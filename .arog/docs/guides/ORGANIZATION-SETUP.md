# 🏢 Using AROG Across Your Organization

## 📦 4 Ways to Share AROG

### ✅ **Option 1: NPM Package** (Recommended for Teams)
**Best for**: Sharing across multiple projects with version control

```bash
# 1. Publish AROG as private npm package
npm publish --access restricted

# 2. In any project, install it
npm install @your-org/arog --save-dev

# 3. Use AROG in package.json
"scripts": {
  "arog:health": "npx @your-org/arog health-check",
  "arog:test": "npx @your-org/arog test",
  "arog:deploy": "npx @your-org/arog deploy"
}
```

### ✅ **Option 2: Git Submodule** (Simple & Free)
**Best for**: Keeping AROG in sync across repos

```bash
# In any project repository
git submodule add https://github.com/ArogyaReddy/arog.git .arog

# Install dependencies
cd .arog && npm install && cd ..

# Add to your package.json
"scripts": {
  "arog:health": "node .arog/scripts/health-check.js",
  "test": "npm run --prefix .arog test"
}

# Team members clone with submodules
git clone --recurse-submodules <your-project-repo>
```

### ✅ **Option 3: GitHub Template** (Quick Start)
**Best for**: Starting new projects with AROG built-in

1. Go to https://github.com/ArogyaReddy/arog/settings
2. Check "Template repository"
3. Team creates new repos from template
4. AROG is automatically included!

### ✅ **Option 4: Shared GitHub Actions** (Enterprise)
**Best for**: Centralized workflow management

```yaml
# In any project: .github/workflows/use-arog.yml
name: Use AROG

on: [push, pull_request]

jobs:
  arog-automation:
    uses: ArogyaReddy/arog/.github/workflows/arog-main.yml@main
    with:
      project-name: ${{ github.repository }}
      run-tests: true
      run-security: true
```

---

## 🎯 Recommended Setup for Organizations

### **For Small Teams (2-10 devs)**
→ Use **Git Submodule** (Free, Simple)

### **For Medium Teams (10-50 devs)**
→ Use **NPM Package** + **GitHub Actions** (Version control + Automation)

### **For Large Orgs (50+ devs)**
→ Use **Private NPM Registry** + **Centralized GitHub Actions** (Enterprise-grade)

---

## 📋 Step-by-Step: NPM Package Setup

### 1. Prepare AROG for Publishing

```bash
# In AROG repository
cd /Users/arog/Learn/AROG

# Update package.json
npm version 1.0.0

# Create .npmignore
echo "docs/
tests/
coverage/
*.md
.git*" > .npmignore

# Test package locally
npm pack
```

### 2. Publish to NPM

```bash
# Login to npm
npm login

# Publish (public)
npm publish

# OR publish private (requires paid npm account)
npm publish --access restricted
```

### 3. Use in Other Projects

```bash
# In any project
npm install @your-username/arog --save-dev

# Or for organization
npm install @your-org/arog --save-dev
```

### 4. Access AROG in Project

```json
// package.json
{
  "scripts": {
    "health": "arog health-check",
    "test": "arog test",
    "lint": "arog lint",
    "security": "arog security-scan"
  },
  "devDependencies": {
    "@your-org/arog": "^1.0.0"
  }
}
```

---

## 🔄 Step-by-Step: Git Submodule Setup

### 1. Add AROG to Project

```bash
# In your project repository
cd /path/to/your-project

# Add AROG as submodule
git submodule add https://github.com/ArogyaReddy/arog.git .arog

# Commit the submodule
git add .gitmodules .arog
git commit -m "Add AROG automation framework"
git push
```

### 2. Update Project Configuration

```json
// package.json
{
  "scripts": {
    "arog:install": "cd .arog && npm install",
    "arog:update": "git submodule update --remote .arog",
    "test": "npm run --prefix .arog test",
    "lint": "npm run --prefix .arog lint"
  }
}
```

### 3. Team Members Setup

```bash
# Clone project with submodules
git clone --recurse-submodules <your-repo-url>

# OR if already cloned
git submodule init
git submodule update

# Install AROG dependencies
npm run arog:install
```

### 4. Update AROG Across Team

```bash
# Pull latest AROG updates
npm run arog:update

# Commit the update
git add .arog
git commit -m "Update AROG to latest version"
git push
```

---

## 🏗️ Step-by-Step: Shared GitHub Actions

### 1. Create Reusable Workflow in AROG

```yaml
# In AROG repo: .github/workflows/arog-reusable.yml
name: AROG Reusable Workflow

on:
  workflow_call:
    inputs:
      run-tests:
        required: false
        type: boolean
        default: true
      run-security:
        required: false
        type: boolean
        default: true

jobs:
  arog-automation:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Run AROG Tests
        if: inputs.run-tests
        run: |
          npm install
          npm test
      
      - name: Run AROG Security
        if: inputs.run-security
        run: npm run security:audit
```

### 2. Use in Any Project

```yaml
# In your project: .github/workflows/ci.yml
name: CI with AROG

on: [push, pull_request]

jobs:
  quality-checks:
    uses: ArogyaReddy/arog/.github/workflows/arog-reusable.yml@main
    with:
      run-tests: true
      run-security: true
```

---

## 📊 Comparison Table

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| **NPM Package** | Version control, npm install, updates | Setup complexity, npm account | Teams with multiple projects |
| **Git Submodule** | Free, always in sync, simple | Git complexity, manual updates | Small teams, open source |
| **GitHub Template** | Quick start, one-click setup | No automatic updates | New projects |
| **Shared Actions** | Centralized, automatic, no install | Requires GitHub Actions | CI/CD automation |

---

## 🎓 Example: Real-World Usage

### **Scenario**: You have 5 projects that need AROG

#### **Setup Once:**
```bash
# Publish AROG to npm
cd /Users/arog/Learn/AROG
npm publish --access public
```

#### **Use in All Projects:**
```bash
# Project 1
cd ~/projects/frontend-app
npm install @arogyareddy/arog --save-dev

# Project 2
cd ~/projects/backend-api
npm install @arogyareddy/arog --save-dev

# Project 3-5... same process
```

#### **All Projects Get:**
- ✅ Same test automation
- ✅ Same code quality checks
- ✅ Same security scanning
- ✅ Same deployment workflows
- ✅ Centralized updates via `npm update @arogyareddy/arog`

---

## 🚀 Quick Start Recommendation

**For your organization, I recommend this combo:**

1. **Create NPM package** for code distribution
2. **Use Git Submodule** for workflow templates
3. **Enable GitHub Template** for new projects

This gives you:
- ✅ Easy installation (`npm install`)
- ✅ Centralized workflows (submodule)
- ✅ Quick project setup (template)

---

## 🔐 Private Organization Setup

### Option 1: GitHub Packages (Free for private repos)

```bash
# Configure npm to use GitHub registry
echo "@your-org:registry=https://npm.pkg.github.com" >> .npmrc

# Publish to GitHub Packages
npm publish
```

### Option 2: Private NPM Org (Paid)

```bash
# Create organization on npmjs.com
# Publish as scoped package
npm publish --access restricted
```

---

## 📝 Next Steps

1. **Choose your distribution method** (I can help set up any!)
2. **Update AROG's package.json** with proper metadata
3. **Create installation guide** for your team
4. **Set up CI/CD** for automatic publishing

**Want me to set up any of these options for you?** Just let me know which method you prefer! 🎯
