#!/usr/bin/env node

/**
 * First-Time Setup Script
 * Runs automatically on first npm install in a new project
 * Launches interactive CLI for first-time users
 */

import fs from 'fs';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Find project root
function findProjectRoot(startPath) {
  let currentPath = startPath;
  while (currentPath !== '/') {
    if (fs.existsSync(path.join(currentPath, 'package.json'))) {
      return currentPath;
    }
    currentPath = path.dirname(currentPath);
  }
  return process.cwd();
}

const projectRoot = findProjectRoot(__dirname);
const FIRST_RUN_MARKER = path.join(projectRoot, '.arog-initialized');

async function checkFirstRun() {
  // Check if this is the first time
  if (fs.existsSync(FIRST_RUN_MARKER)) {
    console.log('✅ AROG already initialized!');
    return false;
  }
  return true;
}

async function launchInteractiveCLI() {
  console.log('\n🎉 Welcome to AROG! Launching interactive setup...\n');
  
  return new Promise((resolve) => {
    const cliPath = path.join(__dirname, '..', 'bin', 'arog-cli.js');
    const cli = spawn('node', [cliPath, '--welcome'], {
      stdio: 'inherit',
      cwd: projectRoot
    });
    
    cli.on('close', (code) => {
      // Mark as initialized
      fs.writeFileSync(FIRST_RUN_MARKER, JSON.stringify({
        initialized: new Date().toISOString(),
        version: '1.0.0'
      }, null, 2));
      resolve(code);
    });
  });
}

async function main() {
  const isFirstRun = await checkFirstRun();
  
  if (isFirstRun) {
    console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🤖 AROG - Autonomous Robot for Organization Growth     ║
║                                                           ║
║   This appears to be your first time using AROG!         ║
║   Let's get you started with an interactive tour...      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
    `);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    await launchInteractiveCLI();
    
    console.log('\n✅ Setup complete! Run "npx arog" anytime to access the menu.\n');
  }
}

main().catch(error => {
  console.error('Setup error:', error.message);
  // Don't fail npm install if setup has issues
  process.exit(0);
});
