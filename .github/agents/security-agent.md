# 🔒 Security Audit Agent

## Purpose
Comprehensive security analysis covering OWASP Top 10, dependency vulnerabilities, secret exposure, and security best practices.

## Capabilities

### 1. Vulnerability Detection
- SQL Injection risks
- Cross-Site Scripting (XSS)
- Cross-Site Request Forgery (CSRF)
- Authentication/Authorization flaws
- Insecure deserialization

### 2. Dependency Security
- Known CVE vulnerabilities
- Outdated packages
- License compliance
- Supply chain attacks

### 3. Secret Scanning
- API keys in code
- Passwords and tokens
- Private keys
- Database credentials

### 4. Configuration Security
- Insecure defaults
- Missing security headers
- CORS misconfigurations
- SSL/TLS issues

### 5. Code Security
- Insecure random number generation
- Weak cryptography
- Path traversal vulnerabilities
- Command injection risks

## Activation

```bash
# Full security audit
arog-cli agent run security-agent

# Specific checks
arog-cli agent run security-agent --owasp-top-10
arog-cli agent run security-agent --secrets
arog-cli agent run security-agent --dependencies
```

## Configuration

```json
{
  "agent": "security-agent",
  "settings": {
    "severity_threshold": "medium",
    "fail_on": ["critical", "high"],
    "ignore_patterns": ["test/**", "*.test.js"],
    "check_dependencies": true,
    "scan_git_history": true,
    "compliance": ["OWASP", "CWE", "PCI-DSS"]
  }
}
```

## OWASP Top 10 Coverage

### 1. A01:2021 - Broken Access Control
- ✅ Check authorization on all endpoints
- ✅ Verify role-based access control
- ✅ Test for privilege escalation

### 2. A02:2021 - Cryptographic Failures
- ✅ Check for weak encryption
- ✅ Verify secure password hashing
- ✅ Check TLS configuration

### 3. A03:2021 - Injection
- ✅ SQL injection detection
- ✅ NoSQL injection detection
- ✅ Command injection detection
- ✅ LDAP injection detection

### 4. A04:2021 - Insecure Design
- ✅ Review security architecture
- ✅ Check rate limiting
- ✅ Verify input validation

### 5. A05:2021 - Security Misconfiguration
- ✅ Check default credentials
- ✅ Verify security headers
- ✅ Review error messages

### 6. A06:2021 - Vulnerable Components
- ✅ Check for known CVEs
- ✅ Verify dependency versions
- ✅ License compliance

### 7. A07:2021 - Authentication Failures
- ✅ Check password policies
- ✅ Verify MFA implementation
- ✅ Check session management

### 8. A08:2021 - Software and Data Integrity
- ✅ Verify code signing
- ✅ Check CI/CD security
- ✅ Review update mechanisms

### 9. A09:2021 - Security Logging Failures
- ✅ Check audit logging
- ✅ Verify log protection
- ✅ Review monitoring

### 10. A10:2021 - Server-Side Request Forgery
- ✅ Check URL validation
- ✅ Verify allowlist implementation
- ✅ Test SSRF vectors

## Sample Output

```markdown
## Security Audit Report

### 🔴 CRITICAL (2)

1. **Hardcoded API Key** (SEVERITY: CRITICAL)
   - File: src/config/api.js:12
   - Issue: Exposed production API key
   - Risk: Complete system compromise
   - Fix: Move to environment variables
   ```javascript
   // ❌ INSECURE
   const API_KEY = 'sk_live_abc123xyz789';
   
   // ✅ SECURE
   const API_KEY = process.env.API_KEY;
   ```

2. **SQL Injection Vulnerability** (SEVERITY: CRITICAL)
   - File: src/db/queries.js:45
   - Issue: Unsanitized user input in query
   - Risk: Database breach, data theft
   - Fix: Use parameterized queries
   ```javascript
   // ❌ VULNERABLE
   const query = `SELECT * FROM users WHERE id = ${userId}`;
   
   // ✅ SECURE
   const query = 'SELECT * FROM users WHERE id = ?';
   db.query(query, [userId]);
   ```

### 🟠 HIGH (5)

1. **Missing CSRF Protection** (src/routes/api.js:78)
   - Endpoints missing CSRF tokens
   - Fix: Implement CSRF middleware
   
2. **Weak Password Hashing** (src/auth/password.js:23)
   - Using MD5 (deprecated)
   - Fix: Use bcrypt or Argon2

3. **Missing Rate Limiting** (src/routes/auth.js:15)
   - Login endpoint vulnerable to brute force
   - Fix: Implement express-rate-limit

4. **Insecure Direct Object Reference** (src/routes/user.js:92)
   - No authorization check
   - Fix: Verify user owns resource

5. **Missing Security Headers** (server.js)
   - No helmet.js middleware
   - Fix: Add security headers

### 🟡 MEDIUM (8)

1. **Outdated Dependencies** (package.json)
   - 12 packages with known vulnerabilities
   - Fix: Run npm audit fix

2. **Insufficient Logging** (src/auth/login.js)
   - Failed login attempts not logged
   - Fix: Add security event logging

### ✅ Passed Checks (45)

- ✓ No exposed secrets in git history
- ✓ HTTPS enforced
- ✓ Secure session configuration
- ✓ Input validation present
- ✓ XSS protection enabled

### 📊 Security Score: 72/100

| Category | Score | Status |
|----------|-------|--------|
| Authentication | 85/100 | 🟢 Good |
| Authorization | 65/100 | 🟡 Needs Work |
| Data Protection | 90/100 | 🟢 Excellent |
| Input Validation | 70/100 | 🟡 Needs Work |
| Dependencies | 55/100 | 🔴 Critical |

### 🔧 Automated Fixes Available

Run: `arog-cli security fix --auto`

Will fix:
- Update vulnerable dependencies
- Add security headers
- Fix weak crypto usage
- Implement rate limiting

### 📋 Compliance Report

- ✅ OWASP Top 10: 80% compliant
- ⚠️ PCI-DSS: Requires fixes (crypto, logging)
- ✅ GDPR: Data protection adequate
- ⚠️ SOC 2: Needs logging improvements
```

## Integration

Works with:
- Snyk for dependency scanning
- OWASP ZAP for penetration testing
- SonarQube for code analysis
- Trivy for container scanning
- git-secrets for secret detection
