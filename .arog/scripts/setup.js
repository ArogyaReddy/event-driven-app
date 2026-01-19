#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

console.log('\n⚙️  @arog is setting up your project...\n');

const steps = [
  {
    name: 'Check Project Structure',
    action: () => {
      const hasPackageJson = fs.existsSync(path.join(process.cwd(), 'package.json'));
      if (hasPackageJson) {
        console.log('  ✅ package.json found');
      } else {
        console.log('  ⚠️  No package.json - skipping dependency install');
        console.log('  💡 Run "npm init" to create one');
      }
      return hasPackageJson;
    },
  },
  {
    name: 'Install Dependencies',
    command: 'npm install',
    condition: () => fs.existsSync(path.join(process.cwd(), 'package.json')),
  },
  {
    name: 'Create Test Directory Structure',
    action: () => {
      const dirs = ['tests/e2e', 'tests/accessibility', 'tests/unit', 'src/utils'];
      dirs.forEach(dir => {
        const fullPath = path.join(process.cwd(), dir);
        if (!fs.existsSync(fullPath)) {
          fs.mkdirSync(fullPath, { recursive: true });
          console.log(`  ✅ Created ${dir}`);
        } else {
          console.log(`  ✓ ${dir} already exists`);
        }
      });
    },
  },
];

steps.forEach((step, index) => {
  // Skip steps with conditions that aren't met
  if (step.condition && !step.condition()) {
    console.log(`⏭️  Skipped: ${step.name}`);
    return;
  }
  
  console.log(`\n📋 Step ${index + 1}/${steps.length}: ${step.name}`);
  try {
    if (step.command) {
      execSync(step.command, { stdio: 'inherit' });
    } else if (step.action) {
      step.action();
    }
    console.log(`✅ ${step.name} - Complete`);
  } catch (error) {
    console.error(`⚠️  ${step.name} - Skipped (${error.message})`);
  }
});

console.log('\n\n🎉 @arog Setup Complete!\n');
console.log('📋 Quick Start:');
console.log('  • Run tests: npm test');
console.log('  • Interactive CLI: arog cli');
console.log('  • Verify MCP: arog verify-mcp');
console.log('  • Learn more: arog what');
console.log('\n⚠️  IMPORTANT: Install Playwright browsers before running E2E tests:');
console.log('   npx playwright install');
console.log('\n💡 TIP: Browsers also auto-install when you first run: npm run test:e2e');
console.log('🤖 @arog is now protecting your codebase 24/7.\n');
