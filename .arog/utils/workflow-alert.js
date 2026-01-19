/**
 * AROG Alert Integration Utility
 * Helper to integrate alerts into GitHub Actions workflows
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

import AlertManager from '../services/alert-manager.service.js';

// Initialize alert manager
const alertManager = new AlertManager();
await alertManager.initialize();

/**
 * Send workflow alert
 * Usage in GitHub Actions:
 * - name: Send Alert
 *   run: node .arog/utils/workflow-alert.js
 *   env:
 *     ALERT_SEVERITY: critical
 *     ALERT_TYPE: build-failure
 *     ALERT_TITLE: Build Failed
 *     ALERT_MESSAGE: ${{ github.workflow }} failed
 */
async function sendWorkflowAlert() {
  const severity = process.env.ALERT_SEVERITY || 'info';
  const type = process.env.ALERT_TYPE || 'workflow-event';
  const title = process.env.ALERT_TITLE || 'Workflow Event';
  const message = process.env.ALERT_MESSAGE || 'GitHub Actions workflow event';

  const details = {
    workflow: process.env.GITHUB_WORKFLOW,
    repository: process.env.GITHUB_REPOSITORY,
    actor: process.env.GITHUB_ACTOR,
    ref: process.env.GITHUB_REF,
    sha: process.env.GITHUB_SHA,
    runId: process.env.GITHUB_RUN_ID,
    runNumber: process.env.GITHUB_RUN_NUMBER,
    eventName: process.env.GITHUB_EVENT_NAME
  };

  const result = await alertManager.sendAlert({
    severity,
    type,
    title,
    message,
    details,
    source: 'github-actions',
    timestamp: Date.now()
  });

  if (result.success) {
    console.log('✅ Alert sent successfully');
    process.exit(0);
  } else {
    console.error('❌ Failed to send alert:', result);
    process.exit(1);
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  sendWorkflowAlert().catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { alertManager, sendWorkflowAlert };
