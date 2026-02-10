-- ============================================
-- 完整修复脚本 - 直接复制到 Supabase SQL Editor
-- ============================================
-- 此脚本会：
-- 1. 修复 user_b 列类型（从 jsonb[] 改为 jsonb）
-- 2. 删除并重新创建 RLS 策略
-- ============================================

-- ============================================
-- 步骤 1：修复 user_b 列类型（最重要！）
-- ============================================
-- 这是解决 "expected JSON array" 错误的关键
ALTER TABLE test_results 
  ALTER COLUMN user_b TYPE JSONB USING NULL;

-- ============================================
-- 步骤 2：删除旧策略（如果存在）
-- ============================================
DROP POLICY IF EXISTS "Allow public read access" ON test_results;
DROP POLICY IF EXISTS "Allow public insert access" ON test_results;
DROP POLICY IF EXISTS "Allow public update access" ON test_results;

-- ============================================
-- 步骤 3：重新创建策略
-- ============================================
CREATE POLICY "Allow public read access" ON test_results
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON test_results
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON test_results
  FOR UPDATE USING (true);

-- ============================================
-- 步骤 4：验证修复结果（可选）
-- ============================================
-- 检查列类型
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

-- ============================================
-- 完成！现在可以测试保存功能了
-- ============================================





