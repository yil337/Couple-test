-- ============================================
-- 测试数据分析查询集合
-- ============================================
-- 在 Supabase SQL Editor 中执行这些查询
-- 可以随时查看，无时限限制
-- ============================================

-- ============================================
-- 1. 基础统计
-- ============================================

-- 查询总测试数量（所有创建的测试记录）
SELECT COUNT(*) AS total_tests
FROM test_results;

-- 查询已完成测试的数量（用户提交了结果）
SELECT COUNT(*) AS completed_tests
FROM test_results 
WHERE completed_at IS NOT NULL;

-- 查询未完成测试的数量（创建了但未提交）
SELECT COUNT(*) AS incomplete_tests
FROM test_results 
WHERE completed_at IS NULL;

-- 查询测试完成率（百分比）
SELECT 
  COUNT(*) AS total_tests,
  COUNT(*) FILTER (WHERE completed_at IS NOT NULL) AS completed_tests,
  COUNT(*) FILTER (WHERE completed_at IS NULL) AS incomplete_tests,
  ROUND(
    COUNT(*) FILTER (WHERE completed_at IS NOT NULL) * 100.0 / NULLIF(COUNT(*), 0),
    2
  ) AS completion_rate_percent
FROM test_results;

-- ============================================
-- 2. 时间维度统计
-- ============================================

-- 按日期统计测试数量（今天、昨天、本周、本月）
SELECT 
  DATE(created_at) AS test_date,
  COUNT(*) AS total_tests,
  COUNT(*) FILTER (WHERE completed_at IS NOT NULL) AS completed_tests
FROM test_results
GROUP BY DATE(created_at)
ORDER BY test_date DESC
LIMIT 30;  -- 最近30天

-- 按小时统计测试数量（查看一天中的活跃时段）
SELECT 
  EXTRACT(HOUR FROM created_at) AS hour,
  COUNT(*) AS total_tests,
  COUNT(*) FILTER (WHERE completed_at IS NOT NULL) AS completed_tests
FROM test_results
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'  -- 最近7天
GROUP BY EXTRACT(HOUR FROM created_at)
ORDER BY hour;

-- 今日统计
SELECT 
  COUNT(*) AS today_total,
  COUNT(*) FILTER (WHERE completed_at IS NOT NULL) AS today_completed,
  COUNT(*) FILTER (WHERE completed_at >= CURRENT_DATE) AS today_completed_today
FROM test_results
WHERE created_at >= CURRENT_DATE;

-- 本周统计
SELECT 
  COUNT(*) AS week_total,
  COUNT(*) FILTER (WHERE completed_at IS NOT NULL) AS week_completed
FROM test_results
WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE);

-- 本月统计
SELECT 
  COUNT(*) AS month_total,
  COUNT(*) FILTER (WHERE completed_at IS NOT NULL) AS month_completed
FROM test_results
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE);

-- ============================================
-- 3. 测试类型统计
-- ============================================

-- 统计单人测试 vs 双人测试
-- 单人测试：只有 user_a，没有 user_b
-- 双人测试：既有 user_a 又有 user_b
SELECT 
  COUNT(*) FILTER (WHERE user_a IS NOT NULL AND user_b IS NULL) AS single_user_tests,
  COUNT(*) FILTER (WHERE user_a IS NOT NULL AND user_b IS NOT NULL) AS pair_tests,
  COUNT(*) AS total_tests
FROM test_results;

-- 统计各动物类型的分布（已完成测试）
SELECT 
  animal,
  COUNT(*) AS count,
  ROUND(COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER (), 0), 2) AS percentage
FROM test_results
WHERE animal IS NOT NULL 
  AND completed_at IS NOT NULL
GROUP BY animal
ORDER BY count DESC;

-- 统计各爱情风格分布
SELECT 
  ls_type,
  COUNT(*) AS count,
  ROUND(COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER (), 0), 2) AS percentage
FROM test_results
WHERE ls_type IS NOT NULL 
  AND completed_at IS NOT NULL
GROUP BY ls_type
ORDER BY count DESC;

-- 统计各依恋类型分布
SELECT 
  at_type,
  COUNT(*) AS count,
  ROUND(COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER (), 0), 2) AS percentage
FROM test_results
WHERE at_type IS NOT NULL 
  AND completed_at IS NOT NULL
GROUP BY at_type
ORDER BY count DESC;

-- ============================================
-- 4. 详细查询
-- ============================================

-- 查看最近的测试记录（带完成状态）
SELECT 
  id,
  created_at,
  completed_at,
  animal,
  ls_type,
  at_type,
  CASE 
    WHEN completed_at IS NOT NULL THEN '已完成'
    ELSE '未完成'
  END AS status,
  CASE 
    WHEN user_b IS NOT NULL THEN '双人测试'
    ELSE '单人测试'
  END AS test_type
FROM test_results
ORDER BY created_at DESC
LIMIT 50;

-- 查看完成时间分布（从创建到完成的时间差）
SELECT 
  id,
  created_at,
  completed_at,
  EXTRACT(EPOCH FROM (completed_at - created_at)) / 60 AS minutes_to_complete
FROM test_results
WHERE completed_at IS NOT NULL
ORDER BY completed_at DESC
LIMIT 50;

-- 平均完成时间（分钟）
SELECT 
  ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - created_at)) / 60), 2) AS avg_minutes_to_complete
FROM test_results
WHERE completed_at IS NOT NULL;

-- ============================================
-- 5. 快速仪表板查询（一键查看所有关键指标）
-- ============================================

SELECT 
  -- 总体统计
  (SELECT COUNT(*) FROM test_results) AS total_tests,
  (SELECT COUNT(*) FROM test_results WHERE completed_at IS NOT NULL) AS completed_tests,
  (SELECT COUNT(*) FROM test_results WHERE completed_at IS NULL) AS incomplete_tests,
  -- 完成率
  ROUND(
    (SELECT COUNT(*) FROM test_results WHERE completed_at IS NOT NULL) * 100.0 / 
    NULLIF((SELECT COUNT(*) FROM test_results), 0),
    2
  ) AS completion_rate_percent,
  -- 今日统计
  (SELECT COUNT(*) FROM test_results WHERE created_at >= CURRENT_DATE) AS today_total,
  (SELECT COUNT(*) FROM test_results WHERE completed_at >= CURRENT_DATE) AS today_completed,
  -- 本周统计
  (SELECT COUNT(*) FROM test_results WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)) AS week_total,
  (SELECT COUNT(*) FROM test_results WHERE completed_at >= DATE_TRUNC('week', CURRENT_DATE)) AS week_completed,
  -- 本月统计
  (SELECT COUNT(*) FROM test_results WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)) AS month_total,
  (SELECT COUNT(*) FROM test_results WHERE completed_at >= DATE_TRUNC('month', CURRENT_DATE)) AS month_completed,
  -- 测试类型
  (SELECT COUNT(*) FROM test_results WHERE user_b IS NOT NULL) AS pair_tests,
  (SELECT COUNT(*) FROM test_results WHERE user_a IS NOT NULL AND user_b IS NULL) AS single_tests;
