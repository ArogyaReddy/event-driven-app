#!/usr/bin/env node

/**
 * AROG Configuration Manager
 * 
 * Validates and manages the 7-level configuration hierarchy:
 * 1. Organization
 * 2. Team
 * 3. Project
 * 4. Repository
 * 5. Platform
 * 6. Environment
 * 7. Developer
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const CONFIG_DIR = path.join(__dirname, '../config');
const CONFIG_FILES = [
  'org-config.json',
  'team-config.json',
  'project-config.json',
  'repo-config.json',
  'platform-config.json',
  'environment-config.json',
  'developer-config.json',
];

class ConfigManager {
  constructor() {
    this.configs = {};
    this.merged = null;
  }

  /**
   * Load all configuration files
   */
  loadConfigs() {
    console.log('📦 Loading AROG configurations...\n');

    CONFIG_FILES.forEach(file => {
      const filePath = path.join(CONFIG_DIR, file);
      if (fs.existsSync(filePath)) {
        try {
          const config = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          this.configs[file] = config;
          console.log(`✅ Loaded: ${file} (v${config.version || '1.0.0'})`);
        } catch (error) {
          console.error(`❌ Error loading ${file}:`, error.message);
        }
      } else {
        console.warn(`⚠️  Missing: ${file}`);
      }
    });

    console.log('');
  }

  /**
   * Validate configuration structure
   */
  validateConfigs() {
    console.log('🔍 Validating configurations...\n');

    let allValid = true;

    Object.entries(this.configs).forEach(([file, config]) => {
      const errors = [];

      // Required fields
      if (!config.configLevel) errors.push('Missing configLevel');
      if (!config.version) errors.push('Missing version');

      // Check extends chain
      if (config.extends) {
        if (!this.configs[config.extends]) {
          errors.push(`Extends ${config.extends} but file not found`);
        }
      }

      if (errors.length > 0) {
        console.error(`❌ ${file}:`);
        errors.forEach(err => console.error(`   - ${err}`));
        allValid = false;
      } else {
        console.log(`✅ ${file}: Valid`);
      }
    });

    console.log('');
    return allValid;
  }

  /**
   * Merge configurations following inheritance chain
   */
  mergeConfigs() {
    console.log('🔄 Merging configuration hierarchy...\n');

    // Start with org config as base
    let merged = JSON.parse(JSON.stringify(this.configs['org-config.json'] || {}));

    // Merge in order: org -> team -> project -> repo
    const mergeOrder = [
      'team-config.json',
      'project-config.json',
      'repo-config.json',
    ];

    mergeOrder.forEach(file => {
      if (this.configs[file]) {
        console.log(`🔗 Merging: ${file}`);
        merged = this.deepMerge(merged, this.configs[file]);
      }
    });

    // Developer config overrides (highest priority)
    if (this.configs['developer-config.json']) {
      console.log(`🔗 Applying developer overrides`);
      merged = this.deepMerge(merged, this.configs['developer-config.json']);
    }

    this.merged = merged;
    console.log('\n✅ Configuration hierarchy merged successfully\n');

    return merged;
  }

  /**
   * Deep merge two objects
   */
  deepMerge(target, source) {
    const output = { ...target };

    if (this.isObject(target) && this.isObject(source)) {
      Object.keys(source).forEach(key => {
        if (this.isObject(source[key])) {
          if (!(key in target)) {
            output[key] = source[key];
          } else {
            output[key] = this.deepMerge(target[key], source[key]);
          }
        } else {
          output[key] = source[key];
        }
      });
    }

    return output;
  }

  /**
   * Check if value is an object
   */
  isObject(item) {
    return item && typeof item === 'object' && !Array.isArray(item);
  }

  /**
   * Show active configuration summary
   */
  showSummary() {
    console.log('📋 Active Configuration Summary\n');
    console.log('═'.repeat(60));

    if (this.merged) {
      // Code Quality
      if (this.merged.standards?.codeQuality) {
        console.log('\n🎨 Code Quality:');
        const cq = this.merged.standards.codeQuality;
        if (cq.eslint) console.log(`   ESLint: ${JSON.stringify(cq.eslint.extends || cq.eslint)}`);
        if (cq.prettier) console.log(`   Prettier: ${cq.prettier.required ? 'Required' : 'Optional'}`);
        if (cq.typescript) console.log(`   TypeScript: ${cq.typescript.strict ? 'Strict' : 'Normal'}`);
      }

      // Testing
      if (this.merged.standards?.testing) {
        console.log('\n🧪 Testing:');
        const test = this.merged.standards.testing;
        console.log(`   Min Coverage: ${test.minCoverage?.global || 'Not set'}%`);
        console.log(`   Required Types: ${test.requiredTestTypes?.join(', ') || 'None'}`);
      }

      // Security
      if (this.merged.standards?.security) {
        console.log('\n🔒 Security:');
        const sec = this.merged.standards.security;
        console.log(`   Threshold: ${sec.vulnerabilityThreshold || 'Not set'}`);
        console.log(`   Scan Frequency: ${sec.scanFrequency || 'Not set'}`);
      }

      // Accessibility
      if (this.merged.standards?.accessibility) {
        console.log('\n♿ Accessibility:');
        const a11y = this.merged.standards.accessibility;
        console.log(`   WCAG Level: ${a11y.wcagLevel || 'Not set'}`);
        console.log(`   Required: ${a11y.required ? 'Yes' : 'No'}`);
      }

      // Performance
      if (this.merged.standards?.performance) {
        console.log('\n⚡ Performance:');
        const perf = this.merged.standards.performance;
        if (perf.budgets?.bundleSize) {
          console.log(`   Bundle Size: ${perf.budgets.bundleSize.maxSize || 'Not set'}`);
        }
        if (perf.budgets?.lighthouse) {
          console.log(`   Lighthouse: ${perf.budgets.lighthouse.performance || 'Not set'}`);
        }
      }

      // Cost Optimization
      if (this.merged.costOptimization) {
        console.log('\n💰 Cost Optimization:');
        const cost = this.merged.costOptimization;
        console.log(`   Enabled: ${cost.enabled ? 'Yes' : 'No'}`);
        if (cost.expectedSavings) {
          console.log(`   Expected Savings: ${cost.expectedSavings}`);
        }
      }

      console.log('\n' + '═'.repeat(60));
    } else {
      console.log('❌ No merged configuration available');
    }

    console.log('');
  }

  /**
   * Export merged configuration
   */
  exportMerged(outputPath) {
    if (!this.merged) {
      console.error('❌ No merged configuration to export');
      return;
    }

    const output = outputPath || path.join(CONFIG_DIR, 'merged-config.json');
    fs.writeFileSync(output, JSON.stringify(this.merged, null, 2));
    console.log(`✅ Merged configuration exported to: ${output}\n`);
  }

  /**
   * Find where a setting is defined
   */
  findSetting(settingPath) {
    console.log(`🔍 Searching for setting: ${settingPath}\n`);

    const parts = settingPath.split('.');
    const results = [];

    CONFIG_FILES.forEach(file => {
      if (this.configs[file]) {
        let value = this.configs[file];
        let found = true;

        parts.forEach(part => {
          if (value && typeof value === 'object' && part in value) {
            value = value[part];
          } else {
            found = false;
          }
        });

        if (found) {
          results.push({
            file,
            level: this.configs[file].configLevel,
            value: value,
          });
        }
      }
    });

    if (results.length > 0) {
      console.log(`Found in ${results.length} config(s):\n`);
      results.forEach(result => {
        console.log(`📍 ${result.file} (${result.level}):`);
        console.log(`   Value: ${JSON.stringify(result.value, null, 2)}`);
        console.log('');
      });

      // Show final value
      const finalValue = results[results.length - 1];
      console.log(`✅ Final value (from ${finalValue.file}):`);
      console.log(`   ${JSON.stringify(finalValue.value, null, 2)}\n`);
    } else {
      console.log(`❌ Setting '${settingPath}' not found in any configuration\n`);
    }
  }

  /**
   * Run all checks
   */
  runAll() {
    this.loadConfigs();
    const valid = this.validateConfigs();

    if (!valid) {
      console.error('❌ Configuration validation failed\n');
      process.exit(1);
    }

    this.mergeConfigs();
    this.showSummary();
    this.exportMerged();

    console.log('✅ All configuration checks passed!\n');
  }
}

// CLI
const isMainModule = import.meta.url === `file://${process.argv[1]}`;

if (isMainModule) {
  const args = process.argv.slice(2);
  const command = args[0];

  const manager = new ConfigManager();

  switch (command) {
    case 'validate':
      manager.loadConfigs();
      const valid = manager.validateConfigs();
      process.exit(valid ? 0 : 1);
      break;

    case 'merge':
      manager.loadConfigs();
      manager.mergeConfigs();
      manager.exportMerged(args[1]);
      break;

    case 'summary':
      manager.loadConfigs();
      manager.mergeConfigs();
      manager.showSummary();
      break;

    case 'find':
      if (!args[1]) {
        console.error('❌ Usage: config-manager.js find <setting.path>');
        process.exit(1);
      }
      manager.loadConfigs();
      manager.findSetting(args[1]);
      break;

    case 'help':
      console.log(`
AROG Configuration Manager

Usage:
  node config-manager.js [command] [options]

Commands:
  validate              Validate all configuration files
  merge [output]        Merge configs and export to file
  summary               Show active configuration summary
  find <setting.path>   Find where a setting is defined
  help                  Show this help message

Examples:
  node config-manager.js validate
  node config-manager.js merge ./merged.json
  node config-manager.js summary
  node config-manager.js find standards.testing.minCoverage
      `);
      break;

    default:
      manager.runAll();
  }
}

export default ConfigManager;

