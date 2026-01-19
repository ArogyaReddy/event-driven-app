# ⚡ Performance Optimization Agent

## Purpose
Identify and fix performance bottlenecks, optimize algorithms, reduce bundle sizes, and improve application speed.

## Capabilities

### 1. Algorithm Analysis
- Detect O(n²) or worse complexity
- Suggest more efficient algorithms
- Identify redundant operations
- Optimize loops and iterations

### 2. Database Optimization
- Find N+1 query problems
- Suggest index additions
- Optimize query patterns
- Recommend caching strategies

### 3. Bundle Optimization
- Analyze bundle size
- Identify large dependencies
- Suggest code splitting
- Tree shaking opportunities

### 4. Memory Optimization
- Detect memory leaks
- Identify excessive allocations
- Suggest object pooling
- Optimize data structures

### 5. Network Optimization
- Reduce API calls
- Implement request batching
- Suggest CDN usage
- Optimize asset loading

## Activation

```bash
# Full performance audit
arog-cli agent run performance-agent

# Specific optimization
arog-cli agent run performance-agent --focus bundle
arog-cli agent run performance-agent --focus database
arog-cli agent run performance-agent --focus algorithms
```

## Configuration

```json
{
  "agent": "performance-agent",
  "settings": {
    "bundle_size_limit": "500KB",
    "response_time_target": "200ms",
    "memory_threshold": "100MB",
    "cpu_threshold": "70%",
    "lighthouse_score": 90
  }
}
```

## Performance Metrics

### 1. Load Performance
- ⏱️ First Contentful Paint (FCP)
- ⏱️ Largest Contentful Paint (LCP)
- ⏱️ Time to Interactive (TTI)
- ⏱️ Total Blocking Time (TBT)

### 2. Runtime Performance
- 🔄 CPU Usage
- 💾 Memory Usage
- 📊 Frame Rate (FPS)
- ⚡ Response Time

### 3. Bundle Performance
- 📦 Total Bundle Size
- 📂 Code Splitting Efficiency
- 🌳 Tree Shaking Results
- 🗜️ Compression Ratio

## Sample Output

```markdown
## Performance Analysis Report

### ⚠️ Critical Issues (3)

1. **O(n²) Algorithm Detected** (src/utils/search.js:45)
   - Current: Nested loop (O(n²))
   - Impact: 2.5s for 1000 items
   - Fix: Use Map for O(n) lookup
   - Expected Improvement: 95% faster

2. **N+1 Query Problem** (src/services/user.js:78)
   - Current: 1 + N queries (N = user count)
   - Impact: 450ms for 100 users
   - Fix: Use JOIN or eager loading
   - Expected Improvement: 90% faster

3. **Large Bundle Dependency** (webpack-bundle-analyzer)
   - Package: moment.js (288KB)
   - Usage: Only formatDate() function
   - Fix: Replace with date-fns (2KB)
   - Expected Savings: 286KB

### 🟡 Warnings (5)

1. **Inefficient Array Filter** (src/data/processor.js:120)
   - Multiple passes over same array
   - Combine into single reduce operation
   - Expected: 40% faster

2. **Missing Database Index** (users.email)
   - Query: SELECT * FROM users WHERE email = ?
   - Current: Full table scan (125ms)
   - Fix: CREATE INDEX idx_users_email
   - Expected: 95% faster (5ms)

### ✅ Optimizations Applied

1. ✓ Implemented code splitting (-180KB)
2. ✓ Added lazy loading for routes
3. ✓ Optimized images (WebP format)
4. ✓ Enabled gzip compression

### 📊 Before vs After

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Load Time | 3.2s | 1.1s | 66% faster |
| Bundle Size | 850KB | 420KB | 51% smaller |
| FCP | 1.8s | 0.7s | 61% faster |
| TTI | 4.5s | 1.9s | 58% faster |
| Lighthouse | 65 | 94 | +29 points |

### 🎯 Next Steps
1. Implement suggested algorithm changes
2. Add database indexes
3. Replace moment.js with date-fns
4. Enable HTTP/2 push for critical assets
```

## Benchmarking

```javascript
// Auto-generated benchmark
Performance.measure('search-operation', () => {
  // Current implementation
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < orders.length; j++) {
      if (users[i].id === orders[j].userId) {
        // Process
      }
    }
  }
});
// Result: 2,500ms for 1000 items

Performance.measure('optimized-search', () => {
  // Optimized with Map
  const userMap = new Map(users.map(u => [u.id, u]));
  orders.forEach(o => {
    const user = userMap.get(o.userId);
    // Process
  });
});
// Result: 125ms for 1000 items (95% faster)
```

## Integration

Works with:
- Lighthouse CI
- webpack-bundle-analyzer
- Chrome DevTools
- New Relic / Datadog
- k6 for load testing
