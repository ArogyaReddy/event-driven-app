---
name: arog-ai-assistance
description: Configure and optimize AI assistance (Copilot, agents, skills) for AROG development. Use when users ask about Copilot, custom agents, or AI integration.
---

# AROG AI Assistance

Master AI-powered development with GitHub Copilot, custom agents, and skills.

## What This Skill Provides

Complete guidance on configuring and using AI assistance in AROG projects.

## When to Use

- User asks about GitHub Copilot configuration
- Setting up custom agents
- Creating reusable skills
- AI integration questions
- Copilot not providing AROG-specific suggestions
- Want to customize AI behavior

## AI Infrastructure Overview

AROG includes three layers of AI assistance:

### 1. Copilot Instructions
**File:** `.github/copilot-instructions.md`
**Purpose:** Configure GitHub Copilot with AROG context

**What It Contains:**
- Project overview and technologies
- Code style preferences (quotes, semicolons, indentation)
- Common tasks and commands
- File structure and important paths
- Testing patterns and frameworks

**When Copilot Reads It:**
- Automatically when you open the workspace
- Provides context for all code suggestions
- Helps generate AROG-specific code

### 2. Custom Agents
**Location:** `.github/agents/`
**Purpose:** Specialized AI assistants for specific tasks

**AROG Includes:**
- `arog.agent.md` - Main autonomous automation assistant
- Invoked with: `@arog <your request>`

**Agent Capabilities:**
- Code review on every commit
- Automated testing
- Security scanning
- Performance monitoring
- Deployment automation

### 3. Reusable Skills
**Location:** `.github/skills/`
**Purpose:** Domain-specific knowledge modules

**AROG Includes:**
- `arog-overview` - System capabilities
- `arog-customize` - Configuration guidance
- `arog-troubleshooting` - Debugging help
- `arog-deployment` - Deployment strategies
- `arog-ai-assistance` - This skill!

## How to Use AROG Agent

### Basic Usage

```
@arog review this code
@arog run all tests
@arog check security vulnerabilities
@arog optimize performance
@arog deploy to staging
```

### Advanced Usage

```
@arog analyze test coverage and suggest missing tests
@arog review PR #123 and post detailed comments
@arog compare bundle size before and after changes
@arog generate Lighthouse performance report
@arog suggest GitHub Actions workflow improvements
```

## Customizing Copilot Instructions

### For Your Organization

Edit `.github/copilot-instructions.md`:

```markdown
# Your Company Name - AROG Configuration

## Project Overview
AROG automation for [your project name]
- Industry: [e.g., E-commerce, Finance, Healthcare]
- Tech Stack: [your specific stack]
- Team Size: [developers count]

## Custom Code Style
- Use double quotes (your preference)
- 4-space indentation (your preference)
- TypeScript strict mode enabled
- Company-specific naming conventions

## Internal Tools
- CI/CD: [Jenkins/GitLab/etc.]
- Monitoring: [DataDog/New Relic/etc.]
- Package Registry: [Artifactory/internal npm]
```

### For Specific Tech Stacks

**React Projects:**
```markdown
## Framework: React
- Use functional components with hooks
- Prefer TypeScript interfaces for props
- Use CSS Modules for styling
- Follow Airbnb React style guide
```

**Vue Projects:**
```markdown
## Framework: Vue 3
- Use Composition API
- TypeScript with defineComponent
- Pinia for state management
- Follow Vue official style guide
```

## Creating Custom Agents

### Agent File Structure

Create `.github/agents/your-agent.agent.md`:

````markdown
```chatagent
---
description: 'Brief description of what this agent does'
model: 'claude-sonnet-4'
---

# Agent Name

I am [Agent Name], your specialized assistant for [specific domain].

## What I Do Automatically

### 🎯 Primary Function
- Bullet point 1
- Bullet point 2

## Invocation

Simply mention me:
```
@your-agent do something
```

## Response Format

I provide:
- ✅ Success indicators
- ❌ Failure details
- 🔧 Fix recommendations
- 📊 Metrics

## Integration

I work with:
- Tool 1
- Tool 2
```
````

### Example: Custom Testing Agent

````markdown
```chatagent
---
description: 'Specialized E2E testing assistant for Playwright tests'
model: 'claude-sonnet-4'
---

# E2ETestingExpert

I am E2ETestingExpert, your Playwright E2E testing specialist.

## What I Do

### 🧪 Test Creation
- Generate Page Object Models
- Write reliable test scenarios
- Create test data fixtures

### 🐛 Debugging
- Diagnose flaky tests
- Fix timing issues
- Improve selectors

## Invocation

```
@E2ETestingExpert create tests for login flow
@E2ETestingExpert fix flaky test in checkout.spec.js
@E2ETestingExpert optimize test execution time
```
```
````

## Creating Reusable Skills

### Skill File Structure

Create `.github/skills/your-skill/SKILL.md`:

```markdown
---
name: your-skill-name
description: Brief description when to use this skill
---

# Skill Title

Short description of what this skill provides.

## When to Use

- Trigger phrase 1
- Trigger phrase 2
- User asks about X

## Content

Detailed knowledge and examples...

## Examples

Practical use cases...
```

### Example: Database Migration Skill

```markdown
---
name: database-migrations
description: Database migration patterns and best practices for AROG projects
---

# Database Migrations

Guide for safe, reversible database migrations.

## When to Use

- User asks about database changes
- Schema migration questions
- Rollback strategies
- Production database updates

## Migration Patterns

### 1. Additive Changes (Safe)
- Add new columns with defaults
- Create new tables
- Add indexes

### 2. Destructive Changes (Risky)
- Rename columns (requires staging)
- Drop tables (requires backups)
- Change data types (requires migration)

## Best Practices

1. Always write reversible migrations
2. Test on staging first
3. Backup before production
4. Monitor after deployment
5. Have rollback plan ready
```

## AI Assistance Best Practices

### ✅ DO:

1. **Provide Context**: Include file paths, error messages, specific requests
2. **Be Specific**: "Review authentication logic in auth.ts" vs "review code"
3. **Iterate**: Ask follow-up questions, refine suggestions
4. **Verify**: Always test AI-generated code
5. **Learn**: Understand suggestions, don't blindly copy

### ❌ DON'T:

1. **Trust Blindly**: AI can make mistakes, always review
2. **Skip Tests**: AI suggestions need testing
3. **Ignore Warnings**: Pay attention to security/performance concerns
4. **Over-Rely**: Use AI to assist, not replace thinking
5. **Share Secrets**: Never include credentials in prompts

## Troubleshooting AI Assistance

### Copilot Not Giving AROG-Specific Suggestions

**Fix:**
1. Ensure `.github/copilot-instructions.md` exists
2. Reload VS Code window
3. Check Copilot is enabled
4. Verify workspace folder is correct

### Agent Not Responding

**Fix:**
1. Check agent file syntax (valid markdown)
2. Ensure agent name matches invocation
3. Verify agent is in `.github/agents/`
4. Try: `@arog help` to test

### Skills Not Being Used

**Fix:**
1. Ensure SKILL.md is in `.github/skills/skill-name/`
2. Check frontmatter YAML is valid
3. Use descriptive skill names
4. Match trigger phrases in user queries

## Measuring AI Effectiveness

Track these metrics:
- **Acceptance Rate**: % of AI suggestions accepted
- **Code Quality**: Issues found by AI vs manual review
- **Time Saved**: Development time before/after AI
- **Developer Satisfaction**: Team feedback
- **Accuracy**: Correct suggestions vs corrections needed

## Next Steps

1. Customize `.github/copilot-instructions.md` for your project
2. Create team-specific agents for common tasks
3. Build skills for domain knowledge
4. Train team on effective AI usage
5. Iterate based on feedback
