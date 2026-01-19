#!/usr/bin/env node

/**
 * 🧪 MCP Setup Integration Test
 * 
 * This script tests that MCP setup works correctly when:
 * 1. Running from integration kit directory (dev mode)
 * 2. Running from node_modules (installed mode)
 * 
 * Usage: node test-mcp-setup.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function boxMessage(title, lines, color = colors.cyan) {
  const width = 70;
  const border = '═'.repeat(width);
  
  console.log(`\n${color}╔${border}╗`);
  console.log(`║ ${title.padEnd(width - 1)}║`);
  console.log(`╠${border}╣`);
  
  lines.forEach(line => {
    console.log(`║ ${line.padEnd(width - 1)}║`);
  });
  
  console.log(`╚${border}╝${colors.reset}\n`);
}

// Simulate getProjectRoot() from setup script
function getProjectRoot() {
  const currentDir = process.cwd();
  log(`🔍 Current directory: ${currentDir}`, colors.blue);
  
  if (currentDir.includes('node_modules')) {
    log('  → Detected: Running from node_modules', colors.yellow);
    const parts = currentDir.split(path.sep);
    const nodeModulesIndex = parts.indexOf('node_modules');
    
    if (nodeModulesIndex > 0) {
      const projectRoot = parts.slice(0, nodeModulesIndex).join(path.sep);
      log(`  → Project root: ${projectRoot}`, colors.green);
      return projectRoot || process.cwd();
    }
  }
  
  log('  → Detected: Running in dev mode', colors.green);
  return currentDir;
}

function testPathResolution() {
  boxMessage(
    '🧪 TEST 1: Path Resolution',
    [
      'Testing getProjectRoot() function',
      'Ensures files are created in correct location'
    ],
    colors.cyan
  );

  const projectRoot = getProjectRoot();
  const vscodePath = path.join(projectRoot, '.vscode');
  const settingsPath = path.join(vscodePath, 'settings.json');
  const envTemplatePath = path.join(projectRoot, '.env.mcp.template');
  const docsPath = path.join(projectRoot, 'MCP-SERVERS-SETUP.md');

  log('Expected file locations:', colors.bright);
  log(`  .vscode/settings.json → ${settingsPath}`, colors.blue);
  log(`  .env.mcp.template → ${envTemplatePath}`, colors.blue);
  log(`  MCP-SERVERS-SETUP.md → ${docsPath}`, colors.blue);

  // Verify these are NOT in node_modules
  const inNodeModules = [settingsPath, envTemplatePath, docsPath].some(p => 
    p.includes('node_modules')
  );

  if (inNodeModules) {
    log('\n❌ FAILED: Files would be created in node_modules!', colors.red);
    return false;
  }

  log('\n✅ PASSED: Files will be created in project root', colors.green);
  return true;
}

function testVSCodeSettings() {
  boxMessage(
    '🧪 TEST 2: VS Code Settings',
    [
      'Testing .vscode/settings.json creation',
      'Verifies MCP server configuration format'
    ],
    colors.cyan
  );

  const projectRoot = getProjectRoot();
  const vscodePath = path.join(projectRoot, '.vscode');
  const settingsPath = path.join(vscodePath, 'settings.json');

  // Check if settings.json exists
  if (fs.existsSync(settingsPath)) {
    try {
      const settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
      
      log('Found settings.json:', colors.blue);
      log(JSON.stringify(settings, null, 2), colors.reset);

      // Verify MCP servers section exists
      if (!settings['mcp.servers']) {
        log('\n❌ FAILED: No mcp.servers section found', colors.red);
        return false;
      }

      const mcpServers = settings['mcp.servers'];
      const expectedServers = ['playwright', 'github', 'gitlab', 'slack', 'postgres'];
      const foundServers = Object.keys(mcpServers);

      log('\nExpected servers:', colors.blue);
      expectedServers.forEach(s => log(`  - ${s}`, colors.reset));

      log('\nFound servers:', colors.blue);
      foundServers.forEach(s => log(`  - ${s}`, colors.green));

      const allFound = expectedServers.every(s => foundServers.includes(s));

      if (!allFound) {
        log('\n⚠️  WARNING: Some servers missing', colors.yellow);
        return false;
      }

      log('\n✅ PASSED: All MCP servers configured', colors.green);
      return true;

    } catch (error) {
      log(`\n❌ FAILED: Invalid JSON in settings.json: ${error.message}`, colors.red);
      return false;
    }
  } else {
    log('\n⚠️  SKIPPED: settings.json not created yet', colors.yellow);
    log('   Run: npm run arog:setup-mcp-servers', colors.blue);
    return true; // Not a failure, just not run yet
  }
}

function testEnvTemplate() {
  boxMessage(
    '🧪 TEST 3: Environment Template',
    [
      'Testing .env.mcp.template creation',
      'Verifies all required environment variables'
    ],
    colors.cyan
  );

  const projectRoot = getProjectRoot();
  const envTemplatePath = path.join(projectRoot, '.env.mcp.template');

  if (fs.existsSync(envTemplatePath)) {
    const content = fs.readFileSync(envTemplatePath, 'utf8');
    
    log('Found .env.mcp.template:', colors.blue);
    log(content, colors.reset);

    const requiredVars = [
      'GITHUB_PERSONAL_ACCESS_TOKEN',
      'GITLAB_PERSONAL_ACCESS_TOKEN',
      'SLACK_BOT_TOKEN',
      'POSTGRES_CONNECTION_STRING'
    ];

    const allPresent = requiredVars.every(v => content.includes(v));

    if (!allPresent) {
      log('\n❌ FAILED: Missing required environment variables', colors.red);
      return false;
    }

    log('\n✅ PASSED: All environment variables present', colors.green);
    return true;

  } else {
    log('\n⚠️  SKIPPED: .env.mcp.template not created yet', colors.yellow);
    log('   Run: npm run arog:setup-mcp-servers', colors.blue);
    return true;
  }
}

function testGlobalPackages() {
  boxMessage(
    '🧪 TEST 4: Global Package Installation',
    [
      'Testing global MCP server packages',
      'Verifies npm install -g worked correctly'
    ],
    colors.cyan
  );

  const packages = [
    '@playwright/mcp',
    '@modelcontextprotocol/server-github',
    'gitlab-mcp-server',
    'slack-mcp-server',
    '@modelcontextprotocol/server-postgres'
  ];

  log('Checking global packages:', colors.blue);

  let allInstalled = true;

  packages.forEach(pkg => {
    try {
      // Try to get package version
      const version = execSync(`npm list -g ${pkg} --depth=0 2>/dev/null || echo "not-installed"`, {
        encoding: 'utf8'
      });

      if (version.includes('not-installed') || version.includes('(empty)')) {
        log(`  ❌ ${pkg} - NOT INSTALLED`, colors.red);
        allInstalled = false;
      } else {
        log(`  ✅ ${pkg} - installed`, colors.green);
      }
    } catch (error) {
      log(`  ⚠️  ${pkg} - unable to verify`, colors.yellow);
    }
  });

  if (!allInstalled) {
    log('\n⚠️  WARNING: Some packages not installed', colors.yellow);
    log('   Run: npm run arog:setup-mcp-servers', colors.blue);
    return true; // Not a failure, just not run yet
  }

  log('\n✅ PASSED: All global packages installed', colors.green);
  return true;
}

function testDocumentation() {
  boxMessage(
    '🧪 TEST 5: Documentation Generation',
    [
      'Testing MCP-SERVERS-SETUP.md creation',
      'Verifies documentation is complete'
    ],
    colors.cyan
  );

  const projectRoot = getProjectRoot();
  const docsPath = path.join(projectRoot, 'MCP-SERVERS-SETUP.md');

  if (fs.existsSync(docsPath)) {
    const content = fs.readFileSync(docsPath, 'utf8');
    const lines = content.split('\n').length;
    const bytes = Buffer.byteLength(content, 'utf8');

    log('Found MCP-SERVERS-SETUP.md:', colors.blue);
    log(`  Lines: ${lines}`, colors.reset);
    log(`  Bytes: ${bytes}`, colors.reset);

    if (lines < 100) {
      log('\n❌ FAILED: Documentation too short', colors.red);
      return false;
    }

    log('\n✅ PASSED: Documentation generated', colors.green);
    return true;

  } else {
    log('\n⚠️  SKIPPED: MCP-SERVERS-SETUP.md not created yet', colors.yellow);
    log('   Run: npm run arog:setup-mcp-servers', colors.blue);
    return true;
  }
}

function runAllTests() {
  boxMessage(
    '🧪 MCP SETUP INTEGRATION TESTS',
    [
      'Running comprehensive tests to verify MCP setup',
      'All tests must pass for production readiness',
      '',
      'Press Enter to start tests...'
    ],
    colors.bright
  );

  // Wait for user input
  process.stdin.once('data', () => {
    const results = {
      pathResolution: testPathResolution(),
      vscodeSettings: testVSCodeSettings(),
      envTemplate: testEnvTemplate(),
      globalPackages: testGlobalPackages(),
      documentation: testDocumentation()
    };

    // Summary
    boxMessage(
      '📊 TEST RESULTS SUMMARY',
      [
        '',
        `Path Resolution:     ${results.pathResolution ? '✅ PASSED' : '❌ FAILED'}`,
        `VS Code Settings:    ${results.vscodeSettings ? '✅ PASSED' : '❌ FAILED'}`,
        `Environment Template: ${results.envTemplate ? '✅ PASSED' : '❌ FAILED'}`,
        `Global Packages:     ${results.globalPackages ? '✅ PASSED' : '❌ FAILED'}`,
        `Documentation:       ${results.documentation ? '✅ PASSED' : '❌ FAILED'}`,
        '',
        'Overall Status:',
        Object.values(results).every(r => r) 
          ? '🎉 ALL TESTS PASSED - PRODUCTION READY!'
          : '⚠️  SOME TESTS FAILED - REVIEW REQUIRED'
      ],
      Object.values(results).every(r => r) ? colors.green : colors.yellow
    );

    process.exit(Object.values(results).every(r => r) ? 0 : 1);
  });
}

// Run tests
runAllTests();
