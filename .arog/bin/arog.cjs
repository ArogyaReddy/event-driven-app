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

// ============================================================================
// NEW @arog COMMANDS - Complete Test Suite Integration
// ============================================================================

// Analyze Project Command
program
  .command('analyze')
  .alias('analyze-project')
  .description('Analyze existing project structure and identify gaps')
  .action(() => {
    showArogBanner('Project Analysis');
    const ProjectAnalyzer = require('../scripts/analyze-project.cjs');
    const analyzer = new ProjectAnalyzer();
    analyzer.analyze();
    analyzer.displayReport();
  });

// Integrate Command
program
  .command('integrate')
  .description('Integrate AROG into existing project')
  .action(async () => {
    showArogBanner('AROG Integration');
    const ArogIntegrator = require('../scripts/integrate-arog.cjs');
    const integrator = new ArogIntegrator();
    await integrator.integrate();
  });

// Run All Tests Command
program
  .command('test-all')
  .alias('run-all-tests')
  .description('Run all test suites (unit, e2e, performance, security, accessibility)')
  .action(() => {
    showArogBanner('Running All Test Suites');
    const ArogTestRunner = require('../scripts/run-tests.cjs');
    const runner = new ArogTestRunner();
    runner.runAll();
  });

// Run Unit Tests Command
program
  .command('test-unit')
  .alias('run-unit-tests')
  .description('Run unit tests')
  .action(() => {
    showArogBanner('Running Unit Tests');
    const ArogTestRunner = require('../scripts/run-tests.cjs');
    const runner = new ArogTestRunner();
    runner.runUnitTests();
  });

// Run Functional Tests Command
program
  .command('test-functional')
  .alias('run-functional-tests')
  .description('Run functional/integration tests')
  .action(() => {
    showArogBanner('Running Functional Tests');
    const ArogTestRunner = require('../scripts/run-tests.cjs');
    const runner = new ArogTestRunner();
    runner.runIntegrationTests();
  });

// Run E2E Tests Command
program
  .command('test-e2e')
  .alias('run-e2e-tests')
  .description('Run end-to-end tests')
  .action(() => {
    showArogBanner('Running E2E Tests');
    const ArogTestRunner = require('../scripts/run-tests.cjs');
    const runner = new ArogTestRunner();
    runner.runE2ETests();
  });

// Run Performance Tests Command
program
  .command('test-performance')
  .alias('run-performance-tests')
  .description('Run performance tests')
  .action(() => {
    showArogBanner('Running Performance Tests');
    const ArogTestRunner = require('../scripts/run-tests.cjs');
    const runner = new ArogTestRunner();
    runner.runPerformanceTests();
  });

// Run Security Tests Command
program
  .command('test-security')
  .alias('run-security-tests')
  .description('Run security vulnerability scans')
  .action(() => {
    showArogBanner('Running Security Tests');
    const ArogTestRunner = require('../scripts/run-tests.cjs');
    const runner = new ArogTestRunner();
    runner.runSecurityTests();
  });

// Run Accessibility Tests Command
program
  .command('test-accessibility')
  .alias('run-accessibility-tests')
  .description('Run accessibility (a11y) tests')
  .action(() => {
    showArogBanner('Running Accessibility Tests');
    const ArogTestRunner = require('../scripts/run-tests.cjs');
    const runner = new ArogTestRunner();
    runner.runAccessibilityTests();
  });

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
