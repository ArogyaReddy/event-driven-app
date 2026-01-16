# 🎯 AROG Configuration System - Complete Guide

## 📋 Configuration Levels

AROG uses a **7-level hierarchical configuration system** that ensures @arog works **EVERYWHERE**:

```
┌─────────────────────────────────────────┐
│  1. Organization Config (Highest)      │  ← Company-wide standards
├─────────────────────────────────────────┤
│  2. Team Config                         │  ← Team-specific rules
├─────────────────────────────────────────┤
│  3. Project Config                      │  ← Project requirements
├─────────────────────────────────────────┤
│  4. Repository Config                   │  ← Repo settings
├─────────────────────────────────────────┤
│  5. Platform Config                     │  ← CI/CD platform
├─────────────────────────────────────────┤
│  6. Environment Config                  │  ← Dev/Staging/Prod
├─────────────────────────────────────────┤
│  7. Developer Config (Lowest)           │  ← Personal preferences
└─────────────────────────────────────────┘

Priority: Developer > Environment > Platform > Repository > Project > Team > Organization
```

---

## 📁 Configuration Files

All configuration files are in `.arog/config/`:

| File | Level | Purpose | Extends |
|------|-------|---------|---------|
| **org-config.json** | Organization | Company-wide standards | - |
| **team-config.json** | Team | Team-specific rules | org-config.json |
| **project-config.json** | Project | Project requirements | team-config.json |
| **repo-config.json** | Repository | Repo settings | project-config.json |
| **platform-config.json** | Platform | CI/CD platform setup | - |
| **environment-config.json** | Environment | Env-specific configs | - |
| **developer-config.json** | Developer | Personal preferences | project-config.json |

---

## 🌟 What Each Config Controls

### 1️⃣ Organization Config (`org-config.json`)

**Controls company-wide standards for ALL projects:**

```json
{
  "standards": {
    "codeQuality": { "eslint": "airbnb", "prettier": true },
    "testing": { "minCoverage": 80 },
    "security": { "vulnerabilityThreshold": "moderate" },
    "accessibility": { "wcagLevel": "AA" },
    "performance": { "lighthouse": 90 }
  },
  "costOptimization": {
    "enabled": true,
    "expectedSavings": "70-85%"
  }
}
```

**Use Cases:**
- ✅ CTO sets company-wide coding standards
- ✅ Security team mandates vulnerability thresholds
- ✅ Compliance team requires WCAG AA
- ✅ Finance team enforces cost optimization

---

### 2️⃣ Team Config (`team-config.json`)

**Overrides org config for specific teams:**

```json
{
  "extends": "org-config.json",
  "team": {
    "name": "Platform Engineering",
    "lead": "platform-lead"
  },
  "overrides": {
    "testing": { "minCoverage": 90 },
    "codeReview": { "minReviewers": 2 }
  },
  "teamSpecific": {
    "techStack": ["TypeScript", "Node.js", "React"],
    "codingGuidelines": { "namingConventions": {} }
  }
}
```

**Use Cases:**
- ✅ Frontend team uses React-specific rules
- ✅ Backend team requires API testing
- ✅ Mobile team has platform-specific standards

---

### 3️⃣ Project Config (`project-config.json`)

**Project-specific requirements:**

```json
{
  "extends": "team-config.json",
  "project": {
    "name": "AROG",
    "type": "automation-framework"
  },
  "overrides": {
    "testing": { "minCoverage": 100 },
    "performance": { "bundleSize": "500KB" }
  },
  "projectSpecific": {
    "features": { "aiAgents": 15, "workflows": 22 },
    "architecture": { "type": "modular" }
  }
}
```

**Use Cases:**
- ✅ Mission-critical projects require 100% coverage
- ✅ E-commerce projects have strict performance budgets
- ✅ Public-facing projects require accessibility

---

### 4️⃣ Repository Config (`repo-config.json`)

**Git repository settings:**

```json
{
  "extends": "project-config.json",
  "repository": {
    "provider": "github",
    "defaultBranch": "main"
  },
  "branches": {
    "protection": {
      "main": {
        "requiredReviews": 2,
        "requiredStatusChecks": ["tests", "linting"]
      }
    }
  },
  "pullRequests": {
    "autoMerge": { "enabled": true },
    "autoReview": { "agent": "@arog-code-reviewer" }
  }
}
```

**Use Cases:**
- ✅ Branch protection rules
- ✅ Required status checks
- ✅ Code owner assignments
- ✅ Auto-merge settings

---

### 5️⃣ Platform Config (`platform-config.json`)

**CI/CD platform configuration:**

```json
{
  "platform": { "name": "GitHub", "type": "source-control" },
  "cicd": {
    "provider": "github-actions",
    "runners": { "default": "ubuntu-latest" }
  },
  "alternatives": {
    "bitbucket": { "supported": true },
    "gitlab": { "supported": true },
    "jenkins": { "supported": true }
  },
  "integrations": {
    "slack": { "enabled": true },
    "jira": { "enabled": true }
  }
}
```

**Use Cases:**
- ✅ Multi-platform support (GitHub, Bitbucket, GitLab)
- ✅ CI/CD runner configuration
- ✅ Third-party integrations
- ✅ Migration scripts

---

### 6️⃣ Environment Config (`environment-config.json`)

**Environment-specific settings:**

```json
{
  "environments": {
    "development": {
      "debug": true,
      "sourceMaps": true,
      "monitoring": { "enabled": false }
    },
    "production": {
      "debug": false,
      "sourceMaps": false,
      "monitoring": { "enabled": true, "alerts": true },
      "deployment": {
        "strategy": "blue-green",
        "approvals": { "required": true }
      }
    }
  }
}
```

**Use Cases:**
- ✅ Different configs for dev/staging/prod
- ✅ Deployment strategies per environment
- ✅ Monitoring and alerting rules
- ✅ Security and performance settings

---

### 7️⃣ Developer Config (`developer-config.json`)

**Personal developer preferences:**

```json
{
  "extends": "project-config.json",
  "developer": {
    "preferences": {
      "editor": "vscode",
      "theme": "dark"
    }
  },
  "localOverrides": {
    "testing": { "watch": true },
    "formatting": { "onSave": true }
  },
  "vscode": {
    "extensions": ["github.copilot"],
    "settings": { "formatOnSave": true }
  }
}
```

**Use Cases:**
- ✅ Personal editor preferences
- ✅ Local development settings
- ✅ Pre-commit hook configuration
- ✅ IDE extensions and settings

---

## 🔧 How Configs Work Together

### Example: Code Coverage Requirement

```
1. Organization:  minCoverage = 80%  (company standard)
2. Team:          minCoverage = 90%  (team override)
3. Project:       minCoverage = 100% (project override)
4. Developer:     No override        (uses project: 100%)

RESULT: Developer must meet 100% coverage ✅
```

### Example: ESLint Configuration

```
1. Organization:  eslint = "airbnb"           (company standard)
2. Team:          eslint = "airbnb-base"      (team override for backend)
3. Project:       No override                 (uses team config)
4. Developer:     autoFix = true              (personal preference)

RESULT: Uses airbnb-base with auto-fix enabled ✅
```

---

## 🚀 Using Configurations

### Load Specific Config

```bash
# Organization-wide validation
npm run arog:validate --config=org-config.json

# Team-specific validation
npm run arog:validate --config=team-config.json

# Project validation (default)
npm run arog:validate

# Developer local checks
npm run arog:local --config=developer-config.json
```

### In GitHub Copilot Chat

```bash
# Use organization standards
@arog validate using org standards

# Use team standards
@arog validate using team standards

# Use project standards
@arog validate this code

# Check what config is active
@arog show active configuration
```

### In CI/CD Pipelines

**GitHub Actions:**
```yaml
- name: Validate with Org Standards
  run: npm run arog:validate -- --config=org-config.json
```

**Bitbucket Pipelines:**
```yaml
- npm run arog:validate -- --config=team-config.json
```

**GitLab CI:**
```yaml
script:
  - npm run arog:validate -- --config=project-config.json
```

---

## 📊 Configuration Priority Examples

### Scenario 1: Frontend Developer on E-Commerce Project

**Active Configs:**
1. ✅ developer-config.json (formatOnSave: true)
2. ✅ project-config.json (minCoverage: 95%)
3. ✅ team-config.json (eslint: "react-app")
4. ✅ org-config.json (wcagLevel: "AA")

**Result:**
- Uses React ESLint rules (team)
- Requires 95% coverage (project)
- Must meet WCAG AA (org)
- Formats on save (developer)

---

### Scenario 2: Backend Team on Microservice

**Active Configs:**
1. ✅ team-config.json (techStack: ["Node.js", "Express"])
2. ✅ org-config.json (security: "strict")

**Result:**
- Node.js/Express specific rules
- Strict security scanning
- Organization-wide standards apply

---

### Scenario 3: Production Deployment

**Active Configs:**
1. ✅ environment-config.json (production)
2. ✅ repo-config.json (branch protection)
3. ✅ project-config.json (deployment strategy)

**Result:**
- Blue-green deployment
- Requires approvals
- Automatic rollback enabled
- Full monitoring and alerts

---

## 🎯 Best Practices

### Organization Level
- ✅ Set minimum standards for ALL projects
- ✅ Define security policies
- ✅ Establish accessibility requirements
- ✅ Enable cost optimization
- ❌ Don't be too restrictive (allow team overrides)

### Team Level
- ✅ Extend organization config
- ✅ Add tech-stack specific rules
- ✅ Define team coding guidelines
- ✅ Set team review requirements
- ❌ Don't conflict with org policies

### Project Level
- ✅ Extend team config
- ✅ Set project-specific budgets
- ✅ Define deployment strategies
- ✅ Configure monitoring
- ❌ Don't lower org/team standards

### Developer Level
- ✅ Personal preferences only
- ✅ Editor settings
- ✅ Local development tools
- ❌ Don't override quality standards
- ❌ Don't bypass required checks

---

## 🔍 Configuration Validation

### Check Active Configuration

```bash
@arog show config

# Output:
# ✅ Organization: AROG (org-config.json)
# ✅ Team: Platform Engineering (team-config.json)
# ✅ Project: AROG (project-config.json)
# ✅ Repository: organization/arog (repo-config.json)
# ✅ Platform: GitHub (platform-config.json)
# ✅ Environment: production (environment-config.json)
# ✅ Developer: Local Developer (developer-config.json)
```

### Validate Configuration Files

```bash
# Validate all configs
npm run arog:validate-configs

# Validate specific config
npm run arog:validate-config org-config.json
```

### Test Configuration Hierarchy

```bash
# Show final merged config
@arog show merged config

# Show config source for specific setting
@arog where is minCoverage defined?

# Output:
# minCoverage = 100%
# Source: project-config.json (overrides team: 90%, org: 80%)
```

---

## 📚 Configuration Files Summary

| Config | What It Controls | Who Sets It | When Used |
|--------|------------------|-------------|-----------|
| **org-config.json** | Company standards | CTO/Leadership | Always |
| **team-config.json** | Team rules | Team Lead | Team projects |
| **project-config.json** | Project requirements | Project Owner | Specific project |
| **repo-config.json** | Repository settings | DevOps | Git operations |
| **platform-config.json** | CI/CD platform | DevOps | Pipeline runs |
| **environment-config.json** | Env settings | DevOps | Deployments |
| **developer-config.json** | Personal prefs | Developer | Local dev |

---

## ✅ Configuration Checklist

### For Organizations
- [x] Create org-config.json with company standards
- [x] Define security policies
- [x] Set accessibility requirements
- [x] Enable cost optimization
- [x] Distribute to all teams

### For Teams
- [x] Create team-config.json extending org config
- [x] Define tech-stack specific rules
- [x] Set team coding guidelines
- [x] Configure review requirements
- [x] Share with team members

### For Projects
- [x] Create project-config.json extending team config
- [x] Set project-specific budgets
- [x] Define deployment strategies
- [x] Configure monitoring
- [x] Document project standards

### For Repositories
- [x] Create repo-config.json
- [x] Set branch protection rules
- [x] Configure code owners
- [x] Enable automation
- [x] Set up webhooks

### For Developers
- [x] Create developer-config.json
- [x] Set personal preferences
- [x] Configure local tools
- [x] Enable pre-commit hooks
- [x] Install required extensions

---

## 🎉 Result

**@arog now has EVERYTHING configured at EVERY level:**

✅ **Organization-wide** standards  
✅ **Team-specific** rules  
✅ **Project** requirements  
✅ **Repository** settings  
✅ **Platform** integrations  
✅ **Environment** configs  
✅ **Developer** preferences  

**@arog = EVERYTHING, EVERYWHERE** ✨

---

**Built with ❤️ by the AROG team**
