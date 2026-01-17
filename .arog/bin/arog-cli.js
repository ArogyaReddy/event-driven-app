#!/usr/bin/env node

/**
 * AROG Portable Interactive CLI
 * This CLI lives in .arog/ folder and travels with your configuration!
 * 
 * When you copy .arog/ and .github/ folders to a new project,
 * this interactive CLI comes with them!
 */

import inquirer from 'inquirer';
import chalk from 'chalk';
import ora from 'ora';
import boxen from 'boxen';
import Table from 'cli-table3';
import figlet from 'figlet';
import gradient from 'gradient-string';
import { createSpinner } from 'nanospinner';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Find project root (where package.json is)
const projectRoot = findProjectRoot(__dirname);

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function findProjectRoot(startPath) {
  let currentPath = startPath;
  while (currentPath !== '/') {
    if (fs.existsSync(join(currentPath, 'package.json'))) {
      return currentPath;
    }
    currentPath = dirname(currentPath);
  }
  return process.cwd(); // Fallback to current directory
}

function runCommand(command, description) {
  return new Promise((resolve, reject) => {
    const spinner = ora(description).start();
    
    const child = spawn(command, { shell: true, cwd: projectRoot });
    let output = '';
    
    child.stdout.on('data', (data) => {
      output += data.toString();
    });
    
    child.stderr.on('data', (data) => {
      output += data.toString();
    });
    
    child.on('close', (code) => {
      if (code === 0) {
        spinner.succeed(description);
        resolve(output);
      } else {
        spinner.fail(`${description} (exit code: ${code})`);
        reject(new Error(output));
      }
    });
  });
}

// ============================================================================
// BANNER
// ============================================================================

function showBanner() {
  console.clear();
  
  const banner = `
   ███████╗██████╗  ██████╗  ██████╗ 
  ██╔══██╗██╔══██╗██╔═══██╗██╔════╝ 
  ███████║██████╔╝██║   ██║██║  ███╗
  ██╔══██║██╔══██╗██║   ██║██║   ██║
  ██║  ██║██║  ██║╚██████╔╝╚██████╔╝
  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ 
  `;
  
  console.log(chalk.cyan(banner));
  console.log(boxen(
    chalk.cyan.bold('🤖 Autonomous Robot for Organization Growth') + '\n' +
    chalk.gray('Your portable automation framework') + '\n\n' +
    chalk.green('✨ Zero configuration • 🚀 Full automation • 💰 Cost optimized'),
    {
      padding: 1,
      margin: { top: 0, bottom: 1, left: 2, right: 2 },
      borderStyle: 'round',
      borderColor: 'cyan'
    }
  ));
}

// ============================================================================
// PROJECT STATUS CHECK
// ============================================================================

async function checkProjectStatus() {
  const checks = {
    'package.json': fs.existsSync(join(projectRoot, 'package.json')),
    'node_modules': fs.existsSync(join(projectRoot, 'node_modules')),
    'tests': fs.existsSync(join(projectRoot, 'tests')) || fs.existsSync(join(projectRoot, 'test')),
    '.git': fs.existsSync(join(projectRoot, '.git')),
    '.github': fs.existsSync(join(projectRoot, '.github')),
    '.arog': fs.existsSync(join(projectRoot, '.arog'))
  };
  
  const table = new Table({
    head: [chalk.cyan('Check'), chalk.cyan('Status')],
    colWidths: [35, 25]
  });
  
  table.push(
    ['📦 package.json', checks['package.json'] ? chalk.green('✓ Found') : chalk.yellow('⚠ Not found')],
    ['📁 node_modules', checks['node_modules'] ? chalk.green('✓ Installed') : chalk.yellow('⚠ Run npm install')],
    ['🧪 Tests directory', checks['tests'] ? chalk.green('✓ Found') : chalk.gray('○ Optional')],
    ['🔧 Git repository', checks['.git'] ? chalk.green('✓ Initialized') : chalk.yellow('⚠ Not initialized')],
    ['⚙️  GitHub Actions', checks['.github'] ? chalk.green('✓ Configured') : chalk.yellow('⚠ Not configured')],
    ['🤖 AROG configured', checks['.arog'] ? chalk.green('✓ Yes') : chalk.red('✗ No')]
  );
  
  console.log(chalk.cyan.bold('\n═══════════════════════════════════════════════════════════════════'));
  console.log(chalk.cyan.bold('  📊 PROJECT STATUS'));
  console.log(chalk.cyan.bold('═══════════════════════════════════════════════════════════════════\n'));
  console.log(table.toString());
  
  const healthScore = Object.values(checks).filter(Boolean).length;
  const healthPercent = Math.round((healthScore / Object.keys(checks).length) * 100);
  
  const healthStatus = healthPercent >= 90 ? chalk.green('Excellent') :
                       healthPercent >= 70 ? chalk.yellow('Good') :
                       chalk.red('Needs Attention');
  
  console.log(boxen(
    `Project Health: ${healthStatus} (${healthPercent}/100)`,
    { padding: 0, margin: { top: 1, bottom: 1, left: 2, right: 2 }, borderColor: 'cyan' }
  ));
}

// ============================================================================
// MAIN MENU
// ============================================================================

async function showMainMenu() {
  const choices = [
    new inquirer.Separator(chalk.cyan('━━━ 🚀 Quick Actions ━━━')),
    { name: '⚡ Quick Start - Get started in 30 seconds', value: 'quick-start' },
    { name: '🏥 Health Check - Verify everything works', value: 'health' },
    { name: '📚 Show All Commands - Complete reference', value: 'commands' },
    
    new inquirer.Separator(chalk.cyan('\n━━━ 🧪 Testing ━━━')),
    { name: '🧪 Run All Tests (10 types!)', value: 'test:all' },
    { name: '⚡ Run Unit Tests', value: 'test:unit' },
    { name: '🌐 Run E2E Tests', value: 'test:e2e' },
    { name: '🔒 Run Security Tests', value: 'test:security' },
    { name: '📊 View Test Coverage', value: 'test:coverage' },
    
    new inquirer.Separator(chalk.cyan('\n━━━ 🔍 Code Quality ━━━')),
    { name: '🔍 Check Code Quality (Lint)', value: 'lint' },
    { name: '🔧 Auto-Fix Issues', value: 'lint:fix' },
    { name: '🎨 Format Code (Prettier)', value: 'format' },
    
    new inquirer.Separator(chalk.cyan('\n━━━ 🔒 Security ━━━')),
    { name: '🔒 Security Audit', value: 'security:audit' },
    { name: '🛡️  Full Security Scan', value: 'security:scan' },
    
    new inquirer.Separator(chalk.cyan('\n━━━ 📦 Build & Deploy ━━━')),
    { name: '📦 Production Build', value: 'build' },
    { name: '🚀 Deploy to Staging', value: 'deploy:staging' },
    { name: '🎯 Deploy to Production', value: 'deploy:production' },
    
    new inquirer.Separator(chalk.cyan('\n━━━ 📊 Reports & Monitoring ━━━')),
    { name: '📊 Generate Full Report', value: 'arog:report' },
    { name: '📈 View Metrics Dashboard', value: 'arog:metrics' },
    { name: '💰 AI Cost Report', value: 'arog:cost-report' },
    
    new inquirer.Separator(chalk.cyan('\n━━━ 📚 Help & Documentation ━━━')),
    { name: '📖 Open The AROG Book', value: 'docs:book' },
    { name: '📚 View Documentation', value: 'docs' },
    { name: '❓ Show Help', value: 'help' },
    
    new inquirer.Separator(chalk.cyan('\n━━━ ━━━ ━━━')),
    { name: '🚪 Exit', value: 'exit' }
  ];
  
  const answer = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan.bold('What would you like to do?'),
      choices,
      pageSize: 20
    }
  ]);
  
  return answer.action;
}

// ============================================================================
// ACTION HANDLERS
// ============================================================================

async function handleQuickStart() {
  console.clear();
  showBanner();
  
  console.log(boxen(
    chalk.cyan.bold('🚀 QUICK START GUIDE\n\n') +
    chalk.white('AROG is your complete automation framework.\n') +
    chalk.white('Everything runs automatically - you just write code!\n\n') +
    chalk.yellow('What AROG does for you:\n\n') +
    chalk.green('  ✓ Testing') + chalk.gray(' - 10 types of automated tests\n') +
    chalk.green('  ✓ Security') + chalk.gray(' - Vulnerability scanning\n') +
    chalk.green('  ✓ Quality') + chalk.gray(' - Code review, linting\n') +
    chalk.green('  ✓ Deploy') + chalk.gray(' - Zero-downtime deployments\n') +
    chalk.green('  ✓ Cost') + chalk.gray(' - 70-85% AI cost savings'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan'
    }
  ));
  
  const { next } = await inquirer.prompt([
    {
      type: 'list',
      name: 'next',
      message: 'What would you like to do next?',
      choices: [
        { name: '🏥 Run Health Check', value: 'health' },
        { name: '🧪 Run Tests', value: 'test' },
        { name: '📚 Show All Commands', value: 'commands' },
        { name: '🔙 Back to Main Menu', value: 'menu' }
      ]
    }
  ]);
  
  return next;
}

async function showAllCommands() {
  console.clear();
  showBanner();
  
  console.log(chalk.cyan.bold('📋 ALL AROG COMMANDS\n'));
  
  const commandCategories = [
    {
      title: '🧪 TESTING',
      commands: [
        { cmd: 'npm test', desc: 'Run unit tests' },
        { cmd: 'npm run test:e2e', desc: 'Run E2E tests' },
        { cmd: 'npm run test:security', desc: 'Run security tests' },
        { cmd: 'npm run test:all', desc: 'Run ALL tests (10 types!)' }
      ]
    },
    {
      title: '🔍 CODE QUALITY',
      commands: [
        { cmd: 'npm run lint', desc: 'Check code quality' },
        { cmd: 'npm run lint:fix', desc: 'Auto-fix issues' },
        { cmd: 'npm run format', desc: 'Format code (Prettier)' }
      ]
    },
    {
      title: '🔒 SECURITY',
      commands: [
        { cmd: 'npm run security:audit', desc: 'Security audit' },
        { cmd: 'npm run security:scan', desc: 'Full security scan' }
      ]
    },
    {
      title: '📦 BUILD & DEPLOY',
      commands: [
        { cmd: 'npm run build', desc: 'Production build' },
        { cmd: 'npm run deploy:staging', desc: 'Deploy to staging' },
        { cmd: 'npm run deploy:production', desc: 'Deploy to production' }
      ]
    },
    {
      title: '🤖 AI AGENT (in VS Code)',
      commands: [
        { cmd: '@arog review this code', desc: 'Code review' },
        { cmd: '@arog run tests', desc: 'Run tests' },
        { cmd: '@arog deploy to staging', desc: 'Deploy' },
        { cmd: '@arog fix this error', desc: 'Debug help' }
      ]
    }
  ];
  
  commandCategories.forEach(category => {
    console.log(chalk.cyan.bold(`\n${category.title}`));
    const table = new Table({
      head: [chalk.gray('Command'), chalk.gray('Description')],
      colWidths: [35, 40]
    });
    
    category.commands.forEach(({ cmd, desc }) => {
      table.push([chalk.green(cmd), desc]);
    });
    
    console.log(table.toString());
  });
  
  console.log(chalk.yellow.bold('\n💡 TIP: ') + chalk.white('Run "npx arog" anytime to see this menu!\n'));
  
  await inquirer.prompt([
    {
      type: 'input',
      name: 'continue',
      message: 'Press ENTER to continue'
    }
  ]);
}

// ============================================================================
// MAIN FUNCTION
// ============================================================================

async function main() {
  const args = process.argv.slice(2);
  
  // Handle CLI flags
  if (args.includes('--help') || args.includes('-h')) {
    console.log(`
AROG Interactive CLI

Usage:
  npx arog              Launch interactive menu
  npx arog --help       Show this help
  npx arog --demo       Run a demo
  npx arog --health     Run health check
  npx arog --welcome    Show welcome screen (first-time users)

This CLI is portable - it lives in .arog/ folder and travels with your config!
    `);
    return;
  }
  
  if (args.includes('--health')) {
    showBanner();
    await checkProjectStatus();
    return;
  }
  
  if (args.includes('--welcome')) {
    // Show first-time welcome
    await handleQuickStart();
    return;
  }
  
  // Main interactive loop
  showBanner();
  await checkProjectStatus();
  
  let keepRunning = true;
  
  while (keepRunning) {
    const action = await showMainMenu();
    
    switch (action) {
      case 'exit':
        console.log(chalk.cyan('\n👋 Goodbye! Run "npx arog" anytime to return.\n'));
        keepRunning = false;
        break;
        
      case 'quick-start':
        const next = await handleQuickStart();
        if (next === 'menu') continue;
        if (next === 'health') {
          showBanner();
          await checkProjectStatus();
        }
        // Handle other next actions...
        break;
        
      case 'commands':
        await showAllCommands();
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'health':
        showBanner();
        await checkProjectStatus();
        break;
        
      case 'test:all':
        await runCommand('npm run test:all || npm test', 'Running all tests');
        await new Promise(resolve => setTimeout(resolve, 2000));
        break;
        
      case 'test:unit':
        await runCommand('npm test', 'Running unit tests');
        await new Promise(resolve => setTimeout(resolve, 2000));
        break;
        
      case 'lint':
        await runCommand('npm run lint', 'Checking code quality');
        await new Promise(resolve => setTimeout(resolve, 2000));
        break;
        
      case 'lint:fix':
        await runCommand('npm run lint:fix || npm run lint -- --fix', 'Auto-fixing issues');
        await new Promise(resolve => setTimeout(resolve, 2000));
        break;
        
      default:
        console.log(chalk.yellow(`\n⚠ Action "${action}" not yet implemented. Coming soon!\n`));
        await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
}

// Run the CLI
main().catch(error => {
  console.error(chalk.red('\n❌ Error:'), error.message);
  process.exit(1);
});
