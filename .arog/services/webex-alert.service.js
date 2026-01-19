/**
 * AROG WebEx Chat Alert Service
 * Sends real-time alerts to WebEx Teams/Chat
 */

import https from 'https';

class WebExAlertService {
  constructor(config) {
    this.config = config;
    const webexConfig = config?.alertRouting?.channels?.webex || {};
    this.botToken = process.env.WEBEX_BOT_TOKEN || webexConfig.config?.botToken;
    this.roomId = process.env.WEBEX_ROOM_ID || webexConfig.config?.roomId;
    this.personEmail = webexConfig.config?.personEmail;
    this.baseUrl = 'https://webexapis.com/v1';
  }

  /**
   * Initialize WebEx service
   */
  async initialize() {
    if (!this.config?.alertRouting?.channels?.webex?.enabled) {
      console.log('💬 WebEx alerts disabled in configuration');
      return;
    }

    if (!this.botToken || this.botToken.includes('<your-')) {
      console.log('⚠️  WebEx bot token not configured - skipping');
      return;
    }

    console.log('✅ WebEx alert service initialized');
  }

  /**
   * Send alert to WebEx
   * @param {Object} alert - Alert details
   */
  async sendAlert(alert) {
    const { severity, type, title, message, details, timestamp } = alert;
    const markdown = this.formatMarkdown(alert);

    try {
      // Send to room if configured
      if (this.roomId) {
        await this.sendToRoom(this.roomId, markdown);
      }

      // Send direct message to person
      if (this.personEmail) {
        await this.sendToPerson(this.personEmail, markdown);
      }

      console.log(`💬 WebEx alert sent: ${title}`);
      return { success: true };
    } catch (error) {
      console.error('❌ Failed to send WebEx alert:', error.message);
      return { success: false, error: error.message };
    }
  }

  /**
   * Send message to WebEx room
   */
  async sendToRoom(roomId, markdown) {
    const payload = {
      roomId: roomId,
      markdown: markdown
    };

    return await this.makeRequest('/messages', 'POST', payload);
  }

  /**
   * Send direct message to person
   */
  async sendToPerson(email, markdown) {
    const payload = {
      toPersonEmail: email,
      markdown: markdown
    };

    return await this.makeRequest('/messages', 'POST', payload);
  }

  /**
   * Format alert as WebEx markdown
   */
  formatMarkdown(alert) {
    const { severity, type, title, message, details, timestamp } = alert;
    const icon = this.getSeverityIcon(severity);
    const color = this.getSeverityColor(severity);

    let markdown = `# ${icon} ${title}\n\n`;
    markdown += `**Severity:** ${severity.toUpperCase()} | **Type:** ${type}\n\n`;
    markdown += `---\n\n`;
    markdown += `## Message\n${message}\n\n`;

    if (details && Object.keys(details).length > 0) {
      markdown += `## Details\n`;
      markdown += '```json\n';
      markdown += JSON.stringify(details, null, 2);
      markdown += '\n```\n\n';
    }

    markdown += `---\n`;
    markdown += `*Timestamp: ${new Date(timestamp).toLocaleString()}*\n`;
    markdown += `*AROG Automation System*`;

    return markdown;
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
   * Get severity color
   */
  getSeverityColor(severity) {
    return {
      critical: 'red',
      high: 'orange',
      medium: 'yellow',
      info: 'blue'
    }[severity] || 'gray';
  }

  /**
   * Make HTTP request to WebEx API
   */
  async makeRequest(endpoint, method, data) {
    return new Promise((resolve, reject) => {
      const options = {
        hostname: 'webexapis.com',
        port: 443,
        path: `/v1${endpoint}`,
        method: method,
        headers: {
          'Authorization': `Bearer ${this.botToken}`,
          'Content-Type': 'application/json'
        }
      };

      const req = https.request(options, (res) => {
        let body = '';
        
        res.on('data', (chunk) => {
          body += chunk;
        });

        res.on('end', () => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              resolve(JSON.parse(body));
            } catch (e) {
              resolve(body);
            }
          } else {
            reject(new Error(`WebEx API error: ${res.statusCode} - ${body}`));
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (data) {
        req.write(JSON.stringify(data));
      }

      req.end();
    });
  }

  /**
   * Send card with adaptive card format (for rich formatting)
   */
  async sendAdaptiveCard(alert) {
    const card = this.createAdaptiveCard(alert);
    
    const payload = {
      roomId: this.roomId,
      markdown: `${this.getSeverityIcon(alert.severity)} ${alert.title}`,
      attachments: [
        {
          contentType: 'application/vnd.microsoft.card.adaptive',
          content: card
        }
      ]
    };

    return await this.makeRequest('/messages', 'POST', payload);
  }

  /**
   * Create adaptive card for rich formatting
   */
  createAdaptiveCard(alert) {
    return {
      type: 'AdaptiveCard',
      version: '1.2',
      body: [
        {
          type: 'TextBlock',
          text: `${this.getSeverityIcon(alert.severity)} ${alert.title}`,
          size: 'Large',
          weight: 'Bolder',
          color: this.getSeverityColor(alert.severity)
        },
        {
          type: 'FactSet',
          facts: [
            { title: 'Severity', value: alert.severity.toUpperCase() },
            { title: 'Type', value: alert.type },
            { title: 'Time', value: new Date(alert.timestamp).toLocaleString() }
          ]
        },
        {
          type: 'TextBlock',
          text: alert.message,
          wrap: true
        },
        {
          type: 'TextBlock',
          text: '```\n' + JSON.stringify(alert.details, null, 2) + '\n```',
          wrap: true,
          size: 'Small',
          isSubtle: true
        }
      ]
    };
  }

  /**
   * Test WebEx connection
   */
  async testConnection() {
    try {
      await this.initialize();
      const testAlert = {
        severity: 'info',
        type: 'test-alert',
        title: 'AROG WebEx Test',
        message: 'This is a test message from AROG alert system',
        details: { test: true, timestamp: new Date().toISOString() },
        timestamp: Date.now()
      };
      return await this.sendAlert(testAlert);
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  /**
   * Get room details
   */
  async getRoomInfo() {
    if (!this.roomId) {
      throw new Error('Room ID not configured');
    }
    return await this.makeRequest(`/rooms/${this.roomId}`, 'GET');
  }

  /**
   * List available rooms
   */
  async listRooms() {
    return await this.makeRequest('/rooms', 'GET');
  }
}

export default WebExAlertService;
