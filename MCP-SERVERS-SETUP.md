# AROG MCP Servers Configuration Guide

## 🎯 Overview

AROG now includes **3 MCP servers** covering the entire SDLC:

- **Code Management**: GitHub, GitLab
- **Testing**: Playwright (E2E automation)
- **Communication**: Slack
- **Database**: PostgreSQL
- **And more...**

## 🚀 Quick Start

### 1. Install MCP Servers

The setup script has already installed the global packages. Verify with:

```bash
npm list -g @playwright/mcp
npm list -g @modelcontextprotocol/server-github
```

### 2. Configure Authentication

Copy the environment template:

```bash
cp .env.mcp.template .env
```

Edit `.env` and add your API keys/tokens:

```bash
# GitHub
GITHUB_PERSONAL_ACCESS_TOKEN=ghp_your_token_here

# GitLab (if using)
GITLAB_PERSONAL_ACCESS_TOKEN=glpat_your_token_here
GITLAB_API_URL=https://gitlab.com/api/v4

# Slack (if using)
SLACK_BOT_TOKEN=xoxb-your-token-here
SLACK_TEAM_ID=T01234567

# PostgreSQL (if using)
POSTGRES_CONNECTION_STRING=postgresql://user:pass@localhost:5432/db
```

**IMPORTANT**: Add `.env` to your `.gitignore` to avoid committing secrets!

### 3. Restart VS Code

1. **Quit VS Code completely** (Cmd+Q on Mac, Alt+F4 on Windows)
2. **Relaunch VS Code**
3. **Open your project**

MCP servers will now be available! 🎉

## 📚 Server Documentation

### TIER1 ESSENTIALS

Critical servers for immediate value

#### github
- **Package**: `@modelcontextprotocol/server-github`
- **Description**: Code review & PR management
- **Environment Variables**: GITHUB_PERSONAL_ACCESS_TOKEN
- **Docs**: https://github.com/modelcontextprotocol/servers/tree/main/src/github

#### playwright
- **Package**: `@playwright/mcp@latest`
- **Description**: E2E test generation & browser automation
- **Environment Variables**: None
- **Docs**: https://playwright.dev/docs/test-agents

### TIER2 HIGH_VALUE

High-value servers for near-term enhancement

#### gitlab
- **Package**: `gitlab-mcp-server`
- **Description**: GitLab users CI/CD & repo management
- **Environment Variables**: GITLAB_PERSONAL_ACCESS_TOKEN, GITLAB_API_URL
- **Docs**: https://docs.gitlab.com/user/gitlab_duo/model_context_protocol/

#### slack
- **Package**: `slack-mcp-server`
- **Description**: Team notifications & communication
- **Environment Variables**: SLACK_BOT_TOKEN, SLACK_TEAM_ID
- **Docs**: https://github.com/modelcontextprotocol/servers-archived/tree/main/src/slack

#### jira
- **Package**: `@modelcontextprotocol/server-jira`
- **Description**: Issue tracking & project management
- **Environment Variables**: JIRA_URL, JIRA_EMAIL, JIRA_API_TOKEN
- **Docs**: https://github.com/modelcontextprotocol/servers/tree/main/src/jira

#### confluence
- **Package**: `@modelcontextprotocol/server-confluence`
- **Description**: Documentation & knowledge management
- **Environment Variables**: CONFLUENCE_URL, CONFLUENCE_EMAIL, CONFLUENCE_API_TOKEN
- **Docs**: https://github.com/modelcontextprotocol/servers/tree/main/src/confluence

### TIER3 STRATEGIC

Strategic servers for long-term differentiation

#### postgres
- **Package**: `@modelcontextprotocol/server-postgres`
- **Description**: PostgreSQL database management
- **Environment Variables**: POSTGRES_CONNECTION_STRING
- **Docs**: https://github.com/modelcontextprotocol/servers/tree/main/src/postgres

#### miro
- **Package**: `miro-mcp-server`
- **Description**: Visual collaboration & design workflows
- **Environment Variables**: MIRO_ACCESS_TOKEN, MIRO_TEAM_ID
- **Docs**: https://developers.miro.com/

## 💡 Usage Examples

### GitHub MCP Server

```
@arog review this PR for security vulnerabilities
@arog create an issue for the bug in auth.ts
@arog summarize recent commits in main branch
```

### Playwright MCP Server

```
@arog generate E2E tests for the login flow
@arog take a screenshot of example.com
@arog test checkout process on staging
```

### Slack MCP Server

```
@arog notify #engineering channel when deployment completes
@arog post test results to #qa channel
```

### PostgreSQL MCP Server

```
@arog check slow queries in the database
@arog optimize this SQL query
@arog explain the users table schema
```

## 🔧 Troubleshooting

### MCP servers not appearing in Claude Desktop?

1. Verify `.vscode/settings.json` exists and contains `mcp.servers` section
2. Check that all environment variables are set in `.env`
3. Restart VS Code completely (quit and relaunch)
4. Check VS Code > Help > Toggle Developer Tools > Console for errors

### Authentication errors?

1. Verify your tokens are valid and have correct permissions
2. Check token format (GitHub: `ghp_...`, GitLab: `glpat_...`)
3. Ensure tokens have required scopes:
   - GitHub: `repo`, `read:org`, `workflow`
   - GitLab: `api`, `read_repository`, `write_repository`

### Server not responding?

1. Check if the package is installed: `npm list -g <package-name>`
2. Try reinstalling: `npm install -g <package-name>`
3. Check VS Code output panel for MCP logs

## 📖 Additional Resources

- [MCP Official Docs](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Server Registry](https://github.com/modelcontextprotocol/servers)
- [Playwright MCP](https://playwright.dev/docs/test-agents)

---

**Built with ❤️ by AROG - Autonomous Robot for Organization Growth**
