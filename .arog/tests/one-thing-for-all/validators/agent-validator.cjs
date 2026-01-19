#!/usr/bin/env node

/**
 * @arog Agent Validator - Actually tests the custom agent configuration
 * 
 * Tests:
 * - copilot-instructions.md exists and has @arog mode
 * - Agent banner is present
 * - Model routing configuration exists
 * - Agent personality/capabilities defined
 * - Integration with AROG automation
 */

const fs = require('fs');
const path = require('path');

class AgentValidator {
  constructor(projectRoot) {
    this.projectRoot = projectRoot || process.cwd();
    this.results = [];
  }

  async runAll() {
    console.log('\n🤖 Running @arog Agent Validators...\n');

    await this.testAgentConfigExists();
    await this.testAgentBanner();
    await this.testModelRouting();
    await this.testAgentCapabilities();
    await this.testArogIntegration();

    return this.results;
  }

  async testAgentConfigExists() {
    const test = {
      name: '@arog agent configuration exists',
      type: 'filesystem',
      critical: true
    };

    try {
      const configPath = path.join(this.projectRoot, '.github/copilot-instructions.md');
      
      if (!fs.existsSync(configPath)) {
        test.passed = false;
        test.message = '❌ .github/copilot-instructions.md not found';
        this.results.push(test);
        return;
      }

      const content = fs.readFileSync(configPath, 'utf8');

      // Check for @arog mode definition
      if (content.includes('<modeInstructions>') && content.includes('@arog')) {
        test.passed = true;
        test.message = '✅ @arog agent configuration found';
      } else {
        test.passed = false;
        test.message = '❌ Missing @arog mode definition';
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testAgentBanner() {
    const test = {
      name: '@arog banner configured',
      type: 'content-check',
      critical: false
    };

    try {
      const configPath = path.join(this.projectRoot, '.github/copilot-instructions.md');
      const content = fs.readFileSync(configPath, 'utf8');

      // Check for the ASCII art banner
      const hasBanner = content.includes('███████╗██████╗  ██████╗  ██████╗');
      const hasIdentifier = content.includes('🤖 Autonomous Robot for Organization Growth');

      if (hasBanner && hasIdentifier) {
        test.passed = true;
        test.message = '✅ @arog banner configured (shows team it\'s the custom agent)';
      } else {
        test.passed = false;
        test.message = '⚠️  @arog banner missing or incomplete';
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testModelRouting() {
    const test = {
      name: 'Smart model routing configured',
      type: 'content-check',
      critical: false
    };

    try {
      const configPath = path.join(this.projectRoot, '.github/copilot-instructions.md');
      const content = fs.readFileSync(configPath, 'utf8');

      // Check for model routing mentions
      const hasModelRouting = content.includes('Smart Model Routing') || 
                             content.includes('FREE models') ||
                             content.includes('GPT-4o-mini');

      if (hasModelRouting) {
        test.passed = true;
        test.message = '✅ Model routing configured (FREE for simple tasks)';
      } else {
        test.passed = false;
        test.message = '⚠️  Model routing not documented';
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testAgentCapabilities() {
    const test = {
      name: '@arog capabilities defined',
      type: 'content-check',
      critical: true
    };

    try {
      const configPath = path.join(this.projectRoot, '.github/copilot-instructions.md');
      const content = fs.readFileSync(configPath, 'utf8');

      const expectedCapabilities = [
        'Code Review',
        'Testing',
        'Security',
        'Performance',
        'Build & Deploy'
      ];

      const found = expectedCapabilities.filter(cap => 
        content.toLowerCase().includes(cap.toLowerCase())
      );

      if (found.length >= 4) {
        test.passed = true;
        test.message = `✅ Agent capabilities defined (${found.length}/5)`;
      } else {
        test.passed = false;
        test.message = `❌ Missing capabilities: ${expectedCapabilities.filter(c => !found.includes(c)).join(', ')}`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testArogIntegration() {
    const test = {
      name: '@arog integrates with AROG workspace',
      type: 'content-check',
      critical: true
    };

    try {
      const configPath = path.join(this.projectRoot, '.github/copilot-instructions.md');
      const content = fs.readFileSync(configPath, 'utf8');

      // Check for AROG-specific integration
      const hasWorkspaceInstructions = content.includes('AROG Workspace') || 
                                      content.includes('automation framework');
      const hasPlaywrightAgents = content.includes('Playwright Test Agents') ||
                                 content.includes('playwright-test-planner');

      if (hasWorkspaceInstructions && hasPlaywrightAgents) {
        test.passed = true;
        test.message = '✅ @arog integrated with AROG automation framework';
      } else {
        test.passed = false;
        test.message = '❌ Missing AROG workspace integration';
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }
}

module.exports = AgentValidator;

// Allow running standalone
if (require.main === module) {
  (async () => {
    const validator = new AgentValidator();
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
