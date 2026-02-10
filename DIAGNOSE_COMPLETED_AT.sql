-- ============================================
-- 诊断 completed_at 字段问题
-- ============================================
-- 在 Supabase SQL Editor 中执行此脚本
-- ============================================

-- 1. 检查 completed_at 字段是否存在
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'test_results' 
AND column_name = 'completed_at';

-- 如果上面的查询返回空结果，说明字段不存在，需要执行：
-- ALTER TABLE test_results ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- 2. 检查最近的测试记录，查看 completed_at 字段的值
SELECT 
  id,
  created_at,
  completed_at,
  CASE 
    WHEN completed_at IS NULL THEN '未完成'
    ELSE '已完成'
  END AS status
FROM test_results
ORDER BY created_at DESC
LIMIT 10;

-- 3. 检查是否有 completed_at 不为 NULL 的记录
SELECT COUNT(*) AS completed_count
FROM test_results
WHERE completed_at IS NOT NULL;

-- 4. 检查总记录数
SELECT COUNT(*) AS total_count
FROM test_results;
