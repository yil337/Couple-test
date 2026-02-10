-- ============================================
-- 完整 Supabase 数据库设置脚本（包含分析功能）
-- ============================================
-- 请在 Supabase SQL Editor 中执行此脚本
-- 访问：https://app.supabase.com/project/otprifxlonsnlikbwngz/editor
-- ============================================
-- 此脚本包含：
-- 1. 创建/更新 test_results 表
-- 2. 添加新字段（支持新的爱情模型）
-- 3. 添加 completed_at 字段（用于分析测试完成率）
-- 4. 创建索引
-- 5. 配置 RLS 策略
-- 6. 验证设置
-- ============================================

-- ============================================
-- 步骤 1：删除旧表（如果存在，可选）
-- ============================================
-- 注意：如果表已存在且有数据，请跳过此步骤
-- DROP TABLE IF EXISTS test_results CASCADE;

-- ============================================
-- 步骤 2：创建 test_results 表（如果不存在）
-- ============================================
CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_a JSONB,  -- 用户A的完整数据（JSONB格式）
  user_b JSONB,  -- 用户B的完整数据（JSONB格式）
  
  -- 新增字段：个人画像关键信息（便于查询）
  ls_type TEXT,           -- 主要爱情风格 (PASSION, GAME, FRIENDSHIP, PRAGMATIC, MANIA, AGAPE)
  at_type TEXT,           -- 主要依恋类型 (SECURE, AVOIDANT, ANXIOUS, FEARFUL)
  animal TEXT,            -- 动物类型（24种动物之一）
  sternberg_type TEXT,    -- Sternberg 类型 (LIKING, INFATUATION, EMPTY, ROMANTIC, COMPANIONATE, FOOLISH, CONSUMMATE)
  gottman_type TEXT,      -- Gottman 类型 (NONE, CRITICISM, DEFENSIVENESS, STONEWALLING, CONTEMPT)
  scores_json JSONB,      -- 详细得分（JSONB格式，包含所有得分向量）
  completed_at TIMESTAMPTZ  -- 测试完成时间（用于分析完成率，NULL 表示未完成）
);

-- ============================================
-- 步骤 3：添加新字段（如果表已存在）
-- ============================================
-- 如果表已存在，使用 ALTER TABLE 添加新字段
ALTER TABLE test_results 
  ADD COLUMN IF NOT EXISTS ls_type TEXT,
  ADD COLUMN IF NOT EXISTS at_type TEXT,
  ADD COLUMN IF NOT EXISTS animal TEXT,
  ADD COLUMN IF NOT EXISTS sternberg_type TEXT,
  ADD COLUMN IF NOT EXISTS gottman_type TEXT,
  ADD COLUMN IF NOT EXISTS scores_json JSONB,
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ;

-- ============================================
-- 步骤 4：创建索引以提高查询性能
-- ============================================
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON test_results(created_at);
CREATE INDEX IF NOT EXISTS idx_test_results_id ON test_results(id);
CREATE INDEX IF NOT EXISTS idx_test_results_animal ON test_results(animal);
CREATE INDEX IF NOT EXISTS idx_test_results_ls_type ON test_results(ls_type);
CREATE INDEX IF NOT EXISTS idx_test_results_at_type ON test_results(at_type);
CREATE INDEX IF NOT EXISTS idx_test_results_sternberg_type ON test_results(sternberg_type);

-- completed_at 字段的部分索引（仅索引非 NULL 值，提高查询已完成测试的性能）
CREATE INDEX IF NOT EXISTS idx_test_results_completed_at 
ON test_results(completed_at) 
WHERE completed_at IS NOT NULL;

-- JSONB 字段的 GIN 索引（用于高效查询 JSONB 数据）
CREATE INDEX IF NOT EXISTS idx_test_results_user_a_gin ON test_results USING GIN (user_a);
CREATE INDEX IF NOT EXISTS idx_test_results_user_b_gin ON test_results USING GIN (user_b);
CREATE INDEX IF NOT EXISTS idx_test_results_scores_json_gin ON test_results USING GIN (scores_json);

-- ============================================
-- 步骤 5：启用 Row Level Security (RLS)
-- ============================================
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 步骤 6：删除旧策略（如果存在，防止重复创建错误）
-- ============================================
DROP POLICY IF EXISTS "Allow public read access" ON test_results;
DROP POLICY IF EXISTS "Allow public insert access" ON test_results;
DROP POLICY IF EXISTS "Allow public update access" ON test_results;

-- ============================================
-- 步骤 7：创建 RLS 策略（允许所有人读取和写入）
-- ============================================
-- 策略 1：允许所有人读取
CREATE POLICY "Allow public read access" ON test_results
  FOR SELECT USING (true);

-- 策略 2：允许所有人插入
CREATE POLICY "Allow public insert access" ON test_results
  FOR INSERT WITH CHECK (true);

-- 策略 3：允许所有人更新
CREATE POLICY "Allow public update access" ON test_results
  FOR UPDATE USING (true);

-- ============================================
-- 步骤 8：验证表结构
-- ============================================
-- 检查表是否存在
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'test_results';

-- 检查所有列及其类型
SELECT 
  column_name, 
  data_type, 
  udt_name,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'test_results' 
ORDER BY ordinal_position;

-- 检查 RLS 是否启用
SELECT 
  tablename,
  rowsecurity
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'test_results';

-- 检查策略是否创建成功
SELECT 
  policyname,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'test_results'
ORDER BY policyname;

-- 检查索引
SELECT 
  indexname,
  indexdef
FROM pg_indexes 
WHERE tablename = 'test_results'
ORDER BY indexname;

-- 验证 completed_at 字段
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'test_results' 
AND column_name = 'completed_at';

-- ============================================
-- 步骤 9：测试插入（可选，用于验证）
-- ============================================
-- 插入一条测试记录
INSERT INTO test_results (
  user_a,
  ls_type,
  at_type,
  animal,
  sternberg_type,
  gottman_type
) 
VALUES (
  '{"test": "data"}'::JSONB,
  'PASSION',
  'SECURE',
  '海豚',
  'CONSUMMATE',
  'NONE'
);

-- 查询测试记录
SELECT 
  id,
  animal,
  ls_type,
  at_type,
  sternberg_type,
  gottman_type,
  created_at,
  completed_at
FROM test_results 
WHERE animal = '海豚'
LIMIT 1;

-- 删除测试记录（可选）
-- DELETE FROM test_results WHERE animal = '海豚' AND ls_type = 'PASSION';

-- ============================================
-- 完成！
-- ============================================
-- 表结构说明：
-- 
-- 核心字段：
-- - id (UUID): 主键，自动生成
-- - created_at (TIMESTAMPTZ): 创建时间
-- - updated_at (TIMESTAMPTZ): 更新时间
-- - user_a (JSONB): 用户A的完整数据（包含所有答案、得分、画像等）
-- - user_b (JSONB): 用户B的完整数据（包含所有答案、得分、画像等）
--
-- 新增字段（便于查询和索引）：
-- - ls_type (TEXT): 主要爱情风格
--   - 可能值：PASSION, GAME, FRIENDSHIP, PRAGMATIC, MANIA, AGAPE
-- - at_type (TEXT): 主要依恋类型
--   - 可能值：SECURE, AVOIDANT, ANXIOUS, FEARFUL
-- - animal (TEXT): 动物类型
--   - 可能值：海豚、刺猬、猫、孔雀、金毛犬、犀牛、海狸、狼、大象、
--             树懒、雪兔、乌龟、雪貂、猫头鹰、鹿、马、山猫、水獭、
--             狐狸、浣熊、章鱼、企鹅、仓鼠
-- - sternberg_type (TEXT): Sternberg 类型
--   - 可能值：LIKING, INFATUATION, EMPTY, ROMANTIC, COMPANIONATE, FOOLISH, CONSUMMATE
-- - gottman_type (TEXT): Gottman 类型
--   - 可能值：NONE, CRITICISM, DEFENSIVENESS, STONEWALLING, CONTEMPT
-- - scores_json (JSONB): 详细得分数据
-- - completed_at (TIMESTAMPTZ): 测试完成时间（NULL 表示未完成，用于分析完成率）
--
-- RLS 策略：
-- - 允许所有人读取（SELECT）
-- - 允许所有人插入（INSERT）
-- - 允许所有人更新（UPDATE）
--
-- 索引：
-- - 基础字段索引：created_at, id, animal, ls_type, at_type, sternberg_type
-- - 分析索引：completed_at（部分索引，仅索引非 NULL 值）
-- - JSONB GIN 索引：user_a, user_b, scores_json（用于高效查询 JSONB 数据）
--
-- 下一步：
-- 1. 确认所有验证查询都返回正确结果
-- 2. 在 Cloudflare Pages 环境变量中配置 Supabase URL 和 Key
-- 3. 测试应用功能
-- 4. 使用以下查询分析测试完成率：
--    SELECT COUNT(*) FILTER (WHERE completed_at IS NOT NULL) * 100.0 / COUNT(*) AS completion_rate
--    FROM test_results;
-- ============================================
