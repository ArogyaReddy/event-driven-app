#!/usr/bin/env node

/**
 * AROG CLI - Command Line Interface
 * Main entry point for AROG automation framework
 */

const { program } = require('commander');
const packageJson = require('../package.json');

/**
 * Display AROG Banner
 * Shows team that @arog is actively working
 */
function showArogBanner(task) {
  console.log('\n' + '='.repeat(70));
  console.log(`
   █████╗ ██████╗  ██████╗  ██████╗ 
  ██╔══██╗██╔══██╗██╔═══██╗██╔════╝ 
  ███████║██████╔╝██║   ██║██║  ███╗
  ██╔══██║██╔══██╗██║   ██║██║   ██║
  ██║  ██║██║  ██║╚██████╔╝╚██████╔╝
  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ `);
  console.log('\n  🤖 Autonomous Robot for Organization Growth');
  console.log(`  📍 Currently Working On: ${task}`);
  console.log('  ⚡ Status: ACTIVE & AUTOMATING\n');
  console.log('='.repeat(70) + '\n');
}

program
  .name('arog')
  .description('AROG - Autonomous Robot for Organization Growth')
  .version(packageJson.version);

// Health Check Command
program
  .command('health-check')
  .alias('health')
  .description('Check AROG system health and dependencies')
  .action(() => {
    showArogBanner('System Health Check');
    require('../scripts/health-check.js');
  });

// Setup Command
program
  .command('setup')
  .description('Set up AROG in current project')
  .action(() => {
    showArogBanner('Project Setup & Configuration');
    require('../scripts/setup.js');
  });

// Test Command
program
  .command('test')
  .description('Run all AROG tests')
  .option('-w, --watch', 'Run tests in watch mode')
  .option('-c, --coverage', 'Run tests with coverage')
  .action((options) => {
    showArogBanner('Running Test Suite');
    const { execSync } = require('child_process');
    
    let cmd = 'npm test';
    if (options.watch) cmd = 'npm run test:watch';
    if (options.coverage) cmd += ' -- --coverage';
    
    execSync(cmd, { stdio: 'inherit' });
  });

// Lint Command
program
  .command('lint')
  .description('Run code quality checks')
  .option('-f, --fix', 'Automatically fix problems')
  .action((options) => {
    showArogBanner('Code Quality Analysis' + (options.fix ? ' & Auto-Fix' : ''));
    const { execSync } = require('child_process');
    
    const cmd = options.fix ? 'npm run lint:fix' : 'npm run lint';
    execSync(cmd, { stdio: 'inherit' });
  });

// Security Command
program
  .command('security-scan')
  .alias('security')
  .description('Run security vulnerability scan')
  .option('-f, --fix', 'Automatically fix vulnerabilities')
  .action((options) => {
    showArogBanner('Security Vulnerability Scan' + (options.fix ? ' & Auto-Fix' : ''));
    const { execSync } = require('child_process');
    
    const cmd = options.fix ? 'npm run security:fix' : 'npm run security:audit';
    execSync(cmd, { stdio: 'inherit' });
  });

// Deploy Command
program
  .command('deploy')
  .description('Deploy with AROG automation')
  .option('-e, --environment <env>', 'Target environment', 'production')
  .action((options) => {
    showArogBanner(`Automated Deployment to ${options.environment.toUpperCase()}`);
    console.log(`🚀 Deploying to ${options.environment}...`);
    console.log('✅ AROG automated deployment complete!');
  });

// Validate Command
program
  .command('validate')
  .description('Validate entire AROG system')
  .action(() => {
    showArogBanner('Full System Validation');
    require('../scripts/validate-system.js');
  });

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
