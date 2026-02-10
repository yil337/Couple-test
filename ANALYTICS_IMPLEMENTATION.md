# 测试完成率分析功能实现

## 概述
添加轻量级分析功能，跟踪有多少用户完成了测试。使用 Supabase 数据库，无需外部分析 SDK。

## 实现内容

### 1. 数据库变更

**文件：** `SUPABASE_ADD_COMPLETED_AT.sql`

在 `test_results` 表中添加 `completed_at` 字段：
- 类型：`TIMESTAMPTZ`（带时区的时间戳）
- 允许 NULL：是（NULL 表示未完成测试）
- 索引：为已完成测试创建部分索引以提高查询性能

**执行步骤：**
1. 在 Supabase SQL Editor 中执行 `SUPABASE_ADD_COMPLETED_AT.sql`
2. 验证字段已成功添加

### 2. 代码变更

**文件：** `src/lib/supabase.ts`

#### 修改 `saveUserA` 函数
- 在更新用户A数据前，先查询当前记录的 `completed_at` 值
- 如果 `completed_at` 为 NULL，则设置为当前时间（首次完成）
- 如果已存在值，则不更新（避免覆盖原始完成时间）
- 在插入新记录时，同时设置 `completed_at`

#### 修改 `saveUserB` 函数
- 在更新用户B数据前，先查询当前记录的 `completed_at` 值
- 如果 `completed_at` 为 NULL，则设置为当前时间（首次完成）
- 如果已存在值，则不更新（避免覆盖原始完成时间）

## 工作原理

1. **首次完成测试：**
   - 用户A或用户B提交测试结果时，系统检查 `completed_at` 字段
   - 如果为 NULL，则设置为当前时间戳
   - 这表示用户首次完成测试

2. **防止重复更新：**
   - 如果 `completed_at` 已有值，则不更新
   - 即使用户刷新页面或重新访问结果页，原始完成时间不会被覆盖

3. **查询完成率：**
   ```sql
   -- 查询已完成测试的数量
   SELECT COUNT(*) FROM test_results WHERE completed_at IS NOT NULL;
   
   -- 查询总测试数量
   SELECT COUNT(*) FROM test_results;
   
   -- 计算完成率
   SELECT 
     COUNT(*) FILTER (WHERE completed_at IS NOT NULL) * 100.0 / COUNT(*) AS completion_rate
   FROM test_results;
   ```

## 注意事项

- `completed_at` 字段在用户完成所有问题并提交测试时设置
- 字段只设置一次，不会因页面刷新而更新
- 使用索引优化查询性能
- 所有逻辑都在 Supabase 层面实现，无需客户端额外处理

## 验证

执行以下 SQL 查询验证功能：

```sql
-- 检查字段是否存在
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'test_results' 
AND column_name = 'completed_at';

-- 查看已完成测试的记录
SELECT id, created_at, completed_at 
FROM test_results 
WHERE completed_at IS NOT NULL 
ORDER BY completed_at DESC 
LIMIT 10;
```
