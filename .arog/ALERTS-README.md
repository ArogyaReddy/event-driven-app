# AROG Alert & Logging System

Complete observability and monitoring solution with email and WebEx chat integration.

## 🎯 Features

### Alert Routing
- **Email Alerts** → arogya.gade@adp.com
- **WebEx Chat** → Real-time notifications
- **Smart Routing** → Rule-based channel selection
- **Throttling** → Prevent alert fatigue
- **Prioritization** → Critical alerts sent immediately

### Operation Logging
Tracks every operation with:
- ✅ **What's asked** - User requests, workflow triggers
- ⏱️ **What's initiated** - Operations started
- ✅ **What's done** - Completed successfully
- ❌ **What's not done** - Failed or skipped
- 📅 **When** - Precise timestamps for all events

## 📋 Quick Start

### 1. Configure Environment Variables

Create `.arog/.env`:

```bash
# Email Configuration
SMTP_HOST=smtp.office365.com
SMTP_PORT=587
SMTP_USER=arog-automation@adp.com
SMTP_PASSWORD=your-password

# WebEx Configuration
WEBEX_BOT_TOKEN=your-bot-token
WEBEX_ROOM_ID=your-room-id
```

### 2. Test Alert System

```bash
cd .arog
npm install nodemailer
node cli/alert-cli.js test
```

### 3. Send Test Alert

```bash
node cli/alert-cli.js send info test "Test Alert" "Testing AROG alert system"
```

### 4. View Logs

```bash
# All logs
node cli/alert-cli.js logs

# Filter by status
node cli/alert-cli.js logs done
node cli/alert-cli.js logs not-done

# Daily summary
node cli/alert-cli.js summary
```

## 📧 Email Setup (Office 365 / Outlook)

### For ADP Email (arogya.gade@adp.com)

1. **Create App Password** (if using MFA):
   - Go to https://account.microsoft.com/security
   - Security → App passwords
   - Create new app password for "AROG"

2. **Configure SMTP**:
   ```bash
   SMTP_HOST=smtp.office365.com
   SMTP_PORT=587
   SMTP_USER=arogya.gade@adp.com
   SMTP_PASSWORD=<app-password>
   ```

3. **Test Connection**:
   ```bash
   node -e "import('./services/email-alert.service.js').then(async (m) => {
     const service = new m.default(JSON.parse(require('fs').readFileSync('config/alerts.config.json')));
     const result = await service.testConnection();
     console.log(result);
   });"
   ```

## 💬 WebEx Setup

### 1. Create WebEx Bot

1. Go to https://developer.webex.com/my-apps/new/bot
2. Create new bot named "AROG Automation"
3. Copy Bot Access Token

### 2. Get Room ID

```bash
# List your rooms
curl -X GET "https://webexapis.com/v1/rooms" \
  -H "Authorization: Bearer YOUR_BOT_TOKEN"

# Or find your room
curl -X GET "https://webexapis.com/v1/rooms?type=direct" \
  -H "Authorization: Bearer YOUR_BOT_TOKEN"
```

### 3. Configure WebEx

```bash
WEBEX_BOT_TOKEN=YOUR_BOT_ACCESS_TOKEN
WEBEX_ROOM_ID=YOUR_ROOM_ID
```

### 4. Test WebEx

```bash
node -e "import('./services/webex-alert.service.js').then(async (m) => {
  const service = new m.default(JSON.parse(require('fs').readFileSync('config/alerts.config.json')));
  const result = await service.testConnection();
  console.log(result);
});"
```

## 📊 Alert Rules

Configure in [.arog/config/alerts.config.json](/.arog/config/alerts.config.json):

### Critical Failures → Email + WebEx
- Build failures
- Deployment failures
- Security breaches

### Test Failures → Email + WebEx (throttled)
- Test failures
- Coverage drops
- Mutation failures

### Security Warnings → Email + WebEx
- Vulnerabilities found
- Secrets detected
- Dependency issues

### Performance → Email only
- Performance regression
- Bundle size increase
- Lighthouse score drops

### Success → WebEx only
- Deployment success
- Release published

### Daily Summary → Email
- Scheduled 9 AM daily
- Operation statistics
- Success/failure metrics

## 🔧 Usage in GitHub Actions

See [.github/workflows/arog-alerts-demo.yml](/.github/workflows/arog-alerts-demo.yml)

### Example: Alert on Test Failure

```yaml
- name: Run Tests
  id: tests
  continue-on-error: true
  run: npm test

- name: Send Alert on Failure
  if: failure()
  env:
    ALERT_SEVERITY: high
    ALERT_TYPE: test-failure
    ALERT_TITLE: "Tests Failed"
    ALERT_MESSAGE: "Unit tests failed in ${{ github.workflow }}"
  run: node .arog/utils/workflow-alert.js
```

### Example: Log Operation

```yaml
- name: Start Operation
  run: |
    node -e "
    import('./.arog/services/operation-logger.service.js').then(async (m) => {
      const logger = new m.default({ enabled: true });
      await logger.initialize();
      const opId = await logger.logAsked({
        name: 'build',
        type: 'build-execution',
        requestedBy: 'github-actions'
      });
      await logger.logInitiated(opId);
      console.log('OPERATION_ID=' + opId);
    });" | tee operation.log

- name: Complete Operation
  run: |
    OPERATION_ID=$(grep OPERATION_ID operation.log | cut -d'=' -f2)
    node -e "
    import('./.arog/services/operation-logger.service.js').then(async (m) => {
      const logger = new m.default({ enabled: true });
      await logger.initialize();
      await logger.logDone('$OPERATION_ID', { data: { success: true } });
    });"
```

## 📁 File Structure

```
.arog/
├── config/
│   └── alerts.config.json          # Alert routing configuration
├── services/
│   ├── alert-manager.service.js    # Central orchestrator
│   ├── email-alert.service.js      # Email notifications
│   ├── webex-alert.service.js      # WebEx chat
│   └── operation-logger.service.js # Operation tracking
├── cli/
│   └── alert-cli.js                # Command-line interface
├── utils/
│   └── workflow-alert.js           # GitHub Actions helper
└── logs/
    ├── operations-2026-01-17.json  # Daily operation logs
    └── daily-summary.json          # Daily summaries
```

## 🎨 Alert Severity Levels

- **Critical** 🚨 - System failures, security breaches
- **High** ⚠️ - Test failures, important errors
- **Medium** ⚡ - Performance issues, warnings
- **Info** ℹ️ - Success notifications, reports

## 📈 Operation Statuses

- **Asked** - Operation requested
- **Initiated** - Operation started
- **Done** - Completed successfully
- **Not Done** - Failed or skipped

## 🔍 Viewing Logs

### Today's Operations
```bash
node cli/alert-cli.js logs
```

### Filter by Status
```bash
node cli/alert-cli.js logs done      # Successful
node cli/alert-cli.js logs not-done  # Failed
```

### Daily Summary
```bash
node cli/alert-cli.js summary
```

### Programmatic Access
```javascript
import AlertManager from './.arog/services/alert-manager.service.js';

const manager = new AlertManager();
await manager.initialize();

// Get all logs
const logs = await manager.getOperationLogs();

// Get specific operation timeline
const timeline = await manager.getOperationLogs({ operationId: 'op-123' });

// Get daily summary
const summary = await manager.getDailySummary();
```

## 🧪 Testing

```bash
# Test all channels
node cli/alert-cli.js test

# Send test alerts
node cli/alert-cli.js send critical test-alert "Test" "Testing critical alert"
node cli/alert-cli.js send high test-alert "Test" "Testing high priority"
node cli/alert-cli.js send info test-alert "Test" "Testing info alert"
```

## 🔒 Security Notes

1. **Never commit credentials** to git
2. Use **environment variables** for sensitive data
3. Store `.env` in `.gitignore`
4. Use **app passwords** for email (not main password)
5. **Rotate bot tokens** regularly

## 📝 Log Retention

- Logs retained for **30 days** (configurable)
- Daily rotation at midnight
- Auto-cleanup of old logs
- JSON format for easy parsing

## 🚀 Next Steps

1. ✅ Configure email credentials
2. ✅ Set up WebEx bot
3. ✅ Test alert system
4. ✅ Add to GitHub workflows
5. ✅ Monitor daily summaries

## 💡 Pro Tips

- Use **throttling** to prevent alert spam
- Set different channels for different severities
- Review **daily summaries** for trends
- Use **operation logs** for debugging
- Test alerts before deploying

## 📞 Support

For issues or questions:
- Check logs: `.arog/logs/`
- Test system: `node cli/alert-cli.js test`
- View summary: `node cli/alert-cli.js summary`
