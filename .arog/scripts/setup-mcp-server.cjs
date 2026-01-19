#!/usr/bin/env node

/**
 * AROG MCP Server Setup
 * Configures Playwright MCP server for browser automation and E2E test generation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function boxMessage(message, color = colors.green) {
  const lines = message.split('\n');
  const maxLength = Math.max(...lines.map(l => l.length));
  const border = '═'.repeat(maxLength + 4);
  
  console.log('');
  log(`╔${border}╗`, color);
  lines.forEach(line => {
    const padding = ' '.repeat(maxLength - line.length);
    log(`║  ${line}${padding}  ║`, color);
  });
  log(`╚${border}╝`, color);
  console.log('');
}

async function setupMCPServer() {
  try {
    log('\n🎭 AROG MCP Server Setup Starting...', colors.cyan);
    log('━'.repeat(60), colors.cyan);

    // Determine project root (parent of .arog folder)
    const arogDir = process.cwd();
    const projectRoot = path.dirname(arogDir);
    const vscodeDir = path.join(projectRoot, '.vscode');
    const settingsFile = path.join(vscodeDir, 'settings.json');
    const gitignoreFile = path.join(projectRoot, '.gitignore');

    // Step 1: Create .vscode directory
    log('\n📁 Step 1: Creating .vscode directory...', colors.cyan);
    if (!fs.existsSync(vscodeDir)) {
      fs.mkdirSync(vscodeDir, { recursive: true });
      log('   ✅ Created .vscode/', colors.green);
    } else {
      log('   ✅ .vscode/ already exists', colors.green);
    }

    // Step 2: Create/Update settings.json
    log('\n⚙️  Step 2: Configuring MCP server...', colors.cyan);
    
    let settings = {};
    if (fs.existsSync(settingsFile)) {
      try {
        const content = fs.readFileSync(settingsFile, 'utf8');
        settings = JSON.parse(content);
        log('   ℹ️  Found existing settings.json', colors.yellow);
      } catch (err) {
        log('   ⚠️  Could not parse existing settings.json, creating new one', colors.yellow);
      }
    }

    // Add MCP server configuration
    if (!settings['mcp.servers']) {
      settings['mcp.servers'] = {};
    }

    settings['mcp.servers']['playwright'] = {
      command: 'npx',
      args: ['@playwright/mcp@latest'],
      description: 'Official Playwright MCP Server with Test Agents'
    };

    fs.writeFileSync(settingsFile, JSON.stringify(settings, null, 2), 'utf8');
    log('   ✅ MCP server configured in settings.json', colors.green);

    // Step 2b: Create mcp.json (standalone format for compatibility)
    log('\n📝 Step 2b: Creating standalone mcp.json...', colors.cyan);
    const mcpFile = path.join(vscodeDir, 'mcp.json');
    const mcpConfig = {
      servers: {
        'playwright-test': {
          type: 'stdio',
          command: 'npx',
          args: ['playwright', 'run-test-mcp-server']
        }
      },
      inputs: []
    };

    fs.writeFileSync(mcpFile, JSON.stringify(mcpConfig, null, 2), 'utf8');
    log('   ✅ mcp.json created (standalone format)', colors.green);

    // Step 3: Install Playwright browsers
    log('\n🌐 Step 3: Installing Playwright browsers...', colors.cyan);
    try {
      execSync('npx playwright install chromium', { 
        stdio: 'inherit',
        cwd: arogDir 
      });
      log('   ✅ Playwright browsers installed', colors.green);
    } catch (err) {
      log('   ⚠️  Browser installation skipped (will install on first use)', colors.yellow);
    }

    // Step 4: Add .vscode/ to .gitignore
    log('\n📝 Step 4: Updating .gitignore...', colors.cyan);
    let gitignoreContent = '';
    if (fs.existsSync(gitignoreFile)) {
      gitignoreContent = fs.readFileSync(gitignoreFile, 'utf8');
    }

    if (!gitignoreContent.includes('.vscode/')) {
      const vscodeLine = '\n# VS Code settings (AROG configuration)\n.vscode/\n';
      fs.writeFileSync(gitignoreFile, gitignoreContent + vscodeLine, 'utf8');
      log('   ✅ Added .vscode/ to .gitignore', colors.green);
    } else {
      log('   ✅ .vscode/ already in .gitignore', colors.green);
    }

    // Success message
    log('\n' + '━'.repeat(60), colors.green);
    log('✅ MCP Server Setup Complete!', colors.green);
    log('━'.repeat(60) + '\n', colors.green);

    // CRITICAL: Show IMPOSSIBLE-TO-MISS restart instruction
    boxMessage(
      '🔄 IMPORTANT: RESTART VS CODE NOW!\n\n' +
      'Press Cmd+Shift+P (Mac) or Ctrl+Shift+P (Windows/Linux)\n' +
      'Type: "Reload Window"\n' +
      'Press Enter\n\n' +
      'Or just close and reopen VS Code\n\n' +
      '⚠️  MCP server will NOT work until you restart!',
      colors.bgYellow + colors.bright
    );

    log('After restart, @arog will have full browser automation capabilities! 🎉\n', colors.green);

  } catch (error) {
    log('\n❌ Error during MCP setup:', colors.red);
    log(error.message, colors.red);
    log('\n⚠️  Don\'t worry! MCP setup will run on your first @arog command.', colors.yellow);
    process.exit(0); // Exit gracefully to not break npm install
  }
}

// Run the setup
setupMCPServer().catch(err => {
  console.error('Setup failed:', err);
  process.exit(0); // Exit gracefully
});
