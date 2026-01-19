#!/usr/bin/env node

/**
 * Automation Toolkit Validator - Tests AROG's 10 automation types
 * 
 * Tests:
 * - Unit testing (Jest)
 * - E2E testing (Playwright)
 * - Accessibility testing (axe-core)
 * - Security scanning (npm audit)
 * - Performance testing (Lighthouse)
 * - Code quality (ESLint, Prettier)
 * - Type checking (TypeScript)
 * - Build automation (Webpack)
 * - CI/CD workflows (GitHub Actions)
 * - Documentation (HTML docs)
 */

const fs = require('fs');
const path = require('path');

class AutomationValidator {
  constructor(projectRoot) {
    this.projectRoot = projectRoot || process.cwd();
    this.results = [];
  }

  async runAll() {
    console.log('\n🛠️  Running Automation Toolkit Validators...\n');

    await this.testUnitTesting();
    await this.testE2ETesting();
    await this.testAccessibilityTesting();
    await this.testSecurityScanning();
    await this.testPerformanceTesting();
    await this.testCodeQuality();
    await this.testTypeChecking();
    await this.testBuildAutomation();
    await this.testCICD();
    await this.testDocumentation();

    return this.results;
  }

  async testUnitTesting() {
    const test = {
      name: 'Unit testing configured (Jest)',
      type: 'config-check',
      critical: true
    };

    try {
      const jestConfig = path.join(this.projectRoot, 'jest.config.js');
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));

      const hasJestConfig = fs.existsSync(jestConfig);
      const hasTestScript = packageJson.scripts && packageJson.scripts.test;
      const hasJestDep = packageJson.devDependencies && packageJson.devDependencies.jest;

      if (hasJestConfig && hasTestScript && hasJestDep) {
        // Config exists, now verify it ACTUALLY WORKS
        const { execSync } = require('child_process');
        try {
          const output = execSync('npm test', { 
            cwd: this.projectRoot, 
            stdio: 'pipe', // Capture output to show errors
            timeout: 60000, // 60 second timeout
            encoding: 'utf8'
          });
          test.passed = true;
          test.message = '✅ Jest tests pass';
        } catch (execError) {
          test.passed = false;
          // Show actual error details, not generic message
          const stderr = execError.stderr || execError.stdout || '';
          const errorLines = stderr.split('\n')
            .filter(line => line.includes('FAIL') || line.includes('Error') || line.includes('●'))
            .slice(0, 10) // First 10 error lines
            .join('\n');
          
          test.message = `❌ npm test failed:\n${errorLines || 'Check console for details'}`;
          test.details = {
            exitCode: execError.status,
            fullError: stderr.slice(0, 1000) // First 1000 chars
          };
        }
      } else {
        test.passed = false;
        test.message = `❌ Missing: ${!hasJestConfig ? 'jest.config.js ' : ''}${!hasTestScript ? 'test script ' : ''}${!hasJestDep ? 'jest dependency' : ''}`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testE2ETesting() {
    const test = {
      name: 'E2E testing configured (Playwright)',
      type: 'config-check',
      critical: true
    };

    try {
      const playwrightConfig = path.join(this.projectRoot, 'playwright.config.js');
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));

      const hasConfig = fs.existsSync(playwrightConfig);
      const hasE2EScript = packageJson.scripts && packageJson.scripts['test:e2e'];
      const hasPlaywrightDep = packageJson.devDependencies && 
                              (packageJson.devDependencies['@playwright/test'] || packageJson.devDependencies.playwright);

      if (hasConfig && hasE2EScript && hasPlaywrightDep) {
        test.passed = true;
        test.message = '✅ Playwright E2E testing fully configured';
      } else {
        test.passed = false;
        test.message = `❌ Missing: ${!hasConfig ? 'playwright.config.js ' : ''}${!hasE2EScript ? 'test:e2e script ' : ''}${!hasPlaywrightDep ? 'playwright dependency' : ''}`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testAccessibilityTesting() {
    const test = {
      name: 'Accessibility testing configured (axe-core)',
      type: 'config-check',
      critical: false
    };

    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
      const hasA11yScript = packageJson.scripts && packageJson.scripts['test:a11y'];
      const hasAxeDep = packageJson.devDependencies && 
                       (packageJson.devDependencies['axe-core'] || packageJson.devDependencies['@axe-core/playwright']);

      if (hasA11yScript && hasAxeDep) {
        test.passed = true;
        test.message = '✅ axe-core accessibility testing configured';
      } else {
        test.passed = false;
        test.message = '⚠️  Accessibility testing incomplete';
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testSecurityScanning() {
    const test = {
      name: 'Security scanning configured',
      type: 'config-check',
      critical: true
    };

    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
      const hasSecurityScript = packageJson.scripts && 
                               (packageJson.scripts.audit || packageJson.scripts['security:audit']);

      if (hasSecurityScript) {
        test.passed = true;
        test.message = '✅ Security scanning configured';
      } else {
        test.passed = false;
        test.message = '❌ Missing security audit script';
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testPerformanceTesting() {
    const test = {
      name: 'Performance testing configured (Lighthouse)',
      type: 'config-check',
      critical: false
    };

    try {
      const lighthouseConfig = path.join(this.projectRoot, 'lighthouserc.json');
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
      
      const hasConfig = fs.existsSync(lighthouseConfig);
      const hasPerfScript = packageJson.scripts && packageJson.scripts['test:perf'];

      if (hasConfig || hasPerfScript) {
        test.passed = true;
        test.message = '✅ Lighthouse performance testing configured';
      } else {
        test.passed = false;
        test.message = '⚠️  Performance testing not configured';
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testCodeQuality() {
    const test = {
      name: 'Code quality tools configured',
      type: 'config-check',
      critical: true
    };

    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
      
      const hasESLint = packageJson.devDependencies && packageJson.devDependencies.eslint;
      const hasLintScript = packageJson.scripts && packageJson.scripts.lint;
      const hasPrettier = packageJson.devDependencies && packageJson.devDependencies.prettier;
      const hasFormatScript = packageJson.scripts && packageJson.scripts.format;

      const configured = [hasESLint, hasLintScript, hasPrettier, hasFormatScript].filter(Boolean).length;

      if (configured >= 3) {
        test.passed = true;
        test.message = `✅ Code quality tools configured (${configured}/4)`;
      } else {
        test.passed = false;
        test.message = `❌ Missing code quality tools (only ${configured}/4)`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testTypeChecking() {
    const test = {
      name: 'Type checking configured (TypeScript)',
      type: 'config-check',
      critical: false
    };

    try {
      const tsConfig = path.join(this.projectRoot, 'tsconfig.json');
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
      
      const hasTsConfig = fs.existsSync(tsConfig);
      const hasTsDep = packageJson.devDependencies && packageJson.devDependencies.typescript;

      if (hasTsConfig && hasTsDep) {
        test.passed = true;
        test.message = '✅ TypeScript type checking configured';
      } else {
        test.passed = false;
        test.message = '⚠️  TypeScript not fully configured';
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testBuildAutomation() {
    const test = {
      name: 'Build automation configured',
      type: 'config-check',
      critical: true
    };

    try {
      const webpackConfig = path.join(this.projectRoot, 'webpack.config.js');
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json'), 'utf8'));
      
      const hasWebpack = fs.existsSync(webpackConfig);
      const hasBuildScript = packageJson.scripts && packageJson.scripts.build;

      if (hasWebpack && hasBuildScript) {
        test.passed = true;
        test.message = '✅ Build automation configured (Webpack)';
      } else {
        test.passed = false;
        test.message = '❌ Missing build configuration';
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testCICD() {
    const test = {
      name: 'CI/CD workflows configured',
      type: 'filesystem',
      critical: true
    };

    try {
      const workflowsDir = path.join(this.projectRoot, '.github/workflows');
      
      if (!fs.existsSync(workflowsDir)) {
        test.passed = false;
        test.message = '❌ .github/workflows directory not found';
        this.results.push(test);
        return;
      }

      const workflows = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));

      if (workflows.length >= 3) {
        test.passed = true;
        test.message = `✅ ${workflows.length} GitHub Actions workflows configured`;
      } else {
        test.passed = false;
        test.message = `❌ Only ${workflows.length} workflows (need at least 3)`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testDocumentation() {
    const test = {
      name: 'Documentation generated',
      type: 'filesystem',
      critical: false
    };

    try {
      const docsDir = path.join(this.projectRoot, 'docs');
      
      if (!fs.existsSync(docsDir)) {
        test.passed = false;
        test.message = '⚠️  docs/ directory not found';
        this.results.push(test);
        return;
      }

      const htmlDocs = fs.readdirSync(docsDir).filter(f => f.endsWith('.html'));

      if (htmlDocs.length >= 5) {
        test.passed = true;
        test.message = `✅ ${htmlDocs.length} HTML documentation files`;
      } else {
        test.passed = false;
        test.message = `⚠️  Only ${htmlDocs.length} documentation files`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }
}

module.exports = AutomationValidator;

// Allow running standalone
if (require.main === module) {
  (async () => {
    const validator = new AutomationValidator();
    const results = await validator.runAll();
    
    console.log('\n📊 Results:\n');
    results.forEach(r => {
      const icon = r.passed ? '✅' : '❌';
      console.log(`${icon} ${r.name}`);
      if (r.message) console.log(`   ${r.message}`);
    });

    const passed = results.filter(r => r.passed).length;
    console.log(`\n${passed}/${results.length} tests passed\n`);
    
    process.exit(results.some(r => r.critical && !r.passed) ? 1 : 0);
  })();
}
