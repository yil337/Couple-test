-- ============================================
-- 修复 user_b 列类型：从 jsonb[] 改为 jsonb
-- ============================================
-- 问题：user_b 列被错误地定义为 jsonb[]（数组），但代码发送的是单个 JSON 对象
-- 解决方案：将列类型改为 jsonb（单个对象）

-- 1. 检查当前列类型
SELECT 
  column_name, 
  data_type, 
  udt_name
FROM information_schema.columns 
WHERE table_name = 'test_results' 
  AND column_name IN ('user_a', 'user_b');

-- 2. 修复 user_b 列类型（从 jsonb[] 改为 jsonb）
-- 注意：如果列中有数据，需要先处理
-- 如果列是空的或只有 NULL，可以直接修改

-- 方案 A：如果 user_b 列是空的或只有 NULL（推荐）
ALTER TABLE test_results 
  ALTER COLUMN user_b TYPE JSONB USING NULL;

-- 如果上面的命令报错，尝试：
-- ALTER TABLE test_results 
--   ALTER COLUMN user_b DROP DEFAULT;
-- ALTER TABLE test_results 
--   ALTER COLUMN user_b TYPE JSONB USING NULL;

-- 3. 验证修复结果
SELECT 
  column_name, 
  data_type, 
  udt_name
FROM information_schema.columns 
WHERE table_name = 'test_results' 
  AND column_name IN ('user_a', 'user_b');

-- 预期结果：
-- user_a | jsonb | jsonb
-- user_b | jsonb | jsonb  （不再是 jsonb[]）

-- 4. 如果 user_a 也是 jsonb[]，也需要修复：
-- ALTER TABLE test_results 
--   ALTER COLUMN user_a TYPE JSONB USING NULL;

