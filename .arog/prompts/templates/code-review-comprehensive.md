# Comprehensive Code Review Prompt

## Context
You are an expert code reviewer analyzing this code for quality, security, performance, and best practices.

## Instructions

Review the following code comprehensively:

### 1. Code Quality (Weight: 25%)
- **Readability**: Is the code easy to understand?
- **Maintainability**: Can it be easily modified?
- **Structure**: Is it well-organized?
- **Naming**: Are variables/functions well-named?
- **Comments**: Are they helpful and up-to-date?

### 2. Security (Weight: 30%)
- **Input Validation**: Are inputs properly validated?
- **SQL Injection**: Any unsanitized queries?
- **XSS Vulnerabilities**: Proper output encoding?
- **Authentication**: Proper auth checks?
- **Secrets**: No hardcoded credentials?
- **OWASP Top 10**: Check against common vulnerabilities

### 3. Performance (Weight: 20%)
- **Algorithm Efficiency**: O(n) vs O(n²)?
- **Database Queries**: N+1 problems?
- **Memory Usage**: Any leaks?
- **Caching**: Opportunities for caching?
- **Network Calls**: Minimize API requests?

### 4. Testing (Weight: 15%)
- **Test Coverage**: Adequate tests?
- **Edge Cases**: Are they tested?
- **Test Quality**: Are tests meaningful?
- **Mocking**: Proper use of mocks?

### 5. Best Practices (Weight: 10%)
- **DRY**: Avoid repetition?
- **SOLID**: Following principles?
- **Error Handling**: Proper try-catch?
- **Logging**: Adequate logging?

## Output Format

```markdown
## Code Review Summary

### ✅ Strengths (Minimum 3)
1. [What's done well]
2. [Another strength]
3. [More strengths]

### 🔴 Critical Issues (Blockers)
1. **[Issue Title]** (File: line X)
   - Problem: [Description]
   - Risk: [Impact]
   - Fix: [Specific solution with code example]

### 🟡 Warnings (Should Fix)
1. **[Issue Title]**
   - Problem: [Description]
   - Suggestion: [How to improve]

### 💡 Suggestions (Nice to Have)
1. [Improvement suggestion]

### 📊 Scores
- Code Quality: X/10
- Security: X/10
- Performance: X/10
- Testing: X/10
- Overall: X/10

### 🎯 Action Items
1. [Priority 1: Fix critical security issue]
2. [Priority 2: Add missing tests]
3. [Priority 3: Refactor long method]
```

## Variables
- `{{file_path}}`: Path to the file being reviewed
- `{{language}}`: Programming language
- `{{framework}}`: Framework used (if any)
- `{{min_score}}`: Minimum acceptable score (default: 7/10)

## Code to Review
```{{language}}
{{code}}
```

## Additional Context
{{context}}
