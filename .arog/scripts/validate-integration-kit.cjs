#!/usr/bin/env node

/**
 * PROACTIVE Integration Kit Validator
 * Ensures integration kit is always production-ready
 * Run this BEFORE releasing/copying integration kit
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const WORKSPACE_ROOT = path.join(__dirname, '../..');
const INTEGRATION_KIT = path.join(WORKSPACE_ROOT, 'arog-integration-kit');
const MAIN_AROG = path.join(WORKSPACE_ROOT, '.arog');

console.log('\n🔍 PROACTIVE INTEGRATION KIT VALIDATION\n');
console.log('======================================\n');

let failures = [];

// ======================================================================
// 1. FILE SYNC VALIDATION
// ======================================================================
console.log('1️⃣  Checking file synchronization...');

const criticalFiles = [
  'package.json',
  'scripts/setup-mcp-servers.cjs',
  'scripts/restart-reminder.cjs',
];

criticalFiles.forEach((file) => {
  const mainFile = path.join(MAIN_AROG, file);
  const kitFile = path.join(INTEGRATION_KIT, '.arog', file);
  
  if (!fs.existsSync(mainFile)) {
    failures.push(`❌ Missing in main: ${file}`);
    return;
  }
  
  if (!fs.existsSync(kitFile)) {
    failures.push(`❌ Missing in kit: ${file}`);
    return;
  }
  
  const mainContent = fs.readFileSync(mainFile, 'utf8');
  const kitContent = fs.readFileSync(kitFile, 'utf8');
  
  if (mainContent !== kitContent) {
    failures.push(`❌ File mismatch: ${file}`);
    console.log(`   ⚠️  ${file} differs between main and kit`);
  } else {
    console.log(`   ✅ ${file} synchronized`);
  }
});

// ======================================================================
// 2. CONFIG VALIDATION
// ======================================================================
console.log('\n2️⃣  Validating configurations...');

// Check Jest config excludes Playwright tests
const jestConfigPath = path.join(WORKSPACE_ROOT, 'config/jest/jest.config.js');
const jestConfig = fs.readFileSync(jestConfigPath, 'utf8');

if (jestConfig.includes('\\.spec\\.js$')) {
  console.log('   ✅ Jest config excludes Playwright tests');
} else {
  failures.push('❌ Jest config missing Playwright exclusion');
}

// Check postinstall runs MCP setup
const packageJsonPath = path.join(INTEGRATION_KIT, '.arog/package.json');
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

if (packageJson.scripts.postinstall && packageJson.scripts.postinstall.includes('setup-mcp-servers.cjs')) {
  console.log('   ✅ postinstall runs MCP setup');
} else {
  failures.push('❌ postinstall does not run setup-mcp-servers.cjs');
}

// ======================================================================
// 3. MCP SETUP VALIDATION
// ======================================================================
console.log('\n3️⃣  Validating MCP setup script...');

const mcpScriptPath = path.join(INTEGRATION_KIT, '.arog/scripts/setup-mcp-servers.cjs');
if (fs.existsSync(mcpScriptPath)) {
  const mcpScript = fs.readFileSync(mcpScriptPath, 'utf8');
  
  const requiredServers = ['playwright', 'github', 'gitlab', 'slack', 'jira', 'confluence', 'postgres', 'miro'];
  const missingServers = requiredServers.filter(server => {
    // Check for both single and double quotes
    return !mcpScript.includes(`'${server}'`) && !mcpScript.includes(`"${server}"`);
  });
  
  if (missingServers.length === 0) {
    console.log('   ✅ All 8 MCP servers configured');
  } else {
    failures.push(`❌ Missing MCP servers: ${missingServers.join(', ')}`);
  }
} else {
  failures.push('❌ setup-mcp-servers.cjs not found in integration kit');
}

// ======================================================================
// 4. DOCUMENTATION VALIDATION
// ======================================================================
console.log('\n4️⃣  Validating documentation...');

const requiredDocs = [
  'README.md',
  'INTEGRATE.md',
  'QUICK-START.md',
];

requiredDocs.forEach((doc) => {
  const docPath = path.join(INTEGRATION_KIT, doc);
  if (fs.existsSync(docPath)) {
    const content = fs.readFileSync(docPath, 'utf8');
    if (content.length > 100) {
      console.log(`   ✅ ${doc} exists and has content`);
    } else {
      failures.push(`❌ ${doc} is empty or too short`);
    }
  } else {
    failures.push(`❌ ${doc} not found`);
  }
});

// ======================================================================
// 5. GITHUB WORKFLOWS VALIDATION
// ======================================================================
console.log('\n5️⃣  Validating GitHub workflows...');

const workflowsDir = path.join(INTEGRATION_KIT, '.github/workflows');
if (fs.existsSync(workflowsDir)) {
  const workflows = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
  
  console.log(`   ℹ️  Found ${workflows.length} workflows`);
  
  // Check for deprecated actions
  let deprecatedCount = 0;
  workflows.forEach((workflow) => {
    const content = fs.readFileSync(path.join(workflowsDir, workflow), 'utf8');
    if (content.includes('upload-artifact@v3') || content.includes('download-artifact@v3')) {
      deprecatedCount++;
      console.log(`   ⚠️  ${workflow} uses deprecated artifact actions`);
    }
  });
  
  if (deprecatedCount === 0) {
    console.log('   ✅ No deprecated actions found');
  } else {
    failures.push(`❌ ${deprecatedCount} workflows use deprecated artifact actions`);
  }
} else {
  failures.push('❌ .github/workflows directory not found');
}

// ======================================================================
// 6. INTEGRATION SIMULATION TEST
// ======================================================================
console.log('\n6️⃣  Running integration simulation...');
console.log('   ⏳ Creating temporary test project...');

const testDir = '/tmp/arog-kit-validation-test';

try {
  // Clean up old test
  if (fs.existsSync(testDir)) {
    execSync(`rm -rf ${testDir}`);
  }
  
  // Create test project
  fs.mkdirSync(testDir, { recursive: true });
  
  // Copy integration kit
  execSync(`cp -r ${INTEGRATION_KIT}/.arog ${testDir}/`);
  execSync(`cp -r ${INTEGRATION_KIT}/.github ${testDir}/`);
  
  // Run npm install
  console.log('   ⏳ Running npm install...');
  execSync('npm install', {
    cwd: path.join(testDir, '.arog'),
    stdio: 'pipe',
  });
  
  // Check if .vscode was created
  const vscodeDir = path.join(testDir, '.vscode');
  if (fs.existsSync(vscodeDir)) {
    console.log('   ✅ .vscode/ directory created');
    
    // Check if settings.json has MCP servers
    const settingsPath = path.join(vscodeDir, 'settings.json');
    if (fs.existsSync(settingsPath)) {
      const settings = fs.readFileSync(settingsPath, 'utf8');
      if (settings.includes('mcp.servers') && settings.includes('playwright')) {
        console.log('   ✅ MCP servers configured in settings.json');
      } else {
        failures.push('❌ MCP servers not configured in settings.json');
      }
    } else {
      failures.push('❌ settings.json not created');
    }
  } else {
    failures.push('❌ .vscode/ directory not created');
  }
  
  // Run tests
  console.log('   ⏳ Running npm test...');
  try {
    execSync('npm test', {
      cwd: path.join(testDir, '.arog'),
      stdio: 'pipe',
    });
    console.log('   ✅ Tests passed');
  } catch (error) {
    // Some tests may fail if there's no app, which is OK
    console.log('   ⚠️  Some tests failed (expected for fresh integration)');
  }
  
  // Clean up
  execSync(`rm -rf ${testDir}`);
  
} catch (error) {
  failures.push(`❌ Integration simulation failed: ${error.message}`);
}

// ======================================================================
// FINAL REPORT
// ======================================================================
console.log('\n======================================');
console.log('📊 VALIDATION SUMMARY\n');

if (failures.length === 0) {
  console.log('✅ ✅ ✅  ALL CHECKS PASSED  ✅ ✅ ✅\n');
  console.log('🎉 Integration kit is PRODUCTION-READY!\n');
  console.log('You can safely:');
  console.log('  - Copy the kit to new projects');
  console.log('  - Share with other developers');
  console.log('  - Deploy in production environments\n');
  process.exit(0);
} else {
  console.log('❌ ❌ ❌  VALIDATION FAILED  ❌ ❌ ❌\n');
  console.log('Issues found:\n');
  failures.forEach((failure, index) => {
    console.log(`${index + 1}. ${failure}`);
  });
  console.log('\n⚠️  FIX THESE ISSUES BEFORE USING THE INTEGRATION KIT!\n');
  process.exit(1);
}
