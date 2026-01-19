#!/usr/bin/env node

/**
 * Results Page Generator - Creates beautiful HTML report of validator results
 */

const fs = require('fs');
const path = require('path');

class ResultsPageGenerator {
  constructor(results) {
    this.results = results;
  }

  generate() {
    const timestamp = new Date().toLocaleString();
    const passRate = ((this.results.passed / this.results.totalTests) * 100).toFixed(1);
    
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>THE ONE-THING Guardian Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            padding: 40px 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
        }

        .header {
            background: white;
            border-radius: 20px;
            padding: 40px;
            margin-bottom: 30px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            text-align: center;
        }

        .logo {
            font-size: 48px;
            font-weight: 900;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }

        .subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 20px;
        }

        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }

        .stat-card {
            background: white;
            border-radius: 15px;
            padding: 30px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.2);
            text-align: center;
        }

        .stat-number {
            font-size: 48px;
            font-weight: 900;
            margin-bottom: 10px;
        }

        .stat-number.success { color: #10b981; }
        .stat-number.warning { color: #f59e0b; }
        .stat-number.danger { color: #ef4444; }
        .stat-number.primary { color: #667eea; }

        .stat-label {
            font-size: 14px;
            color: #666;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        .validators-section {
            background: white;
            border-radius: 20px;
            padding: 40px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            margin-bottom: 30px;
        }

        .validators-title {
            font-size: 32px;
            font-weight: 900;
            margin-bottom: 30px;
            color: #1f2937;
        }

        .validator {
            margin-bottom: 40px;
            padding-bottom: 30px;
            border-bottom: 2px solid #f3f4f6;
        }

        .validator:last-child {
            border-bottom: none;
        }

        .validator-header {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
        }

        .validator-icon {
            font-size: 32px;
            margin-right: 15px;
        }

        .validator-name {
            font-size: 24px;
            font-weight: 700;
            color: #1f2937;
        }

        .test-item {
            display: flex;
            align-items: center;
            padding: 15px;
            margin-bottom: 10px;
            border-radius: 10px;
            background: #f9fafb;
            transition: all 0.3s;
        }

        .test-item:hover {
            transform: translateX(5px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

        .test-item.passed {
            border-left: 4px solid #10b981;
        }

        .test-item.failed {
            border-left: 4px solid #ef4444;
        }

        .test-status {
            font-size: 24px;
            margin-right: 15px;
        }

        .test-name {
            flex: 1;
            font-size: 16px;
            font-weight: 600;
            color: #374151;
        }

        .test-message {
            font-size: 14px;
            color: #6b7280;
            margin-left: 54px;
            margin-top: -10px;
            margin-bottom: 10px;
        }

        .health-badge {
            display: inline-block;
            padding: 10px 30px;
            border-radius: 50px;
            font-size: 18px;
            font-weight: 700;
            margin-top: 20px;
        }

        .health-excellent {
            background: #d1fae5;
            color: #065f46;
        }

        .health-good {
            background: #fed7aa;
            color: #92400e;
        }

        .health-poor {
            background: #fee2e2;
            color: #991b1b;
        }

        .timestamp {
            text-align: center;
            color: white;
            margin-top: 30px;
            font-size: 14px;
        }

        .progress-bar {
            width: 100%;
            height: 20px;
            background: #e5e7eb;
            border-radius: 10px;
            overflow: hidden;
            margin-top: 20px;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #10b981 0%, #059669 100%);
            transition: width 1s ease-out;
        }

        @media (max-width: 768px) {
            .stats-grid {
                grid-template-columns: 1fr 1fr;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🛡️ THE ONE-THING-FOR-ALL GUARDIAN</div>
            <div class="subtitle">Autonomous Robot for Organization Growth - System Validation Report</div>
            
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${passRate}%"></div>
            </div>
            
            <div class="health-badge ${this.getHealthClass(passRate)}">
                ${passRate}% Health - ${this.getHealthStatus(passRate)}
            </div>
        </div>

        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-number success">${this.results.passed}</div>
                <div class="stat-label">Tests Passed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number danger">${this.results.failed}</div>
                <div class="stat-label">Tests Failed</div>
            </div>
            <div class="stat-card">
                <div class="stat-number primary">${this.results.totalTests}</div>
                <div class="stat-label">Total Tests</div>
            </div>
            <div class="stat-card">
                <div class="stat-number warning">$0.00</div>
                <div class="stat-label">Cost (FREE)</div>
            </div>
        </div>

        <div class="validators-section">
            <h2 class="validators-title">Validator Results</h2>
            ${this.generateValidatorSections()}
        </div>

        <div class="timestamp">
            Generated on ${timestamp}<br>
            THE ONE-THING Guardian - Always Validating, Never Sleeping 🤖
        </div>
    </div>
</body>
</html>`;

    return html;
  }

  generateValidatorSections() {
    const validatorIcons = {
      'Quick Start Setup': '🚀',
      'MCP Servers': '🎭',
      'Integration Kit': '📦',
      '@arog Custom Agent': '🤖',
      'CLI Tools': '⚡',
      'Automation Toolkit': '🛠️'
    };

    let html = '';

    // Use actual validator results from guardian
    const validators = this.results.validators || [
      { name: 'Quick Start Setup', icon: '🚀', tests: [] },
      { name: 'MCP Servers', icon: '🎭', tests: [] },
      { name: 'Integration Kit', icon: '📦', tests: [] },
      { name: '@arog Custom Agent', icon: '🤖', tests: [] },
      { name: 'CLI Tools', icon: '⚡', tests: [] },
      { name: 'Automation Toolkit', icon: '🛠️', tests: [] }
    ];

    // Map validator names to icons
    const iconMap = {
      'Quick Start Setup': '🚀',
      'MCP Servers': '🎭',
      'Integration Kit': '📦',
      '@arog Custom Agent': '🤖',
      'CLI Tools': '⚡',
      'Automation Toolkit': '🛠️'
    };

    validators.forEach(validator => {
      const icon = validator.icon || iconMap[validator.name] || '🧪';
      html += `
            <div class="validator">
                <div class="validator-header">
                    <span class="validator-icon">${icon}</span>
                    <span class="validator-name">${validator.name}</span>
                </div>
                <div class="test-items">
                    ${this.generateTestItems(validator.tests)}
                </div>
            </div>`;
    });

    return html;
  }

  generateTestItems(tests) {
    if (!tests || tests.length === 0) {
      return '<div class="test-message">No tests found - validator may have been skipped</div>';
    }

    return tests.map(test => `
                    <div class="test-item ${test.passed ? 'passed' : 'failed'}">
                        <span class="test-status">${test.passed ? '✅' : '❌'}</span>
                        <span class="test-name">${test.name}</span>
                    </div>
                    ${test.message && !test.passed ? `<div class="test-message">${test.message}</div>` : ''}`
    ).join('');
  }

  getHealthClass(passRate) {
    if (passRate >= 90) return 'health-excellent';
    if (passRate >= 70) return 'health-good';
    return 'health-poor';
  }

  getHealthStatus(passRate) {
    if (passRate >= 90) return 'Excellent';
    if (passRate >= 70) return 'Good';
    return 'Needs Attention';
  }

  save(outputPath) {
    const html = this.generate();
    fs.writeFileSync(outputPath, html, 'utf8');
    return outputPath;
  }
}

module.exports = ResultsPageGenerator;
