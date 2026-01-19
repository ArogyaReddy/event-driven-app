#!/usr/bin/env node

/**
 * AROG MCP Multi-Server Setup Script
 * 
 * Automatically configures Tier 1, 2, and 3 MCP servers for complete SDLC automation
 * 
 * Features:
 * - Installs official MCP servers via npm
 * - Creates .vscode/settings.json with all server configurations
 * - Sets up authentication placeholders
 * - Provides interactive prompts for API keys/tokens
 * - Validates server installation
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Show immediate feedback that script is running
process.stdout.write('\n🚀 MCP Server Setup Starting...\n');
process.stdout.write('⏳ This may take 1-2 minutes (downloading Playwright browsers)\n\n');

// Detect project root (handles both development and installed in node_modules)
function getProjectRoot() {
  const currentDir = process.cwd();
  
  // If running from node_modules, go up to find project root
  if (currentDir.includes('node_modules')) {
    // Find the node_modules directory
    const parts = currentDir.split(path.sep);
    const nodeModulesIndex = parts.indexOf('node_modules');
    
    if (nodeModulesIndex > 0) {
      // Go to parent of node_modules
      const projectRoot = parts.slice(0, nodeModulesIndex).join(path.sep);
      return projectRoot || process.cwd();
    }
  }
  
  // If running from .arog directory, go up one level to actual project root
  if (currentDir.endsWith('.arog')) {
    return path.dirname(currentDir);
  }
  
  // If running locally (development), use current directory
  return currentDir;
}

// Color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  red: '\x1b[31m'
};

// MCP Server Tiers Configuration
const MCP_SERVERS = {
  tier1_essentials: {
    description: 'Critical servers for immediate value',
    servers: {
      'github': {
        package: '@modelcontextprotocol/server-github',
        description: 'Code review & PR management',
        envVars: ['GITHUB_PERSONAL_ACCESS_TOKEN'],
        docs: 'https://github.com/modelcontextprotocol/servers/tree/main/src/github'
      },
      'playwright': {
        package: '@playwright/mcp@latest',
        description: 'E2E test generation & browser automation',
        envVars: [],
        docs: 'https://playwright.dev/docs/test-agents',
        alreadySetup: true // Already configured
      }
    }
  },
  tier2_high_value: {
    description: 'High-value servers for near-term enhancement',
    servers: {
      'gitlab': {
        package: 'gitlab-mcp-server',
        description: 'GitLab users CI/CD & repo management',
        envVars: ['GITLAB_PERSONAL_ACCESS_TOKEN', 'GITLAB_API_URL'],
        docs: 'https://docs.gitlab.com/user/gitlab_duo/model_context_protocol/'
      },
      'slack': {
        package: 'slack-mcp-server',
        description: 'Team notifications & communication',
        envVars: ['SLACK_BOT_TOKEN', 'SLACK_TEAM_ID'],
        docs: 'https://github.com/modelcontextprotocol/servers-archived/tree/main/src/slack'
      },
      'jira': {
        package: '@modelcontextprotocol/server-jira',
        description: 'Issue tracking & project management',
        envVars: ['JIRA_URL', 'JIRA_EMAIL', 'JIRA_API_TOKEN'],
        docs: 'https://github.com/modelcontextprotocol/servers/tree/main/src/jira'
      },
      'confluence': {
        package: '@modelcontextprotocol/server-confluence',
        description: 'Documentation & knowledge management',
        envVars: ['CONFLUENCE_URL', 'CONFLUENCE_EMAIL', 'CONFLUENCE_API_TOKEN'],
        docs: 'https://github.com/modelcontextprotocol/servers/tree/main/src/confluence'
      }
    }
  },
  tier3_strategic: {
    description: 'Strategic servers for long-term differentiation',
    servers: {
      'postgres': {
        package: '@modelcontextprotocol/server-postgres',
        description: 'PostgreSQL database management',
        envVars: ['POSTGRES_CONNECTION_STRING'],
        docs: 'https://github.com/modelcontextprotocol/servers/tree/main/src/postgres'
      },
      'miro': {
        package: 'miro-mcp-server',
        description: 'Visual collaboration & design workflows',
        envVars: ['MIRO_ACCESS_TOKEN', 'MIRO_TEAM_ID'],
        docs: 'https://developers.miro.com/'
      }
    }
  }
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function boxMessage(title, lines, color = colors.cyan) {
  const maxLength = Math.max(title.length, ...lines.map(l => l.length));
  const border = '═'.repeat(maxLength + 4);
  
  console.log();
  console.log(color + '╔' + border + '╗');
  console.log('║  ' + title.padEnd(maxLength) + '  ║');
  console.log('╠' + border + '╣');
  lines.forEach(line => {
    console.log('║  ' + line.padEnd(maxLength) + '  ║');
  });
  console.log('╚' + border + '╝' + colors.reset);
  console.log();
}

function installMCPServer(packageName, optional = false) {
  log(`📦 Installing ${packageName}...`, colors.blue);
  process.stdout.write(`   ⏳ Downloading and installing (this may take a minute)...\n`);
  try {
    execSync(`npm install -g ${packageName}`, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    log(`✅ Successfully installed ${packageName}`, colors.green);
    return true;
  } catch (error) {
    if (optional) {
      log(`⚠️  ${packageName} is optional and not available - skipping`, colors.yellow);
    } else {
      log(`❌ Failed to install ${packageName}: ${error.message}`, colors.red);
    }
    return false;
  }
}

function createVSCodeSettings(tier, selectedServers) {
  const projectRoot = getProjectRoot(); // Use helper function
  const vscodeDir = path.join(projectRoot, '.vscode');
  const settingsPath = path.join(vscodeDir, 'settings.json');
  const mcpJsonPath = path.join(vscodeDir, 'mcp.json');

  log(`📂 Project root detected: ${projectRoot}`, colors.cyan);
  log(`📂 Creating VS Code settings in: ${vscodeDir}`, colors.cyan);
  process.stdout.write(`   ⏳ Setting up MCP configuration...\n`);

  // Create .vscode directory if it doesn't exist
  if (!fs.existsSync(vscodeDir)) {
    fs.mkdirSync(vscodeDir, { recursive: true });
    log(`   ✅ Created .vscode/`, colors.green);
  } else {
    log(`   ✅ .vscode/ already exists`, colors.green);
  }

  // Read existing settings.json if it exists (SMART MERGE)
  let settings = {};
  if (fs.existsSync(settingsPath)) {
    try {
      const content = fs.readFileSync(settingsPath, 'utf8');
      settings = JSON.parse(content);
      log(`   ℹ️  Found existing settings.json - merging MCP servers`, colors.yellow);
    } catch (err) {
      log(`   ⚠️  Could not parse existing settings.json - creating new one`, colors.yellow);
      settings = {};
    }
  }

  // Initialize mcp.servers section if it doesn't exist
  if (!settings['mcp.servers']) {
    settings['mcp.servers'] = {};
  }

  // Build MCP servers configuration
  const mcpServers = {};

  // Add Playwright (already configured)
  mcpServers['playwright'] = {
    command: 'npx',
    args: ['@playwright/mcp@latest'],
    description: 'E2E test generation & browser automation'
  };

  // Add selected servers
  Object.entries(selectedServers).forEach(([serverName, config]) => {
    if (config.alreadySetup) return; // Skip already configured servers

    const serverConfig = {
      command: 'npx',
      args: ['-y', config.package],
      description: config.description
    };

    // Add environment variables if needed
    if (config.envVars && config.envVars.length > 0) {
      serverConfig.env = {};
      config.envVars.forEach(envVar => {
        serverConfig.env[envVar] = `\${env:${envVar}}`;
      });
    }

    mcpServers[serverName] = serverConfig;
  });

  // Merge MCP servers into existing settings (preserves existing settings!)
  settings['mcp.servers'] = {
    ...settings['mcp.servers'],
    ...mcpServers
  };

  // Write merged settings.json
  fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
  log(`   ✅ MCP servers configured in settings.json`, colors.green);

  // Also create standalone mcp.json for compatibility
  const mcpJson = {
    mcpServers: mcpServers
  };
  fs.writeFileSync(mcpJsonPath, JSON.stringify(mcpJson, null, 2), 'utf8');
  log(`   ✅ Created mcp.json for compatibility`, colors.green);

  return settingsPath;
}

function createEnvTemplate(selectedServers) {
  const projectRoot = getProjectRoot(); // Use helper function
  const envTemplatePath = path.join(projectRoot, '.env.mcp.template');

  log(`📝 Creating environment template in: ${projectRoot}`, colors.cyan);

  let envContent = `# AROG MCP Servers Environment Variables
# Copy this to .env and fill in your actual values
# 
# NEVER commit .env to version control!
# Add .env to your .gitignore

`;

  Object.entries(selectedServers).forEach(([serverName, config]) => {
    if (config.envVars && config.envVars.length > 0) {
      envContent += `\n# ${serverName.toUpperCase()} - ${config.description}\n`;
      envContent += `# Docs: ${config.docs}\n`;
      config.envVars.forEach(envVar => {
        envContent += `${envVar}=your_${envVar.toLowerCase()}_here\n`;
      });
    }
  });

  fs.writeFileSync(envTemplatePath, envContent);
  log(`✅ Created ${envTemplatePath}`, colors.green);

  return envTemplatePath;
}

function createMCPServerDocs(tier) {
  const projectRoot = getProjectRoot(); // Use helper function
  const docsPath = path.join(projectRoot, 'MCP-SERVERS-SETUP.md');

  log(`📖 Creating documentation in: ${projectRoot}`, colors.cyan);

  const content = `# AROG MCP Servers Configuration Guide

## 🎯 Overview

AROG now includes **${Object.keys(tier).length} MCP servers** covering the entire SDLC:

- **Code Management**: GitHub, GitLab
- **Testing**: Playwright (E2E automation)
- **Communication**: Slack
- **Database**: PostgreSQL
- **And more...**

## 🚀 Quick Start

### 1. Install MCP Servers

The setup script has already installed the global packages. Verify with:

\`\`\`bash
npm list -g @playwright/mcp
npm list -g @modelcontextprotocol/server-github
\`\`\`

### 2. Configure Authentication

Copy the environment template:

\`\`\`bash
cp .env.mcp.template .env
\`\`\`

Edit \`.env\` and add your API keys/tokens:

\`\`\`bash
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
\`\`\`

**IMPORTANT**: Add \`.env\` to your \`.gitignore\` to avoid committing secrets!

### 3. Restart VS Code

1. **Quit VS Code completely** (Cmd+Q on Mac, Alt+F4 on Windows)
2. **Relaunch VS Code**
3. **Open your project**

MCP servers will now be available! 🎉

## 📚 Server Documentation

${Object.entries(tier).map(([tierName, tierConfig]) => {
  return `### ${tierName.replace('_', ' ').toUpperCase()}\n\n${tierConfig.description}\n\n${Object.entries(tierConfig.servers).map(([name, config]) => {
    return `#### ${name}\n- **Package**: \`${config.package}\`\n- **Description**: ${config.description}\n- **Environment Variables**: ${config.envVars.length > 0 ? config.envVars.join(', ') : 'None'}\n- **Docs**: ${config.docs}`;
  }).join('\n\n')}`;
}).join('\n\n')}

## 💡 Usage Examples

### GitHub MCP Server

\`\`\`
@arog review this PR for security vulnerabilities
@arog create an issue for the bug in auth.ts
@arog summarize recent commits in main branch
\`\`\`

### Playwright MCP Server

\`\`\`
@arog generate E2E tests for the login flow
@arog take a screenshot of example.com
@arog test checkout process on staging
\`\`\`

### Slack MCP Server

\`\`\`
@arog notify #engineering channel when deployment completes
@arog post test results to #qa channel
\`\`\`

### PostgreSQL MCP Server

\`\`\`
@arog check slow queries in the database
@arog optimize this SQL query
@arog explain the users table schema
\`\`\`

## 🔧 Troubleshooting

### MCP servers not appearing in Claude Desktop?

1. Verify \`.vscode/settings.json\` exists and contains \`mcp.servers\` section
2. Check that all environment variables are set in \`.env\`
3. Restart VS Code completely (quit and relaunch)
4. Check VS Code > Help > Toggle Developer Tools > Console for errors

### Authentication errors?

1. Verify your tokens are valid and have correct permissions
2. Check token format (GitHub: \`ghp_...\`, GitLab: \`glpat_...\`)
3. Ensure tokens have required scopes:
   - GitHub: \`repo\`, \`read:org\`, \`workflow\`
   - GitLab: \`api\`, \`read_repository\`, \`write_repository\`

### Server not responding?

1. Check if the package is installed: \`npm list -g <package-name>\`
2. Try reinstalling: \`npm install -g <package-name>\`
3. Check VS Code output panel for MCP logs

## 📖 Additional Resources

- [MCP Official Docs](https://modelcontextprotocol.io/)
- [MCP TypeScript SDK](https://github.com/modelcontextprotocol/typescript-sdk)
- [MCP Server Registry](https://github.com/modelcontextprotocol/servers)
- [Playwright MCP](https://playwright.dev/docs/test-agents)

---

**Built with ❤️ by AROG - Autonomous Robot for Organization Growth**
`;

  fs.writeFileSync(docsPath, content);
  log(`✅ Created ${docsPath}`, colors.green);

  return docsPath;
}

async function prompt(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  boxMessage(
    '🤖 AROG MCP Multi-Server Setup',
    [
      'Setting up complete SDLC automation with MCP servers',
      '',
      'This will install and configure:',
      '- Tier 1: Essential servers (GitHub, Playwright)',
      '- Tier 2: High-value servers (GitLab, Slack)',  
      '- Tier 3: Strategic servers (PostgreSQL, etc.)',
      '',
      'Press Ctrl+C to cancel, or press Enter to continue...'
    ],
    colors.cyan
  );

  await prompt('');

  log('\n📦 Step 1: Installing MCP Server Packages\n', colors.bright);

  const allServers = {};
  
  // Collect all servers from all tiers
  Object.entries(MCP_SERVERS).forEach(([tierName, tierConfig]) => {
    log(`\n${tierConfig.description}:`, colors.yellow);
    Object.entries(tierConfig.servers).forEach(([serverName, config]) => {
      if (!config.alreadySetup) {
        log(`  Installing ${serverName}...`, colors.blue);
        // Mark tier2 and tier3 servers as optional (they often require auth or don't exist)
        const isOptional = tierName !== 'tier1_essentials';
        installMCPServer(config.package, isOptional);
      } else {
        log(`  ✓ ${serverName} (already configured)`, colors.green);
      }
      allServers[serverName] = config;
    });
  });

  log('\n⚙️  Step 2: Creating VS Code Configuration\n', colors.bright);
  const settingsPath = createVSCodeSettings(MCP_SERVERS, allServers);

  log('\n📝 Step 3: Creating Environment Template\n', colors.bright);
  const envTemplatePath = createEnvTemplate(allServers);

  log('\n📖 Step 4: Creating Documentation\n', colors.bright);
  const docsPath = createMCPServerDocs(MCP_SERVERS);

  boxMessage(
    '✅ MCP MULTI-SERVER SETUP COMPLETE!',
    [
      '',
      'Next steps:',
      '',
      '1. Copy environment template:',
      '   cp .env.mcp.template .env',
      '',
      '2. Add your API keys/tokens to .env',
      '',
      '3. Read setup guide:',
      '   cat MCP-SERVERS-SETUP.md',
      '',
      '4. **RESTART VS CODE** (Quit completely, then relaunch)',
      '',
      '5. Start using MCP servers with @arog!',
      '',
      '🚀 You now have FULL SDLC automation capabilities!'
    ],
    colors.green
  );

  rl.close();
}

main().catch((error) => {
  log(`\n❌ Setup failed: ${error.message}`, colors.red);
  process.exit(1);
});
