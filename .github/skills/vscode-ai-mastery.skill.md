# VS Code AI Mastery

## Description
Master VS Code's AI capabilities, extensions, and workflows to become a 10x developer with GitHub Copilot and other AI tools.

## Essential Extensions for AI Development

### AI Assistants
1. **GitHub Copilot** (Required)
   - ID: `GitHub.copilot`
   - Features: Code completion, chat, agents
   - Shortcut: `Cmd+I` (inline chat), `Cmd+Shift+I` (chat panel)

2. **GitHub Copilot Chat** (Required)
   - ID: `GitHub.copilot-chat`
   - Features: Conversational coding, explanations
   - Slash commands: /explain, /fix, /tests, /doc

3. **Continue** (Alternative AI)
   - ID: `Continue.continue`
   - Features: Multiple AI models, custom prompts
   - Use: Open-source alternative/complement

### Code Quality
4. **Error Lens**
   - ID: `usernamehw.errorlens`
   - Shows errors inline as you type

5. **Code Spell Checker**
   - ID: `streetsidesoftware.code-spell-checker`
   - Catch typos before Copilot learns them

6. **ESLint**
   - ID: `dbaeumer.vscode-eslint`
   - AI-powered linting suggestions

### Productivity
7. **Project Manager**
   - ID: `alefragnani.project-manager`
   - Switch between projects quickly

8. **GitLens**
   - ID: `eamodio.gitlens`
   - Git supercharged, AI commit messages

9. **Thunder Client** (API Testing)
   - ID: `rangav.vscode-thunder-client`
   - Test APIs without leaving VS Code

### JavaScript/Web Development
10. **ES7+ React/Redux Snippets**
    - ID: `dsznajder.es7-react-js-snippets`
    - Combined with Copilot = Super fast

11. **Live Server**
    - ID: `ritwickdey.LiveServer`
    - Instant preview of HTML/JS changes

## Keyboard Shortcuts Mastery

### Copilot Shortcuts (macOS)
```
Cmd+I              → Inline chat (edit code in place)
Cmd+Shift+I        → Open chat panel
Tab                → Accept suggestion
Opt+]              → Next suggestion
Opt+[              → Previous suggestion
Esc                → Dismiss suggestion
Cmd+Shift+P        → Command palette (type "Copilot")
```

### Essential VS Code Shortcuts
```
Cmd+P              → Quick file open
Cmd+Shift+P        → Command palette
Cmd+B              → Toggle sidebar
Cmd+J              → Toggle terminal
Cmd+\              → Split editor
Cmd+W              → Close tab
Cmd+K Cmd+S        → Keyboard shortcuts reference
Cmd+/              → Toggle comment
Cmd+D              → Select next occurrence
Cmd+Shift+L        → Select all occurrences
Opt+Up/Down        → Move line up/down
Opt+Shift+Up/Down  → Copy line up/down
Cmd+Shift+K        → Delete line
```

### Multi-Cursor Magic
```
Opt+Click          → Add cursor
Cmd+Opt+Up/Down    → Add cursor above/below
Cmd+Shift+L        → Add cursors to all selections
```

## Copilot Chat Commands

### Built-in Slash Commands
```
/explain          → Explain selected code
/fix              → Fix problems in code
/tests            → Generate tests
/doc              → Add documentation
/optimize         → Suggest optimizations
/clear            → Clear chat history
```

### Context Variables
```
@workspace        → Reference entire workspace
@terminal         → Reference terminal output
@vscode           → Ask about VS Code features
#file:path        → Reference specific file
#selection        → Reference selected code
```

### Example Prompts
```
@workspace How is authentication implemented?
@terminal What does this error mean?
/tests for the validateEmail function
#file:config.js Explain this configuration
/fix this async function, avoid race conditions
```

## Custom Agent Setup

### Using Your New Agents
1. Place `.agent.md` files in workspace
2. Reference with `@` in chat
3. Example: `@ai-mastery-mentor What should I learn today?`

### Agent Locations
```
workarea/
  ai-mastery-mentor.agent.md      (Learning guide)
  copilot-agent-builder.agent.md   (Agent creator)
  project-accelerator.agent.md     (Implementation)
```

## Copilot Settings Optimization

### Access Settings
```
Cmd+, → Search "copilot"
```

### Recommended Settings
```json
{
  "github.copilot.enable": {
    "*": true,
    "markdown": true,
    "plaintext": false
  },
  "github.copilot.editor.enableAutoCompletions": true,
  "editor.inlineSuggest.enabled": true,
  "editor.quickSuggestions": {
    "comments": "on",
    "strings": "on",
    "other": "on"
  }
}
```

## Workspace Setup for AI Development

### Folder Structure
```
your-project/
  .github/
    copilot-instructions.md    (Custom instructions)
  .vscode/
    settings.json              (Project settings)
    extensions.json            (Recommended extensions)
  workarea/                    (Practice/experiments)
  src/                         (Source code)
  tests/                       (Test files)
```

### Custom Instructions
Create `.github/copilot-instructions.md`:
```markdown
# Project Guidelines

## Code Style
- Use ES6+ features
- Prefer const over let
- Use async/await over promises

## Testing
- Write tests for all functions
- Use Jest syntax
- Aim for 80% coverage

## Documentation
- JSDoc for all functions
- README for each module
```

## Workflows with AI

### Morning Setup
```
1. Open VS Code
2. Cmd+P → Recent project
3. Cmd+Shift+I → Ask Copilot: "What did I work on yesterday?"
4. Review suggestions, plan today
```

### Development Flow
```
1. Write comment describing feature
2. Let Copilot suggest implementation
3. Review and refine
4. Cmd+I → "Add error handling"
5. /tests → Generate tests
6. Run tests in terminal
```

### Code Review Flow
```
1. Select code block
2. Cmd+I → "Review this for issues"
3. /optimize → Get improvements
4. /doc → Add documentation
5. Commit with AI-generated message
```

### Debugging Flow
```
1. Copy error from terminal
2. @terminal What's wrong?
3. Get suggestions
4. Implement fix
5. /tests to prevent regression
```

## Advanced Features

### Copilot for Documentation
```javascript
/**
 * [Describe function, let Copilot complete JSDoc]
 */
function complexFunction(params) {
  // Copilot suggests full documentation
}
```

### Copilot for Testing
```javascript
// Write test for: calculateTotalPrice with discount
// Copilot suggests complete test suite
```

### Copilot for Refactoring
```javascript
// Select old code
// Cmd+I → "Refactor to use modern JavaScript"
// Review changes
```

## Performance Tips

### Make Copilot Faster
1. Close unused files (less context to process)
2. Use specific comments (clearer intent)
3. Accept/reject quickly (trains model)
4. Use slash commands (optimized paths)

### Optimize VS Code
```json
{
  "files.autoSave": "onFocusChange",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  }
}
```

## Troubleshooting

### Copilot Not Working?
1. Check status bar (should show Copilot icon)
2. Cmd+Shift+P → "Copilot: Sign In"
3. Verify subscription: https://github.com/settings/copilot
4. Restart VS Code
5. Check network/firewall

### Bad Suggestions?
1. Write more descriptive comments
2. Provide more context (surrounding code)
3. Use specific variable names
4. Try rephrasing comment
5. Use chat for complex logic

### Performance Issues?
1. Disable unused extensions
2. Clear editor cache
3. Update VS Code
4. Restart VS Code
5. Check CPU/memory usage

## Learning Resources

### Official Docs
- VS Code Docs: https://code.visualstudio.com/docs
- Copilot Docs: https://docs.github.com/copilot
- VS Code Tips: https://code.visualstudio.com/docs/getstarted/tips-and-tricks

### Video Tutorials
- VS Code YouTube channel
- GitHub Copilot quick starts
- Community tutorials on YouTube

### Practice
- VS Code Playground (Help → Welcome → Interactive Playground)
- GitHub Skills: Copilot course
- Daily coding with Copilot enabled

## Measuring Mastery

### Beginner → Intermediate
- [ ] Use Copilot for basic completions
- [ ] Know 10+ keyboard shortcuts
- [ ] Use chat for explanations
- [ ] Install essential extensions
- [ ] Configure workspace settings

### Intermediate → Advanced
- [ ] Create custom agents
- [ ] Use all slash commands effectively
- [ ] Optimize Copilot settings
- [ ] Build custom workflows
- [ ] Contribute to agent community

### Advanced → Expert
- [ ] Build VS Code extensions
- [ ] Create MCP servers
- [ ] Share custom agents publicly
- [ ] Teach others AI-powered development
- [ ] 10x productivity improvement

## Daily Practice

### Week 1: Foundations
- Day 1-2: Learn keyboard shortcuts
- Day 3-4: Master Copilot chat
- Day 5-7: Try all slash commands

### Week 2: Optimization
- Day 1-3: Configure settings
- Day 4-5: Install & configure extensions
- Day 6-7: Create custom instructions

### Week 3: Advanced
- Day 1-3: Create custom agent
- Day 4-5: Build workflow automation
- Day 6-7: Share and get feedback

## Quick Reference Card

```
COPILOT COMMANDS          SHORTCUT
─────────────────────────────────────
Inline Chat               Cmd+I
Chat Panel                Cmd+Shift+I
Accept Suggestion         Tab
Next Suggestion           Opt+]
Explain Code              /explain
Generate Tests            /tests
Fix Issues                /fix

VS CODE ESSENTIALS        SHORTCUT
─────────────────────────────────────
Command Palette           Cmd+Shift+P
Quick Open                Cmd+P
Toggle Terminal           Cmd+J
Toggle Sidebar            Cmd+B
Multi-cursor              Opt+Click
```

Remember: VS Code mastery + AI tools = Unstoppable developer. Practice these daily until they become muscle memory.
