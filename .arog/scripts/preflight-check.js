#!/usr/bin/env node

/**
 * AROG Pre-Flight Checklist
 * Validates the system is ready for organization-wide deployment
 */

console.log('🚀 AROG Pre-Flight Checklist\n');
console.log('Validating system is ready for organization-wide deployment...\n');

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

let allChecks = true;
const checks = [];

// Helper function
function check(name, testFn, critical = true) {
  try {
    const result = testFn();
    if (result) {
      console.log(`✅ ${name}`);
      checks.push({ name, status: 'pass', critical });
      return true;
    } else {
      console.log(`${critical ? '❌' : '⚠️'} ${name}`);
      checks.push({ name, status: 'fail', critical });
      if (critical) {
        allChecks = false;
      }
      return false;
    }
  } catch (error) {
    console.log(`${critical ? '❌' : '⚠️'} ${name}: ${error.message}`);
    checks.push({ name, status: 'error', critical, error: error.message });
    if (critical) {
      allChecks = false;
    }
    return false;
  }
}

console.log('📂 File Structure Checks:\n');

check('package.json exists', () => fs.existsSync('package.json'));
check('README.md exists', () => fs.existsSync('README.md'));
check('.gitignore exists', () => fs.existsSync('.gitignore'));
check('.github directory exists', () => fs.existsSync('.github'));
check('docs directory exists', () => fs.existsSync('docs'));
check('src directory exists', () => fs.existsSync('src'));
check('tests directory exists', () => fs.existsSync('tests'));
check('scripts directory exists', () => fs.existsSync('scripts'));

console.log('\n🤖 Context & Instructions:\n');

check('copilot-instructions.md exists', () => 
  fs.existsSync('.github/copilot-instructions.md'));
check('SKILLS directory exists', () => 
  fs.existsSync('.github/skills'));
check('arog-overview SKILL', () => 
  fs.existsSync('.github/skills/arog-overview/SKILL.md'));
check('arog-troubleshooting SKILL', () => 
  fs.existsSync('.github/skills/arog-troubleshooting/SKILL.md'));
check('arog-customize SKILL', () => 
  fs.existsSync('.github/skills/arog-customize/SKILL.md'));
check('arog.agent.md exists', () => 
  fs.existsSync('.github/agents/arog.agent.md'));

console.log('\n⚙️ Configuration Files:\n');

check('.eslintrc.js', () => fs.existsSync('.eslintrc.js'));
check('jest.config.js', () => fs.existsSync('jest.config.js'));
check('playwright.config.js', () => fs.existsSync('playwright.config.js'));
check('tsconfig.json', () => fs.existsSync('tsconfig.json'));
check('webpack.config.js', () => fs.existsSync('webpack.config.js'));
check('lighthouserc.json', () => fs.existsSync('lighthouserc.json'));
check('.prettierrc.json', () => fs.existsSync('.prettierrc.json'));

console.log('\n🔄 GitHub Actions Workflows:\n');

const workflows = [
  'arog-unit-tests.yml',
  'arog-code-quality.yml',
  'arog-code-review.yml',
  'arog-e2e-tests.yml',
  'arog-security.yml',
  'arog-performance.yml',
  'arog-build.yml',
  'arog-pr-review.yml',
];

workflows.forEach(workflow => {
  check(`Workflow: ${workflow}`, () => 
    fs.existsSync(`.github/workflows/${workflow}`));
});

console.log('\n📚 Documentation:\n');

const docs = [
  'index.html',
  'setup-guide.html',
  'configuration.html',
  'api-reference.html',
  'context-sharing-guide.html',
];

docs.forEach(doc => {
  check(`Doc: ${doc}`, () => fs.existsSync(`docs/${doc}`));
});

console.log('\n📜 Scripts:\n');

const scripts = [
  'check-bundle-size.js',
  'health-check.js',
  'setup.js',
  'validate-system.js',
];

scripts.forEach(script => {
  check(`Script: ${script}`, () => {
    const exists = fs.existsSync(`scripts/${script}`);
    if (exists) {
      const stats = fs.statSync(`scripts/${script}`);
      return (stats.mode & 0o111) !== 0; // Check if executable
    }
    return false;
  });
});

console.log('\n🧪 Tests:\n');

check('Unit tests exist', () => 
  fs.readdirSync('tests/unit').some(f => f.endsWith('.test.js')));
check('E2E tests exist', () => 
  fs.readdirSync('tests/e2e').some(f => f.endsWith('.spec.js')));
check('Accessibility tests exist', () => 
  fs.readdirSync('tests/accessibility').some(f => f.endsWith('.spec.js')));

console.log('\n🔒 Security & Privacy:\n');

// Check for hardcoded paths
check('No hardcoded user paths in docs', () => {
  const docsPath = 'docs';
  const files = fs.readdirSync(docsPath);
  for (const file of files) {
    if (file.endsWith('.html')) {
      const content = fs.readFileSync(path.join(docsPath, file), 'utf8');
      if (content.includes('/Users/arog/')) {
        console.log(`   Found in: ${file}`);
        return false;
      }
    }
  }
  return true;
});

check('No hardcoded secrets', () => {
  const pkg = JSON.stringify(require(path.join(process.cwd(), 'package.json')));
  return !pkg.includes('sk-') && !pkg.includes('ghp_');
}, true);

check('Repository URL is generic', () => {
  const pkg = require(path.join(process.cwd(), 'package.json'));
  return pkg.repository.url.includes('YourOrg');
});

console.log('\n📦 Package.json Validation:\n');

const pkg = require(path.join(process.cwd(), 'package.json'));

check('Has required scripts', () => {
  const required = ['test', 'lint', 'build', 'arog:health', 'arog:validate'];
  return required.every(s => pkg.scripts[s]);
});

check('Has all dependencies', () => {
  return pkg.devDependencies && Object.keys(pkg.devDependencies).length > 10;
});

check('License specified', () => pkg.license === 'MIT', false);

console.log('\n🎯 Automation Capabilities:\n');

check('Unit testing configured', () => 
  fs.existsSync('jest.config.js'));
check('E2E testing configured', () => 
  fs.existsSync('playwright.config.js'));
check('Code quality configured', () => 
  fs.existsSync('.eslintrc.js'));
check('Build system configured', () => 
  fs.existsSync('webpack.config.js') && fs.existsSync('tsconfig.json'));
check('Performance testing configured', () => 
  fs.existsSync('lighthouserc.json'));

console.log('\n📊 Summary:\n');

const totalChecks = checks.length;
const passedChecks = checks.filter(c => c.status === 'pass').length;
const criticalFails = checks.filter(c => c.status !== 'pass' && c.critical).length;

console.log(`Total Checks: ${totalChecks}`);
console.log(`Passed: ${passedChecks}`);
console.log(`Failed: ${totalChecks - passedChecks}`);
console.log(`Critical Failures: ${criticalFails}`);

console.log('\n' + '='.repeat(60) + '\n');

if (allChecks) {
  console.log('🎉 ✅ AROG IS READY FOR DEPLOYMENT!\n');
  console.log('System is validated and ready to share with your organization.');
  console.log('\nNext steps:');
  console.log('1. git push to your organization repository');
  console.log('2. Enable GitHub Actions');
  console.log('3. Share with team members\n');
  console.log('Everything will work automatically! 🚀');
  process.exit(0);
} else {
  console.log('❌ AROG HAS CRITICAL ISSUES\n');
  console.log('Please fix the issues above before deploying.');
  console.log('\nCritical failures:');
  checks.filter(c => c.status !== 'pass' && c.critical).forEach(c => {
    console.log(`  - ${c.name}`);
  });
  process.exit(1);
}
