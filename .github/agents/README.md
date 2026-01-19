# 🤖 AROG Custom Agents - AI-Powered Task Specialists

This directory contains specialized AI agents for different automation tasks.

## Available Agents

### 1. Code Review Agent (`code-review-agent.md`)
Expert at reviewing code quality, security, and best practices

### 2. Test Generation Agent (`test-generation-agent.md`)
Automatically generates comprehensive test suites

### 3. Documentation Agent (`documentation-agent.md`)
Creates and maintains project documentation

### 4. Performance Optimization Agent (`performance-agent.md`)
Analyzes and optimizes code performance

### 5. Security Audit Agent (`security-agent.md`)
Deep security analysis and vulnerability detection

### 6. Refactoring Agent (`refactoring-agent.md`)
Suggests and implements code improvements

### 7. API Design Agent (`api-design-agent.md`)
Designs RESTful and GraphQL APIs

### 8. Database Optimization Agent (`database-agent.md`)
Optimizes queries and database schema

## How Agents Work

Each agent has:
- **Expertise**: Specialized knowledge domain
- **Context**: Project-specific understanding
- **Actions**: What they can do
- **Triggers**: When they activate
- **Output**: Deliverables they produce

## Usage

```bash
# Activate an agent
arog-cli agent --name code-review --file src/app.js

# Run agent on PR
arog-cli agent --name test-generation --target tests/

# Batch agent execution
arog-cli agent --name security --scan-all
```

## Agent Configuration

Agents are configured in `.arog/agents/config.json`:

```json
{
  "agents": {
    "code-review": {
      "enabled": true,
      "triggers": ["pull_request", "commit"],
      "severity": ["error", "warning"]
    }
  }
}
```
