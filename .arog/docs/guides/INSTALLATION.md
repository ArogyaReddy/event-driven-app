# 📦 Installing AROG in Your Project

## Quick Install (5 minutes)

### Method 1: NPM Package (Coming Soon)

```bash
# Install AROG
npm install @arogyareddy/arog --save-dev

# Run setup wizard
npx arog setup

# Verify installation
npx arog health-check
```

### Method 2: Git Submodule (Available Now)

```bash
# Add AROG to your project
git submodule add https://github.com/ArogyaReddy/arog.git .arog

# Install AROG dependencies
cd .arog && npm install && cd ..

# Add scripts to your package.json
npm pkg set scripts.arog:health="node .arog/scripts/health-check.js"
npm pkg set scripts.arog:test="npm run --prefix .arog test"
npm pkg set scripts.arog:lint="npm run --prefix .arog lint"

# Test it works
npm run arog:health
```

### Method 3: Clone Directly

```bash
# Clone into your project
git clone https://github.com/ArogyaReddy/arog.git .arog

# Install dependencies
cd .arog && npm install && cd ..

# Add to your package.json scripts
```

---

## After Installation

### 1. Run Health Check
```bash
npm run arog:health
```

### 2. Run Your First Test
```bash
npm run arog:test
```

### 3. Open AROG Bible
```bash
# macOS
open .arog/docs/arog-bible.html

# Linux
xdg-open .arog/docs/arog-bible.html

# Windows
start .arog/docs/arog-bible.html
```

### 4. Add GitHub Actions
The setup wizard automatically creates `.github/workflows/arog.yml`

Commit and push:
```bash
git add .github/workflows/arog.yml
git commit -m "Add AROG automation"
git push
```

---

## Team Setup

### For Team Members

```bash
# Clone project with AROG submodule
git clone --recurse-submodules <your-repo-url>

# OR if already cloned
git submodule update --init --recursive

# Install dependencies
cd .arog && npm install && cd ..

# Verify setup
npm run arog:health
```

---

## Available Commands

Once installed, you have these commands:

```bash
# Health & Setup
npm run arog:health          # Check system health
npx arog setup              # Run setup wizard

# Testing
npm run arog:test           # Run all tests
npx arog test --watch       # Watch mode
npx arog test --coverage    # With coverage

# Code Quality
npm run arog:lint           # Check code quality
npx arog lint --fix         # Fix issues automatically

# Security
npm run arog:security       # Security scan
npx arog security --fix     # Fix vulnerabilities

# Validation
npx arog validate           # Full system check
```

---

## Integration Examples

### React Project
```json
{
  "scripts": {
    "dev": "react-scripts start",
    "test": "arog test",
    "lint": "arog lint",
    "prebuild": "arog validate"
  }
}
```

### Node.js API
```json
{
  "scripts": {
    "start": "node server.js",
    "test": "arog test",
    "prestart": "arog health-check",
    "predeploy": "arog validate"
  }
}
```

### Full-Stack App
```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:client\" \"npm run dev:server\"",
    "test": "arog test",
    "test:e2e": "arog test:e2e",
    "lint": "arog lint",
    "security": "arog security-scan",
    "validate": "arog validate",
    "predeploy": "arog validate"
  }
}
```

---

## Troubleshooting

### AROG command not found
```bash
# Make sure AROG is installed
npm install @arogyareddy/arog --save-dev

# OR use npx
npx arog health-check
```

### Submodule not initialized
```bash
git submodule update --init --recursive
cd .arog && npm install
```

### Permission denied (bin/arog.js)
```bash
chmod +x .arog/bin/arog.js
# or
chmod +x node_modules/@arogyareddy/arog/bin/arog.js
```

---

## Support

- 📖 **Documentation**: See AROG Bible in `docs/arog-bible.html`
- 🐛 **Issues**: https://github.com/ArogyaReddy/arog/issues
- 💬 **Discussions**: https://github.com/ArogyaReddy/arog/discussions

---

## Next Steps

1. ✅ Install AROG
2. ✅ Run health check
3. ✅ Open AROG Bible
4. ✅ Set up GitHub Actions
5. ✅ Share with your team!

**Ready to automate? Let AROG handle the boring stuff!** 🤖✨
