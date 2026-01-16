# Performance Optimization Prompt

## Context
You are a performance optimization expert analyzing code for speed, efficiency, and resource usage.

## Instructions

Analyze the following code for performance issues and provide optimization recommendations.

### Analysis Areas

1. **Algorithm Complexity**
   - Identify O(n²) or worse algorithms
   - Suggest more efficient approaches
   - Analyze time and space complexity

2. **Database Performance**
   - Detect N+1 query problems
   - Identify missing indexes
   - Suggest query optimizations
   - Recommend caching strategies

3. **Memory Optimization**
   - Find memory leaks
   - Identify excessive allocations
   - Suggest object pooling
   - Optimize data structures

4. **Network Performance**
   - Reduce API calls
   - Implement request batching
   - Suggest lazy loading
   - Optimize asset loading

5. **Code-Level Optimizations**
   - Avoid unnecessary computations
   - Use memoization where appropriate
   - Implement early returns
   - Optimize loops

## Benchmarking

For each optimization, provide before/after benchmarks:

```javascript
// BEFORE
console.time('operation');
// Current implementation
console.timeEnd('operation');
// Result: 2,500ms

// AFTER
console.time('optimized');
// Optimized implementation
console.timeEnd('optimized');
// Result: 125ms (95% faster)
```

## Output Format

```markdown
## Performance Analysis Report

### ⚠️ Critical Issues (Fix Immediately)

1. **O(n²) Algorithm Detected**
   - **Location**: {{file}}:{{line}}
   - **Current Complexity**: O(n²)
   - **Impact**: 2.5s for 1000 items
   - **Optimization**: Use Map for O(n) lookup
   - **Expected Improvement**: 95% faster (125ms)
   
   ```javascript
   // ❌ CURRENT (O(n²))
   for (let i = 0; i < users.length; i++) {
     for (let j = 0; j < orders.length; j++) {
       if (users[i].id === orders[j].userId) {
         // Process
       }
     }
   }
   
   // ✅ OPTIMIZED (O(n))
   const userMap = new Map(users.map(u => [u.id, u]));
   orders.forEach(order => {
     const user = userMap.get(order.userId);
     // Process
   });
   ```

2. **N+1 Query Problem**
   - **Location**: {{file}}:{{line}}
   - **Current**: 1 + N queries
   - **Impact**: 450ms for 100 records
   - **Fix**: Use JOIN or eager loading
   - **Expected**: 90% faster (45ms)

### 🟡 Optimization Opportunities

1. **Missing Memoization**
   - Expensive computation called repeatedly
   - Add memoization for 80% improvement

2. **Inefficient Loop**
   - Multiple array iterations
   - Combine into single reduce()

### 📊 Performance Metrics

| Optimization | Before | After | Improvement |
|--------------|--------|-------|-------------|
| Algorithm fix | 2.5s | 125ms | 95% faster |
| Database query | 450ms | 45ms | 90% faster |
| Memoization | 800ms | 160ms | 80% faster |
| **TOTAL** | **3.75s** | **330ms** | **91% faster** |

### 🎯 Implementation Priority

1. **High Impact** (Implement first)
   - Fix O(n²) algorithm
   - Add database indexes
   - Implement query batching

2. **Medium Impact**
   - Add memoization
   - Optimize loops
   - Reduce API calls

3. **Low Impact** (Nice to have)
   - Minor code optimizations
   - Cleanup unused code
```

## Variables
- `{{performance_target}}`: Target response time (default: 200ms)
- `{{memory_limit}}`: Memory threshold (default: 100MB)
- `{{include_benchmarks}}`: Generate benchmarks (default: true)

## Code to Analyze
```{{language}}
{{code}}
```

## Context
- Application Type: {{app_type}}
- Scale: {{request_volume}} requests/day
- Critical Path: {{is_critical_path}}
