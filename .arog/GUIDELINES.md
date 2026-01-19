# @arog Guidelines (Detailed)

**Purpose:** Detailed guidelines for @arog operations  
**Last Updated:** January 18, 2026  
**Status:** ACTIVE - READ BEFORE RESPONDING

---

## Table of Contents
1. [Response Guidelines](#response-guidelines)
2. [Code Generation Guidelines](#code-generation-guidelines)
3. [Testing Guidelines](#testing-guidelines)
4. [Communication Guidelines](#communication-guidelines)
5. [Error Handling Guidelines](#error-handling-guidelines)
6. [Validation Guidelines](#validation-guidelines)
7. [Documentation Guidelines](#documentation-guidelines)

---

## Response Guidelines

### Before Every Response

**MANDATORY Checklist:**
1. ✅ Read `.arog/RULES.md`
2. ✅ Check `.arog/KNOWN-ISSUES.md` for active problems
3. ✅ Review `.arog/SESSION-LOG.md` (last 5 entries)
4. ✅ Search `.arog/ISSUES-FIXES-BANK.md` for similar issues
5. ✅ Include @arog banner in response
6. ✅ Log this interaction in SESSION-LOG.md

### Response Structure

```
1. @arog Banner (MANDATORY)
2. Acknowledge user request
3. Reference any related past issues (from ISSUES-FIXES-BANK)
4. Explain what you're going to do
5. Perform actions
6. Validate results
7. Log to SESSION-LOG.md
8. Provide clear next steps
```

### When User Reports a Bug

1. **Acknowledge:**
   - "I should have caught this."
   - Reference if it's a repeated issue

2. **Search History:**
   - Check ISSUES-FIXES-BANK.md for similar issues
   - If it's a regression, explain why it happened again

3. **Diagnose:**
   - Read error messages carefully
   - Check THE ONE-THING results
   - Review relevant code

4. **Fix:**
   - Apply fix with tests
   - Update validators if needed
   - Add to ISSUES-FIXES-BANK.md

5. **Validate:**
   - Run THE ONE-THING
   - Run relevant tests
   - Manual verification

6. **Prevent:**
   - Add test to prevent regression
   - Add validator if applicable
   - Update RULES.md if process gap

---

## Code Generation Guidelines

### Before Generating Code

1. **Check for plan.md:**
   - Does a plan exist for this feature?
   - If not, create one (for multi-step work)

2. **Understand requirements:**
   - Read acceptance criteria
   - Clarify edge cases
   - Verify expected behavior

3. **Review existing patterns:**
   - Search codebase for similar implementations
   - Follow established conventions
   - Use existing utilities

### Code Quality Standards

**MANDATORY:**
- ✅ Follow ESLint rules (single quotes, semicolons, 2-space indent)
- ✅ Add TypeScript types (if applicable)
- ✅ Write tests BEFORE or WITH code
- ✅ Add inline comments for complex logic
- ✅ Use meaningful variable names
- ✅ Keep functions small and focused

**FORBIDDEN:**
- ❌ TODO comments without creating issues
- ❌ console.log without removing after debug
- ❌ Commented-out code
- ❌ Unused imports
- ❌ Magic numbers without explanation

### Testing Requirements

**Every code change MUST include:**
1. Unit tests (for business logic)
2. Integration tests (for workflows)
3. E2E tests (for user-facing features)
4. Manual testing (for UX validation)

**Test Coverage:**
- Minimum: 80% (enforced by Jest)
- Target: 100% (for critical code)
- User-facing features: MUST have E2E tests

---

## Testing Guidelines

### Test-First Development

**Process:**
1. Write failing test
2. Implement code to pass test
3. Refactor while keeping tests green
4. Add edge case tests
5. Verify 100% coverage

### Test Types

**1. Unit Tests** (`tests/unit/`)
- Test individual functions
- Mock dependencies
- Fast execution (< 100ms each)
- 100% coverage of business logic

**2. Integration Tests** (`tests/integration/`)
- Test component interactions
- Use real dependencies where possible
- Test workflows end-to-end
- Validate data flow

**3. E2E Tests** (`tests/e2e/`)
- Test user journeys
- Use Playwright
- Test happy path + error scenarios
- Validate UI/UX

**4. Manual Tests**
- User workflows (CLI, UI)
- Visual validation
- Accessibility testing
- Performance testing

### Test Organization

```
tests/
├── unit/              # Fast, isolated tests
│   ├── services/
│   ├── utils/
│   └── validators/
├── integration/       # Component interaction tests
│   ├── api/
│   ├── cli/
│   └── workflows/
├── e2e/              # User journey tests
│   ├── auth/
│   ├── setup/
│   └── workflows/
└── one-thing-for-all/ # THE ONE-THING validators
    └── validators/
```

---

## Communication Guidelines

### Tone and Style

**DO:**
- ✅ Be direct and concise
- ✅ Use clear language
- ✅ Provide working examples
- ✅ Acknowledge mistakes
- ✅ Explain "why" not just "how"

**DON'T:**
- ❌ Use corporate jargon
- ❌ Be overly apologetic
- ❌ Make excuses
- ❌ Use emojis excessively (unless in banners)
- ❌ Assume user knowledge

### Error Messages

**Structure:**
```
❌ [What failed]

Why this happened:
[Root cause explanation]

How to fix it:
1. [Step 1]
2. [Step 2]

What I'm doing to prevent this:
- [Prevention 1]
- [Prevention 2]
```

### Success Messages

**Structure:**
```
✅ [What succeeded]

Changes made:
- [Change 1]
- [Change 2]

Validation:
✅ Tests passing
✅ THE ONE-THING: 100%

Next steps:
[What user should do next]
```

---

## Error Handling Guidelines

### When Tests Fail

1. **Don't ignore it:**
   - Read error message carefully
   - Identify failing test
   - Understand what broke

2. **Diagnose:**
   - Run specific test in isolation
   - Check recent changes
   - Review test expectations

3. **Fix:**
   - Fix the code (if code is wrong)
   - Fix the test (if test is wrong)
   - Update both (if requirements changed)

4. **Verify:**
   - Re-run failing test
   - Run full test suite
   - Check coverage didn't drop

5. **Document:**
   - Log in SESSION-LOG.md
   - Add to ISSUES-FIXES-BANK.md if significant
   - Update KNOWN-ISSUES.md if not resolved

### When THE ONE-THING Fails

**CRITICAL: DO NOT PROCEED until THE ONE-THING is 100%**

1. **Stop all work**
2. Read failure message
3. Identify which validator failed
4. Fix the root cause
5. Re-run THE ONE-THING
6. Only proceed when 100%

### When Build Fails

1. **Check TypeScript errors:**
   - Run `npm run typecheck`
   - Fix type issues
   - Re-run build

2. **Check Webpack errors:**
   - Read error output
   - Check import paths
   - Verify dependencies

3. **Check dependencies:**
   - Run `npm install`
   - Clear node_modules if needed
   - Verify package.json

---

## Validation Guidelines

### Pre-Commit Validation

**MANDATORY before every commit:**
```bash
npm run lint          # Must pass
npm run typecheck     # Must pass
npm test              # Must pass (100% coverage)
npm run build         # Must succeed
npm run one-thing     # Must be 100%
```

### Pre-Release Validation

**MANDATORY before any release:**
```bash
npm run one-thing              # 100%
npm test                       # All pass
npm run test:e2e              # All pass
npm run test:a11y             # All pass
npm run lint                  # No errors
npm run build                 # Success
npm audit                     # No high/critical
```

### Manual Testing Checklist

**For CLI changes:**
- [ ] Run `arog cli`
- [ ] Test each menu option
- [ ] Verify output is visible
- [ ] Test error scenarios
- [ ] Verify progress indicators

**For MCP changes:**
- [ ] Restart VS Code
- [ ] Verify MCP servers connected
- [ ] Test each MCP capability
- [ ] Check for errors in Output panel

**For Integration Kit:**
- [ ] Copy to fresh project
- [ ] Run npm install
- [ ] Run arog setup
- [ ] Verify all scripts work

---

## Documentation Guidelines

### When to Update Docs

**MANDATORY:**
- Public API changes → Update `docs/api-reference.html`
- User-facing features → Update `docs/` and `README.md`
- Configuration changes → Update `docs/configuration.html`
- New processes → Update `.arog/PROCESS.md`

**OPTIONAL:**
- Internal refactoring → Update inline comments
- Bug fixes → Update changelog

### Documentation Standards

**README.md:**
- Keep concise (< 500 lines)
- Focus on "getting started"
- Link to detailed docs
- Include badges (tests, coverage, etc.)

**API Reference:**
- Document all public functions
- Include examples
- Show parameters and return types
- Document edge cases

**Inline Comments:**
- Explain WHY, not WHAT
- Document complex algorithms
- Clarify non-obvious behavior
- Reference issue IDs for workarounds

---

## Smart Model Routing Guidelines

### Use FREE Models (GPT-4o-mini) For:
- ✅ Running tests
- ✅ Code formatting
- ✅ Health checks
- ✅ Simple explanations
- ✅ Documentation lookup
- ✅ Status reports
- ✅ File searches
- ✅ Small code reviews (<100 lines)

### Use PAID Models (Claude Sonnet) For:
- 💎 Code generation
- 💎 Security reviews
- 💎 Architecture design
- 💎 Performance optimization
- 💎 Complex refactoring
- 💎 Large code reviews (>100 lines)
- 💎 Critical analysis
- 💎 Multi-file changes

### Cost Optimization

**Target:**
- 70-85% of requests use FREE models
- Only complex work uses PAID models
- Estimated savings: $50-100/month per user

**Validation:**
- Track model usage in SESSION-LOG.md
- Review monthly for optimization opportunities

---

## Continuous Improvement Guidelines

### Weekly Reviews

**Every Monday:**
1. Review SESSION-LOG.md (last week's entries)
2. Identify repeated issues
3. Update RULES.md if patterns found
4. Update validators if gaps found
5. Clean up KNOWN-ISSUES.md (close resolved)

### Monthly Audits

**First of every month:**
1. Review ISSUES-FIXES-BANK.md
2. Identify recurring issues
3. Update testing strategy
4. Improve validation rules
5. Update documentation

### Learning from Mistakes

**After every bug:**
1. Add to ISSUES-FIXES-BANK.md
2. Identify root cause (technical + process)
3. Add test to prevent regression
4. Add validator if applicable
5. Update RULES.md if process gap
6. Document lesson learned

---

**END OF GUIDELINES**

*These guidelines complement RULES.md with detailed "how-to" instructions.*
*Update this file when processes improve or new patterns emerge.*
