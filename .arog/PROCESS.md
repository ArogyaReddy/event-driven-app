# @arog Standard Operating Procedures

**Purpose:** Step-by-step processes for common @arog tasks  
**Last Updated:** January 18, 2026  
**Status:** ACTIVE - FOLLOW THESE STEPS EXACTLY

---

## Table of Contents
1. [Session Startup Process](#session-startup-process)
2. [Bug Fix Process](#bug-fix-process)
3. [Feature Development Process](#feature-development-process)
4. [Code Review Process](#code-review-process)
5. [Release Process](#release-process)
6. [Issue Logging Process](#issue-logging-process)
7. [Emergency Response Process](#emergency-response-process)

---

## Session Startup Process

**Execute EVERY TIME before responding:**

### Step 1: Load Context
```bash
1. Read .arog/RULES.md (10 mandatory rules)
2. Read .arog/KNOWN-ISSUES.md (active problems)
3. Read .arog/SESSION-LOG.md (last 5 entries)
4. Scan .arog/ISSUES-FIXES-BANK.md (search for similar issues)
```

### Step 2: Understand Request
```bash
1. Read user's message carefully
2. Identify request type:
   - Bug report
   - Feature request
   - Question
   - Code review
   - Other
3. Check if this is a repeated issue (search ISSUES-FIXES-BANK)
```

### Step 3: Prepare Response
```bash
1. Show @arog banner
2. Acknowledge request
3. Reference past issues if applicable
4. Outline plan
```

### Step 4: Execute Work
```bash
1. Follow relevant process (bug fix, feature dev, etc.)
2. Log actions in real-time
3. Validate as you go
```

### Step 5: Log Session
```bash
1. Update SESSION-LOG.md
2. Update KNOWN-ISSUES.md if needed
3. Update ISSUES-FIXES-BANK.md if fixing a bug
```

---

## Bug Fix Process

**Use this for ALL bug reports:**

### Step 1: Acknowledge & Search
```bash
1. Show @arog banner
2. Acknowledge: "I should have caught this."
3. Search ISSUES-FIXES-BANK.md for similar issues
4. If found: "This is similar to #[ISSUE-ID]. Let me check why it regressed."
5. If new: "This is a new issue. Let me investigate."
```

### Step 2: Diagnose
```bash
1. Read error message/screenshot carefully
2. Identify affected files
3. Check recent changes (git log)
4. Run THE ONE-THING to see current state
5. Run relevant tests to understand failure
6. Identify root cause (technical + process)
```

### Step 3: Create Issue Entry
```bash
1. Assign issue ID: #[COMPONENT]-[NUMBER]
   Example: #CLI-001, #STDIO-001
2. Add to KNOWN-ISSUES.md (if not resolved immediately)
3. Prepare ISSUES-FIXES-BANK.md entry (fill in later)
```

### Step 4: Implement Fix
```bash
1. Create/update plan.md if multi-step fix
2. Use manage_todo_list for tracking
3. Make code changes
4. Add tests to prevent regression
5. Add validators if applicable
6. Update documentation
```

### Step 5: Validate Fix
```bash
1. Run unit tests: npm test
2. Run specific tests for this bug
3. Run THE ONE-THING: npm run one-thing
4. Manual verification (actually test it!)
5. Check coverage didn't drop
```

### Step 6: Document & Prevent
```bash
1. Complete ISSUES-FIXES-BANK.md entry
2. Add "Prevention Strategy" section
3. Update RULES.md if process gap found
4. Add validator to THE ONE-THING
5. Remove from KNOWN-ISSUES.md (if resolved)
```

### Step 7: Log & Report
```bash
1. Update SESSION-LOG.md with full details
2. Report to user:
   - What was wrong
   - What was fixed
   - How it's prevented
   - Validation results
```

---

## Feature Development Process

**Use this for new features:**

### Step 1: Requirements Gathering
```bash
1. Check if plan.md exists
2. If not, create one:
   - Context & goals
   - Requirements (acceptance criteria)
   - Implementation steps
   - Testing strategy
3. Clarify edge cases with user
```

### Step 2: Planning
```bash
1. Use manage_todo_list to create task list
2. Break into small, testable steps
3. Identify files to create/modify
4. Plan test strategy (unit + integration + E2E)
5. Get user confirmation before starting
```

### Step 3: Test-First Development
```bash
1. Mark first task as "in-progress"
2. Write failing test for feature
3. Implement minimum code to pass test
4. Refactor for quality
5. Add edge case tests
6. Verify 100% coverage
7. Mark task complete
8. Repeat for next task
```

### Step 4: Integration
```bash
1. Run full test suite
2. Run THE ONE-THING
3. Build project (npm run build)
4. Manual testing
5. Fix any issues found
```

### Step 5: Documentation
```bash
1. Update README.md (if user-facing)
2. Update API docs (if public API)
3. Update inline comments
4. Update plan.md to mark complete
5. Create examples if needed
```

### Step 6: Validation & Log
```bash
1. Final validation:
   - npm test (all pass)
   - npm run one-thing (100%)
   - npm run build (success)
   - Manual verification
2. Update SESSION-LOG.md
3. Mark all todos complete
```

---

## Code Review Process

**Use this when reviewing code:**

### Step 1: Understand Context
```bash
1. Read the PR/commit description
2. Check if there's a plan.md
3. Review KNOWN-ISSUES.md for related problems
4. Identify what changed (git diff)
```

### Step 2: Automated Checks
```bash
1. Run THE ONE-THING
2. Run linter (npm run lint)
3. Run tests (npm test)
4. Check coverage (must be ≥ 80%)
5. Build project (npm run build)
```

### Step 3: Manual Review
```bash
1. Code quality:
   - Follows AROG conventions?
   - Readable and maintainable?
   - Proper error handling?
   - No security vulnerabilities?

2. Testing:
   - Tests included?
   - Edge cases covered?
   - E2E tests for user features?
   - Manual testing done?

3. Documentation:
   - Code comments for complex logic?
   - README updated if needed?
   - API docs updated?
```

### Step 4: Provide Feedback
```bash
1. If APPROVED:
   ✅ List what's good
   ✅ Confirm validation passed
   ✅ Note any optional improvements

2. If CHANGES REQUESTED:
   ❌ List specific issues
   ❌ Provide examples of fixes
   ❌ Reference RULES.md if violated
   ❌ Suggest tests if missing
```

### Step 5: Log Review
```bash
1. Update SESSION-LOG.md
2. If issues found, add to KNOWN-ISSUES.md
3. Track approval/rejection in log
```

---

## Release Process

**Use this before ANY release:**

### Step 1: Pre-Release Validation
```bash
1. Run THE ONE-THING: npm run one-thing
   Expected: 100% (all validators pass)

2. Run full test suite:
   - npm test (unit tests)
   - npm run test:e2e (E2E tests)
   - npm run test:a11y (accessibility)
   Expected: All pass

3. Run security audit:
   - npm audit
   Expected: No high/critical vulnerabilities

4. Run build:
   - npm run build
   Expected: Success, no errors
```

### Step 2: Manual Testing
```bash
1. CLI Testing:
   - Run arog cli
   - Test each menu option
   - Verify output visible
   - Test error scenarios

2. MCP Testing:
   - Restart VS Code
   - Check MCP servers connected
   - Test MCP capabilities
   - Check for errors

3. Integration Kit Testing:
   - Copy to fresh project
   - Run npm install
   - Run arog setup
   - Verify all features work
```

### Step 3: Documentation Check
```bash
1. README.md up to date?
2. CHANGELOG.md updated?
3. Version bumped in package.json?
4. API docs current?
5. Migration guide (if breaking changes)?
```

### Step 4: Final Validation
```bash
1. Review KNOWN-ISSUES.md
   - Any critical issues? (STOP if yes)
   - Any high priority blocking? (Consider delay)
   - Document known issues in release notes

2. Review SESSION-LOG.md
   - Recent bugs fixed?
   - All validations passed?
   - Any concerns?

3. Re-run THE ONE-THING one final time
   Expected: 100%
```

### Step 5: Release & Log
```bash
1. Create git tag
2. Push to repository
3. Publish to npm (if applicable)
4. Update SESSION-LOG.md with release info
5. Update KNOWN-ISSUES.md (close fixed issues)
6. Announce release
```

---

## Issue Logging Process

**Use this for EVERY interaction:**

### Step 1: Prepare Entry
```bash
Format:
## [YYYY-MM-DD HH:MM] - [TYPE]
**User Request:** [exact quote]
**Analysis:** [understanding]
**Action Taken:** [what you did]
**Files Modified:** [list]
**Validation:** [test results]
**Result:** [SUCCESS/FAILURE/PARTIAL]
**Issues Found:** [new issues]
**Follow-up Required:** [YES/NO]
**Logged in ISSUES-FIXES-BANK:** [YES/NO + ID]
```

### Step 2: Fill Details
```bash
1. Copy user request exactly
2. Explain your understanding
3. List every file modified
4. Show validation results (paste output)
5. Indicate success/failure
6. Note any new issues discovered
7. Specify follow-up if needed
```

### Step 3: Cross-Reference
```bash
1. If fixing a bug:
   - Add to ISSUES-FIXES-BANK.md
   - Link to issue ID in SESSION-LOG
   - Update KNOWN-ISSUES.md

2. If finding a bug:
   - Create issue ID
   - Add to KNOWN-ISSUES.md
   - Note in SESSION-LOG

3. If closing an issue:
   - Update KNOWN-ISSUES.md status
   - Move to ISSUES-FIXES-BANK.md
   - Link in SESSION-LOG
```

### Step 4: Commit Log
```bash
1. Append to SESSION-LOG.md
2. Verify formatting is correct
3. Ensure timestamps are accurate
4. Maintain chronological order
```

---

## Emergency Response Process

**Use this for CRITICAL issues:**

### Step 1: Immediate Assessment
```bash
1. STOP all other work
2. Read error message/report carefully
3. Classify severity:
   - CRITICAL: Production broken, users blocked
   - HIGH: Major feature broken
   - MEDIUM: Minor feature broken
   - LOW: Cosmetic issue
```

### Step 2: Triage (CRITICAL only)
```bash
1. Is production affected?
   YES → Immediately notify user
   NO → Proceed normally

2. Can users work around it?
   YES → Document workaround, then fix
   NO → Fix immediately

3. Do we have a previous fix?
   Search ISSUES-FIXES-BANK.md
   If found → Apply same fix
```

### Step 3: Emergency Fix
```bash
1. Create hotfix issue: #HOTFIX-[NUMBER]
2. Add to KNOWN-ISSUES.md (mark CRITICAL)
3. Implement minimal fix (don't refactor now)
4. Add test to prevent regression
5. Run THE ONE-THING (must be 100%)
6. Manual verification
```

### Step 4: Deploy & Monitor
```bash
1. Deploy fix immediately
2. Monitor for side effects
3. Verify users can proceed
4. Log everything in SESSION-LOG.md
```

### Step 5: Post-Mortem
```bash
1. Complete ISSUES-FIXES-BANK.md entry
2. Identify root cause (technical + process)
3. Update RULES.md if process gap
4. Add validator to prevent recurrence
5. Schedule follow-up for proper fix (if hotfix was quick/dirty)
```

---

## Quick Reference: Decision Tree

```
User Request Received
├── Bug Report? → Follow Bug Fix Process
├── Feature Request? → Follow Feature Development Process
├── Code Review? → Follow Code Review Process
├── Release? → Follow Release Process
├── Critical Issue? → Follow Emergency Response Process
└── Question/Other? → Follow Session Startup Process
```

---

**END OF STANDARD OPERATING PROCEDURES**

*These processes ensure consistency and quality in @arog operations.*
*Update when better processes are discovered.*
