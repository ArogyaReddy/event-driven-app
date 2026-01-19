# Test Generation Prompt

## Context
You are an expert test engineer creating comprehensive test suites with maximum coverage.

## Instructions

Generate a complete test suite for the following code:

### Test Requirements

1. **Unit Tests (60% of tests)**
   - Test each function/method independently
   - Mock external dependencies
   - Cover all code paths
   - Include:
     - Happy path scenarios
     - Edge cases (null, undefined, empty, boundary values)
     - Error conditions
     - Type validation (if applicable)

2. **Integration Tests (30% of tests)**
   - Test component interactions
   - Test data flow between modules
   - Test external API integrations
   - Test database operations

3. **E2E Tests (10% of tests)**
   - Test complete user workflows
   - Test critical user journeys
   - Test error scenarios from user perspective

### Coverage Targets
- **Statements**: {{statement_coverage}}% (default: 100%)
- **Branches**: {{branch_coverage}}% (default: 95%)
- **Functions**: {{function_coverage}}% (default: 100%)
- **Lines**: {{line_coverage}}% (default: 100%)

### Test Framework
- Framework: {{test_framework}} (jest/mocha/vitest)
- Assertion Library: {{assertion_lib}} (expect/chai/assert)
- Mocking: {{mock_lib}} (jest/sinon/vitest)

## Output Format

```{{language}}
// {{file_name}}.test.{{ext}}

import { describe, it, expect, jest } from '{{test_framework}}';
import { {{functions_to_test}} } from './{{file_name}}';

describe('{{module_name}}', () => {
  
  // ==================== UNIT TESTS ====================
  
  describe('{{function_name}}', () => {
    
    describe('Happy Path', () => {
      it('should {{expected_behavior}} when {{condition}}', () => {
        // Arrange
        const input = {{test_input}};
        const expected = {{expected_output}};
        
        // Act
        const result = {{function_name}}(input);
        
        // Assert
        expect(result).toBe(expected);
      });
    });
    
    describe('Edge Cases', () => {
      it('should handle null input gracefully', () => {
        expect(() => {{function_name}}(null)).not.toThrow();
      });
      
      it('should handle undefined input', () => {
        expect({{function_name}}(undefined)).toBe({{default_value}});
      });
      
      it('should handle empty array/string/object', () => {
        expect({{function_name}}([])).toEqual([]);
      });
      
      it('should handle boundary values', () => {
        expect({{function_name}}(Number.MAX_VALUE)).toBe({{expected}});
        expect({{function_name}}(0)).toBe({{expected}});
        expect({{function_name}}(-1)).toBe({{expected}});
      });
    });
    
    describe('Error Handling', () => {
      it('should throw error for invalid input', () => {
        expect(() => {{function_name}}('invalid')).toThrow('{{error_message}}');
      });
    });
  });
  
  // ==================== INTEGRATION TESTS ====================
  
  describe('Integration: {{module_name}} with {{dependency}}', () => {
    it('should correctly integrate with {{dependency}}', async () => {
      // Test module interaction
    });
  });
  
  // ==================== E2E TESTS ====================
  
  describe('E2E: Complete {{workflow_name}} workflow', () => {
    it('should complete workflow successfully', async () => {
      // Test full user journey
    });
  });
});
```

## Mock Data Generation

Generate realistic test data using Faker.js:

```javascript
import { faker } from '@faker-js/faker';

const mockUser = () => ({
  id: faker.string.uuid(),
  name: faker.person.fullName(),
  email: faker.internet.email(),
  age: faker.number.int({ min: 18, max: 80 })
});
```

## Variables
- `{{test_framework}}`: jest (default)
- `{{coverage_target}}`: 90% (default)
- `{{include_mocks}}`: true (default)
- `{{include_fixtures}}`: true (default)

## Code to Test
```{{language}}
{{code}}
```

## Expected Output

Generate:
1. Complete test file with {{expected_test_count}}+ tests
2. Mock data fixtures (if {{include_fixtures}} = true)
3. Setup/teardown functions
4. Coverage report showing {{coverage_target}}%+ coverage
