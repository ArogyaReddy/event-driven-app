# Advanced Prompt Engineering

## Description
Master the art of crafting effective prompts for AI tools to get precise, high-quality outputs for any coding task.

## Core Principles

### 1. Specificity Wins
- ❌ "Create a function"
- ✅ "Create a JavaScript function that validates email addresses using regex, handles edge cases, and returns boolean"

### 2. Context is King
- Provide relevant background information
- Reference existing code patterns
- Specify constraints and requirements
- Mention target users or use cases

### 3. Format Matters
```
Good prompt structure:
[Role/Context] + [Task] + [Constraints] + [Format]

Example:
"As a senior JavaScript developer, refactor this authentication function 
to use async/await instead of callbacks, maintain backward compatibility, 
and return the result as a Promise with proper error handling."
```

## Prompt Patterns

### Pattern 1: The Specific Request
```
Template:
Create a [type] that [does what] for [whom/what], 
considering [constraints], formatted as [output format]

Example:
Create a React component that displays a user profile card for a dashboard,
considering mobile responsiveness and dark mode support, formatted as a 
functional component with TypeScript
```

### Pattern 2: The Refactoring Request
```
Template:
Refactor this [code/function/class] to [improvement goal],
while maintaining [requirements], and optimizing for [metric]

Example:
Refactor this sorting function to use more efficient algorithm,
while maintaining the same API, and optimizing for large datasets (10k+ items)
```

### Pattern 3: The Explanation Request
```
Template:
Explain [concept/code] as if teaching [audience level],
focusing on [specific aspects], with [example type]

Example:
Explain JavaScript closures as if teaching beginners,
focusing on practical use cases, with real-world code examples
```

### Pattern 4: The Problem-Solving Request
```
Template:
I'm trying to [goal] but encountering [problem].
Current approach: [what you tried]
Constraints: [limitations]
Suggest [solutions/alternatives]

Example:
I'm trying to optimize page load time but encountering CORS errors 
when fetching external APIs. Current approach: direct fetch calls.
Constraints: Can't modify server, must work in browser.
Suggest alternatives or workarounds
```

## Advanced Techniques

### Chain of Thought
Break complex requests into steps:
```
1. First, analyze the current code structure
2. Then, identify performance bottlenecks
3. Next, suggest specific optimizations
4. Finally, implement the top 3 improvements
```

### Few-Shot Learning
Provide examples of what you want:
```
Generate function names following this pattern:
- calculateUserScore
- validateEmailAddress
- formatCurrencyAmount

Now create similar names for: [your functions]
```

### Constraint-Based Prompting
Define what NOT to do:
```
Create a sorting algorithm that:
- Does NOT use built-in sort()
- Does NOT exceed O(n log n) complexity
- Does NOT modify the original array
```

### Role-Playing
Assign AI a specific expertise:
```
As a security expert, review this authentication code 
and identify potential vulnerabilities...

As a performance engineer, analyze this database query 
and suggest optimizations...
```

## Copilot-Specific Techniques

### Inline Completions
```javascript
// Trigger: Write descriptive comments
// Calculate the average of numbers in array, handling empty arrays and non-numeric values
function calculateAverage(numbers) {
  // Copilot will suggest implementation
}
```

### Chat Prompts
```
Use context variables:
- "@workspace find all API endpoints"
- "@terminal show recent errors"
- "#file:config.js explain this configuration"
```

### Agent Invocation
```
Structure requests for agents:
@agent-name I need you to [specific task] 
considering [context] and outputting [format]
```

## Quality Indicators

### Signs of a Good Prompt
✅ Specific and measurable outcome
✅ Clear constraints and requirements
✅ Relevant context provided
✅ Expected format defined
✅ Edge cases considered

### Signs of a Bad Prompt
❌ Vague or ambiguous
❌ Missing context
❌ No constraints
❌ Unclear expectations
❌ Too broad in scope

## Practice Exercises

### Exercise 1: Improve These Prompts
Before: "Make this better"
After: [Your improved version]

Before: "Add validation"
After: [Your improved version]

Before: "Fix the bug"
After: [Your improved version]

### Exercise 2: Create Prompts For
1. Generating comprehensive unit tests
2. Creating accessible UI components
3. Optimizing database queries
4. Writing technical documentation
5. Debugging production errors

## Troubleshooting

### If AI gives wrong output:
1. Add more specific constraints
2. Provide example of desired output
3. Break into smaller subtasks
4. Specify what NOT to do
5. Include relevant context files

### If AI is too verbose:
- Add "Be concise" to prompt
- Specify exact format (e.g., "respond in 3 bullet points")
- Ask for code only, no explanations

### If AI misses edge cases:
- List specific edge cases to handle
- Ask to "consider all edge cases including..."
- Request input validation explicitly

## Implementation

Use this skill when:
- Creating custom agents (write better instructions)
- Using Copilot chat (get better responses)
- Writing code comments (trigger better completions)
- Debugging issues (describe problems precisely)
- Learning new concepts (ask targeted questions)

## Examples in Practice

### Creating a Component
```
Poor: "Create a button component"

Good: "Create a reusable React button component with TypeScript that:
- Accepts variants: primary, secondary, danger
- Supports disabled state with visual feedback
- Handles onClick with proper TypeScript typing
- Includes loading state with spinner
- Is accessible (ARIA labels, keyboard nav)
- Exports as default with named props interface"
```

### Debugging
```
Poor: "This doesn't work"

Good: "This function should fetch user data but returns undefined.
Error in console: 'Cannot read property 'data' of undefined'
Function: [paste code]
Expected: Returns user object with id, name, email
Actual: undefined
Environment: Browser, async/await, fetch API"
```

### Refactoring
```
Poor: "Make this cleaner"

Good: "Refactor this class component to functional component:
- Convert lifecycle methods to hooks
- Use useState for local state
- Use useEffect for side effects
- Maintain same props interface
- Keep same functionality
- Add TypeScript types
- Follow React hooks best practices"
```

## Measuring Improvement

Track your prompt engineering skills:
- **First-attempt success rate**: How often AI gets it right first time
- **Iteration count**: How many refinements needed
- **Output quality**: Code that needs minimal edits
- **Time saved**: Faster than manual implementation
- **Learning rate**: Understanding increases with each prompt

## Resources

### Study These
- OpenAI Prompt Engineering Guide
- GitHub Copilot Best Practices
- Anthropic Claude Prompting Tips
- Prompt Engineering by Lilian Weng
- "The Prompt Engineering Book" (online)

### Practice Platforms
- Copilot chat (daily practice)
- Custom agent creation (weekly)
- Open-source contributions (monthly)
- Teaching others (best way to master)

Remember: Great prompts are specific, contextual, and iterative. The more you practice, the better your AI outputs become.
