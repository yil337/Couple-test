-- ============================================
-- 检查 completed_at 字段问题的完整诊断
-- ============================================

-- 1. 检查字段是否存在
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'test_results' 
AND column_name = 'completed_at';

-- 2. 如果字段不存在，执行以下命令添加：
-- ALTER TABLE test_results ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- 3. 查看最近的测试记录（检查是否有 completed_at 值）
SELECT 
  id,
  created_at,
  updated_at,
  completed_at,
  CASE 
    WHEN completed_at IS NULL THEN '❌ 未完成'
    ELSE '✅ 已完成'
  END AS status,
  user_a IS NOT NULL AS has_user_a,
  user_b IS NOT NULL AS has_user_b
FROM test_results
ORDER BY created_at DESC
LIMIT 10;

-- 4. 统计信息
SELECT 
  COUNT(*) AS total,
  COUNT(completed_at) AS with_completed_at,
  COUNT(*) - COUNT(completed_at) AS without_completed_at
FROM test_results;

-- 5. 检查是否有更新但 completed_at 仍为 NULL 的记录
-- （这些记录有 user_a 或 user_b 数据，说明测试已完成，但 completed_at 未设置）
SELECT 
  COUNT(*) AS completed_but_no_timestamp
FROM test_results
WHERE (user_a IS NOT NULL OR user_b IS NOT NULL)
  AND completed_at IS NULL;
