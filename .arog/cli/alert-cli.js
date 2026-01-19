#!/usr/bin/env node

/**
 * AROG Alert CLI
 * Command-line interface for managing alerts and viewing logs
 */

import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Load .env file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });

import AlertManager from '../services/alert-manager.service.js';
import chalk from 'chalk';
import Table from 'cli-table3';

const alertManager = new AlertManager();

async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  try {
    await alertManager.initialize();

    switch (command) {
      case 'test':
        await testAlerts();
        break;

      case 'send':
        await sendCustomAlert(args.slice(1));
        break;

      case 'logs':
        await showLogs(args[1]);
        break;

      case 'summary':
        await showSummary();
        break;

      case 'help':
      default:
        showHelp();
        break;
    }
  } catch (error) {
    console.error(chalk.red('Error:'), error.message);
    process.exit(1);
  }
}

async function testAlerts() {
  console.log(chalk.blue.bold('\n🧪 Testing Alert System\n'));
  const results = await alertManager.testAllChannels();
  
  if (Object.values(results).every(r => r && r.success)) {
    console.log(chalk.green.bold('\n✅ All systems operational!\n'));
  } else {
    console.log(chalk.yellow.bold('\n⚠️  Some systems need attention\n'));
  }
}

async function sendCustomAlert(args) {
  const [severity, type, title, ...messageParts] = args;
  const message = messageParts.join(' ');

  if (!severity || !type || !title || !message) {
    console.log(chalk.red('Usage: alert send <severity> <type> <title> <message>'));
    console.log(chalk.gray('Example: alert send high test-failure "Build Failed" "Unit tests are failing"'));
    return;
  }

  console.log(chalk.blue(`Sending ${severity} alert...`));
  
  const result = await alertManager.sendAlert({
    severity,
    type,
    title,
    message,
    details: { cli: true },
    timestamp: Date.now()
  });

  if (result.success) {
    console.log(chalk.green('✅ Alert sent successfully'));
    console.log(chalk.gray(`   Rules matched: ${result.rulesMatched}`));
    console.log(chalk.gray(`   Channels: ${result.results.map(r => r.channel).join(', ')}`));
  } else {
    console.log(chalk.red('❌ Failed to send alert'));
  }
}

async function showLogs(filter) {
  console.log(chalk.blue.bold('\n📝 Operation Logs\n'));

  let logs;
  if (filter) {
    logs = await alertManager.getOperationLogs({ status: filter });
  } else {
    logs = await alertManager.getOperationLogs();
  }

  if (logs.length === 0) {
    console.log(chalk.gray('No logs found'));
    return;
  }

  const table = new Table({
    head: ['ID', 'Status', 'Operation', 'Time'],
    colWidths: [25, 15, 30, 25]
  });

  logs.slice(-20).forEach(log => {
    const statusColor = {
      asked: 'blue',
      initiated: 'yellow',
      done: 'green',
      'not-done': 'red'
    }[log.status] || 'white';

    table.push([
      log.id.substring(0, 20) + '...',
      chalk[statusColor](log.status),
      log.operation || log.type || '-',
      new Date(log.timestamp).toLocaleString()
    ]);
  });

  console.log(table.toString());
  console.log(chalk.gray(`\nShowing last ${Math.min(20, logs.length)} of ${logs.length} logs\n`));
}

async function showSummary() {
  console.log(chalk.blue.bold('\n📊 Daily Summary\n'));

  const summary = await alertManager.getDailySummary();

  const table = new Table({
    head: ['Metric', 'Value'],
    colWidths: [30, 20]
  });

  table.push(
    ['Total Operations', summary.total],
    ['Completed', chalk.green(summary.done)],
    ['Failed', chalk.red(summary.failed)],
    ['Skipped', chalk.yellow(summary.skipped)],
    ['In Progress', chalk.blue(summary.inProgress)],
    ['Success Rate', `${summary.successRate.toFixed(1)}%`],
    ['Avg Duration', `${(summary.averageDuration / 1000).toFixed(2)}s`]
  );

  console.log(table.toString());
  console.log();
}

function showHelp() {
  console.log(chalk.blue.bold('\n🤖 AROG Alert CLI\n'));
  console.log('Usage: alert <command> [options]\n');
  console.log('Commands:');
  console.log('  test                           Test all alert channels');
  console.log('  send <severity> <type> <title> <message>  Send custom alert');
  console.log('  logs [status]                  Show operation logs');
  console.log('  summary                        Show daily summary');
  console.log('  help                           Show this help\n');
  console.log('Examples:');
  console.log(chalk.gray('  alert test'));
  console.log(chalk.gray('  alert send high test-failure "Build Failed" "Unit tests failing"'));
  console.log(chalk.gray('  alert logs done'));
  console.log(chalk.gray('  alert summary\n'));
}

main();
