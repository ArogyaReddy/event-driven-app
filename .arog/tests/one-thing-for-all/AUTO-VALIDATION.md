# 🛡️ THE ONE-THING Auto-Validation

## What Is This?

THE ONE-THING Guardian now runs **automatically** on every commit and push to protect AROG's integrity.

## When It Runs

### 1. **Local (Before Every Commit)**
```bash
git commit -m "your message"
```
→ Triggers `.husky/pre-commit` hook  
→ Runs `npm run one-thing`  
→ Blocks commit if critical tests fail  

**Skip if needed:**
```bash
git commit --no-verify -m "emergency fix"
```

### 2. **CI/CD (On Every Push)**
```bash
git push
```
→ Triggers `.github/workflows/the-one-thing.yml`  
→ Runs full validation suite  
→ Uploads HTML report to artifacts  
→ Comments on PRs with results  

## What It Validates

✅ **35 Tests Across 6 Validators:**
1. Quick Start Setup (5 tests)
2. MCP Servers (4 tests)
3. Integration Kit (4 tests)
4. @arog Agent (5 tests)
5. CLI Tools (4 tests)
6. Automation Toolkit (10 tests)
7. Book Chapters (3 tests)

## Workflow

```
┌─────────────────────────────────────────────┐
│  Developer makes changes                    │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│  git add . && git commit                    │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
┌─────────────────────────────────────────────┐
│  🛡️  Pre-commit hook runs                   │
│  npm run one-thing                          │
└──────────────────┬──────────────────────────┘
                   │
           ┌───────┴────────┐
           ↓                ↓
    ┌──────────┐    ┌──────────────┐
    │  PASS    │    │  FAIL        │
    │  86%+    │    │  < 86%       │
    └────┬─────┘    └───┬──────────┘
         │              │
         ↓              ↓
  ┌────────────┐  ┌────────────────┐
  │ ✅ Commit  │  │ ❌ Block       │
  │  proceeds  │  │  Show report   │
  └─────┬──────┘  └────────────────┘
        │
        ↓
  ┌────────────────────────────────┐
  │  git push                      │
  └──────────────┬─────────────────┘
                 │
                 ↓
  ┌────────────────────────────────┐
  │  GitHub Actions runs           │
  │  Full validation + artifacts   │
  └────────────────────────────────┘
```

## Exit Codes

- **0** - All tests passed (86%+ health)
- **1** - Tests failed or critical issues detected

## Files

- `.husky/pre-commit` - Local git hook
- `.github/workflows/the-one-thing.yml` - CI/CD workflow
- `tests/one-thing-for-all/guardian.cjs` - Main orchestrator
- `tests/one-thing-for-all/validators/*.cjs` - 6 validators
- `docs/one-thing-report.html` - Generated HTML report

## Benefits

✅ **No broken commits** - Catches issues before they're committed  
✅ **Fast feedback** - Results in < 5 seconds locally  
✅ **Zero cost** - No AI models, pure filesystem checks  
✅ **Beautiful reports** - HTML + terminal output  
✅ **PR automation** - Comments on pull requests  
✅ **Artifact storage** - 30-day report history  

## Customization

### Change validation level:
```json
// package.json
"precommit": "npm run one-thing:quick"  // Faster
"precommit": "npm run one-thing"        // Full (default)
```

### Disable locally:
```bash
git commit --no-verify
```

### Disable in CI:
```yaml
# .github/workflows/the-one-thing.yml
on:
  push:
    branches: [ main ]  # Only on main branch
```

## Troubleshooting

**Hook not running?**
```bash
npx husky install
chmod +x .husky/pre-commit
```

**Too slow?**
```bash
npm run one-thing:quick  # Quick mode
```

**Need to skip?**
```bash
git commit --no-verify   # Emergency only!
```

---

**THE ONE-THING is always watching, always validating, always protecting.** 🛡️
