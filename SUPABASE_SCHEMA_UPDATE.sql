-- ============================================
-- Supabase 数据库 Schema 更新脚本
-- 添加新字段以支持新的爱情模型
-- ============================================
-- 请在 Supabase SQL Editor 中执行此脚本
-- ============================================

-- ============================================
-- 步骤 1：添加新字段（如果不存在）
-- ============================================

-- 个人画像字段
ALTER TABLE test_results 
  ADD COLUMN IF NOT EXISTS ls_type TEXT,
  ADD COLUMN IF NOT EXISTS at_type TEXT,
  ADD COLUMN IF NOT EXISTS animal TEXT,
  ADD COLUMN IF NOT EXISTS sternberg_type TEXT,
  ADD COLUMN IF NOT EXISTS gottman_type TEXT;

-- 得分字段（JSONB 存储详细得分）
ALTER TABLE test_results 
  ADD COLUMN IF NOT EXISTS scores_json JSONB;

-- ============================================
-- 步骤 2：创建索引（提高查询性能）
-- ============================================

CREATE INDEX IF NOT EXISTS idx_test_results_animal ON test_results(animal);
CREATE INDEX IF NOT EXISTS idx_test_results_ls_type ON test_results(ls_type);
CREATE INDEX IF NOT EXISTS idx_test_results_at_type ON test_results(at_type);
CREATE INDEX IF NOT EXISTS idx_test_results_sternberg_type ON test_results(sternberg_type);

-- ============================================
-- 步骤 3：验证字段已添加
-- ============================================

SELECT 
  column_name, 
  data_type, 
  udt_name
FROM information_schema.columns 
WHERE table_name = 'test_results' 
  AND column_name IN (
    'ls_type', 
    'at_type', 
    'animal', 
    'sternberg_type', 
    'gottman_type',
    'scores_json'
  );

-- ============================================
-- 完成！
-- ============================================
-- 新字段说明：
-- - ls_type: 主要爱情风格 (PASSION, GAME, FRIENDSHIP, PRAGMATIC, MANIA, AGAPE)
-- - at_type: 主要依恋类型 (SECURE, AVOIDANT, ANXIOUS, FEARFUL)
-- - animal: 动物类型（24种动物之一）
-- - sternberg_type: Sternberg 类型 (LIKING, INFATUATION, EMPTY, ROMANTIC, COMPANIONATE, FOOLISH, CONSUMMATE)
-- - gottman_type: Gottman 类型 (NONE, CRITICISM, DEFENSIVENESS, STONEWALLING, CONTEMPT)
-- - scores_json: 详细得分（JSONB格式，包含所有得分向量）
-- ============================================




