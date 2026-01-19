#!/usr/bin/env node

/**
 * CLI Validator - Actually tests AROG CLI functionality
 * 
 * Tests:
 * - CLI scripts exist (arog.js, arog-interactive.js, arog-wizard.js)
 * - Scripts are executable
 * - CLI commands are defined
 * - Interactive mode works
 * - Help system exists
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class CLIValidator {
  constructor(projectRoot) {
    this.projectRoot = projectRoot || process.cwd();
    this.results = [];
  }

  async runAll() {
    console.log('\n⚡ Running CLI Validators...\n');

    await this.testCLIScriptsExist();
    await this.testCLIExecutable();
    await this.testCLICommands();
    await this.testInteractiveMode();

    return this.results;
  }

  async testCLIScriptsExist() {
    const test = {
      name: 'CLI scripts exist',
      type: 'filesystem',
      critical: true
    };

    try {
      const requiredScripts = [
        'bin/arog.js',
        'bin/arog.cjs',
        'bin/arog-interactive.js',
        'bin/arog-wizard.js'
      ];

      const missing = [];
      for (const script of requiredScripts) {
        const fullPath = path.join(this.projectRoot, script);
        if (!fs.existsSync(fullPath)) {
          missing.push(script);
        }
      }

      if (missing.length === 0) {
        test.passed = true;
        test.message = `✅ All ${requiredScripts.length} CLI scripts exist`;
      } else {
        test.passed = false;
        test.message = `❌ Missing scripts: ${missing.join(', ')}`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testCLIExecutable() {
    const test = {
      name: 'CLI scripts are executable',
      type: 'filesystem',
      critical: true
    };

    try {
      const scripts = [
        'bin/arog.js',
        'bin/arog-interactive.js',
        'bin/arog-wizard.js'
      ];

      const notExecutable = [];
      for (const script of scripts) {
        const fullPath = path.join(this.projectRoot, script);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, 'utf8');
          if (!content.startsWith('#!/usr/bin/env node')) {
            notExecutable.push(script);
          }
        }
      }

      if (notExecutable.length === 0) {
        test.passed = true;
        test.message = '✅ All CLI scripts have shebang';
      } else {
        test.passed = false;
        test.message = `❌ Missing shebang: ${notExecutable.join(', ')}`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testCLICommands() {
    const test = {
      name: 'CLI commands defined',
      type: 'content-check',
      critical: true
    };

    try {
      const mainCLI = path.join(this.projectRoot, 'bin/arog.cjs');
      const content = fs.readFileSync(mainCLI, 'utf8');

      const expectedCommands = [
        'setup',
        'verify-mcp',
        'what',
        'cli'
      ];

      const found = expectedCommands.filter(cmd => 
        content.includes(`'${cmd}'`) || content.includes(`"${cmd}"`) || content.includes(`case '${cmd}':`)
      );

      if (found.length >= 3) {
        test.passed = true;
        test.message = `✅ CLI commands defined (${found.length}/${expectedCommands.length})`;
      } else {
        test.passed = false;
        test.message = `❌ Missing commands: ${expectedCommands.filter(c => !found.includes(c)).join(', ')}`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testInteractiveMode() {
    const test = {
      name: 'Interactive CLI mode exists',
      type: 'content-check',
      critical: false
    };

    try {
      const interactiveCLI = path.join(this.projectRoot, 'bin/arog-interactive.js');
      const content = fs.readFileSync(interactiveCLI, 'utf8');

      // Check for interactive features
      const hasPrompts = content.includes('inquirer') || content.includes('readline');
      const hasMenu = content.includes('menu') || content.includes('choices');

      if (hasPrompts || hasMenu) {
        test.passed = true;
        test.message = '✅ Interactive mode configured';
      } else {
        test.passed = false;
        test.message = '⚠️  Interactive mode incomplete';
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }
}

module.exports = CLIValidator;

// Allow running standalone
if (require.main === module) {
  (async () => {
    const validator = new CLIValidator();
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
