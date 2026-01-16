---
description: 'Diagnose and fix issues with AROG workflows, tests, or configurations. Use when users report failures, errors, or unexpected behavior in the automation system.'
---

# AROG Troubleshooting

## What This Skill Provides
Step-by-step debugging guidance for common AROG issues with specific solutions.

## When to Use
- User reports test failures
- GitHub Actions workflows failing
- Build errors
- Configuration issues
- Performance problems
- Security scan alerts

## Troubleshooting Workflow

### 1. Identify the Problem Area
Ask user to run: `npm run arog:health`

This checks:
- ✅ Node.js version (requires 18+)
- ✅ npm version (requires 9+)
- ✅ Git repository status
- ✅ Required files present
- ✅ Workflow configurations

### 2. Common Issues & Solutions

#### Unit Tests Failing
```bash
# Run tests with verbose output
npm test -- --verbose

# Common fixes:
1. Coverage below threshold → Add more tests
2. Import errors → Check file paths
3. Timeout errors → Increase timeout in jest.config.js
```

#### E2E Tests Failing
```bash
# Run with UI to see what's happening
npm run test:e2e:ui

# Common fixes:
1. Playwright not installed → npx playwright install
2. Port already in use → Change port in playwright.config.js
3. Timeout → Increase timeout for specific test
```

#### ESLint Errors
```bash
# Auto-fix what's possible
npm run lint:fix

# If manual fixes needed:
npm run lint
# Then fix issues shown in output
```

#### Build Failures
```bash
# Check TypeScript errors
npm run typecheck

# Check Webpack build
npm run build

# Common fixes:
1. Type errors → Add proper type annotations
2. Module not found → Check imports and file paths
3. Build size too large → Run npm run build:size
```

#### Security Vulnerabilities
```bash
# See detailed report
npm audit

# Auto-fix (may cause breaking changes)
npm run security:fix

# Manual fix:
npm audit fix

# If no fix available:
# - Check if vulnerability affects production
# - Consider alternative package
# - Add exception if acceptable risk
```

#### GitHub Actions Failing
```
1. Go to repo → Actions tab
2. Click failing workflow
3. Check error messages
4. Common issues:
   - Missing secrets → Add in repo settings
   - Node version mismatch → Check workflow YAML
   - Dependencies changed → Re-run npm install
```

### 3. Response Template

When user reports an issue, respond with:

```
🔍 AROG Troubleshooting

**Issue**: [Describe the problem]

**Quick Check**:
```bash
npm run arog:health
```

**Diagnosis**:
[Explain what's likely wrong based on symptoms]

**Solution**:
```bash
# Step 1: [command]
# Step 2: [command]
# Step 3: [command]
```

**Why This Works**:
[Brief explanation]

**Prevention**:
[How to avoid this in future]

**Still Not Working?**
Try: [alternative solution]
Or check: [specific file/config to review]
```

## Common Error Messages & Fixes

### "Cannot find module"
**Cause**: Import path incorrect or module not installed
**Fix**: 
```bash
npm install  # Reinstall dependencies
# OR fix import path in code
```

### "Coverage threshold not met"
**Cause**: Tests don't cover enough code
**Fix**: Add tests for uncovered files/lines
**Check**: `coverage/lcov-report/index.html` for details

### "Port 8080 already in use"
**Cause**: Server already running or port blocked
**Fix**:
```bash
# Kill existing process
lsof -ti:8080 | xargs kill -9
# OR change port in config
```

### "Playwright browser not installed"
**Cause**: Browsers not downloaded
**Fix**:
```bash
npx playwright install
```

### "ESLint errors found"
**Cause**: Code doesn't match style rules
**Fix**:
```bash
npm run lint:fix  # Auto-fix
# Then manually fix remaining issues
```

## Prevention Tips

1. **Before Committing**:
   ```bash
   npm run validate  # Runs all checks
   ```

2. **Before Creating PR**:
   ```bash
   npm test && npm run test:e2e && npm run build
   ```

3. **After Pulling Changes**:
   ```bash
   npm install  # Update dependencies
   ```

4. **Regular Maintenance**:
   ```bash
   npm run security:audit  # Weekly
   npm audit fix  # Apply security patches
   ```

## Advanced Debugging

### Enable Debug Mode
```bash
# Jest
DEBUG=* npm test

# Playwright
DEBUG=pw:api npm run test:e2e
```

### Check Logs
```bash
# GitHub Actions logs
# Go to: repo → Actions → failing run → View logs

# Local test logs
# Check: test-results/ directory
```

### Validate Entire System
```bash
npm run arog:validate  # Full system check
```

## When to Ask for Help

If after trying above solutions:
- Issue persists
- Error message unclear
- System-wide problem
- Need custom configuration

→ Provide:
1. Error message (full text)
2. Output of `npm run arog:health`
3. Steps to reproduce
4. What you've tried

## Rules
- Always start with simplest solution
- Provide exact commands to run
- Explain why each step is needed
- Include prevention tips
- Link to relevant docs if complex
