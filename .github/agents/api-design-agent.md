# 🔌 API Design Agent

## Purpose
Design, analyze, and optimize RESTful APIs following best practices, OpenAPI standards, and industry conventions.

## Capabilities

### 1. API Design Review
- RESTful principles compliance
- Resource naming conventions
- HTTP method usage
- Status code appropriateness
- Versioning strategy

### 2. OpenAPI Specification
- Auto-generate OpenAPI 3.0 specs
- Validate existing specs
- Generate from code
- Sync code with specs

### 3. API Documentation
- Endpoint descriptions
- Request/response schemas
- Authentication docs
- Example requests/responses
- Error documentation

### 4. API Optimization
- Reduce over-fetching
- Implement pagination
- Add filtering/sorting
- Optimize response sizes
- Caching strategies

### 5. Security Review
- Authentication implementation
- Authorization patterns
- Rate limiting
- Input validation
- CORS configuration

## Activation

```bash
# Full API design review
arog-cli agent run api-design-agent

# Generate OpenAPI spec
arog-cli agent run api-design-agent --generate-spec

# Validate existing API
arog-cli agent run api-design-agent --validate
```

## Configuration

```json
{
  "agent": "api-design-agent",
  "settings": {
    "rest_level": "strict",
    "openapi_version": "3.0.3",
    "authentication": ["JWT", "OAuth2"],
    "versioning": "url",
    "pagination": "cursor",
    "rate_limiting": true,
    "compression": true
  }
}
```

## REST Best Practices

### 1. Resource Naming
```javascript
// ❌ WRONG
GET /getUsers
POST /createUser
GET /user_orders

// ✅ CORRECT
GET /users
POST /users
GET /users/:id/orders
```

### 2. HTTP Methods
```javascript
// ❌ WRONG
POST /users/delete/:id
GET /users/create

// ✅ CORRECT
DELETE /users/:id
POST /users
```

### 3. Status Codes
```javascript
// ❌ WRONG
app.post('/users', (req, res) => {
  if (userExists) {
    res.status(200).json({ error: 'User exists' });
  }
});

// ✅ CORRECT
app.post('/users', (req, res) => {
  if (userExists) {
    res.status(409).json({ 
      error: 'Conflict',
      message: 'User already exists'
    });
  }
});
```

### 4. Versioning
```javascript
// ✅ RECOMMENDED OPTIONS

// URL versioning
GET /api/v1/users
GET /api/v2/users

// Header versioning
GET /api/users
Headers: { 'API-Version': 'v1' }

// Media type versioning
GET /api/users
Headers: { 'Accept': 'application/vnd.api.v1+json' }
```

### 5. Pagination
```javascript
// ❌ WRONG (offset pagination - inconsistent with updates)
GET /users?page=2&limit=20

// ✅ BETTER (cursor pagination - consistent)
GET /users?cursor=abc123&limit=20

Response:
{
  "data": [...],
  "pagination": {
    "next_cursor": "xyz789",
    "has_more": true
  }
}
```

## Sample Output

```markdown
## API Design Analysis Report

### 📊 API Overview

- Total Endpoints: 45
- RESTful Compliance: 78%
- OpenAPI Coverage: 65%
- Authentication: JWT
- Rate Limiting: ✅ Enabled

### 🔴 Critical Issues (3)

1. **Non-RESTful Endpoint Design**
   - Endpoint: POST /getUserByEmail
   - Issue: RPC-style naming
   - Fix: GET /users?email={email}
   - Impact: API inconsistency

2. **Missing Rate Limiting**
   - Endpoints: /auth/login, /auth/register
   - Issue: Vulnerable to brute force
   - Fix: Implement express-rate-limit
   ```javascript
   const rateLimit = require('express-rate-limit');
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutes
     max: 5 // 5 requests per window
   });
   app.use('/auth', limiter);
   ```

3. **Inconsistent Error Responses**
   - Issue: Multiple error formats
   - Fix: Standardize error schema
   ```javascript
   {
     "error": {
       "code": "VALIDATION_ERROR",
       "message": "Invalid input",
       "details": [...]
     }
   }
   ```

### 🟡 Warnings (8)

1. **Over-fetching Data**
   - Endpoint: GET /users/:id
   - Issue: Returns 50+ fields, client uses 8
   - Fix: Implement field selection
   ```javascript
   GET /users/:id?fields=id,name,email
   ```

2. **Missing Pagination**
   - Endpoint: GET /users
   - Issue: Returns all records
   - Fix: Add cursor pagination

3. **No API Versioning**
   - Issue: Breaking changes will affect clients
   - Fix: Implement URL versioning (/api/v1/...)

4. **Weak Input Validation**
   - Endpoints: POST /users, PUT /users/:id
   - Fix: Use Joi or Zod for validation

### ✅ Good Practices (12)

- ✓ JWT authentication implemented
- ✓ HTTPS enforced
- ✓ CORS configured properly
- ✓ Compression enabled
- ✓ Request logging in place

### 📋 Generated OpenAPI Spec

```yaml
openapi: 3.0.3
info:
  title: Your API
  version: 1.0.0
  description: Auto-generated API documentation

servers:
  - url: https://api.example.com/v1
    description: Production

paths:
  /users:
    get:
      summary: List all users
      parameters:
        - name: cursor
          in: query
          schema:
            type: string
        - name: limit
          in: query
          schema:
            type: integer
            default: 20
      responses:
        '200':
          description: Success
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items:
                      $ref: '#/components/schemas/User'
                  pagination:
                    $ref: '#/components/schemas/Pagination'
    post:
      summary: Create a user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserRequest'
      responses:
        '201':
          description: User created
        '409':
          description: User already exists

components:
  schemas:
    User:
      type: object
      properties:
        id:
          type: string
        name:
          type: string
        email:
          type: string
          format: email
    
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

### 🎯 Recommended Improvements

1. **Implement Field Selection**
   - Allow clients to specify needed fields
   - Reduce bandwidth by 60%

2. **Add Partial Response Support**
   - Use PATCH for partial updates
   - Include ETag for optimistic locking

3. **Implement Bulk Operations**
   - POST /users/bulk for batch creation
   - Reduce API calls by 90%

4. **Add Webhook Support**
   - Event-driven notifications
   - Reduce polling

5. **Implement GraphQL** (optional)
   - For complex data requirements
   - Eliminate over/under-fetching

### 📊 Performance Impact

| Optimization | Bandwidth Saved | Response Time |
|--------------|-----------------|---------------|
| Field Selection | 60% | -40ms |
| Compression | 75% | -80ms |
| Pagination | N/A | -200ms |
| Caching | 90% | -500ms |

### 🔗 Integration Code

```javascript
// Recommended API Client Setup
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.example.com/v1',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth interceptor
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add retry logic
apiClient.interceptors.response.use(null, async error => {
  if (error.response?.status === 429) {
    // Rate limited - retry after delay
    await new Promise(r => setTimeout(r, 1000));
    return apiClient(error.config);
  }
  throw error;
});
```
```

## Integration

Works with:
- Swagger UI for interactive docs
- Postman for API testing
- OpenAPI Generator for client SDKs
- API Gateway for deployment
