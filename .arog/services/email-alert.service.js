/**
 * AROG Email Alert Service
 * Sends formatted email notifications for automation events
 */

import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class EmailAlertService {
  constructor(config) {
    this.config = config;
    this.transporter = null;
    this.templatesPath = path.join(__dirname, '../templates/email');
  }

  /**
   * Initialize email transporter
   */
  async initialize() {
    if (!this.config?.alertRouting?.channels?.email?.enabled) {
      console.log('📧 Email alerts disabled in configuration');
      return;
    }

    const emailConfig = this.config.alertRouting.channels.email.config;
    
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || emailConfig.host,
      port: process.env.SMTP_PORT || emailConfig.port,
      secure: emailConfig.secure,
      auth: {
        user: process.env.SMTP_USER || emailConfig.auth.user,
        pass: process.env.SMTP_PASSWORD || emailConfig.auth.pass
      }
    });

    // Verify connection
    try {
      await this.transporter.verify();
      console.log('✅ Email alert service initialized successfully');
      return true;
    } catch (error) {
      console.error('❌ Email service verification failed:', error.message);
      console.log('⚠️  Email alerts will be disabled');
      this.transporter = null;
      return false;
    }
  }

  /**
   * Send alert email
   * @param {Object} alert - Alert details
   */
  async sendAlert(alert) {
    if (!this.transporter) {
      const initialized = await this.initialize();
      if (!initialized || !this.transporter) {
        return { success: false, error: 'Email service not initialized' };
      }
    }

    const { severity, type, title, message, details, timestamp } = alert;
    const template = await this.loadTemplate(severity);
    const html = this.formatTemplate(template, alert);

    const mailOptions = {
      from: this.config.alertRouting.channels.email.config.from,
      to: this.config.alertRouting.channels.email.config.recipients.join(', '),
      subject: this.formatSubject(severity, type, title),
      html: html,
      priority: this.getPriority(severity)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      console.log(`📧 Email alert sent: ${info.messageId}`);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('❌ Failed to send email alert:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Load email template
   */
  async loadTemplate(severity) {
    const templateFile = this.config.alertRouting.templates.email[severity] || 'alert-default.html';
    const templatePath = path.join(this.templatesPath, templateFile);

    try {
      return await fs.readFile(templatePath, 'utf-8');
    } catch (error) {
      // Return default template if custom not found
      return this.getDefaultTemplate();
    }
  }

  /**
   * Format email template with alert data
   */
  formatTemplate(template, alert) {
    return template
      .replace(/{{title}}/g, alert.title)
      .replace(/{{severity}}/g, alert.severity)
      .replace(/{{type}}/g, alert.type)
      .replace(/{{message}}/g, alert.message)
      .replace(/{{details}}/g, JSON.stringify(alert.details, null, 2))
      .replace(/{{timestamp}}/g, new Date(alert.timestamp).toLocaleString())
      .replace(/{{severityColor}}/g, this.getSeverityColor(alert.severity))
      .replace(/{{severityIcon}}/g, this.getSeverityIcon(alert.severity));
  }

  /**
   * Format email subject
   */
  formatSubject(severity, type, title) {
    const prefix = {
      critical: '🚨 CRITICAL',
      high: '⚠️ HIGH',
      medium: '⚡ MEDIUM',
      info: 'ℹ️ INFO'
    }[severity] || 'ALERT';

    return `${prefix}: AROG - ${title || type}`;
  }

  /**
   * Get email priority based on severity
   */
  getPriority(severity) {
    return {
      critical: 'high',
      high: 'high',
      medium: 'normal',
      info: 'low'
    }[severity] || 'normal';
  }

  /**
   * Get severity color for HTML styling
   */
  getSeverityColor(severity) {
    return {
      critical: '#dc3545',
      high: '#fd7e14',
      medium: '#ffc107',
      info: '#17a2b8'
    }[severity] || '#6c757d';
  }

  /**
   * Get severity icon
   */
  getSeverityIcon(severity) {
    return {
      critical: '🚨',
      high: '⚠️',
      medium: '⚡',
      info: 'ℹ️'
    }[severity] || '📢';
  }

  /**
   * Default HTML template
   */
  getDefaultTemplate() {
    return `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: {{severityColor}}; color: white; padding: 20px; border-radius: 5px 5px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; }
    .details { background: white; padding: 15px; border-left: 4px solid {{severityColor}}; margin: 10px 0; }
    .footer { background: #333; color: white; padding: 10px; text-align: center; border-radius: 0 0 5px 5px; font-size: 12px; }
    pre { background: #f4f4f4; padding: 10px; border-radius: 3px; overflow-x: auto; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>{{severityIcon}} {{title}}</h1>
      <p><strong>Severity:</strong> {{severity}} | <strong>Type:</strong> {{type}}</p>
    </div>
    <div class="content">
      <h2>Message</h2>
      <p>{{message}}</p>
      <div class="details">
        <h3>Details</h3>
        <pre>{{details}}</pre>
      </div>
      <p><small>Timestamp: {{timestamp}}</small></p>
    </div>
    <div class="footer">
      <p>AROG - Autonomous Robot for Organization Growth</p>
      <p>This is an automated alert from your AROG automation system</p>
    </div>
  </div>
</body>
</html>
    `.trim();
  }

  /**
   * Send daily summary email
   */
  async sendDailySummary(summary) {
    const alert = {
      severity: 'info',
      type: 'daily-report',
      title: 'AROG Daily Summary',
      message: 'Your daily automation report is ready',
      details: summary,
      timestamp: Date.now()
    };

    return await this.sendAlert(alert);
  }

  /**
   * Test email connection
   */
  async testConnection() {
    try {
      if (!this.transporter) {
        const initialized = await this.initialize();
        if (!initialized || !this.transporter) {
          return { success: false, error: 'Email service initialization failed' };
        }
      }
      
      const testAlert = {
        severity: 'info',
        type: 'test-alert',
        title: 'AROG Email Test',
        message: 'This is a test email from AROG alert system',
        details: { test: true, timestamp: new Date().toISOString() },
        timestamp: Date.now()
      };
      return await this.sendAlert(testAlert);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default EmailAlertService;
