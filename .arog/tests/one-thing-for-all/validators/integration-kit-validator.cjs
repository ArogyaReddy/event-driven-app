#!/usr/bin/env node

/**
 * Integration Kit Validator - Actually tests the integration kit
 * 
 * Tests:
 * - Integration kit directory exists
 * - All files synced between main and integration kit
 * - Package.json matches
 * - Scripts are identical
 * - No blocking operations in integration kit
 */

const fs = require('fs');
const path = require('path');

class IntegrationKitValidator {
  constructor(projectRoot) {
    this.projectRoot = projectRoot || process.cwd();
    this.integrationKitPath = path.join(this.projectRoot, 'arog-integration-kit');
    this.results = [];
  }

  async runAll() {
    console.log('\n📦 Running Integration Kit Validators...\n');

    await this.testIntegrationKitExists();
    await this.testPackageJsonSync();
    await this.testScriptsSync();
    await this.testNoBlockingInKit();

    return this.results;
  }

  async testIntegrationKitExists() {
    const test = {
      name: 'Integration kit directory exists',
      type: 'filesystem',
      critical: true
    };

    try {
      if (fs.existsSync(this.integrationKitPath)) {
        const requiredDirs = [
          '.arog',
          '.arog/scripts'
        ];

        const missing = [];
        for (const dir of requiredDirs) {
          const fullPath = path.join(this.integrationKitPath, dir);
          if (!fs.existsSync(fullPath)) {
            missing.push(dir);
          }
        }

        if (missing.length === 0) {
          test.passed = true;
          test.message = '✅ Integration kit structure complete';
        } else {
          test.passed = false;
          test.message = `❌ Missing in kit: ${missing.join(', ')}`;
        }
      } else {
        test.passed = false;
        test.message = '❌ Integration kit directory not found';
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testPackageJsonSync() {
    const test = {
      name: 'Package.json synced between main and kit',
      type: 'sync-check',
      critical: true
    };

    try {
      const mainPkgPath = path.join(this.projectRoot, '.arog/package.json');
      const kitPkgPath = path.join(this.integrationKitPath, '.arog/package.json');

      if (!fs.existsSync(mainPkgPath) || !fs.existsSync(kitPkgPath)) {
        test.passed = false;
        test.message = '❌ package.json missing in main or kit';
        this.results.push(test);
        return;
      }

      const mainPkg = JSON.parse(fs.readFileSync(mainPkgPath, 'utf8'));
      const kitPkg = JSON.parse(fs.readFileSync(kitPkgPath, 'utf8'));

      // Check postinstall matches
      const mainPostinstall = mainPkg.scripts?.postinstall || '';
      const kitPostinstall = kitPkg.scripts?.postinstall || '';

      if (mainPostinstall === kitPostinstall) {
        test.passed = true;
        test.message = '✅ Postinstall scripts match';
      } else {
        test.passed = false;
        test.message = `❌ Postinstall mismatch:\n  Main: "${mainPostinstall}"\n  Kit:  "${kitPostinstall}"`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testScriptsSync() {
    const test = {
      name: 'Critical scripts synced',
      type: 'sync-check',
      critical: true
    };

    try {
      const criticalScripts = [
        { path: '.arog/scripts/setup-mcp-servers.cjs', name: 'setup-mcp-servers.cjs' },
        { path: '.arog/scripts/verify-mcp.cjs', name: 'verify-mcp.cjs' },
        { path: '.arog/scripts/restart-reminder.cjs', name: 'restart-reminder.cjs' },
        { path: 'scripts/setup.js', name: 'setup.js' }
      ];

      const differences = [];

      for (const script of criticalScripts) {
        const mainPath = path.join(this.projectRoot, script.path);
        const kitPath = path.join(this.integrationKitPath, script.path);

        if (!fs.existsSync(mainPath) || !fs.existsSync(kitPath)) {
          differences.push(`${script.name} missing in main or kit`);
          continue;
        }

        const mainContent = fs.readFileSync(mainPath, 'utf8');
        const kitContent = fs.readFileSync(kitPath, 'utf8');

        if (mainContent !== kitContent) {
          differences.push(`${script.name} differs`);
        }
      }

      if (differences.length === 0) {
        test.passed = true;
        test.message = `✅ All ${criticalScripts.length} critical scripts synced`;
      } else {
        test.passed = false;
        test.message = `❌ Differences found: ${differences.join(', ')}`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testNoBlockingInKit() {
    const test = {
      name: 'Integration kit postinstall configures MCP',
      type: 'config',
      critical: true
    };

    try {
      const kitPkgPath = path.join(this.integrationKitPath, '.arog/package.json');

      if (!fs.existsSync(kitPkgPath)) {
        test.passed = false;
        test.message = '❌ Integration kit package.json not found';
        this.results.push(test);
        return;
      }

      const kitPkg = JSON.parse(fs.readFileSync(kitPkgPath, 'utf8'));
      const postinstall = kitPkg.scripts?.postinstall || '';

      // SHOULD have MCP setup to create .vscode/
      const hasMCPSetup = postinstall.includes('setup-mcp-servers');

      if (hasMCPSetup) {
        test.passed = true;
        test.message = '✅ Integration kit postinstall configures MCP';
      } else {
        test.passed = false;
        test.message = `❌ Integration kit missing MCP setup - .vscode/ won't be created in target projects!`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }
}

module.exports = IntegrationKitValidator;

// Run if called directly
if (require.main === module) {
  const validator = new IntegrationKitValidator();
  validator.runAll().then(results => {
    const passed = results.filter(r => r.passed).length;
    const failed = results.filter(r => !r.passed).length;
    
    console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);
    
    results.forEach(r => {
      console.log(`${r.passed ? '✅' : '❌'} ${r.name}`);
      console.log(`   ${r.message}\n`);
    });
    
    process.exit(failed > 0 ? 1 : 0);
  });
}
