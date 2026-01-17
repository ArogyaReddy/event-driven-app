# 🤖 AROG Portable CLI

## ✨ The Portable Automation Interface

This folder (`.arog/`) contains everything you need to use AROG in any project!

### 📦 What's Inside

```
.arog/
├── package.json          # Enables 'npx arog' command
├── bin/
│   └── arog-cli.js       # Interactive CLI (travels with you!)
├── scripts/
│   └── first-time-setup.js  # First-time onboarding
├── config/               # AROG configurations
├── skills/               # AROG skill definitions
└── prompts/              # AI agent prompts
```

### 🚀 Quick Start

When you copy `.arog/` and `.github/` folders to a new project:

```bash
# 1. Install AROG dependencies (one time)
cd .arog
npm install

# 2. Launch interactive CLI
npx arog

# That's it! The CLI shows you everything you can do.
```

### 🎯 First Time in a New Project?

**The interactive CLI auto-launches on first `npm install`!**

Just run:
```bash
cd .arog
npm install
```

And you'll see a guided tour explaining:
- What AROG is
- All available commands
- How to use @arog agent
- Health status of your project

### 💡 Using the CLI

```bash
# Launch interactive menu
npx arog

# Quick actions
npx arog --help       # Show help
npx arog --health     # Run health check
npx arog --welcome    # Show welcome screen
npx arog --demo       # Run a demo

# Or run from your project root
cd ..  # Go back to project root
.arog/node_modules/.bin/arog
```

### 🎨 What the Interactive CLI Does

- ✅ **Shows project status** - Health check for your project
- ✅ **Lists all commands** - Complete command reference
- ✅ **Quick actions** - Run tests, lint, deploy, etc.
- ✅ **Guided workflows** - Step-by-step for common tasks
- ✅ **No memorization** - Everything in an easy menu

### 📚 Available Commands via CLI

When you run `npx arog`, you can:

**Testing:**
- Run all tests (10 types!)
- Unit tests
- E2E tests
- Security tests
- Coverage reports

**Code Quality:**
- Check code quality (lint)
- Auto-fix issues
- Format code

**Security:**
- Security audit
- Vulnerability scanning

**Build & Deploy:**
- Production builds
- Deploy to staging
- Deploy to production

**Reports:**
- Generate full reports
- View metrics
- Cost analysis

**And much more!**

### 🔧 Integration with Your Project

After copying `.arog/` and `.github/` to your project:

**1. Install AROG CLI:**
```bash
cd .arog
npm install
```

**2. Add to your project's package.json (optional):**
```json
{
  "scripts": {
    "arog": ".arog/node_modules/.bin/arog",
    "arog:health": "npm run arog -- --health"
  }
}
```

**3. Now you can run from project root:**
```bash
npm run arog
```

### 🤖 Using @arog Agent in VS Code

Once `.arog/` and `.github/` are in your project:

**The @arog agent knows everything AROG can do!**

Just ask in VS Code:
```
@arog what can you do?
@arog review this code
@arog run tests
@arog deploy to staging
@arog show me all commands
```

The @arog agent uses the configurations and skills in this `.arog/` folder!

### 📖 Documentation

- **First-Time User Guide:** `docs/FIRST-TIME-USER-GUIDE.md`
- **All Commands:** `docs/ALL-AROG-COMMANDS.md`
- **The AROG Book:** `docs/book/index.html`
- **Integration Guide:** `arog-integration-kit/INTEGRATE.md`

### 🎓 Why This is Portable

**Traditional approach:**
- Tools installed globally
- Different versions across projects
- Configuration scattered

**AROG approach:**
- CLI lives in `.arog/` folder
- Travels with your configuration
- Same experience across all projects
- Just copy and go!

**When you share `.arog/` and `.github/` folders:**
- ✅ Everyone gets the interactive CLI
- ✅ Everyone has same commands
- ✅ Everyone sees same menu
- ✅ Zero setup friction

### 🚀 For Teams

**Onboarding new developers:**

```bash
# They clone your repo (already has .arog/ and .github/)
git clone <your-repo>
cd <your-repo>

# Install AROG
cd .arog
npm install

# Interactive CLI launches automatically!
# Shows them:
# - What AROG is
# - All commands available
# - How to use @arog
# - Project health status

# They're productive in 10 minutes!
```

### ✨ The Magic

**You copy two folders:**
- `.arog/` → AROG configuration + CLI
- `.github/` → GitHub Actions workflows

**You get:**
- ✅ Interactive CLI (`npx arog`)
- ✅ All automation (tests, security, deploy)
- ✅ AI agent integration (`@arog`)
- ✅ First-time onboarding
- ✅ Complete documentation

**That's it! AROG is now in your project!**

### 🎉 Quick Reference

```bash
# Essential commands
npx arog              # Launch interactive menu
npx arog --help       # Show help
npx arog --health     # Health check

# From project root (if added to package.json)
npm run arog          # Launch interactive menu
npm run arog:health   # Health check

# In VS Code
@arog what can you do?
@arog review this code
@arog run tests
```

---

**Made with ❤️ by the AROG Team**

**Questions?** Run `npx arog` and select "Help & Documentation"!
