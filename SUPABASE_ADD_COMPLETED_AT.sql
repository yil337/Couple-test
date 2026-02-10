-- ============================================
-- 添加 completed_at 字段用于分析测试完成率
-- ============================================
-- 在 Supabase SQL Editor 中执行此脚本
-- ============================================

-- 添加 completed_at 字段（允许 NULL，表示未完成）
ALTER TABLE test_results 
ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- 添加索引以便快速查询已完成测试的数量
CREATE INDEX IF NOT EXISTS idx_test_results_completed_at 
ON test_results(completed_at) 
WHERE completed_at IS NOT NULL;

-- 验证字段已添加
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'test_results' 
AND column_name = 'completed_at';
