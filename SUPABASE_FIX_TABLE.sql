-- ============================================
-- 修复 Supabase 表结构（如果表结构有问题）
-- ============================================
-- 如果遇到 "expected JSON array" 错误，可能是表结构定义错误
-- 请在 Supabase SQL Editor 中执行此脚本

-- 1. 检查当前表结构
SELECT 
  column_name, 
  data_type, 
  udt_name
FROM information_schema.columns 
WHERE table_name = 'test_results';

-- 2. 如果 user_a 或 user_b 不是 JSONB 类型，需要修改
-- 注意：修改列类型会删除现有数据，请先备份！

-- 方案 A：如果表是空的或可以清空数据
-- ALTER TABLE test_results 
--   ALTER COLUMN user_a TYPE JSONB USING user_a::JSONB;
-- ALTER TABLE test_results 
--   ALTER COLUMN user_b TYPE JSONB USING user_b::JSONB;

-- 方案 B：如果表有数据，需要先转换
-- ALTER TABLE test_results 
--   ALTER COLUMN user_a TYPE JSONB USING CASE 
--     WHEN user_a IS NULL THEN NULL::JSONB
--     WHEN jsonb_typeof(user_a::JSONB) = 'array' THEN user_a::JSONB
--     ELSE user_a::JSONB
--   END;
-- ALTER TABLE test_results 
--   ALTER COLUMN user_b TYPE JSONB USING CASE 
--     WHEN user_b IS NULL THEN NULL::JSONB
--     WHEN jsonb_typeof(user_b::JSONB) = 'array' THEN user_b::JSONB
--     ELSE user_b::JSONB
--   END;

-- 3. 验证表结构
SELECT 
  column_name, 
  data_type, 
  udt_name
FROM information_schema.columns 
WHERE table_name = 'test_results' 
  AND column_name IN ('user_a', 'user_b');

-- 预期结果：
-- user_a | jsonb | jsonb
-- user_b | jsonb | jsonb


