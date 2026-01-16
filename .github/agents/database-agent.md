# 🗄️ Database Optimization Agent

## Purpose
Optimize database performance through query analysis, index recommendations, schema review, and data modeling best practices.

## Capabilities

### 1. Query Optimization
- Identify slow queries
- Detect N+1 problems
- Suggest index additions
- Optimize JOIN operations
- Reduce query complexity

### 2. Index Analysis
- Missing index detection
- Unused index identification
- Composite index recommendations
- Index usage statistics
- Covering index suggestions

### 3. Schema Review
- Normalization analysis
- Data type optimization
- Constraint validation
- Foreign key relationships
- Partition strategies

### 4. Performance Monitoring
- Query execution plans
- Lock contention detection
- Deadlock analysis
- Cache hit ratios
- Connection pool tuning

### 5. Data Modeling
- Entity-Relationship design
- Denormalization recommendations
- Migration suggestions
- Archive strategies
- Sharding recommendations

## Activation

```bash
# Full database analysis
arog-cli agent run database-agent

# Query optimization only
arog-cli agent run database-agent --optimize-queries

# Index recommendations
arog-cli agent run database-agent --analyze-indexes
```

## Configuration

```json
{
  "agent": "database-agent",
  "settings": {
    "database_type": "postgresql",
    "slow_query_threshold": "100ms",
    "analyze_n_plus_one": true,
    "suggest_indexes": true,
    "check_normalization": true,
    "monitor_locks": true
  }
}
```

## Optimization Patterns

### 1. N+1 Query Problem

```javascript
// ❌ PROBLEM: N+1 queries (1 + N where N = user count)
async function getUsersWithOrders() {
  const users = await db.query('SELECT * FROM users'); // 1 query
  
  for (const user of users) {
    user.orders = await db.query(
      'SELECT * FROM orders WHERE user_id = ?', 
      [user.id]
    ); // N queries (one per user)
  }
  
  return users;
}
// Total: 1 + 100 = 101 queries for 100 users
// Time: ~2.5 seconds

// ✅ SOLUTION 1: JOIN
async function getUsersWithOrders() {
  return db.query(`
    SELECT 
      u.*,
      json_agg(o.*) as orders
    FROM users u
    LEFT JOIN orders o ON u.id = o.user_id
    GROUP BY u.id
  `);
}
// Total: 1 query
// Time: ~25ms (100x faster!)

// ✅ SOLUTION 2: Eager loading (ORM)
async function getUsersWithOrders() {
  return User.findAll({
    include: [{ model: Order }]
  });
}
```

### 2. Missing Index

```sql
-- ❌ PROBLEM: Slow query without index
-- Query: SELECT * FROM users WHERE email = 'user@example.com'
-- Execution: Full table scan (125ms for 100K users)

EXPLAIN SELECT * FROM users WHERE email = 'user@example.com';
-- Seq Scan on users (cost=0.00..2345.00 rows=1)

-- ✅ SOLUTION: Add index
CREATE INDEX idx_users_email ON users(email);

-- After index:
-- Index Scan using idx_users_email (cost=0.42..8.44 rows=1)
-- Time: 5ms (96% faster!)
```

### 3. Inefficient JOIN

```sql
-- ❌ PROBLEM: Joining large tables without proper indexes
SELECT 
  u.name,
  o.order_date,
  oi.product_name
FROM users u
JOIN orders o ON u.id = o.user_id
JOIN order_items oi ON o.id = oi.order_id
WHERE u.created_at > '2024-01-01';
-- Time: 3.2 seconds

-- ✅ SOLUTION: Add indexes on join columns
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_users_created_at ON users(created_at);
-- Time: 180ms (94% faster!)
```

### 4. SELECT * Problem

```sql
-- ❌ PROBLEM: Fetching unnecessary data
SELECT * FROM users WHERE status = 'active';
-- Returns 50 columns, only need 3
-- Data transferred: 5.2 MB
-- Time: 450ms

-- ✅ SOLUTION: Select only needed columns
SELECT id, name, email FROM users WHERE status = 'active';
-- Data transferred: 180 KB (97% reduction)
-- Time: 45ms (90% faster)
```

### 5. Denormalization for Read Performance

```sql
-- ❌ PROBLEM: Expensive aggregation on every read
SELECT 
  p.id,
  p.name,
  COUNT(r.id) as review_count,
  AVG(r.rating) as avg_rating
FROM products p
LEFT JOIN reviews r ON p.id = r.product_id
GROUP BY p.id;
-- Time: 1.2 seconds (on every product list)

-- ✅ SOLUTION: Denormalize with computed columns
ALTER TABLE products 
ADD COLUMN review_count INTEGER DEFAULT 0,
ADD COLUMN avg_rating DECIMAL(3,2) DEFAULT 0;

-- Update with trigger
CREATE TRIGGER update_product_stats
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_product_aggregates();

-- New query:
SELECT id, name, review_count, avg_rating FROM products;
-- Time: 12ms (99% faster!)
```

## Sample Output

```markdown
## Database Optimization Report

### 📊 Database Overview

- Database: PostgreSQL 15.2
- Tables: 45
- Total Records: 2.5M
- Database Size: 8.2 GB
- Indexes: 78

### 🔴 Critical Issues (4)

1. **N+1 Query Problem Detected** (SEVERITY: CRITICAL)
   - File: src/services/userService.js:45
   - Query Pattern: 1 + N queries in loop
   - Current: 1 + 250 queries = 251 total
   - Impact: 2,500ms average response time
   - Solution: Use JOIN or eager loading
   - Expected Improvement: 95% faster (125ms)

2. **Missing Critical Index** (SEVERITY: CRITICAL)
   - Table: users
   - Column: email
   - Query Frequency: 15,000/day
   - Current: Full table scan (125ms)
   - Solution: `CREATE INDEX idx_users_email ON users(email)`
   - Expected Improvement: 96% faster (5ms)

3. **Slow Aggregation Query** (SEVERITY: HIGH)
   - Query: Product listing with review stats
   - Current: 1,200ms per request
   - Frequency: 500/hour
   - Solution: Denormalize with materialized view
   ```sql
   CREATE MATERIALIZED VIEW product_stats AS
   SELECT 
     p.id,
     COUNT(r.id) as review_count,
     AVG(r.rating) as avg_rating
   FROM products p
   LEFT JOIN reviews r ON p.id = r.product_id
   GROUP BY p.id;
   
   CREATE INDEX ON product_stats(id);
   ```
   - Expected: 12ms (99% faster)

4. **Table Bloat Detected** (SEVERITY: HIGH)
   - Table: logs
   - Size: 4.2 GB
   - Records: 2.1M
   - Issue: No archival strategy
   - Solution: Implement partitioning
   ```sql
   -- Create partitioned table
   CREATE TABLE logs (
     id SERIAL,
     created_at TIMESTAMP,
     message TEXT
   ) PARTITION BY RANGE (created_at);
   
   -- Monthly partitions
   CREATE TABLE logs_2024_01 PARTITION OF logs
   FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');
   
   -- Archive old partitions
   ```

### 🟡 Performance Warnings (7)

1. **Inefficient JOIN Query**
   - Tables: users ⋈ orders ⋈ products
   - Issue: Missing index on orders.user_id
   - Impact: 850ms query time
   - Fix: `CREATE INDEX idx_orders_user_id ON orders(user_id)`

2. **SELECT * Usage**
   - Occurrences: 23 queries
   - Wasted Bandwidth: ~15 MB/day
   - Fix: Select only required columns

3. **Unused Indexes** (5 found)
   ```sql
   DROP INDEX idx_users_phone;  -- Never used
   DROP INDEX idx_orders_notes;  -- <0.01% usage
   ```
   - Space Saved: 240 MB

4. **Missing Composite Index**
   - Query: WHERE status = 'active' AND created_at > ...
   - Current: Two separate scans
   - Fix: `CREATE INDEX idx_users_status_created ON users(status, created_at)`

### ✅ Optimizations Applied

1. ✓ Added 8 missing indexes
2. ✓ Removed 5 unused indexes
3. ✓ Optimized 12 slow queries
4. ✓ Implemented query result caching

### 📊 Performance Impact

| Optimization | Before | After | Improvement |
|--------------|--------|-------|-------------|
| User lookup by email | 125ms | 5ms | 96% faster |
| Order list for user | 2,500ms | 125ms | 95% faster |
| Product with reviews | 1,200ms | 12ms | 99% faster |
| Active users count | 450ms | 8ms | 98% faster |
| **Average Query Time** | **485ms** | **22ms** | **95% faster** |

### 🎯 Index Recommendations

```sql
-- High Impact Indexes (implement immediately)
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);

-- Composite Indexes (for common queries)
CREATE INDEX idx_users_status_created ON users(status, created_at);
CREATE INDEX idx_orders_status_date ON orders(status, order_date);

-- Covering Indexes (include frequently selected columns)
CREATE INDEX idx_users_email_name ON users(email) INCLUDE (name, created_at);
```

### 📈 Connection Pool Analysis

```javascript
// Current Configuration
{
  "min": 2,
  "max": 10,
  "idle_timeout": 10000
}

// Observations:
// - Peak connections: 8/10 (80% utilization)
// - Average wait time: 45ms
// - Connection errors: 0

// ✅ Recommendation: Configuration is optimal
```

### 🔍 Query Execution Plans

**Slow Query #1:**
```sql
EXPLAIN ANALYZE
SELECT * FROM orders WHERE user_id = 123;

Before:
Seq Scan on orders  (cost=0.00..15234.00 rows=250) (actual time=125.432..125.433)
  Filter: (user_id = 123)
  Rows Removed by Filter: 249750

After (with index):
Index Scan using idx_orders_user_id  (cost=0.42..8.44 rows=250) (actual time=0.015..0.018)
  Index Cond: (user_id = 123)
```

### 💾 Storage Optimization

- Unused indexes removed: 240 MB
- Data archived: 1.8 GB
- Vacuum full performed: 420 MB reclaimed
- **Total space saved: 2.46 GB (30%)**

### 🎯 Next Steps

1. **Immediate**:
   - ✅ Apply critical indexes (done)
   - ⏳ Implement query caching
   - ⏳ Set up partition for logs table

2. **This Week**:
   - Review application code for N+1 patterns
   - Implement connection pooling optimization
   - Set up automated query monitoring

3. **This Month**:
   - Consider read replicas for reporting
   - Implement materialized views for analytics
   - Evaluate sharding strategy for scale
```

## Integration

Works with:
- pgAdmin for PostgreSQL management
- MySQL Workbench for MySQL
- DataGrip for multi-DB support
- Prometheus for metrics
- Grafana for visualization
