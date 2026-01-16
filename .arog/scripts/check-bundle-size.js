#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MAX_SIZE = 500 * 1024; // 500KB
const WARN_SIZE = 400 * 1024; // 400KB

function getFileSize(filePath) {
  const stats = fs.statSync(filePath);
  return stats.size;
}

function formatSize(bytes) {
  return `${(bytes / 1024).toFixed(2)} KB`;
}

function checkBundleSize() {
  const bundlePath = path.join(__dirname, '..', 'dist', 'bundle.js');
  
  console.log('\n📦 @arog is checking bundle size...\n');
  
  if (!fs.existsSync(bundlePath)) {
    console.log('⚠️  Bundle file not found. Run build first: npm run build');
    console.log('\n🤖 @arog bundle check skipped.\n');
    return;
  }
  
  const size = getFileSize(bundlePath);
  console.log(`Bundle Size Analysis:\n`);
  console.log(`File: ${bundlePath}`);
  console.log(`Size: ${formatSize(size)}`);
  console.log(`Limit: ${formatSize(MAX_SIZE)}`);
  console.log(`Warning: ${formatSize(WARN_SIZE)}\n`);
  
  if (size > MAX_SIZE) {
    console.error(`❌ Bundle size exceeds limit!`);
    console.error(`   Current: ${formatSize(size)}`);
    console.error(`   Maximum: ${formatSize(MAX_SIZE)}`);
    process.exit(1);
  } else if (size > WARN_SIZE) {
    console.warn(`⚠️  Bundle size approaching limit`);
    console.warn(`   Current: ${formatSize(size)}`);
    console.warn(`   Warning: ${formatSize(WARN_SIZE)}`);
  } else {
    console.log(`✅ Bundle size is within limits`);
  }
  
  console.log('\n🤖 @arog bundle check complete.\n');
}

checkBundleSize();
