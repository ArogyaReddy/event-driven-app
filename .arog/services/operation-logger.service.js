/**
 * AROG Operation Logger
 * Comprehensive logging system that tracks:
 * - What's asked (user requests, workflow triggers)
 * - What's initiated (started operations)
 * - What's done (completed operations)
 * - What's not done (failed/skipped operations)
 * - When (timestamps for all events)
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class OperationLogger {
  constructor(config = {}) {
    this.logsDir = config.logsDir || path.join(process.cwd(), '.arog', 'logs');
    this.enabled = config.enabled !== false;
    this.level = config.level || 'info';
    this.rotateDaily = config.rotateDaily !== false;
    this.retentionDays = config.retentionDays || 30;
    this.logFile = null;
    this.operationsLog = [];
  }

  /**
   * Initialize logger
   */
  async initialize() {
    if (!this.enabled) {
      console.log('📝 Operation logging disabled');
      return;
    }

    // Create logs directory
    await fs.mkdir(this.logsDir, { recursive: true });

    // Set log file path with date
    const date = new Date().toISOString().split('T')[0];
    this.logFile = path.join(this.logsDir, `operations-${date}.json`);

    // Load existing logs for today
    await this.loadExistingLogs();

    // Clean old logs
    await this.cleanOldLogs();

    console.log('✅ Operation logger initialized');
  }

  /**
   * Log what's asked (user request, trigger event)
   */
  async logAsked(operation) {
    const logEntry = {
      id: this.generateId(),
      status: 'asked',
      timestamp: new Date().toISOString(),
      operation: operation.name,
      type: operation.type,
      requestedBy: operation.requestedBy || 'system',
      source: operation.source || 'unknown',
      parameters: operation.parameters || {},
      context: operation.context || {}
    };

    await this.writeLog(logEntry);
    return logEntry.id;
  }

  /**
   * Log what's initiated (operation started)
   */
  async logInitiated(operationId, details = {}) {
    const logEntry = {
      id: operationId,
      status: 'initiated',
      timestamp: new Date().toISOString(),
      startedAt: new Date().toISOString(),
      initiatedBy: details.initiatedBy || 'system',
      steps: details.steps || [],
      estimatedDuration: details.estimatedDuration || null,
      dependencies: details.dependencies || []
    };

    await this.writeLog(logEntry);
  }

  /**
   * Log what's done (operation completed successfully)
   */
  async logDone(operationId, result = {}) {
    const startLog = this.operationsLog.find(log => log.id === operationId && log.status === 'initiated');
    const duration = startLog ? this.calculateDuration(startLog.startedAt) : null;

    const logEntry = {
      id: operationId,
      status: 'done',
      timestamp: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      duration: duration,
      result: result.data || {},
      success: true,
      metrics: result.metrics || {},
      artifacts: result.artifacts || []
    };

    await this.writeLog(logEntry);
    await this.updateSummary(operationId, 'completed');
  }

  /**
   * Log what's not done (operation failed/skipped)
   */
  async logNotDone(operationId, reason = {}) {
    const startLog = this.operationsLog.find(log => log.id === operationId && log.status === 'initiated');
    const duration = startLog ? this.calculateDuration(startLog.startedAt) : null;

    const logEntry = {
      id: operationId,
      status: 'not-done',
      timestamp: new Date().toISOString(),
      failedAt: new Date().toISOString(),
      duration: duration,
      reason: reason.message || 'Unknown error',
      errorType: reason.type || 'error',
      errorCode: reason.code || null,
      stackTrace: reason.stack || null,
      success: false,
      retryable: reason.retryable !== false,
      retryCount: reason.retryCount || 0
    };

    await this.writeLog(logEntry);
    await this.updateSummary(operationId, reason.type === 'skipped' ? 'skipped' : 'failed');
  }

  /**
   * Write log entry to file and memory
   */
  async writeLog(entry) {
    if (!this.enabled) return;

    // Add to in-memory log
    this.operationsLog.push(entry);

    // Write to file
    try {
      const logs = await this.loadLogs();
      logs.push(entry);
      await fs.writeFile(this.logFile, JSON.stringify(logs, null, 2));
    } catch (error) {
      console.error('Failed to write log entry:', error);
    }
  }

  /**
   * Load existing logs for today
   */
  async loadExistingLogs() {
    try {
      this.operationsLog = await this.loadLogs();
    } catch (error) {
      this.operationsLog = [];
    }
  }

  /**
   * Load logs from file
   */
  async loadLogs() {
    try {
      const content = await fs.readFile(this.logFile, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      return [];
    }
  }

  /**
   * Get operation timeline
   */
  async getOperationTimeline(operationId) {
    const logs = this.operationsLog.filter(log => log.id === operationId);
    return logs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  /**
   * Get all operations for today
   */
  async getTodayOperations() {
    return this.operationsLog;
  }

  /**
   * Get operations by status
   */
  async getOperationsByStatus(status) {
    return this.operationsLog.filter(log => log.status === status);
  }

  /**
   * Get operation summary
   */
  async getSummary() {
    const summary = {
      total: 0,
      asked: 0,
      initiated: 0,
      done: 0,
      notDone: 0,
      failed: 0,
      skipped: 0,
      inProgress: 0,
      averageDuration: 0,
      successRate: 0
    };

    // Get unique operations
    const operations = new Map();
    
    this.operationsLog.forEach(log => {
      if (!operations.has(log.id)) {
        operations.set(log.id, { id: log.id, logs: [] });
      }
      operations.get(log.id).logs.push(log);
    });

    summary.total = operations.size;

    let totalDuration = 0;
    let completedCount = 0;

    operations.forEach(op => {
      const latestLog = op.logs[op.logs.length - 1];
      
      if (latestLog.status === 'done') {
        summary.done++;
        completedCount++;
        if (latestLog.duration) totalDuration += latestLog.duration;
      } else if (latestLog.status === 'not-done') {
        summary.notDone++;
        if (latestLog.errorType === 'skipped') {
          summary.skipped++;
        } else {
          summary.failed++;
        }
      } else if (latestLog.status === 'initiated') {
        summary.inProgress++;
      }
    });

    summary.averageDuration = completedCount > 0 ? totalDuration / completedCount : 0;
    summary.successRate = summary.total > 0 ? (summary.done / summary.total) * 100 : 0;

    return summary;
  }

  /**
   * Update daily summary file
   */
  async updateSummary(operationId, finalStatus) {
    const summaryFile = path.join(this.logsDir, 'daily-summary.json');
    
    try {
      let summary = {};
      try {
        const content = await fs.readFile(summaryFile, 'utf-8');
        summary = JSON.parse(content);
      } catch (e) {
        summary = {};
      }

      const date = new Date().toISOString().split('T')[0];
      if (!summary[date]) {
        summary[date] = { completed: 0, failed: 0, skipped: 0 };
      }

      summary[date][finalStatus] = (summary[date][finalStatus] || 0) + 1;
      summary[date].lastUpdated = new Date().toISOString();

      await fs.writeFile(summaryFile, JSON.stringify(summary, null, 2));
    } catch (error) {
      console.error('Failed to update summary:', error);
    }
  }

  /**
   * Clean logs older than retention period
   */
  async cleanOldLogs() {
    try {
      const files = await fs.readdir(this.logsDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionDays);

      for (const file of files) {
        if (!file.startsWith('operations-')) continue;

        const match = file.match(/operations-(\d{4}-\d{2}-\d{2})\.json/);
        if (match) {
          const fileDate = new Date(match[1]);
          if (fileDate < cutoffDate) {
            await fs.unlink(path.join(this.logsDir, file));
            console.log(`🗑️ Cleaned old log: ${file}`);
          }
        }
      }
    } catch (error) {
      console.error('Failed to clean old logs:', error);
    }
  }

  /**
   * Generate unique operation ID
   */
  generateId() {
    return `op-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Calculate duration in milliseconds
   */
  calculateDuration(startTime) {
    return new Date() - new Date(startTime);
  }

  /**
   * Export logs to JSON
   */
  async exportLogs(startDate, endDate) {
    const files = await fs.readdir(this.logsDir);
    const allLogs = [];

    for (const file of files) {
      if (!file.startsWith('operations-')) continue;

      const match = file.match(/operations-(\d{4}-\d{2}-\d{2})\.json/);
      if (match) {
        const fileDate = new Date(match[1]);
        if (fileDate >= startDate && fileDate <= endDate) {
          const content = await fs.readFile(path.join(this.logsDir, file), 'utf-8');
          allLogs.push(...JSON.parse(content));
        }
      }
    }

    return allLogs;
  }

  /**
   * Search logs by criteria
   */
  async searchLogs(criteria) {
    const logs = this.operationsLog;
    
    return logs.filter(log => {
      if (criteria.operation && !log.operation?.includes(criteria.operation)) return false;
      if (criteria.status && log.status !== criteria.status) return false;
      if (criteria.type && log.type !== criteria.type) return false;
      if (criteria.requestedBy && log.requestedBy !== criteria.requestedBy) return false;
      return true;
    });
  }
}

export default OperationLogger;
