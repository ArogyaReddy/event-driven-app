---
description: 'Customize AROG configuration for specific team needs. Use when users want to modify rules, thresholds, workflows, or add new automation capabilities.'
---

# AROG Configuration & Customization

## What This Skill Provides
Guided configuration changes with examples and best practices for customizing AROG.

## When to Use
- User wants to change ESLint rules
- User needs different test thresholds
- User wants to add new workflows
- User needs environment-specific settings
- User wants to customize for their tech stack

## Configuration Areas

### 1. Code Quality Rules

**File**: `.eslintrc.js`

**Common Customizations**:

```javascript
// Stricter rules
rules: {
  'max-len': ['error', { code: 80 }],  // Shorter lines
  'complexity': ['error', 5],          // Lower complexity
  'no-console': 'error',               // No console at all
}

// More lenient
rules: {
  'max-len': ['warn', { code: 150 }],  // Longer lines
  'no-console': 'off',                 // Allow console
  'prefer-const': 'warn',              // Warn instead of error
}

// Framework-specific (React example)
extends: [
  'eslint:recommended',
  'plugin:react/recommended',
],
plugins: ['react'],
```

**When to customize**:
- Team has different style preferences
- Using specific framework (React, Vue, etc.)
- Need stricter/looser rules

### 2. Test Coverage Thresholds

**File**: `jest.config.js`

**Examples**:

```javascript
// Stricter (recommended for new projects)
coverageThreshold: {
  global: {
    branches: 90,
    functions: 90,
    lines: 90,
    statements: 90,
  },
}

// Per-file thresholds
coverageThreshold: {
  global: {
    branches: 70,
    functions: 70,
    lines: 70,
    statements: 70,
  },
  './src/utils/*.js': {
    branches: 100,  // Critical files need 100%
    functions: 100,
  },
}

// Gradual improvement
coverageThreshold: {
  global: {
    branches: 50,  // Start low
    functions: 50,
    lines: 50,
    statements: 50,
  },
}
// Then increase by 10% each month
```

**When to customize**:
- Legacy codebase (start low, increase gradually)
- Critical systems (set to 90-100%)
- Different standards for different files

### 3. E2E Test Configuration

**File**: `playwright.config.js`

**Examples**:

```javascript
// Test only Chrome (faster)
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
],

// Add more browsers
projects: [
  { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
  { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
  { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  { name: 'edge', use: { ...devices['Desktop Edge'] } },
],

// Custom viewport sizes
use: {
  viewport: { width: 1920, height: 1080 },  // Larger screens
},

// Slower/faster timeouts
use: {
  actionTimeout: 10000,  // 10 seconds per action
  navigationTimeout: 30000,  // 30 seconds for page loads
},
```

**When to customize**:
- Need specific browser coverage
- Different screen sizes to test
- Slower/faster CI environment

### 4. Performance Budgets

**File**: `lighthouserc.json`

**Examples**:

```javascript
// Stricter performance requirements
assertions: {
  'categories:performance': ['error', { minScore: 0.95 }],  // 95+
  'first-contentful-paint': ['error', { maxNumericValue: 1000 }],  // 1s
  'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],  // 2s
}

// Bundle size limits
// File: scripts/check-bundle-size.js
const MAX_SIZE = 300 * 1024;  // 300KB (stricter)
const WARN_SIZE = 200 * 1024;  // 200KB

// Or more lenient for complex apps
const MAX_SIZE = 1024 * 1024;  // 1MB
const WARN_SIZE = 800 * 1024;  // 800KB
```

**When to customize**:
- Mobile-first apps (stricter)
- Rich web apps (more lenient)
- Specific performance goals

### 5. Security Policies

**File**: `.github/workflows/arog-security.yml`

**Examples**:

```yaml
# Stricter - block on moderate too
- name: Check Vulnerabilities
  run: |
    if (vulnerabilities.moderate > 0) {
      process.exit(1);  # Fail on moderate too
    }

# More lenient - only block critical
- name: Check Vulnerabilities
  run: |
    if (vulnerabilities.critical > 0) {
      process.exit(1);  # Only fail on critical
    }

# Add Snyk integration
- name: Snyk Security Scan
  uses: snyk/actions/node@master
  env:
    SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

**When to customize**:
- Different risk tolerance
- Using additional security tools
- Compliance requirements

### 6. Workflow Triggers

**Example Customizations**:

```yaml
# Run only on specific branches
on:
  push:
    branches: [main, develop, staging]

# Run on schedule (e.g., nightly tests)
on:
  schedule:
    - cron: '0 0 * * *'  # Every day at midnight

# Skip CI for docs changes
on:
  push:
    paths-ignore:
      - 'docs/**'
      - '**.md'

# Require manual approval
on:
  workflow_dispatch:  # Manual trigger only
```

**When to customize**:
- Expensive tests (run nightly instead of per-commit)
- Multi-environment setup
- Need manual control

## Response Template

When user asks to customize, respond:

```
⚙️ AROG Configuration Guide

**What You Want to Change**: [user's request]

**File to Edit**: [specific file path]

**Current Setting**:
```javascript
[show current config]
```

**Recommended Change**:
```javascript
[show recommended config]
```

**Why This Works**:
[Explain the impact and benefits]

**Testing the Change**:
```bash
[commands to verify it works]
```

**Potential Impact**:
- ✅ Benefits: [list benefits]
- ⚠️ Watch out for: [potential issues]

**Alternative Options**:
[Other ways to achieve similar goal]

**Next Steps**:
1. Make the change
2. Run: [validation command]
3. Commit and test in CI
```

## Common Customization Requests

### "Make linting less strict"
**Response**:
```
Change .eslintrc.js:
- Switch errors to warnings: 'rule': 'warn'
- Disable specific rules: 'rule': 'off'
- Increase limits: 'max-len': ['error', { code: 120 }]

Test: npm run lint
```

### "Add TypeScript strict mode"
**Response**:
```
Edit tsconfig.json:
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}

Test: npm run typecheck
```

### "Add React support"
**Response**:
```
1. Install dependencies:
npm install --save-dev eslint-plugin-react @types/react

2. Update .eslintrc.js:
extends: ['plugin:react/recommended'],
plugins: ['react'],
settings: {
  react: { version: 'detect' }
}

3. Update tsconfig.json:
"jsx": "react"

Test: npm run lint
```

### "Run tests only on PR, not every commit"
**Response**:
```
Edit .github/workflows/arog-unit-tests.yml:

Change from:
on:
  push:
    branches: ['**']

To:
on:
  pull_request:
    branches: [main, develop]

This saves CI minutes but delays feedback.
Consider: Keep unit tests on commit, move E2E to PR only.
```

## Rules
- Always explain the impact of changes
- Provide before/after examples
- Include test commands
- Warn about potential issues
- Suggest gradual changes
- Link to official docs for complex changes

## Advanced Customizations

### Add New Workflow
1. Create `.github/workflows/custom.yml`
2. Use existing workflows as templates
3. Add to docs/configuration.html
4. Test with `git push`

### Environment-Specific Config
```javascript
// In webpack.config.js
module.exports = {
  mode: process.env.NODE_ENV === 'production' ? 'production' : 'development',
  // Different settings per environment
}
```

### Custom Scripts
```json
// In package.json
"scripts": {
  "test:integration": "jest --testMatch='**/*.integration.js'",
  "deploy:staging": "npm run build && scp dist/* user@staging:/var/www",
  "custom:task": "node scripts/custom-task.js"
}
```

## Best Practices
- ✅ Make small changes, test thoroughly
- ✅ Document custom changes in README
- ✅ Keep configs in version control
- ✅ Share customizations with team
- ✅ Review configs quarterly
- ✅ Use environment variables for secrets
