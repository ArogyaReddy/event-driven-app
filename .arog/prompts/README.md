# 🎯 AROG Custom Prompts Library

AI-powered prompt templates for different automation scenarios.

## Available Prompt Categories

### 1. 🔍 Code Review Prompts
- **Deep Security Review**: Comprehensive security analysis
- **Performance Audit**: Find performance bottlenecks
- **Architecture Review**: Evaluate system design
- **Best Practices Check**: Ensure coding standards

### 2. 🧪 Test Generation Prompts
- **Comprehensive Test Suite**: Full test coverage
- **Edge Case Discovery**: Find unusual scenarios
- **Integration Test Design**: Test component interactions
- **Performance Test Plans**: Load and stress test scenarios

### 3. 📚 Documentation Prompts
- **API Documentation**: Generate API docs from code
- **README Generation**: Create comprehensive README
- **Architecture Diagrams**: System architecture docs
- **User Guides**: End-user documentation

### 4. 🔧 Refactoring Prompts
- **Code Modernization**: Update to latest standards
- **Pattern Implementation**: Apply design patterns
- **Dependency Cleanup**: Remove unused dependencies
- **Performance Optimization**: Optimize slow code

### 5. 🐛 Debugging Prompts
- **Error Analysis**: Diagnose error messages
- **Performance Profiling**: Find slow operations
- **Memory Leak Detection**: Identify memory issues
- **Security Vulnerability**: Find security flaws

## Using Custom Prompts

### Method 1: CLI
```bash
# Use a specific prompt
arog-cli prompt --template code-review --file src/app.js

# List available prompts
arog-cli prompt --list

# Create custom prompt
arog-cli prompt --create my-custom-prompt
```

### Method 2: Configuration File
`.arog/prompts/my-prompt.json`:
```json
{
  "name": "Custom Security Review",
  "description": "Deep security analysis with OWASP Top 10",
  "template": "Review this code for security vulnerabilities...",
  "parameters": {
    "focus": ["sql-injection", "xss", "csrf"],
    "severity": "critical"
  }
}
```

### Method 3: GitHub Copilot
Use `/arog-review` slash command in GitHub Copilot Chat

## Example Prompts

### Deep Security Review
```
Analyze this code for security vulnerabilities:
1. Check for SQL injection risks
2. Verify input validation
3. Check authentication/authorization
4. Look for exposed secrets
5. Verify secure data handling

Focus on OWASP Top 10 vulnerabilities.
Provide specific line numbers and fix recommendations.
```

### Comprehensive Test Generation
```
Generate comprehensive tests for this function:
1. Happy path scenarios
2. Edge cases (null, undefined, empty, boundary values)
3. Error conditions
4. Performance edge cases
5. Concurrent access scenarios

Use Jest framework.
Aim for 100% code coverage.
Include mock data and fixtures.
```

### Performance Optimization
```
Analyze this code for performance issues:
1. Identify O(n²) or worse algorithms
2. Find unnecessary database queries
3. Detect memory leaks
4. Check for blocking operations
5. Suggest caching opportunities

Provide before/after metrics.
Include implementation examples.
```

### API Documentation Generation
```
Generate API documentation for these endpoints:
1. Endpoint description and purpose
2. Request/response schemas
3. Authentication requirements
4. Example requests/responses
5. Error codes and handling

Format: OpenAPI 3.0 specification
Include examples for each endpoint.
```

## Prompt Chaining

Combine multiple prompts for complex workflows:

```javascript
// .arog/workflows/complete-review.json
{
  "name": "Complete Code Review",
  "steps": [
    {
      "prompt": "code-quality-check",
      "output": "quality-report.md"
    },
    {
      "prompt": "security-audit",
      "output": "security-report.md"
    },
    {
      "prompt": "performance-analysis",
      "output": "performance-report.md"
    },
    {
      "prompt": "test-coverage-check",
      "output": "coverage-report.md"
    }
  ],
  "aggregate": "final-review.md"
}
```

## Custom Prompt Variables

Use variables in prompts:

```
Review {{file}} for:
- {{review_type}} issues
- Coverage: {{min_coverage}}%
- Severity: {{severity_level}}

Framework: {{framework}}
Language: {{language}}
```

## Prompt Best Practices

1. **Be Specific**: Clear, detailed instructions
2. **Provide Context**: Include relevant information
3. **Set Expectations**: Define desired output format
4. **Include Examples**: Show what you want
5. **Set Constraints**: Define limits and requirements

## Sharing Prompts

```bash
# Export prompt
arog-cli prompt export my-prompt > my-prompt.json

# Import prompt
arog-cli prompt import my-prompt.json

# Publish to marketplace
arog-cli prompt publish my-prompt
```
