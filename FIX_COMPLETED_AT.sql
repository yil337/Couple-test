-- ============================================
-- 修复 completed_at 字段问题
-- ============================================
-- 在 Supabase SQL Editor 中执行此脚本
-- ============================================

-- 步骤 1：检查字段是否存在
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'test_results' 
AND column_name = 'completed_at';

-- 步骤 2：如果字段不存在，添加字段
ALTER TABLE test_results 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- 步骤 3：为已有数据批量设置 completed_at
-- 如果 user_a 或 user_b 有数据，说明测试已完成，设置 completed_at 为 updated_at（或 created_at）
UPDATE test_results
SET completed_at = COALESCE(updated_at, created_at)
WHERE (user_a IS NOT NULL OR user_b IS NOT NULL)
  AND completed_at IS NULL;

-- 步骤 4：创建索引
CREATE INDEX IF NOT EXISTS idx_test_results_completed_at 
ON test_results(completed_at) 
WHERE completed_at IS NOT NULL;

-- 步骤 5：验证修复结果
SELECT 
  COUNT(*) AS total_tests,
  COUNT(completed_at) AS completed_tests,
  COUNT(*) - COUNT(completed_at) AS incomplete_tests,
  ROUND(COUNT(completed_at) * 100.0 / NULLIF(COUNT(*), 0), 2) AS completion_rate
FROM test_results;

-- 步骤 6：查看最近的记录
SELECT 
  id,
  created_at,
  updated_at,
  completed_at,
  CASE 
    WHEN completed_at IS NULL THEN '❌ 未完成'
    ELSE '✅ 已完成'
  END AS status
FROM test_results
ORDER BY created_at DESC
LIMIT 10;
