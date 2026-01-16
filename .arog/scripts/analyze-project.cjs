#!/usr/bin/env node

/**
 * AROG Project Analyzer
 * Analyzes existing projects to understand structure, tech stack, and testing setup
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class ProjectAnalyzer {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath;
    this.analysis = {
      projectName: path.basename(projectPath),
      path: projectPath,
      languages: [],
      frameworks: [],
      buildTools: [],
      testFrameworks: [],
      existingTests: {},
      dependencies: {},
      scripts: {},
      cicd: {},
      gaps: [],
      recommendations: []
    };
  }

  /**
   * Run complete project analysis
   */
  analyze() {
    console.log('\n🔍 @arog is analyzing your project...\n');

    this.detectLanguages();
    this.detectFrameworks();
    this.detectBuildTools();
    this.detectTestFrameworks();
    this.scanExistingTests();
    this.analyzeDependencies();
    this.analyzeScripts();
    this.analyzeCICD();
    this.identifyGaps();
    this.generateRecommendations();

    return this.analysis;
  }

  /**
   * Detect programming languages used
   */
  detectLanguages() {
    const languageMarkers = {
      'JavaScript': ['package.json', '*.js'],
      'TypeScript': ['tsconfig.json', '*.ts'],
      'Python': ['requirements.txt', 'setup.py', 'pyproject.toml', '*.py'],
      'Java': ['pom.xml', 'build.gradle', '*.java'],
      'Ruby': ['Gemfile', '*.rb'],
      'Go': ['go.mod', '*.go'],
      'Rust': ['Cargo.toml', '*.rs'],
      'PHP': ['composer.json', '*.php']
    };

    for (const [lang, markers] of Object.entries(languageMarkers)) {
      if (markers.some(marker => this.fileExists(marker))) {
        this.analysis.languages.push(lang);
      }
    }

    console.log(`📝 Languages detected: ${this.analysis.languages.join(', ') || 'None'}`);
  }

  /**
   * Detect frameworks in use
   */
  detectFrameworks() {
    const packageJson = this.readPackageJson();
    if (!packageJson) return;

    const frameworks = {
      'React': ['react'],
      'Vue': ['vue'],
      'Angular': ['@angular/core'],
      'Express': ['express'],
      'Next.js': ['next'],
      'Nest.js': ['@nestjs/core'],
      'Svelte': ['svelte']
    };

    for (const [framework, packages] of Object.entries(frameworks)) {
      if (packages.some(pkg => packageJson.dependencies?.[pkg] || packageJson.devDependencies?.[pkg])) {
        this.analysis.frameworks.push(framework);
      }
    }

    console.log(`🎨 Frameworks detected: ${this.analysis.frameworks.join(', ') || 'None'}`);
  }

  /**
   * Detect build tools
   */
  detectBuildTools() {
    const buildTools = {
      'Webpack': 'webpack.config.js',
      'Vite': 'vite.config.js',
      'Rollup': 'rollup.config.js',
      'Parcel': '.parcelrc',
      'esbuild': 'esbuild.config.js',
      'Turbopack': 'turbo.json'
    };

    for (const [tool, configFile] of Object.entries(buildTools)) {
      if (this.fileExists(configFile)) {
        this.analysis.buildTools.push(tool);
      }
    }

    console.log(`🏗️  Build tools detected: ${this.analysis.buildTools.join(', ') || 'None'}`);
  }

  /**
   * Detect test frameworks
   */
  detectTestFrameworks() {
    const packageJson = this.readPackageJson();
    if (!packageJson) return;

    const testFrameworks = {
      'Jest': ['jest'],
      'Mocha': ['mocha'],
      'Vitest': ['vitest'],
      'Playwright': ['@playwright/test'],
      'Cypress': ['cypress'],
      'Selenium': ['selenium-webdriver'],
      'Puppeteer': ['puppeteer'],
      'Testing Library': ['@testing-library/react', '@testing-library/vue'],
      'Jasmine': ['jasmine'],
      'Karma': ['karma'],
      'AVA': ['ava']
    };

    for (const [framework, packages] of Object.entries(testFrameworks)) {
      if (packages.some(pkg => packageJson.dependencies?.[pkg] || packageJson.devDependencies?.[pkg])) {
        this.analysis.testFrameworks.push(framework);
      }
    }

    console.log(`🧪 Test frameworks detected: ${this.analysis.testFrameworks.join(', ') || 'None'}`);
  }

  /**
   * Scan for existing test files
   */
  scanExistingTests() {
    const testPatterns = [
      { type: 'unit', paths: ['tests/unit', 'test/unit', '__tests__', 'src/**/*.test.js', 'src/**/*.spec.js'] },
      { type: 'integration', paths: ['tests/integration', 'test/integration'] },
      { type: 'e2e', paths: ['tests/e2e', 'test/e2e', 'e2e', 'tests/playwright', 'tests/cypress'] },
      { type: 'performance', paths: ['tests/performance', 'test/performance', 'tests/load'] },
      { type: 'security', paths: ['tests/security', 'test/security'] },
      { type: 'accessibility', paths: ['tests/accessibility', 'tests/a11y', 'test/accessibility'] }
    ];

    for (const { type, paths } of testPatterns) {
      for (const testPath of paths) {
        if (this.directoryExists(testPath) || this.findFiles(testPath).length > 0) {
          const files = this.findFiles(testPath);
          this.analysis.existingTests[type] = {
            found: true,
            path: testPath,
            fileCount: files.length
          };
          console.log(`✅ ${type} tests found: ${files.length} files in ${testPath}`);
          break;
        }
      }
      if (!this.analysis.existingTests[type]) {
        this.analysis.existingTests[type] = { found: false };
        console.log(`❌ ${type} tests: NOT FOUND`);
      }
    }
  }

  /**
   * Analyze package.json dependencies
   */
  analyzeDependencies() {
    const packageJson = this.readPackageJson();
    if (!packageJson) return;

    this.analysis.dependencies = {
      production: Object.keys(packageJson.dependencies || {}).length,
      development: Object.keys(packageJson.devDependencies || {}).length,
      total: Object.keys(packageJson.dependencies || {}).length + Object.keys(packageJson.devDependencies || {}).length
    };

    console.log(`📦 Dependencies: ${this.analysis.dependencies.total} total (${this.analysis.dependencies.production} prod, ${this.analysis.dependencies.development} dev)`);
  }

  /**
   * Analyze npm scripts
   */
  analyzeScripts() {
    const packageJson = this.readPackageJson();
    if (!packageJson || !packageJson.scripts) return;

    this.analysis.scripts = packageJson.scripts;

    const scriptTypes = {
      test: ['test', 'test:unit', 'test:integration', 'test:e2e'],
      build: ['build', 'compile'],
      lint: ['lint', 'eslint'],
      format: ['format', 'prettier'],
      dev: ['dev', 'start', 'serve']
    };

    console.log('\n📜 Available npm scripts:');
    for (const [type, scripts] of Object.entries(scriptTypes)) {
      const found = scripts.filter(s => packageJson.scripts[s]);
      if (found.length > 0) {
        console.log(`   ${type}: ${found.join(', ')}`);
      }
    }
  }

  /**
   * Analyze CI/CD setup
   */
  analyzeCICD() {
    const cicdSystems = {
      'GitHub Actions': '.github/workflows',
      'GitLab CI': '.gitlab-ci.yml',
      'CircleCI': '.circleci/config.yml',
      'Travis CI': '.travis.yml',
      'Jenkins': 'Jenkinsfile'
    };

    for (const [system, path] of Object.entries(cicdSystems)) {
      if (this.fileExists(path) || this.directoryExists(path)) {
        this.analysis.cicd[system] = true;
        console.log(`✅ CI/CD: ${system} detected`);
      }
    }

    if (Object.keys(this.analysis.cicd).length === 0) {
      console.log('❌ CI/CD: No automation detected');
    }
  }

  /**
   * Identify gaps in testing/automation
   */
  identifyGaps() {
    const gaps = [];

    // Test coverage gaps
    if (!this.analysis.existingTests.unit?.found) {
      gaps.push('No unit tests found');
    }
    if (!this.analysis.existingTests.e2e?.found) {
      gaps.push('No E2E tests found');
    }
    if (!this.analysis.existingTests.performance?.found) {
      gaps.push('No performance tests found');
    }
    if (!this.analysis.existingTests.security?.found) {
      gaps.push('No security tests found');
    }
    if (!this.analysis.existingTests.accessibility?.found) {
      gaps.push('No accessibility tests found');
    }

    // CI/CD gaps
    if (Object.keys(this.analysis.cicd).length === 0) {
      gaps.push('No CI/CD automation configured');
    }

    // Test framework gaps
    if (this.analysis.testFrameworks.length === 0) {
      gaps.push('No test framework installed');
    }

    this.analysis.gaps = gaps;

    if (gaps.length > 0) {
      console.log('\n⚠️  Gaps identified:');
      gaps.forEach(gap => console.log(`   • ${gap}`));
    }
  }

  /**
   * Generate recommendations
   */
  generateRecommendations() {
    const recommendations = [];

    // Test recommendations
    if (!this.analysis.existingTests.e2e?.found) {
      recommendations.push('Add Playwright for E2E testing');
    }
    if (!this.analysis.existingTests.performance?.found) {
      recommendations.push('Add k6 or Artillery for performance testing');
    }
    if (!this.analysis.existingTests.accessibility?.found) {
      recommendations.push('Add axe-core for accessibility testing');
    }

    // CI/CD recommendations
    if (Object.keys(this.analysis.cicd).length === 0) {
      recommendations.push('Set up GitHub Actions for CI/CD automation');
    }

    // General recommendations
    if (this.analysis.testFrameworks.length === 0) {
      recommendations.push('Install Jest or Vitest for unit testing');
    }

    this.analysis.recommendations = recommendations;

    if (recommendations.length > 0) {
      console.log('\n💡 @arog recommendations:');
      recommendations.forEach((rec, i) => console.log(`   ${i + 1}. ${rec}`));
    }
  }

  /**
   * Helper methods
   */
  fileExists(filePath) {
    try {
      return fs.existsSync(path.join(this.projectPath, filePath));
    } catch {
      return false;
    }
  }

  directoryExists(dirPath) {
    try {
      const fullPath = path.join(this.projectPath, dirPath);
      return fs.existsSync(fullPath) && fs.statSync(fullPath).isDirectory();
    } catch {
      return false;
    }
  }

  findFiles(pattern) {
    try {
      if (pattern.includes('*')) {
        // Simple glob support
        const baseDir = pattern.split('*')[0];
        const ext = pattern.includes('.') ? pattern.split('.').pop() : null;
        if (this.directoryExists(baseDir)) {
          return this.getAllFiles(path.join(this.projectPath, baseDir))
            .filter(f => !ext || f.endsWith(`.${ext}`));
        }
        return [];
      } else {
        return this.directoryExists(pattern) ? [pattern] : [];
      }
    } catch {
      return [];
    }
  }

  getAllFiles(dirPath, arrayOfFiles = []) {
    try {
      const files = fs.readdirSync(dirPath);
      files.forEach(file => {
        const filePath = path.join(dirPath, file);
        if (fs.statSync(filePath).isDirectory()) {
          arrayOfFiles = this.getAllFiles(filePath, arrayOfFiles);
        } else {
          arrayOfFiles.push(filePath);
        }
      });
      return arrayOfFiles;
    } catch {
      return arrayOfFiles;
    }
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

  /**
   * Display summary report
   */
  displayReport() {
    console.log('\n' + '='.repeat(70));
    console.log('📊 PROJECT ANALYSIS SUMMARY');
    console.log('='.repeat(70));
    console.log(`\n📁 Project: ${this.analysis.projectName}`);
    console.log(`📍 Path: ${this.analysis.path}`);
    console.log(`\n📝 Languages: ${this.analysis.languages.join(', ') || 'None detected'}`);
    console.log(`🎨 Frameworks: ${this.analysis.frameworks.join(', ') || 'None detected'}`);
    console.log(`🧪 Test Frameworks: ${this.analysis.testFrameworks.join(', ') || 'None detected'}`);
    
    console.log('\n🧪 Existing Tests:');
    for (const [type, info] of Object.entries(this.analysis.existingTests)) {
      if (info.found) {
        console.log(`   ✅ ${type}: ${info.fileCount} files`);
      } else {
        console.log(`   ❌ ${type}: Not found`);
      }
    }

    if (this.analysis.gaps.length > 0) {
      console.log('\n⚠️  Gaps:');
      this.analysis.gaps.forEach(gap => console.log(`   • ${gap}`));
    }

    if (this.analysis.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      this.analysis.recommendations.forEach((rec, i) => console.log(`   ${i + 1}. ${rec}`));
    }

    console.log('\n✅ Analysis complete!');
    console.log('\nNext steps:');
    console.log('   • Run: arog integrate    (to add AROG automation)');
    console.log('   • Run: arog test         (to run existing tests)');
    console.log('='.repeat(70) + '\n');
  }
}

// Run if called directly
if (require.main === module) {
  const analyzer = new ProjectAnalyzer();
  analyzer.analyze();
  analyzer.displayReport();
}

module.exports = ProjectAnalyzer;
