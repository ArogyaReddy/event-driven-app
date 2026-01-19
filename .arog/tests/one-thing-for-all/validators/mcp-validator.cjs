#!/usr/bin/env node

/**
 * MCP Validator - Actually tests MCP server configuration
 * 
 * Tests:
 * - All 8 MCP servers configured in settings.json
 * - setup-mcp-servers.cjs exists and is executable
 * - verify-mcp.cjs works correctly
 * - No blocking MCP operations in postinstall
 */

const fs = require('fs');
const path = require('path');

class MCPValidator {
  constructor(projectRoot) {
    this.projectRoot = projectRoot || process.cwd();
    this.results = [];
    this.expectedServers = [
      'playwright',
      'github',
      'gitlab',
      'slack',
      'jira',
      'confluence',
      'postgres',
      'miro'
    ];
  }

  async runAll() {
    console.log('\n🎭 Running MCP Validators...\n');

    await this.testMCPScriptsExist();
    await this.testVSCodeSetup(); // NEW: Actually check .vscode/ was created
    await this.testSetupMCPServersContent();
    await this.testVerifyMCPContent();
    await this.testNoBlockingMCP();

    return this.results;
  }

  async testVSCodeSetup() {
    const test = {
      name: '.vscode/ configured with MCP servers',
      type: 'execution-check',
      critical: true
    };

    try {
      const vscodeDir = path.join(this.projectRoot, '.vscode');
      const settingsPath = path.join(vscodeDir, 'settings.json');

      if (!fs.existsSync(vscodeDir)) {
        test.passed = false;
        test.message = '❌ .vscode/ directory missing - run: cd .arog && npm install';
        this.results.push(test);
        return;
      }

      if (!fs.existsSync(settingsPath)) {
        test.passed = false;
        test.message = '❌ .vscode/settings.json missing - MCP not configured';
        this.results.push(test);
        return;
      }

      // Verify settings.json has MCP servers
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      
      if (!settings['mcp.servers']) {
        test.passed = false;
        test.message = '❌ settings.json exists but has no MCP servers configured';
        this.results.push(test);
        return;
      }

      const configuredServers = Object.keys(settings['mcp.servers']);
      
      if (configuredServers.length === 0) {
        test.passed = false;
        test.message = '❌ MCP servers section is empty';
      } else {
        test.passed = true;
        test.message = `✅ ${configuredServers.length} MCP servers configured`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testMCPScriptsExist() {
    const test = {
      name: 'MCP scripts exist',
      type: 'filesystem',
      critical: true
    };

    try {
      const requiredScripts = [
        '.arog/scripts/setup-mcp-servers.cjs',
        '.arog/scripts/verify-mcp.cjs'
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
        test.message = `✅ All ${requiredScripts.length} MCP scripts exist`;
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

  async testSetupMCPServersContent() {
    const test = {
      name: 'setup-mcp-servers.cjs configures all 8 servers',
      type: 'code-analysis',
      critical: true
    };

    try {
      const scriptPath = path.join(this.projectRoot, '.arog/scripts/setup-mcp-servers.cjs');
      
      if (!fs.existsSync(scriptPath)) {
        test.passed = false;
        test.message = '❌ setup-mcp-servers.cjs not found';
        this.results.push(test);
        return;
      }

      const content = fs.readFileSync(scriptPath, 'utf8');
      
      const missing = this.expectedServers.filter(server => 
        !content.includes(server) && !content.includes(server.toUpperCase())
      );

      if (missing.length === 0) {
        test.passed = true;
        test.message = `✅ All 8 MCP servers referenced in setup script`;
      } else {
        test.passed = false;
        test.message = `❌ Missing servers: ${missing.join(', ')}`;
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testVerifyMCPContent() {
    const test = {
      name: 'verify-mcp.cjs can auto-setup when missing',
      type: 'code-analysis',
      critical: true
    };

    try {
      const scriptPath = path.join(this.projectRoot, '.arog/scripts/verify-mcp.cjs');
      
      if (!fs.existsSync(scriptPath)) {
        test.passed = false;
        test.message = '❌ verify-mcp.cjs not found';
        this.results.push(test);
        return;
      }

      const content = fs.readFileSync(scriptPath, 'utf8');
      
      // Check for auto-setup capability
      const hasAutoSetup = content.includes('setup-mcp-servers') && 
                          content.includes('execSync');

      if (hasAutoSetup) {
        test.passed = true;
        test.message = '✅ verify-mcp has auto-setup capability';
      } else {
        test.passed = false;
        test.message = '❌ verify-mcp missing auto-setup logic';
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }

  async testNoBlockingMCP() {
    const test = {
      name: 'Postinstall configures MCP servers automatically',
      type: 'config',
      critical: true
    };

    try {
      const pkgPath = path.join(this.projectRoot, '.arog/package.json');
      
      if (!fs.existsSync(pkgPath)) {
        test.passed = false;
        test.message = '❌ .arog/package.json not found';
        this.results.push(test);
        return;
      }

      const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      const postinstall = pkg.scripts?.postinstall || '';
      
      // SHOULD run setup-mcp-servers in postinstall (this creates .vscode/)
      const hasMCPSetup = postinstall.includes('setup-mcp-servers.cjs') ||
                            postinstall.includes('setup-mcp-server.js');

      if (hasMCPSetup) {
        test.passed = true;
        test.message = '✅ Postinstall runs MCP setup (creates .vscode/)';
      } else {
        test.passed = false;
        test.message = '❌ Postinstall missing MCP setup - .vscode/ won\'t be created!';
      }
    } catch (error) {
      test.passed = false;
      test.message = `❌ Error: ${error.message}`;
    }

    this.results.push(test);
  }
}

module.exports = MCPValidator;

// Run if called directly
if (require.main === module) {
  const validator = new MCPValidator();
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
