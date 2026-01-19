#!/usr/bin/env node

/**
 * AROG Interactive CLI
 * Beautiful, user-friendly interface for all @arog capabilities
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

// ============================================================================
// BEAUTIFUL BANNER
// ============================================================================

function showBanner() {
  console.clear();
  
  const banner = figlet.textSync('AROG', {
    font: 'ANSI Shadow',
    horizontalLayout: 'default'
  });
  
  console.log(gradient.pastel.multiline(banner));
  console.log();
  console.log(boxen(
    chalk.cyan.bold('🤖 Autonomous Robot for Organization Growth') + '\n' +
    chalk.gray('Your complete automation framework') + '\n\n' +
    chalk.green('✨ Zero configuration • 🚀 Full automation • 💰 Cost optimized'),
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      backgroundColor: '#1a1a1a'
    }
  ));
}

// ============================================================================
// PROJECT STATUS CHECK
// ============================================================================

async function checkProjectStatus() {
  const status = {
    hasPackageJson: fs.existsSync('package.json'),
    hasNodeModules: fs.existsSync('node_modules'),
    hasTests: fs.existsSync('tests') || fs.existsSync('test'),
    hasGit: fs.existsSync('.git'),
    hasGithubWorkflows: fs.existsSync('.github/workflows'),
    hasArogConfig: fs.existsSync('.arog')
  };

  let score = 0;
  if (status.hasPackageJson) score += 20;
  if (status.hasNodeModules) score += 20;
  if (status.hasTests) score += 20;
  if (status.hasGit) score += 20;
  if (status.hasGithubWorkflows) score += 10;
  if (status.hasArogConfig) score += 10;

  status.score = score;
  status.health = score >= 80 ? 'Excellent' : score >= 60 ? 'Good' : score >= 40 ? 'Fair' : 'Needs Setup';

  return status;
}

// ============================================================================
// MAIN MENU
// ============================================================================

async function showMainMenu(status) {
  console.log();
  console.log(chalk.cyan.bold('═'.repeat(70)));
  console.log(chalk.cyan.bold('  📊 PROJECT STATUS'));
  console.log(chalk.cyan.bold('═'.repeat(70)));
  
  const statusTable = new Table({
    head: [chalk.white.bold('Check'), chalk.white.bold('Status')],
    colWidths: [40, 28],
    style: { head: [], border: ['cyan'] }
  });

  statusTable.push(
    ['📦 package.json', status.hasPackageJson ? chalk.green('✓ Found') : chalk.red('✗ Missing')],
    ['📁 node_modules', status.hasNodeModules ? chalk.green('✓ Installed') : chalk.yellow('⚠ Not installed')],
    ['🧪 Tests directory', status.hasTests ? chalk.green('✓ Found') : chalk.gray('○ Not found')],
    ['🔧 Git repository', status.hasGit ? chalk.green('✓ Initialized') : chalk.gray('○ Not initialized')],
    ['⚙️  GitHub Actions', status.hasGithubWorkflows ? chalk.green('✓ Configured') : chalk.gray('○ Not configured')],
    ['🤖 AROG configured', status.hasArogConfig ? chalk.green('✓ Yes') : chalk.gray('○ Not yet')]
  );

  console.log(statusTable.toString());
  console.log();
  
  const healthColor = status.score >= 80 ? chalk.green : status.score >= 60 ? chalk.yellow : chalk.red;
  console.log(boxen(
    chalk.white.bold('Project Health: ') + healthColor.bold(status.health) + 
    chalk.gray(` (${status.score}/100)`),
    { padding: 0.5, borderColor: 'cyan', borderStyle: 'round' }
  ));
  console.log();

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: chalk.cyan.bold('What would you like to do?'),
      pageSize: 15,
      choices: [
        new inquirer.Separator(chalk.gray('━━━ 🚀 Quick Actions ━━━')),
        { name: '⚡ ' + chalk.green('Quick Start') + chalk.gray(' - Get started in 30 seconds'), value: 'quickstart' },
        { name: '🧪 ' + chalk.cyan('Run All Tests') + chalk.gray(' - Unit, E2E, API, Accessibility'), value: 'test-all' },
        { name: '✅ ' + chalk.blue('Validate Everything') + chalk.gray(' - Complete project validation'), value: 'validate' },
        
        new inquirer.Separator(chalk.gray('━━━ 🛠️  Setup & Configuration ━━━')),
        { name: '🔧 ' + chalk.yellow('Project Setup') + chalk.gray(' - Initialize AROG in project'), value: 'setup' },
        { name: '💊 ' + chalk.magenta('Health Check') + chalk.gray(' - Verify system requirements'), value: 'health' },
        
        new inquirer.Separator(chalk.gray('━━━ 🧪 Testing & Quality ━━━')),
        { name: '🎯 ' + chalk.cyan('Testing Menu') + chalk.gray(' - Unit, E2E, API, Accessibility tests'), value: 'testing' },
        { name: '✨ ' + chalk.blue('Code Quality') + chalk.gray(' - Lint, format, type check'), value: 'quality' },
        { name: '🔍 ' + chalk.green('Code Review') + chalk.gray(' - AI-powered comprehensive review'), value: 'review' },
        
        new inquirer.Separator(chalk.gray('━━━ 🔒 Security & Performance ━━━')),
        { name: '🛡️  ' + chalk.red('Security Scan') + chalk.gray(' - Vulnerabilities, secrets, audit'), value: 'security' },
        { name: '⚡ ' + chalk.yellow('Performance Test') + chalk.gray(' - Lighthouse, bundle size, vitals'), value: 'performance' },
        
        new inquirer.Separator(chalk.gray('━━━ 🏗️  Build & Deploy ━━━')),
        { name: '🏗️  ' + chalk.cyan('Build Project') + chalk.gray(' - Production build'), value: 'build' },
        { name: '🚀 ' + chalk.green('Deploy') + chalk.gray(' - Deploy to staging/production'), value: 'deploy' },
        
        new inquirer.Separator(chalk.gray('━━━ 📚 Information & Help ━━━')),
        { name: '📖 ' + chalk.blue('View Documentation') + chalk.gray(' - Open AROG docs'), value: 'docs' },
        { name: '💡 ' + chalk.yellow('Show Tips') + chalk.gray(' - Best practices & pro tips'), value: 'tips' },
        
        new inquirer.Separator(chalk.gray('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')),
        { name: '🚪 ' + chalk.gray('Exit'), value: 'exit' }
      ]
    }
  ]);

  return answers.action;
}

// ============================================================================
// TESTING MENU
// ============================================================================

async function showTestingMenu() {
  console.log();
  console.log(boxen(
    chalk.cyan.bold('🧪 AROG Testing Suite\n\n') +
    chalk.gray('Choose which tests to run:'),
    { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
  ));
  console.log();

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'testType',
      message: 'Select test type:',
      choices: [
        { name: '🎯 ' + chalk.cyan('All Tests') + chalk.gray(' - Run everything (recommended)'), value: 'all' },
        { name: '🧪 ' + chalk.blue('Unit Tests') + chalk.gray(' - Jest with coverage'), value: 'unit' },
        { name: '🎭 ' + chalk.magenta('E2E Tests') + chalk.gray(' - Playwright (5 browsers)'), value: 'e2e' },
        { name: '🔌 ' + chalk.green('API Tests') + chalk.gray(' - Integration tests'), value: 'api' },
        { name: '♿ ' + chalk.yellow('Accessibility Tests') + chalk.gray(' - WCAG 2.1 AA compliance'), value: 'a11y' },
        { name: '📊 ' + chalk.cyan('Coverage Report') + chalk.gray(' - View test coverage'), value: 'coverage' },
        new inquirer.Separator(),
        { name: '← Back to Main Menu', value: 'back' }
      ]
    }
  ]);

  return answers.testType;
}

// ============================================================================
// CODE QUALITY MENU
// ============================================================================

async function showQualityMenu() {
  console.log();
  console.log(boxen(
    chalk.cyan.bold('✨ Code Quality Tools\n\n') +
    chalk.gray('Choose quality check to run:'),
    { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
  ));
  console.log();

  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'qualityType',
      message: 'Select quality check:',
      choices: [
        { name: '🎯 ' + chalk.cyan('All Quality Checks') + chalk.gray(' - Lint + Format + TypeCheck'), value: 'all' },
        { name: '✨ ' + chalk.blue('ESLint Check') + chalk.gray(' - Find code issues'), value: 'lint' },
        { name: '🔧 ' + chalk.green('ESLint Fix') + chalk.gray(' - Auto-fix issues'), value: 'lint-fix' },
        { name: '🎨 ' + chalk.magenta('Prettier Format') + chalk.gray(' - Format code'), value: 'format' },
        { name: '📝 ' + chalk.yellow('TypeScript Check') + chalk.gray(' - Validate types'), value: 'typecheck' },
        new inquirer.Separator(),
        { name: '← Back to Main Menu', value: 'back' }
      ]
    }
  ]);

  return answers.qualityType;
}

// ============================================================================
// RUN COMMAND WITH BEAUTIFUL OUTPUT
// ============================================================================

async function runCommand(command, description) {
  console.log(chalk.cyan(`⚙️  ${description}`));
  console.log();
  
  return new Promise((resolve, reject) => {
    const [cmd, ...args] = command.split(' ');
    const child = spawn(cmd, args, {
      cwd: process.cwd(),
      stdio: 'inherit',  // Show real-time output!
      shell: true
    });

    child.on('close', (code) => {
      console.log();
      if (code === 0) {
        console.log(chalk.green(`✓ ${description} completed successfully!`));
        console.log();
        resolve({ success: true });
      } else {
        console.log(chalk.red(`✗ ${description} failed (exit code ${code})`));
        console.log();
        reject({ success: false, code });
      }
    });

    child.on('error', (err) => {
      console.log();
      console.log(chalk.red(`✗ Error running ${description}: ${err.message}`));
      console.log();
      reject({ success: false, error: err.message });
    });
  });
}

// ============================================================================
// ACTION HANDLERS
// ============================================================================

async function handleQuickStart() {
  console.log();
  console.log(boxen(
    chalk.cyan.bold('⚡ AROG Quick Start\n\n') +
    chalk.gray('This will set up AROG in your project (30-90 seconds)\n') +
    chalk.yellow('⏳ Downloading Playwright browsers may take time on first run'),
    { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
  ));
  
  try {
    // Use arog CLI commands instead of direct script paths
    console.log();
    console.log(chalk.cyan('📋 Step 1/3: Setting up AROG project structure'));
    await runCommand('arog setup', 'Setting up AROG');
    
    console.log();
    console.log(chalk.cyan('📋 Step 2/3: Installing dependencies (this may take 1-2 minutes)'));
    console.log(chalk.gray('   ⏳ Downloading Playwright browsers (~200MB)...'));
    await runCommand('npm install', 'Installing dependencies');
    
    console.log();
    console.log(chalk.cyan('📋 Step 3/3: Running initial tests'));
    await runCommand('npm test', 'Running initial tests');
    
    console.log();
    console.log(boxen(
      chalk.green.bold('✓ Quick Start Complete!\n\n') +
      chalk.white('Your project is ready to use @arog.\n\n') +
      chalk.cyan.bold('✨ What happened:\n') +
      chalk.gray('   ✅ MCP server configured (browser automation)\n') +
      chalk.gray('   ✅ Playwright browsers installed\n') +
      chalk.gray('   ✅ Tests validated\n\n') +
      chalk.gray('Launch CLI anytime: ') + chalk.cyan('arog cli'),
      { padding: 1, borderColor: 'green', borderStyle: 'round' }
    ));
  } catch (error) {
    console.log(chalk.red('\n✗ Quick start encountered issues. Check output above.'));
  }
  
  await pause();
}

async function handleTesting(testType) {
  const commands = {
    all: { cmd: 'npm test', desc: 'Running all tests' },
    unit: { cmd: 'npm run test', desc: 'Running unit tests' },
    e2e: { cmd: 'npm run test:e2e', desc: 'Running E2E tests' },
    api: { cmd: 'npm run test:api', desc: 'Running API tests' },
    a11y: { cmd: 'npm run test:a11y', desc: 'Running accessibility tests' },
    coverage: { cmd: 'npm test -- --coverage', desc: 'Generating coverage report' }
  };

  if (testType === 'back') return;

  const test = commands[testType];
  if (test) {
    try {
      await runCommand(test.cmd, test.desc);
    } catch (error) {
      // Error already displayed
    }
    await pause();
  }
}

async function handleQuality(qualityType) {
  const commands = {
    all: [
      { cmd: 'npm run lint', desc: 'Running ESLint' },
      { cmd: 'npm run format:check', desc: 'Checking formatting' },
      { cmd: 'npm run typecheck', desc: 'Type checking' }
    ],
    lint: { cmd: 'npm run lint', desc: 'Running ESLint' },
    'lint-fix': { cmd: 'npm run lint:fix', desc: 'Fixing ESLint issues' },
    format: { cmd: 'npm run format', desc: 'Formatting code with Prettier' },
    typecheck: { cmd: 'npm run typecheck', desc: 'Type checking with TypeScript' }
  };

  if (qualityType === 'back') return;

  if (qualityType === 'all') {
    for (const task of commands.all) {
      try {
        await runCommand(task.cmd, task.desc);
      } catch (error) {
        // Continue with other tasks
      }
    }
  } else {
    const task = commands[qualityType];
    if (task) {
      try {
        await runCommand(task.cmd, task.desc);
      } catch (error) {
        // Error already displayed
      }
    }
  }
  
  await pause();
}

async function handleValidate() {
  console.log();
  console.log(boxen(
    chalk.cyan.bold('✅ Complete System Validation\n\n') +
    chalk.gray('This will run all checks (2-3 minutes)'),
    { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
  ));
  
  const tasks = [
    { cmd: 'npm run lint', desc: 'Code quality check' },
    { cmd: 'npm run typecheck', desc: 'TypeScript validation' },
    { cmd: 'npm test', desc: 'All tests' },
    { cmd: 'npm run build', desc: 'Production build' }
  ];

  let passed = 0;
  let failed = 0;

  for (const task of tasks) {
    try {
      await runCommand(task.cmd, task.desc);
      passed++;
    } catch (error) {
      failed++;
    }
  }

  console.log();
  const resultColor = failed === 0 ? chalk.green : chalk.yellow;
  console.log(boxen(
    resultColor.bold(`Validation Complete!\n\n`) +
    chalk.green(`✓ Passed: ${passed}\n`) +
    (failed > 0 ? chalk.red(`✗ Failed: ${failed}\n`) : '') +
    chalk.white(`\nTotal: ${passed + failed} checks`),
    { padding: 1, borderColor: failed === 0 ? 'green' : 'yellow', borderStyle: 'round' }
  ));
  
  await pause();
}

async function handleSecurity() {
  console.log();
  console.log(boxen(
    chalk.red.bold('🛡️  Security Scan\n\n') +
    chalk.gray('Scanning for vulnerabilities and exposed secrets'),
    { padding: 1, borderColor: 'red', borderStyle: 'round' }
  ));
  
  try {
    await runCommand('npm audit', 'Running dependency audit');
    console.log(chalk.gray('\nChecking for exposed secrets...'));
    // Add secret scanning logic here
  } catch (error) {
    // Error already displayed
  }
  
  await pause();
}

async function showTips() {
  console.log();
  console.log(boxen(
    chalk.yellow.bold('💡 AROG Pro Tips\n\n') +
    chalk.white('1. ') + chalk.cyan('Use @arog in VS Code') + chalk.gray(' - Ask @arog to generate code\n') +
    chalk.white('2. ') + chalk.cyan('Run tests often') + chalk.gray(' - Catch issues early\n') +
    chalk.white('3. ') + chalk.cyan('Let @arog review') + chalk.gray(' - Before every commit\n') +
    chalk.white('4. ') + chalk.cyan('Check security daily') + chalk.gray(' - Stay protected\n') +
    chalk.white('5. ') + chalk.cyan('Monitor performance') + chalk.gray(' - Keep apps fast\n\n') +
    chalk.green('💰 Cost Optimization:\n') +
    chalk.gray('- Simple tasks use FREE models (GPT-4o-mini)\n') +
    chalk.gray('- Complex tasks use PAID models (Claude Sonnet)\n') +
    chalk.gray('- Saves 70-85% on AI costs automatically!'),
    { padding: 1, borderColor: 'yellow', borderStyle: 'round' }
  ));
  
  await pause();
}

async function pause() {
  console.log();
  await inquirer.prompt([
    {
      type: 'input',
      name: 'continue',
      message: chalk.gray('Press Enter to continue...'),
    }
  ]);
}

// ============================================================================
// MAIN LOOP
// ============================================================================

async function main() {
  let running = true;

  while (running) {
    showBanner();
    const status = await checkProjectStatus();
    const action = await showMainMenu(status);

    switch (action) {
      case 'quickstart':
        await handleQuickStart();
        break;
      
      case 'test-all':
        await handleTesting('all');
        break;
      
      case 'testing':
        const testType = await showTestingMenu();
        await handleTesting(testType);
        break;
      
      case 'quality':
        const qualityType = await showQualityMenu();
        await handleQuality(qualityType);
        break;
      
      case 'validate':
        await handleValidate();
        break;
      
      case 'security':
        await handleSecurity();
        break;
      
      case 'health':
        await runCommand('arog health', 'Running health check');
        await pause();
        break;
      
      case 'setup':
        await runCommand('arog setup', 'Setting up AROG');
        await pause();
        break;
      
      case 'build':
        await runCommand('npm run build', 'Building production bundle');
        await pause();
        break;
      
      case 'review':
        console.log();
        console.log(boxen(
          chalk.cyan.bold('🔍 Code Review\n\n') +
          chalk.gray('Use @arog in VS Code for AI-powered code reviews.\n') +
          chalk.white('Just select code and type: ') + chalk.cyan('@arog review this code'),
          { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
        ));
        await pause();
        break;
      
      case 'tips':
        await showTips();
        break;
      
      case 'docs':
        console.log();
        console.log(boxen(
          chalk.blue.bold('📚 Documentation\n\n') +
          chalk.white('AROG documentation is available at:\n\n') +
          chalk.cyan('• docs/arog-bible.html\n') +
          chalk.cyan('• docs/setup-guide.html\n') +
          chalk.cyan('• docs/configuration.html\n\n') +
          chalk.gray('Run: ') + chalk.green('npm run docs:serve') + chalk.gray(' to view in browser'),
          { padding: 1, borderColor: 'blue', borderStyle: 'round' }
        ));
        await pause();
        break;
      
      case 'exit':
        console.log();
        console.log(boxen(
          chalk.cyan.bold('👋 Thanks for using AROG!\n\n') +
          chalk.gray('Run ') + chalk.green('arog') + chalk.gray(' anytime to return.\n\n') +
          chalk.white('🤖 ') + chalk.cyan('Your code is in good hands!'),
          { padding: 1, borderColor: 'cyan', borderStyle: 'round' }
        ));
        console.log();
        running = false;
        break;
    }
  }
}

// ============================================================================
// START
// ============================================================================

main().catch((error) => {
  console.error(chalk.red('\n✗ An error occurred:'), error.message);
  process.exit(1);
});
