/**
 * AROG Alert Manager
 * Central orchestrator for routing alerts to appropriate channels
 * Combines email, WebEx, and logging services
 */

import EmailAlertService from './email-alert.service.js';
import WebExAlertService from './webex-alert.service.js';
import OperationLogger from './operation-logger.service.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class AlertManager {
  constructor(configPath = null) {
    this.configPath = configPath || path.join(__dirname, '../config/alerts.config.json');
    this.config = null;
    this.emailService = null;
    this.webexService = null;
    this.logger = null;
    this.throttleCache = new Map();
  }

  /**
   * Initialize alert manager and all services
   */
  async initialize() {
    // Load configuration
    await this.loadConfig();

    // Initialize logger first
    this.logger = new OperationLogger(this.config.logging);
    await this.logger.initialize();

    // Initialize alert services
    this.emailService = new EmailAlertService(this.config);
    this.webexService = new WebExAlertService(this.config);

    if (this.config?.alertRouting?.enabled) {
      if (this.config?.alertRouting?.channels?.email?.enabled) {
        await this.emailService.initialize();
      }
      if (this.config?.alertRouting?.channels?.webex?.enabled) {
        await this.webexService.initialize();
      }
    }

    console.log('✅ Alert Manager initialized successfully');
  }

  /**
   * Load configuration
   */
  async loadConfig() {
    try {
      const content = await fs.readFile(this.configPath, 'utf-8');
      this.config = JSON.parse(content);
    } catch (error) {
      console.error('❌ Failed to load alert configuration:', error.message);
      throw error;
    }
  }

  /**
   * Send alert through appropriate channels based on rules
   * @param {Object} alert - Alert details
   */
  async sendAlert(alert) {
    if (!this.config?.alertRouting?.enabled) {
      console.log('🔕 Alert routing disabled');
      return { success: false, reason: 'disabled' };
    }

    // Log the alert request
    const operationId = await this.logger.logAsked({
      name: 'send-alert',
      type: 'alert',
      requestedBy: 'system',
      source: alert.source || 'unknown',
      parameters: { severity: alert.severity, type: alert.type }
    });

    await this.logger.logInitiated(operationId, {
      initiatedBy: 'alert-manager',
      steps: ['match-rules', 'check-throttle', 'send-to-channels']
    });

    try {
      // Ensure alert has required fields
      const completeAlert = this.validateAlert(alert);

      // Find matching rules
      const matchingRules = this.findMatchingRules(completeAlert);

      if (matchingRules.length === 0) {
        console.log('⚠️ No matching rules for alert:', completeAlert.type);
        await this.logger.logNotDone(operationId, {
          message: 'No matching rules found',
          type: 'skipped'
        });
        return { success: false, reason: 'no-matching-rules' };
      }

      const results = [];

      for (const rule of matchingRules) {
        // Check throttling
        if (this.isThrottled(rule, completeAlert)) {
          console.log(`⏳ Alert throttled for rule: ${rule.name}`);
          continue;
        }

        // Send to channels specified in rule
        for (const channel of rule.channels) {
          const result = await this.sendToChannel(channel, completeAlert, rule);
          results.push({ channel, rule: rule.name, ...result });
        }

        // Update throttle cache
        this.updateThrottleCache(rule, completeAlert);
      }

      await this.logger.logDone(operationId, {
        data: { rules: matchingRules.map(r => r.name), results },
        metrics: { channelsSent: results.filter(r => r.success).length }
      });

      return {
        success: true,
        results: results,
        rulesMatched: matchingRules.length
      };
    } catch (error) {
      console.error('❌ Failed to send alert:', error);
      await this.logger.logNotDone(operationId, {
        message: error.message,
        type: 'error',
        stack: error.stack
      });
      return { success: false, error: error.message };
    }
  }

  /**
   * Validate alert has all required fields
   */
  validateAlert(alert) {
    return {
      severity: alert.severity || 'info',
      type: alert.type || 'unknown',
      title: alert.title || 'AROG Alert',
      message: alert.message || '',
      details: alert.details || {},
      timestamp: alert.timestamp || Date.now(),
      source: alert.source || 'unknown'
    };
  }

  /**
   * Find rules that match the alert
   */
  findMatchingRules(alert) {
    return this.config.alertRouting.rules.filter(rule => {
      const condition = rule.condition;

      // Check severity match
      if (condition.severity) {
        const severities = Array.isArray(condition.severity) ? condition.severity : [condition.severity];
        if (!severities.includes(alert.severity)) {
          return false;
        }
      }

      // Check type match
      if (condition.type) {
        const types = Array.isArray(condition.type) ? condition.type : [condition.type];
        if (!types.includes(alert.type)) {
          return false;
        }
      }

      return true;
    });
  }

  /**
   * Check if alert is throttled
   */
  isThrottled(rule, alert) {
    if (!rule.throttle || !rule.throttle.enabled) {
      return false;
    }

    const cacheKey = `${rule.name}-${alert.type}`;
    const cached = this.throttleCache.get(cacheKey);

    if (!cached) {
      return false;
    }

    const windowMs = rule.throttle.windowMinutes * 60 * 1000;
    const isInWindow = (Date.now() - cached.firstAlert) < windowMs;
    const isOverLimit = cached.count >= rule.throttle.maxAlerts;

    return isInWindow && isOverLimit;
  }

  /**
   * Update throttle cache
   */
  updateThrottleCache(rule, alert) {
    if (!rule.throttle || !rule.throttle.enabled) {
      return;
    }

    const cacheKey = `${rule.name}-${alert.type}`;
    const cached = this.throttleCache.get(cacheKey);

    if (!cached) {
      this.throttleCache.set(cacheKey, {
        firstAlert: Date.now(),
        count: 1
      });
    } else {
      const windowMs = rule.throttle.windowMinutes * 60 * 1000;
      const isInWindow = (Date.now() - cached.firstAlert) < windowMs;

      if (isInWindow) {
        cached.count++;
      } else {
        // Reset window
        this.throttleCache.set(cacheKey, {
          firstAlert: Date.now(),
          count: 1
        });
      }
    }
  }

  /**
   * Send alert to specific channel
   */
  async sendToChannel(channel, alert, rule) {
    try {
      switch (channel) {
        case 'email':
          return await this.emailService.sendAlert(alert);
        
        case 'webex':
          return await this.webexService.sendAlert(alert);
        
        default:
          console.warn(`⚠️ Unknown channel: ${channel}`);
          return { success: false, error: 'unknown-channel' };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Quick alert methods for common scenarios
   */
  async critical(type, title, message, details = {}) {
    return await this.sendAlert({
      severity: 'critical',
      type,
      title,
      message,
      details,
      timestamp: Date.now()
    });
  }

  async high(type, title, message, details = {}) {
    return await this.sendAlert({
      severity: 'high',
      type,
      title,
      message,
      details,
      timestamp: Date.now()
    });
  }

  async medium(type, title, message, details = {}) {
    return await this.sendAlert({
      severity: 'medium',
      type,
      title,
      message,
      details,
      timestamp: Date.now()
    });
  }

  async info(type, title, message, details = {}) {
    return await this.sendAlert({
      severity: 'info',
      type,
      title,
      message,
      details,
      timestamp: Date.now()
    });
  }

  /**
   * Test all alert channels
   */
  async testAllChannels() {
    console.log('\n🧪 Testing Alert Channels...\n');

    const results = {
      email: null,
      webex: null,
      logger: null
    };

    // Test email
    if (this.config?.alertRouting?.channels?.email?.enabled) {
      console.log('📧 Testing email...');
      results.email = await this.emailService.testConnection();
      console.log(`   ${results.email.success ? '✅' : '❌'} Email: ${results.email.success ? 'Success' : results.email.error}`);
    } else {
      console.log('📧 Email alerts disabled or not configured');
    }

    // Test WebEx
    if (this.config?.alertRouting?.channels?.webex?.enabled) {
      console.log('💬 Testing WebEx...');
      results.webex = await this.webexService.testConnection();
      console.log(`   ${results.webex.success ? '✅' : '❌'} WebEx: ${results.webex.success ? 'Success' : results.webex.error}`);
    } else {
      console.log('💬 WebEx alerts disabled or not configured');
    }

    // Test logger
    console.log('📝 Testing logger...');
    const logId = await this.logger.logAsked({
      name: 'test-operation',
      type: 'test',
      requestedBy: 'alert-manager-test'
    });
    await this.logger.logInitiated(logId);
    await this.logger.logDone(logId, { data: { test: true } });
    results.logger = { success: true };
    console.log('   ✅ Logger: Success');

    console.log('\n📊 Test Summary:');
    const allSuccess = Object.values(results).every(r => r && r.success);
    console.log(allSuccess ? '✅ All channels operational' : '⚠️ Some channels failed');

    return results;
  }

  /**
   * Get operation logs
   */
  async getOperationLogs(criteria = {}) {
    if (criteria.operationId) {
      return await this.logger.getOperationTimeline(criteria.operationId);
    }
    
    if (criteria.status) {
      return await this.logger.getOperationsByStatus(criteria.status);
    }

    return await this.logger.getTodayOperations();
  }

  /**
   * Get daily summary
   */
  async getDailySummary() {
    return await this.logger.getSummary();
  }
}

export default AlertManager;
