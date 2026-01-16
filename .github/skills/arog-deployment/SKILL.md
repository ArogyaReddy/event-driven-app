---
name: arog-deployment
description: Guide deployment strategies, CI/CD setup, and organization rollout for AROG framework. Use when users ask about deployment, GitHub Actions, or organization-wide setup.
---

# AROG Deployment

Expert guidance on deploying AROG across teams and organizations.

## When to Use

- User asks about deployment strategies
- Setting up GitHub Actions workflows
- Organization-wide AROG rollout
- Multi-repository automation
- Team onboarding and training
- Production deployment best practices

## Deployment Strategies

### 1. NPM Package Distribution
**Best for**: Organizations with centralized package management

```bash
# Install from npm registry
npm install --save-dev @arogyareddy/arog

# Add to package.json scripts
{
  "scripts": {
    "arog:health": "arog health-check",
    "arog:setup": "arog setup",
    "arog:validate": "arog validate"
  }
}
```

**Pros**: Easy updates, version control, consistent across teams
**Cons**: Requires npm registry access, package publishing workflow

### 2. Git Submodule Approach
**Best for**: Teams wanting full source control and customization

```bash
# Add AROG as submodule
git submodule add https://github.com/ArogyaReddy/arog.git .arog
git submodule update --init --recursive

# Use from submodule
cd .arog && npm install && npm test
```

**Pros**: Full customization, direct source access, no npm dependency
**Cons**: Submodule management complexity, manual updates

### 3. GitHub Template Repository
**Best for**: Starting new projects with AROG pre-configured

```bash
# Create from template
gh repo create my-project --template ArogyaReddy/arog

# Or use GitHub UI:
# "Use this template" button on GitHub
```

**Pros**: Instant project setup, all features included, best practices
**Cons**: Harder to update, full codebase duplication

### 4. Shared GitHub Actions
**Best for**: Large organizations with multiple repositories

```yaml
# .github/workflows/use-arog.yml
name: AROG Automation
on: [push, pull_request]

jobs:
  arog-tests:
    uses: ArogyaReddy/arog/.github/workflows/arog-unit-tests.yml@main
  
  arog-security:
    uses: ArogyaReddy/arog/.github/workflows/arog-security.yml@main
```

**Pros**: Centralized updates, minimal duplication, easy to maintain
**Cons**: Less customization, dependency on external repo

## Organization Rollout Steps

### Phase 1: Pilot (Week 1-2)
1. Select 2-3 pilot projects
2. Install AROG using preferred strategy
3. Run health checks: `arog health-check`
4. Gather feedback from pilot teams
5. Document customization needs

### Phase 2: Documentation (Week 2-3)
1. Create internal deployment guide
2. Customize copilot-instructions.md for your org
3. Configure agents for your tech stack
4. Set up team-specific skills
5. Create runbooks for common issues

### Phase 3: Training (Week 3-4)
1. Conduct team workshops
2. Share AROG Agent (docs/arog-agent.html)
3. Demo CLI commands and workflows
4. Set up support channels (Slack/Teams)
5. Create FAQ and troubleshooting guide

### Phase 4: Rollout (Week 4+)
1. Deploy to all active projects
2. Monitor adoption metrics
3. Provide ongoing support
4. Iterate based on feedback
5. Scale to new teams

## GitHub Actions Setup

### Essential Workflows to Enable

```yaml
# Recommended workflow combination:
1. arog-unit-tests.yml      # Every push
2. arog-code-quality.yml    # Every push
3. arog-security.yml        # Daily + push
4. arog-build.yml           # Every push
5. arog-e2e-tests.yml       # Pull requests
6. arog-pr-review.yml       # Pull requests
```

### Configuration Tips

**Environment Variables:**
```yaml
env:
  NODE_ENV: production
  COVERAGE_THRESHOLD: 80
  BUNDLE_SIZE_LIMIT: 500KB
```

**Secrets Management:**
- `GITHUB_TOKEN` (auto-provided)
- `NPM_TOKEN` (for npm publish)
- `SLACK_WEBHOOK` (for notifications)

**Caching Strategy:**
```yaml
- uses: actions/setup-node@v4
  with:
    cache: 'npm'  # Requires package-lock.json
```

## Team Size Recommendations

### Small Teams (2-10 developers)
- Strategy: **Git Submodule** or **NPM Package**
- Workflows: Unit Tests, Code Quality, Security
- Customization: Moderate (team-specific rules)
- Support: Self-service with docs

### Medium Teams (10-50 developers)
- Strategy: **NPM Package** with centralized config
- Workflows: All 8 workflows enabled
- Customization: High (multiple tech stacks)
- Support: Dedicated DevOps/Platform team

### Large Organizations (50+ developers)
- Strategy: **Shared GitHub Actions** + NPM Package
- Workflows: Centralized + project-specific
- Customization: Very high (governance required)
- Support: Platform engineering team + champions

## Common Issues & Solutions

### Issue: Workflows Failing on First Run
**Solution:**
1. Ensure package-lock.json is committed (not in .gitignore)
2. Verify Node.js version matches (20.x recommended)
3. Check secrets are configured
4. Run locally first: `npm test && npm run build`

### Issue: Different Teams Need Different Rules
**Solution:**
1. Fork AROG and customize per team
2. Use environment-specific configs
3. Implement feature flags in config files
4. Create team-specific skills/agents

### Issue: Slow CI/CD Pipeline
**Solution:**
1. Enable npm caching in workflows
2. Run tests in parallel
3. Use test sharding for E2E tests
4. Optimize bundle size and dependencies

### Issue: Developers Not Adopting AROG
**Solution:**
1. Show immediate value (find real bugs)
2. Integrate into existing workflows
3. Provide excellent documentation
4. Celebrate wins and share metrics
5. Make it easier than not using it

## Success Metrics

Track these KPIs:
- ✅ **Adoption Rate**: % of projects using AROG
- ✅ **Test Coverage**: Average across all projects
- ✅ **Build Success Rate**: % of passing builds
- ✅ **Security Issues Found**: Vulnerabilities detected
- ✅ **Deployment Frequency**: Releases per week
- ✅ **Time to Deploy**: PR merge to production
- ✅ **Developer Satisfaction**: Team feedback scores

## Next Steps

After deployment:
1. Schedule monthly reviews
2. Collect improvement suggestions
3. Update AROG to latest version
4. Share best practices across teams
5. Expand to new use cases
