# Playwright Test Agents - Integration Guide

## Overview

AROG now includes **official Playwright Test Agents** for autonomous E2E test generation and healing. This document explains how the agents work and how to use them in any project.

## What Are Playwright Test Agents?

Playwright Test Agents are AI-powered tools that automate the complete test lifecycle:

### 🎭 Three Official Agents

1. **planner** - Explores your application and creates human-readable test plans
2. **generator** - Transforms test plans into executable Playwright tests
3. **healer** - Automatically debugs and fixes failing tests

### Why Use Agents?

- **Zero Manual Test Writing**: Agents explore, plan, and generate tests automatically
- **Self-Healing**: Tests automatically adapt when UI changes
- **Human-Readable Plans**: Test plans are Markdown files anyone can review
- **Production-Ready**: Generated tests use best practices (accessible selectors, proper waits, etc.)

## How It Works

### The Agentic Workflow

```
1. USER REQUEST
   "Create tests for user login"
          ↓
2. 🎭 PLANNER AGENT
   - Navigates to your app
   - Explores login form
   - Identifies flows and edge cases
   - Saves plan to specs/login.md
          ↓
3. 🎭 GENERATOR AGENT  
   - Reads specs/login.md
   - Generates Playwright test code
   - Verifies selectors live in browser
   - Saves to tests/auth/login.spec.ts
          ↓
4. 🎭 HEALER AGENT
   - Runs the generated test
   - If failures occur, analyzes why
   - Updates selectors/waits/assertions
   - Re-runs until passing
          ↓
5. RESULT: Working E2E test!
```

## Setup (Automatic)

When you copy AROG to a new project:

```bash
# 1. Copy AROG folders
cp -r .arog .github /path/to/your-project/

# 2. Install dependencies (MCP auto-configures!)
cd /path/to/your-project/.arog
npm install

# 3. Restart VS Code
# → Playwright Test Agents are now available!
```

### What Gets Configured

The `npm install` postinstall hook automatically:
1. Creates `.vscode/settings.json` with official Playwright MCP
2. Installs `@playwright/test` if not already present
3. Downloads Playwright chromium browser
4. Adds `.vscode/` to `.gitignore`

### Manual Setup (If Needed)

If automatic setup doesn't work:

```bash
# Configure MCP manually
node .arog/scripts/setup-mcp-server.cjs

# Or add to .vscode/settings.json manually:
{
  "mcp.servers": {
    "playwright": {
      "command": "npx",
      "args": ["@playwright/mcp@latest"]
    }
  }
}
```

## Using the Agents

### Example 1: Create Tests from Scratch

**Step 1: Ask Planner to Explore**
```
@playwright-test-planner create a test plan for the checkout flow at https://mystore.com
```

**What happens**:
- Planner navigates to your site
- Explores the checkout process
- Identifies steps, validations, edge cases
- Creates `specs/checkout.md`:

```markdown
# Test Plan: Checkout Flow

## Seed Test
tests/seed.spec.ts

## Test Scenarios

### Scenario 1: Guest Checkout
**Test Suite**: Checkout Tests
**Test File**: tests/checkout/guest-checkout.spec.ts

#### Steps:
1. Navigate to https://mystore.com
2. Add product to cart
3. Proceed to checkout
4. Fill shipping information
5. Complete payment
6. Verify order confirmation

#### Expected Results:
- Order number displayed
- Confirmation email sent
- Cart is empty
```

**Step 2: Generate Tests**
```
@playwright-test-generator generate tests from specs/checkout.md
```

**What happens**:
- Generator reads the plan
- Creates `tests/checkout/guest-checkout.spec.ts`
- Verifies all selectors work
- Generates test with proper assertions

**Step 3: Fix Any Failures**
```
@playwright-test-healer fix failing tests in tests/checkout/
```

**What happens**:
- Healer runs the tests
- If failures occur, debugs them
- Updates selectors that changed
- Adds missing waits
- Re-runs until passing

### Example 2: Fix Broken Tests

When UI changes break your tests:

```
@playwright-test-healer fix all failing tests
```

The healer will:
1. Run all tests
2. Identify failures
3. Analyze the new UI
4. Update selectors/assertions
5. Re-run until passing

### Example 3: Expand Test Coverage

```
@playwright-test-planner add tests for error handling in the login flow
```

Planner will:
- Review existing login tests
- Identify missing edge cases
- Add scenarios to specs/login.md
- You then use generator to create the new tests

## Directory Structure

```
your-project/
├── .arog/                           # AROG automation framework
│   ├── scripts/
│   │   └── setup-mcp-server.cjs    # Auto-configures Playwright MCP
│   └── package.json                 # Postinstall hook
│
├── .github/                         # Agent definitions
│   ├── agents/
│   │   ├── playwright-test-planner.agent.md
│   │   ├── playwright-test-generator.agent.md
│   │   └── playwright-test-healer.agent.md
│   └── copilot-instructions.md      # Tells @arog how to use agents
│
├── .vscode/
│   └── settings.json                # MCP configuration (auto-created)
│
├── specs/                           # Test plans (Markdown)
│   ├── README.md
│   ├── login.md
│   ├── checkout.md
│   └── admin.md
│
└── tests/                           # Executable tests
    ├── seed.spec.ts                 # Bootstrap test for agents
    ├── auth/
    │   ├── login.spec.ts
    │   └── logout.spec.ts
    └── checkout/
        └── guest-checkout.spec.ts
```

## File Roles

### `tests/seed.spec.ts` (Bootstrap)
- Provides ready-to-use `page` context
- Example of test structure
- Runs before planner explores
- Sets up environment/fixtures

### `specs/*.md` (Test Plans)
- Human-readable test descriptions
- Created by planner agent
- Read by generator agent
- Can be edited manually
- Version controlled with code

### `tests/*.spec.ts` (Executable Tests)
- Generated by generator agent
- Fixed by healer agent
- Run with `npx playwright test`
- Use best practices automatically

## Best Practices

### 1. Start with Seed Test
Always have a `tests/seed.spec.ts` that:
- Navigates to your app
- Demonstrates test patterns
- Sets up authentication if needed

### 2. Review Generated Plans
Before generating tests, review `specs/*.md`:
- Are all scenarios covered?
- Are edge cases identified?
- Is test data appropriate?

### 3. Let Healer Fix Issues
Don't manually fix broken tests immediately:
```
# Instead of editing code, ask healer:
@playwright-test-healer fix failing tests in tests/auth/login.spec.ts
```

### 4. Use Accessible Selectors
Agents automatically use:
- `getByRole('button', { name: 'Login' })`
- `getByLabel('Email')`
- `getByText('Welcome')`

These are more resilient than CSS selectors.

### 5. Keep Plans Updated
When requirements change:
1. Update `specs/*.md` manually, OR
2. Ask planner to regenerate
3. Use generator to update tests

## Advanced Usage

### Custom Seed Test with Auth

```typescript
// tests/seed.spec.ts
import { test, expect } from '@playwright/test';

test('seed - authenticated user', async ({ page }) => {
  // Login before planner explores
  await page.goto('https://myapp.com/login');
  await page.getByLabel('Email').fill('test@example.com');
  await page.getByLabel('Password').fill('password');
  await page.getByRole('button', { name: 'Login' }).click();
  
  await expect(page).toHaveURL('/dashboard');
});
```

Now planner will explore as logged-in user!

### Multi-Environment Testing

```
@playwright-test-planner create tests for staging environment at https://staging.myapp.com
```

### API Testing Integration

```typescript
// tests/seed.spec.ts
test('seed - with API setup', async ({ page, request }) => {
  // Create test data via API
  await request.post('/api/test-data', {
    data: { user: 'testuser', items: 5 }
  });
  
  await page.goto('https://myapp.com');
});
```

## Troubleshooting

### Agents Not Showing in VS Code

1. Restart VS Code
2. Check `.vscode/settings.json` exists
3. Verify MCP configuration:
   ```json
   {
     "mcp.servers": {
       "playwright": {
         "command": "npx",
         "args": ["@playwright/mcp@latest"]
       }
     }
   }
   ```
4. Run: `npx playwright init-agents --loop=vscode`

### Tests Keep Failing

```
@playwright-test-healer analyze why tests/auth/login.spec.ts keeps failing
```

Healer will provide detailed diagnostics.

### Selectors Not Working

Agents use accessible selectors, but if issues persist:

```
@playwright-test-generator regenerate tests/checkout/payment.spec.ts with more robust selectors
```

### Performance Issues

If generation is slow:
- Close unnecessary browser tabs
- Use `--headed=false` for faster exploration
- Limit scope: "Create plan for login only, not entire app"

## Portable Setup

### For New Projects

1. **Copy AROG**:
   ```bash
   cp -r /path/to/arog-repo/.arog /path/to/arog-repo/.github /your-project/
   ```

2. **Install**:
   ```bash
   cd /your-project/.arog
   npm install
   ```

3. **Restart VS Code**

4. **Start Testing**:
   ```
   @playwright-test-planner create a test plan for my app
   ```

### For Team Collaboration

Commit these files:
- `.github/agents/` - Agent definitions
- `.github/copilot-instructions.md` - Usage instructions
- `specs/` - Test plans
- `tests/` - Generated tests
- `.arog/` - Automation framework

Do NOT commit:
- `.vscode/settings.json` - Auto-generated, user-specific
- `test-results/` - Test outputs
- `playwright-report/` - HTML reports

## Learn More

- **Official Docs**: https://playwright.dev/docs/test-agents
- **MCP Server**: https://github.com/microsoft/playwright-mcp
- **Video Tutorials**: https://playwright.dev/community/mcp-videos
- **Examples**: https://executeautomation.github.io/mcp-playwright/

## Quick Reference

```bash
# Initialize agents (if not auto-created)
npx playwright init-agents --loop=vscode

# Run all tests
npx playwright test

# Run specific test
npx playwright test tests/auth/login.spec.ts

# Debug mode
npx playwright test --debug

# UI mode (interactive)
npx playwright test --ui

# Generate HTML report
npx playwright show-report
```

## Summary

With Playwright Test Agents in AROG:
- ✅ **Zero manual test writing** - Agents do it all
- ✅ **Self-healing tests** - Adapt to UI changes automatically
- ✅ **Portable** - Copy `.arog` + `.github` to any project
- ✅ **Production-ready** - Best practices built-in
- ✅ **Team-friendly** - Plans are human-readable Markdown

**Get started now**:
```
@playwright-test-planner create a test plan for my app at http://localhost:3000
```
