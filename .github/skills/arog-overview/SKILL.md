---
description: 'Get a comprehensive overview of the AROG automation framework, including all 10 automation types, workflows, and configuration options. Use when users ask about AROG capabilities, features, or system status.'
---

# AROG System Overview

## What This Skill Provides
A complete snapshot of the AROG automation framework's capabilities, status, and configuration.

## When to Use
- User asks: "What can AROG do?"
- User asks: "What automations are available?"
- User asks: "Show me AROG status"
- User asks: "Explain AROG system"
- User asks: "What features does AROG have?"

## Response Format

When invoked, provide this structured overview:

```
🤖 AROG System Overview

📊 Automation Status: ✅ All 10 Types Active

1. 🧪 Unit Testing (Jest)
   - 15 tests passing
   - 100% coverage threshold
   - Runs on: every commit

2. 📝 Code Quality (ESLint + Prettier)
   - Auto-fix on commit
   - Enforced style rules
   - Runs on: every commit

3. 🔍 Automated Code Review
   - AI-powered analysis
   - Best practice checks
   - Runs on: every PR

4. 🎭 E2E Testing (Playwright)
   - 5 browsers (Chrome, Firefox, Safari, Mobile)
   - Screenshot on failure
   - Runs on: PRs and main branch

5. 🔒 Security Scanning
   - npm audit integration
   - Secret detection
   - Runs on: daily + PRs

6. ⚡ Performance Testing (Lighthouse)
   - Web vitals monitoring
   - Bundle size checks (500KB limit)
   - Runs on: PRs and main branch

7. 🎯 Accessibility Testing (axe-core)
   - WCAG 2.1 AA compliance
   - Keyboard navigation checks
   - Runs on: PRs

8. 🏗️ Build Checks
   - TypeScript validation
   - Webpack bundling
   - Runs on: every commit

9. 📊 PR Review Bot
   - Complexity scoring
   - Risk assessment
   - Runs on: every PR

10. 📈 Coverage Reporting
    - Real-time tracking
    - Trend analysis
    - Runs on: every test run

🔧 Quick Commands:
- npm test                 → Run unit tests
- npm run test:e2e        → Run E2E tests
- npm run lint            → Check code quality
- npm run arog:validate   → Full system check
- npm run docs:serve      → View documentation

📚 Documentation: http://localhost:8080 (after npm run docs:serve)

⚙️ Configuration Files:
- .eslintrc.js           → Code quality rules
- jest.config.js         → Test configuration
- playwright.config.js   → E2E test setup
- tsconfig.json          → TypeScript settings
- webpack.config.js      → Build configuration
```

## Rules
- Always show current status (check if tests passing)
- Include practical next steps
- Link to relevant documentation
- Be concise but comprehensive
- Mention key npm scripts
- Highlight any failing checks if present

## Examples

**User asks**: "What can AROG do?"

**Response**: 
```
🤖 AROG provides 10 types of automation with zero human intervention:

✅ Testing: Unit (Jest) + E2E (Playwright) + Accessibility (axe-core)
✅ Quality: ESLint + Prettier auto-formatting
✅ Security: npm audit + secret scanning (daily)
✅ Performance: Lighthouse CI + bundle monitoring
✅ Code Review: AI-powered on every PR
✅ Build: TypeScript + Webpack validation

All run automatically via 8 GitHub Actions workflows.

Try: npm run arog:validate to check system health
Docs: npm run docs:serve
```

**User asks**: "Show AROG status"

**Response**:
```
📊 AROG System Status

✅ Unit Tests: 15/15 passing (100% coverage)
✅ Code Quality: No ESLint errors
✅ Security: 0 vulnerabilities
✅ Build: TypeScript compiling successfully
✅ All 8 workflows: Active

Last Validation: [check timestamp]

Run npm run arog:health for detailed health check
```

## Tips
- If user is new, suggest: `npm run docs:serve` first
- If debugging, recommend: `npm run arog:validate`
- If customizing, point to: `docs/configuration.html`
- Always be specific about file locations
