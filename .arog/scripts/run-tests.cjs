#!/usr/bin/env node

/**
 * AROG Test Runner
 * Intelligently runs different types of tests based on project setup
 */

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

class ArogTestRunner {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath;
    this.packageJson = this.readPackageJson();
  }

  /**
   * Run all tests
   */
  runAll() {
    console.log('\n🧪 @arog is running ALL tests...\n');

    const results = {
      unit: this.runUnitTests(),
      integration: this.runIntegrationTests(),
      e2e: this.runE2ETests(),
      performance: this.runPerformanceTests(),
      security: this.runSecurityTests(),
      accessibility: this.runAccessibilityTests()
    };

    this.displaySummary(results);
    return results;
  }

  /**
   * Run unit tests
   */
  runUnitTests() {
    console.log('📦 Running Unit Tests...\n');

    const commands = [
      'npm test',
      'npm run test:unit',
      'npm run unit',
      'yarn test',
      'pnpm test',
      'jest',
      'vitest run',
      'mocha'
    ];

    return this.tryCommands(commands, 'unit tests');
  }

  /**
   * Run integration tests
   */
  runIntegrationTests() {
    console.log('\n🔗 Running Integration Tests...\n');

    const commands = [
      'npm run test:integration',
      'npm run integration',
      'yarn test:integration'
    ];

    const result = this.tryCommands(commands, 'integration tests');
    
    if (!result.success && !result.found) {
      console.log('   ℹ️  No integration tests configured');
      console.log('   💡 Add with: npm run test:integration\n');
    }

    return result;
  }

  /**
   * Run E2E tests
   */
  runE2ETests() {
    console.log('\n🎭 Running E2E Tests...\n');

    const commands = [
      'npm run test:e2e',
      'npm run e2e',
      'npx playwright test',
      'npx cypress run',
      'yarn test:e2e'
    ];

    const result = this.tryCommands(commands, 'E2E tests');
    
    if (!result.success && !result.found) {
      console.log('   ℹ️  No E2E tests configured');
      console.log('   💡 @arog can add Playwright tests');
      console.log('   💡 Run: npm install -D @playwright/test && npx playwright install\n');
    }

    return result;
  }

  /**
   * Run performance tests
   */
  runPerformanceTests() {
    console.log('\n⚡ Running Performance Tests...\n');

    // Check for bundle size
    if (fs.existsSync(path.join(this.projectPath, 'dist'))) {
      this.checkBundleSize();
    }

    const commands = [
      'npm run test:performance',
      'npm run test:perf',
      'npm run perf',
      'k6 run tests/performance/*.js',
      'artillery run tests/performance/*.yml'
    ];

    const result = this.tryCommands(commands, 'performance tests');
    
    if (!result.success && !result.found) {
      console.log('   ℹ️  No performance tests configured');
      console.log('   💡 @arog can add k6 or Artillery tests');
      console.log('   💡 Install: npm install -D k6\n');
    }

    return result;
  }

  /**
   * Run security tests
   */
  runSecurityTests() {
    console.log('\n🔒 Running Security Tests...\n');

    // npm audit
    console.log('Running npm audit...');
    try {
      const auditResult = execSync('npm audit --audit-level=moderate', {
        cwd: this.projectPath,
        encoding: 'utf8'
      });
      console.log(auditResult);
      console.log('✅ No vulnerabilities found\n');
      return { success: true, found: true, command: 'npm audit' };
    } catch (error) {
      if (error.stdout) {
        console.log(error.stdout);
      }
      
      // Parse vulnerabilities
      if (error.stdout && error.stdout.includes('vulnerabilities')) {
        console.log('⚠️  Vulnerabilities detected');
        console.log('💡 Run: npm audit fix\n');
        return { success: false, found: true, command: 'npm audit', vulnerabilities: true };
      }
    }

    // Try security test scripts
    const commands = [
      'npm run test:security',
      'npm run security',
      'npm run snyk'
    ];

    const result = this.tryCommands(commands, 'security tests');
    
    if (!result.found) {
      console.log('   ℹ️  No additional security tests configured\n');
    }

    return result;
  }

  /**
   * Run accessibility tests
   */
  runAccessibilityTests() {
    console.log('\n♿ Running Accessibility Tests...\n');

    const commands = [
      'npm run test:a11y',
      'npm run test:accessibility',
      'npm run a11y',
      'npx playwright test tests/accessibility',
      'pa11y-ci'
    ];

    const result = this.tryCommands(commands, 'accessibility tests');
    
    if (!result.success && !result.found) {
      console.log('   ℹ️  No accessibility tests configured');
      console.log('   💡 @arog can add axe-core accessibility tests');
      console.log('   💡 Install: npm install -D axe-playwright\n');
    }

    return result;
  }

  /**
   * Run functional tests
   */
  runFunctionalTests() {
    console.log('\n⚙️  Running Functional Tests...\n');

    const commands = [
      'npm run test:functional',
      'npm run functional',
      'npm run test:integration',
      'npm run test:api'
    ];

    const result = this.tryCommands(commands, 'functional tests');
    
    if (!result.success && !result.found) {
      console.log('   ℹ️  No functional tests configured');
      console.log('   💡 Functional tests often overlap with integration/E2E tests\n');
    }

    return result;
  }

  /**
   * Try multiple commands until one works
   */
  tryCommands(commands, testType) {
    for (const command of commands) {
      // Check if command exists in package.json scripts
      if (command.startsWith('npm run')) {
        const scriptName = command.replace('npm run ', '');
        if (!this.packageJson || !this.packageJson.scripts || !this.packageJson.scripts[scriptName]) {
          continue;
        }
      }

      try {
        console.log(`   Running: ${command}`);
        const output = execSync(command, {
          cwd: this.projectPath,
          encoding: 'utf8',
          stdio: 'inherit'
        });
        
        console.log(`\n✅ ${testType} passed\n`);
        return { success: true, found: true, command };
      } catch (error) {
        if (error.status !== 0) {
          console.log(`\n❌ ${testType} failed`);
          console.log(`   Command: ${command}`);
          console.log(`   Exit code: ${error.status}\n`);
          return { success: false, found: true, command, error: error.message };
        }
      }
    }

    return { success: false, found: false };
  }

  /**
   * Check bundle size
   */
  checkBundleSize() {
    console.log('📦 Checking bundle size...');

    const distPath = path.join(this.projectPath, 'dist');
    if (!fs.existsSync(distPath)) {
      console.log('   ℹ️  No dist/ directory found\n');
      return;
    }

    try {
      const files = this.getAllFiles(distPath);
      let totalSize = 0;

      files.forEach(file => {
        const stats = fs.statSync(file);
        totalSize += stats.size;
      });

      const sizeInKB = (totalSize / 1024).toFixed(2);
      const sizeInMB = (totalSize / 1024 / 1024).toFixed(2);

      console.log(`   Total bundle size: ${sizeInKB} KB (${sizeInMB} MB)`);

      // Check against common limits
      const limitKB = 500; // 500KB limit
      if (totalSize / 1024 > limitKB) {
        console.log(`   ⚠️  Bundle exceeds ${limitKB}KB recommended limit`);
      } else {
        console.log(`   ✅ Bundle size within limits`);
      }
      console.log();
    } catch (error) {
      console.log('   ℹ️  Could not calculate bundle size\n');
    }
  }

  /**
   * Display test summary
   */
  displaySummary(results) {
    console.log('\n' + '='.repeat(70));
    console.log('📊 TEST SUMMARY');
    console.log('='.repeat(70) + '\n');

    const types = [
      { key: 'unit', name: 'Unit Tests', icon: '📦' },
      { key: 'integration', name: 'Integration Tests', icon: '🔗' },
      { key: 'e2e', name: 'E2E Tests', icon: '🎭' },
      { key: 'performance', name: 'Performance Tests', icon: '⚡' },
      { key: 'security', name: 'Security Tests', icon: '🔒' },
      { key: 'accessibility', name: 'Accessibility Tests', icon: '♿' }
    ];

    let passed = 0;
    let failed = 0;
    let notConfigured = 0;

    types.forEach(({ key, name, icon }) => {
      const result = results[key];
      
      if (!result || !result.found) {
        console.log(`${icon} ${name}: ⚠️  NOT CONFIGURED`);
        notConfigured++;
      } else if (result.success) {
        console.log(`${icon} ${name}: ✅ PASSED`);
        passed++;
      } else if (result.vulnerabilities) {
        console.log(`${icon} ${name}: ⚠️  VULNERABILITIES FOUND`);
        failed++;
      } else {
        console.log(`${icon} ${name}: ❌ FAILED`);
        failed++;
      }
    });

    console.log('\n' + '='.repeat(70));
    console.log(`Total: ${passed} passed • ${failed} failed • ${notConfigured} not configured`);
    console.log('='.repeat(70) + '\n');

    if (notConfigured > 0) {
      console.log('💡 @arog can help you add missing test types!');
      console.log('   Run: arog integrate\n');
    }

    return {
      passed,
      failed,
      notConfigured,
      total: passed + failed + notConfigured
    };
  }

  /**
   * Helper methods
   */
  readPackageJson() {
    try {
      const pkgPath = path.join(this.projectPath, 'package.json');
      if (fs.existsSync(pkgPath)) {
        return JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      }
    } catch {
      return null;
    }
    return null;
  }

  getAllFiles(dirPath, arrayOfFiles = []) {
    try {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
          arrayOfFiles = this.getAllFiles(filePath, arrayOfFiles);
        } else {
          arrayOfFiles.push(filePath);
        }
      });
      return arrayOfFiles;
    } catch {
      return arrayOfFiles;
    }
  }
}

// CLI interface
if (require.main === module) {
  const testType = process.argv[2] || 'all';
  const runner = new ArogTestRunner();

  switch (testType.toLowerCase()) {
    case 'all':
      runner.runAll();
      break;
    case 'unit':
      runner.runUnitTests();
      break;
    case 'integration':
    case 'functional':
      runner.runIntegrationTests();
      break;
    case 'e2e':
      runner.runE2ETests();
      break;
    case 'performance':
    case 'perf':
      runner.runPerformanceTests();
      break;
    case 'security':
      runner.runSecurityTests();
      break;
    case 'accessibility':
    case 'a11y':
      runner.runAccessibilityTests();
      break;
    default:
      console.log(`Unknown test type: ${testType}`);
      console.log('Available types: all, unit, integration, e2e, performance, security, accessibility');
      process.exit(1);
  }
}

module.exports = ArogTestRunner;
