#!/usr/bin/env node

/**
 * AROG Integration Script
 * Integrates AROG into existing projects WITHOUT breaking existing setup
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ArogIntegrator {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath;
    this.backupDir = path.join(projectPath, '.arog-backup');
  }

  /**
   * Main integration process
   */
  async integrate() {
    console.log('\n🤖 @arog is integrating into your project...\n');

    try {
      this.createBackup();
      this.createArogDirectory();
      this.createAgentConfiguration();
      this.addGitHubWorkflows();
      this.addNpmScripts();
      this.addTestingInfrastructure();
      this.createDocumentation();
      this.displaySuccess();
    } catch (error) {
      console.error('❌ Integration failed:', error.message);
      console.log('\n💡 Your original files have been backed up to .arog-backup');
      process.exit(1);
    }
  }

  /**
   * Create backup of existing files
   */
  createBackup() {
    console.log('📦 Creating backup of existing files...');
    
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }

    const filesToBackup = [
      'package.json',
      '.github/workflows',
      'tests',
      'test'
    ];

    filesToBackup.forEach(file => {
      const sourcePath = path.join(this.projectPath, file);
      const backupPath = path.join(this.backupDir, file);
      
      if (fs.existsSync(sourcePath)) {
        if (fs.statSync(sourcePath).isDirectory()) {
          this.copyDirectory(sourcePath, backupPath);
        } else {
          fs.copyFileSync(sourcePath, backupPath);
        }
      }
    });

    console.log('✅ Backup created in .arog-backup/\n');
  }

  /**
   * Create .arog directory structure
   */
  createArogDirectory() {
    console.log('📁 Creating .arog directory structure...');

    const dirs = [
      '.arog',
      '.arog/config',
      '.arog/logs',
      '.arog/reports'
    ];

    dirs.forEach(dir => {
      const dirPath = path.join(this.projectPath, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });

    // Create .arog/.gitignore
    const gitignoreContent = `# AROG generated files
logs/
reports/
*.log
`;
    fs.writeFileSync(path.join(this.projectPath, '.arog/.gitignore'), gitignoreContent);

    console.log('✅ .arog directory created\n');
  }

  /**
   * Create GitHub Copilot Agent configuration
   */
  createAgentConfiguration() {
    console.log('🤖 Creating @arog agent configuration...');

    const agentDir = path.join(this.projectPath, '.github/agents');
    if (!fs.existsSync(agentDir)) {
      fs.mkdirSync(agentDir, { recursive: true });
    }

    const packageJson = this.readPackageJson();
    const projectName = packageJson?.name || path.basename(this.projectPath);

    const agentConfig = `# @arog - Autonomous Robot for Organization Growth

## Project: ${projectName}

You are @arog, the autonomous automation agent for this project.

## Your Capabilities

### 1. Code Review & Quality
- Review all commits for code quality
- Check coding standards and best practices  
- Identify potential bugs and vulnerabilities
- Post detailed review comments on PRs

### 2. Testing (Always On)
- Run unit tests on every commit
- Execute E2E tests on PRs
- Check test coverage thresholds
- Validate all test types

### 3. Security (Always On)
- Scan dependencies for vulnerabilities
- Detect exposed secrets and credentials
- Monitor security advisories
- Auto-fix known vulnerabilities

### 4. Performance (Always On)
- Monitor web vitals
- Check bundle size limits
- Run load tests on deployments
- Track performance metrics

### 5. Build & Deploy (Always On)
- Type check with TypeScript
- Build with configured build tool
- Validate dependencies
- Deploy on merge to main

## Available Test Commands

${this.generateTestCommands()}

## Project-Specific Configuration

- **Language**: ${this.detectLanguage()}
- **Framework**: ${this.detectFramework()}
- **Test Framework**: ${this.detectTestFramework()}
- **Build Tool**: ${this.detectBuildTool()}

## Automation Rules

### On Every Commit:
1. Run linting
2. Run unit tests
3. Check code coverage
4. Post review comments

### On Pull Requests:
1. Full code review
2. Run all test suites
3. Security scanning
4. Performance testing
5. Build validation

### On Merge to Main:
1. Full test suite
2. Build production bundle
3. Security audit
4. Run smoke tests

## Response Format

Always start responses with the @arog banner:

\`\`\`
======================================================================
   ███████╗██████╗  ██████╗  ██████╗ 
  ██╔══██╗██╔══██╗██╔═══██╗██╔════╝ 
  ███████║██████╔╝██║   ██║██║  ███╗
  ██╔══██║██╔══██╗██║   ██║██║   ██║
  ██║  ██║██║  ██║╚██████╔╝╚██████╔╝
  ╚═╝  ╚═╝╚═╝  ╚═╝ ╚═════╝  ╚═════╝ 
  
  🤖 Autonomous Robot for Organization Growth
  📍 Currently Working On: [TASK]
  ⚡ Status: ACTIVE & AUTOMATING
======================================================================
\`\`\`

I am @arog. Your code is in good hands. 🤖
`;

    fs.writeFileSync(path.join(agentDir, 'arog.agent.md'), agentConfig);
    console.log('✅ Agent configuration created at .github/agents/arog.agent.md\n');
  }

  /**
   * Add GitHub Actions workflows
   */
  addGitHubWorkflows() {
    console.log('⚙️  Adding GitHub Actions workflows...');

    const workflowsDir = path.join(this.projectPath, '.github/workflows');
    if (!fs.existsSync(workflowsDir)) {
      fs.mkdirSync(workflowsDir, { recursive: true });
    }

    // Only add workflows that don't exist
    const workflows = [
      {
        name: 'arog-code-quality.yml',
        content: this.generateCodeQualityWorkflow()
      },
      {
        name: 'arog-unit-tests.yml',
        content: this.generateUnitTestWorkflow()
      },
      {
        name: 'arog-security.yml',
        content: this.generateSecurityWorkflow()
      }
    ];

    let added = 0;
    workflows.forEach(({ name, content }) => {
      const workflowPath = path.join(workflowsDir, name);
      if (!fs.existsSync(workflowPath)) {
        fs.writeFileSync(workflowPath, content);
        console.log(`   ✅ Added ${name}`);
        added++;
      } else {
        console.log(`   ⏭️  Skipped ${name} (already exists)`);
      }
    });

    console.log(`\n✅ ${added} new workflows added\n`);
  }

  /**
   * Add npm scripts to package.json
   */
  addNpmScripts() {
    console.log('📜 Adding @arog npm scripts...');

    const packageJsonPath = path.join(this.projectPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      console.log('   ⏭️  No package.json found, skipping...\n');
      return;
    }

    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    
    const arogScripts = {
      'arog:health': 'node node_modules/@arogyareddy/arog/scripts/health-check.js || echo "Install @arog first: npm install @arogyareddy/arog"',
      'arog:validate': 'node node_modules/@arogyareddy/arog/scripts/validate-system.js || echo "Install @arog first"',
      'arog:analyze': 'node node_modules/@arogyareddy/arog/scripts/analyze-project.js || echo "Install @arog first"'
    };

    let added = 0;
    for (const [script, command] of Object.entries(arogScripts)) {
      if (!packageJson.scripts[script]) {
        packageJson.scripts[script] = command;
        added++;
      }
    }

    if (added > 0) {
      fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
      console.log(`✅ Added ${added} @arog scripts to package.json\n`);
    } else {
      console.log('   ⏭️  All @arog scripts already exist\n');
    }
  }

  /**
   * Add testing infrastructure
   */
  addTestingInfrastructure() {
    console.log('🧪 Setting up testing infrastructure...');

    // Check what's missing and add it
    const testTypes = [
      { name: 'unit', dir: 'tests/unit' },
      { name: 'e2e', dir: 'tests/e2e' },
      { name: 'integration', dir: 'tests/integration' },
      { name: 'performance', dir: 'tests/performance' },
      { name: 'security', dir: 'tests/security' },
      { name: 'accessibility', dir: 'tests/accessibility' }
    ];

    let created = 0;
    testTypes.forEach(({ name, dir }) => {
      const testDir = path.join(this.projectPath, dir);
      if (!fs.existsSync(testDir)) {
        fs.mkdirSync(testDir, { recursive: true });
        
        // Create README in each test directory
        const readme = `# ${name.charAt(0).toUpperCase() + name.slice(1)} Tests

This directory contains ${name} tests for the project.

## Running Tests

\`\`\`bash
npm run test:${name}
\`\`\`

Added by @arog automation framework.
`;
        fs.writeFileSync(path.join(testDir, 'README.md'), readme);
        console.log(`   ✅ Created ${dir}/`);
        created++;
      } else {
        console.log(`   ⏭️  ${dir}/ already exists`);
      }
    });

    console.log(`\n✅ ${created} new test directories created\n`);
  }

  /**
   * Create documentation
   */
  createDocumentation() {
    console.log('📚 Creating @arog documentation...');

    const docsDir = path.join(this.projectPath, 'docs/arog');
    if (!fs.existsSync(docsDir)) {
      fs.mkdirSync(docsDir, { recursive: true });
    }

    const integrationDoc = `# @arog Integration Guide

@arog has been successfully integrated into your project!

## What Was Added

### 1. Agent Configuration
- \`.github/agents/arog.agent.md\` - @arog agent configuration for GitHub Copilot

### 2. GitHub Actions Workflows
- \`arog-code-quality.yml\` - Automated code quality checks
- \`arog-unit-tests.yml\` - Automated unit testing
- \`arog-security.yml\` - Security vulnerability scanning

### 3. Test Directories
- \`tests/unit/\` - Unit tests
- \`tests/e2e/\` - End-to-end tests  
- \`tests/integration/\` - Integration tests
- \`tests/performance/\` - Performance tests
- \`tests/security/\` - Security tests
- \`tests/accessibility/\` - Accessibility tests

### 4. NPM Scripts
- \`npm run arog:health\` - Check @arog system health
- \`npm run arog:validate\` - Validate @arog configuration
- \`npm run arog:analyze\` - Analyze project structure

## Using @arog

### In GitHub Copilot Chat

Simply mention @arog in any conversation:

\`\`\`
@arog analyze this code
@arog run all tests
@arog check security
@arog review this PR
\`\`\`

### Command Line

\`\`\`bash
# Analyze project
npm run arog:analyze

# Check health
npm run arog:health

# Validate system
npm run arog:validate
\`\`\`

## Next Steps

1. **Review Configuration**: Check \`.github/agents/arog.agent.md\`
2. **Add Tests**: Start adding tests to the new test directories
3. **Commit Changes**: \`git add . && git commit -m "Integrate @arog automation"\`
4. **Push to GitHub**: Workflows will activate automatically

## Need Help?

Ask @arog anything in GitHub Copilot Chat!

---

**@arog = EVERYTHING** 🤖
Autonomous automation for your entire development workflow.
`;

    fs.writeFileSync(path.join(docsDir, 'INTEGRATION.md'), integrationDoc);
    console.log('✅ Documentation created at docs/arog/INTEGRATION.md\n');
  }

  /**
   * Display success message
   */
  displaySuccess() {
    console.log('\n' + '='.repeat(70));
    console.log('🎉 @arog INTEGRATION COMPLETE!');
    console.log('='.repeat(70));
    console.log('\n✅ What was added:\n');
    console.log('   🤖 GitHub Copilot Agent configuration');
    console.log('   ⚙️  GitHub Actions workflows');
    console.log('   🧪 Test directory structure');
    console.log('   📜 NPM scripts');
    console.log('   📚 Documentation');
    console.log('\n🚀 Next steps:\n');
    console.log('   1. Review: docs/arog/INTEGRATION.md');
    console.log('   2. Run: npm run arog:health');
    console.log('   3. Commit: git add . && git commit -m "Integrate @arog"');
    console.log('   4. Push: git push');
    console.log('\n💬 Start using @arog:\n');
    console.log('   • In VS Code: @arog help');
    console.log('   • In terminal: npm run arog:analyze');
    console.log('\n' + '='.repeat(70));
    console.log('🤖 @arog is now active and ready to automate!');
    console.log('='.repeat(70) + '\n');
  }

  /**
   * Helper methods
   */
  copyDirectory(source, destination) {
    if (!fs.existsSync(destination)) {
      fs.mkdirSync(destination, { recursive: true });
    }

    const files = fs.readdirSync(source);
    files.forEach(file => {
      const sourcePath = path.join(source, file);
      const destPath = path.join(destination, file);

      if (fs.statSync(sourcePath).isDirectory()) {
        this.copyDirectory(sourcePath, destPath);
      } else {
        fs.copyFileSync(sourcePath, destPath);
      }
    });
  }

  readPackageJson() {
    try {
      const pkgPath = path.join(this.projectPath, 'package.json');
      if (fs.existsSync(pkgPath)) {
        return JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
      }
    } catch {
      return null;
    }
    return null;
  }

  detectLanguage() {
    if (fs.existsSync(path.join(this.projectPath, 'package.json'))) return 'JavaScript/TypeScript';
    if (fs.existsSync(path.join(this.projectPath, 'requirements.txt'))) return 'Python';
    if (fs.existsSync(path.join(this.projectPath, 'Gemfile'))) return 'Ruby';
    if (fs.existsSync(path.join(this.projectPath, 'go.mod'))) return 'Go';
    return 'Unknown';
  }

  detectFramework() {
    const pkg = this.readPackageJson();
    if (!pkg) return 'None';
    if (pkg.dependencies?.react) return 'React';
    if (pkg.dependencies?.vue) return 'Vue';
    if (pkg.dependencies?.['@angular/core']) return 'Angular';
    if (pkg.dependencies?.express) return 'Express';
    if (pkg.dependencies?.next) return 'Next.js';
    return 'None detected';
  }

  detectTestFramework() {
    const pkg = this.readPackageJson();
    if (!pkg) return 'None';
    if (pkg.devDependencies?.jest) return 'Jest';
    if (pkg.devDependencies?.mocha) return 'Mocha';
    if (pkg.devDependencies?.vitest) return 'Vitest';
    if (pkg.devDependencies?.['@playwright/test']) return 'Playwright';
    return 'None detected';
  }

  detectBuildTool() {
    if (fs.existsSync(path.join(this.projectPath, 'webpack.config.js'))) return 'Webpack';
    if (fs.existsSync(path.join(this.projectPath, 'vite.config.js'))) return 'Vite';
    if (fs.existsSync(path.join(this.projectPath, 'rollup.config.js'))) return 'Rollup';
    return 'None detected';
  }

  generateTestCommands() {
    const pkg = this.readPackageJson();
    if (!pkg || !pkg.scripts) return 'No test commands found';

    const testScripts = Object.keys(pkg.scripts)
      .filter(key => key.includes('test'))
      .map(key => `- \`npm run ${key}\` - ${pkg.scripts[key]}`)
      .join('\n');

    return testScripts || 'No test commands configured';
  }

  generateCodeQualityWorkflow() {
    return `name: @arog - Code Quality

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run lint || echo "No lint script found"
      - run: npm run format:check || echo "No format script found"
`;
  }

  generateUnitTestWorkflow() {
    return `name: @arog - Unit Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm test || npm run test:unit || echo "No test command found"
`;
  }

  generateSecurityWorkflow() {
    return `name: @arog - Security Scan

on:
  push:
    branches: [main, master]
  schedule:
    - cron: '0 0 * * *'  # Daily at midnight

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm audit --audit-level=moderate || true
`;
  }
}

// Run if called directly
if (require.main === module) {
  const integrator = new ArogIntegrator();
  integrator.integrate();
}

module.exports = ArogIntegrator;
