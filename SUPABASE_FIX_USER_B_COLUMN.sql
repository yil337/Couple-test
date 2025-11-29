-- ============================================
-- 修复 user_b 列类型：从 jsonb[] 改为 jsonb
-- ============================================
-- 这是最重要的修复！必须执行！

-- 1. 检查当前列类型
SELECT 
  column_name, 
  data_type, 
  udt_name
FROM information_schema.columns 
WHERE table_name = 'test_results' 
  AND column_name IN ('user_a', 'user_b');

-- 2. 修复 user_b 列类型（从 jsonb[] 改为 jsonb）
-- 如果 user_b 列是空的或只有 NULL，可以直接修改
ALTER TABLE test_results 
  ALTER COLUMN user_b TYPE JSONB USING NULL;

-- 3. 如果上面的命令报错，尝试这个（先删除默认值）：
-- ALTER TABLE test_results 
--   ALTER COLUMN user_b DROP DEFAULT;
-- ALTER TABLE test_results 
--   ALTER COLUMN user_b TYPE JSONB USING NULL;

-- 4. 验证修复结果
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


