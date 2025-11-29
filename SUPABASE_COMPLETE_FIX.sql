-- ============================================
-- 完整修复脚本：修复列类型 + 更新策略
-- ============================================
-- 请在 Supabase SQL Editor 中执行此脚本
-- 按顺序执行，不要跳过任何步骤

-- ============================================
-- 步骤 1：修复 user_b 列类型（最重要！）
-- ============================================
-- 这是解决 "expected JSON array" 错误的关键
ALTER TABLE test_results 
  ALTER COLUMN user_b TYPE JSONB USING NULL;

-- 验证列类型
SELECT 
  column_name, 
  data_type, 
  udt_name
FROM information_schema.columns 
WHERE table_name = 'test_results' 
  AND column_name IN ('user_a', 'user_b');

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
-- 完成！现在可以测试保存功能了
-- ============================================


