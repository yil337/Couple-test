-- ============================================
-- 完整 Supabase 数据库设置与分析脚本
-- ============================================
-- 用途：一次性设置完整的数据库结构，包括表、字段、索引、策略和分析查询
-- 执行位置：Supabase SQL Editor
-- 访问：https://app.supabase.com/project/[你的项目ID]/sql/new
-- ============================================

-- ============================================
-- 第一部分：创建/更新表结构
-- ============================================

-- 创建 test_results 表（如果不存在）
-- 这个表用于存储所有测试结果，包括单人测试和双人测试
CREATE TABLE IF NOT EXISTS test_results (
  -- 主键：唯一标识每条测试记录
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- 创建时间：记录首次创建的时间戳
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 更新时间：记录最后更新的时间戳
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- 用户A的完整数据：JSONB格式，包含所有答案、得分、画像等
  user_a JSONB,
  
  -- 用户B的完整数据：JSONB格式，包含所有答案、得分、画像等（双人测试时使用）
  user_b JSONB,
  
  -- 主要爱情风格：从6种类型中选择（PASSION, GAME, FRIENDSHIP, PRAGMATIC, MANIA, AGAPE）
  ls_type TEXT,
  
  -- 主要依恋类型：从4种类型中选择（SECURE, AVOIDANT, ANXIOUS, FEARFUL）
  at_type TEXT,
  
  -- 动物类型：24种动物之一（如：海豚、刺猬、猫等）
  animal TEXT,
  
  -- Sternberg 类型：7种爱情类型之一（LIKING, INFATUATION, EMPTY, ROMANTIC, COMPANIONATE, FOOLISH, CONSUMMATE）
  sternberg_type TEXT,
  
  -- Gottman 类型：5种沟通模式之一（NONE, CRITICISM, DEFENSIVENESS, STONEWALLING, CONTEMPT）
  gottman_type TEXT,
  
  -- 详细得分：JSONB格式，包含所有得分向量和详细数据
  scores_json JSONB,
  
  -- 测试完成时间：用于分析完成率，NULL表示未完成，有值表示已完成
  completed_at TIMESTAMPTZ
);

-- ============================================
-- 第二部分：添加字段（如果表已存在）
-- ============================================
-- 如果表已经存在，使用 ALTER TABLE 添加新字段
-- 使用 IF NOT EXISTS 确保不会重复添加

-- 添加个人画像相关字段
ALTER TABLE test_results 
  ADD COLUMN IF NOT EXISTS ls_type TEXT,           -- 主要爱情风格
  ADD COLUMN IF NOT EXISTS at_type TEXT,           -- 主要依恋类型
  ADD COLUMN IF NOT EXISTS animal TEXT,             -- 动物类型
  ADD COLUMN IF NOT EXISTS sternberg_type TEXT,     -- Sternberg 类型
  ADD COLUMN IF NOT EXISTS gottman_type TEXT,       -- Gottman 类型
  ADD COLUMN IF NOT EXISTS scores_json JSONB,       -- 详细得分
  ADD COLUMN IF NOT EXISTS completed_at TIMESTAMPTZ; -- 测试完成时间

-- ============================================
-- 第三部分：创建索引（提高查询性能）
-- ============================================

-- 基础字段索引：用于快速查询和排序
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON test_results(created_at);        -- 创建时间索引
CREATE INDEX IF NOT EXISTS idx_test_results_id ON test_results(id);                        -- 主键索引（通常自动创建，但明确指定更安全）
CREATE INDEX IF NOT EXISTS idx_test_results_animal ON test_results(animal);                -- 动物类型索引
CREATE INDEX IF NOT EXISTS idx_test_results_ls_type ON test_results(ls_type);               -- 爱情风格索引
CREATE INDEX IF NOT EXISTS idx_test_results_at_type ON test_results(at_type);              -- 依恋类型索引
CREATE INDEX IF NOT EXISTS idx_test_results_sternberg_type ON test_results(sternberg_type); -- Sternberg 类型索引

-- 分析索引：completed_at 的部分索引（仅索引非 NULL 值，提高已完成测试的查询性能）
CREATE INDEX IF NOT EXISTS idx_test_results_completed_at 
ON test_results(completed_at) 
WHERE completed_at IS NOT NULL;

-- JSONB 字段的 GIN 索引：用于高效查询 JSONB 数据内容
CREATE INDEX IF NOT EXISTS idx_test_results_user_a_gin ON test_results USING GIN (user_a);      -- 用户A数据索引
CREATE INDEX IF NOT EXISTS idx_test_results_user_b_gin ON test_results USING GIN (user_b);      -- 用户B数据索引
CREATE INDEX IF NOT EXISTS idx_test_results_scores_json_gin ON test_results USING GIN (scores_json); -- 得分数据索引

-- ============================================
-- 第四部分：启用 Row Level Security (RLS)
-- ============================================
-- RLS 是 Supabase 的安全功能，用于控制数据访问权限

-- 启用行级安全策略
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 第五部分：删除旧策略（防止重复创建错误）
-- ============================================
-- 如果策略已存在，先删除再创建，避免重复创建错误

DROP POLICY IF EXISTS "Allow public read access" ON test_results;    -- 删除旧的读取策略
DROP POLICY IF EXISTS "Allow public insert access" ON test_results;  -- 删除旧的插入策略
DROP POLICY IF EXISTS "Allow public update access" ON test_results;  -- 删除旧的更新策略

-- ============================================
-- 第六部分：创建 RLS 策略（允许所有人读取和写入）
-- ============================================
-- 这些策略允许匿名用户访问数据（适合公开测试应用）

-- 策略 1：允许所有人读取数据（SELECT 操作）
CREATE POLICY "Allow public read access" ON test_results
  FOR SELECT USING (true);

-- 策略 2：允许所有人插入数据（INSERT 操作）
CREATE POLICY "Allow public insert access" ON test_results
  FOR INSERT WITH CHECK (true);

-- 策略 3：允许所有人更新数据（UPDATE 操作）
CREATE POLICY "Allow public update access" ON test_results
  FOR UPDATE USING (true);

-- ============================================
-- 第七部分：为已有数据批量设置 completed_at
-- ============================================
-- 如果表中有旧数据，为已完成测试设置 completed_at 时间戳
-- 判断标准：如果 user_a 或 user_b 有数据，说明测试已完成

UPDATE test_results
SET completed_at = COALESCE(updated_at, created_at)  -- 使用 updated_at，如果没有则使用 created_at
WHERE (user_a IS NOT NULL OR user_b IS NOT NULL)     -- 有用户数据说明已完成
  AND completed_at IS NULL;                          -- 只更新还没有 completed_at 的记录

-- ============================================
-- 第八部分：验证表结构
-- ============================================
-- 执行以下查询验证表结构是否正确设置

-- 查询 1：检查表是否存在
SELECT 
  table_name,    -- 表名
  table_type      -- 表类型
FROM information_schema.tables 
WHERE table_schema = 'public'    -- 在 public schema 中查找
  AND table_name = 'test_results';

-- 查询 2：检查所有列及其类型
SELECT 
  column_name,     -- 列名
  data_type,       -- 数据类型
  udt_name,        -- 用户定义类型名
  is_nullable      -- 是否允许 NULL
FROM information_schema.columns 
WHERE table_name = 'test_results' 
ORDER BY ordinal_position;  -- 按列的顺序排列

-- 查询 3：检查 RLS 是否启用
SELECT 
  tablename,      -- 表名
  rowsecurity     -- RLS 是否启用（true/false）
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename = 'test_results';

-- 查询 4：检查策略是否创建成功
SELECT 
  policyname,     -- 策略名称
  cmd,            -- 命令类型（SELECT, INSERT, UPDATE）
  qual,           -- 条件表达式
  with_check      -- WITH CHECK 表达式
FROM pg_policies 
WHERE tablename = 'test_results'
ORDER BY policyname;

-- 查询 5：检查所有索引
SELECT 
  indexname,      -- 索引名称
  indexdef        -- 索引定义
FROM pg_indexes 
WHERE tablename = 'test_results'
ORDER BY indexname;

-- 查询 6：验证 completed_at 字段
SELECT 
  column_name,    -- 列名
  data_type,      -- 数据类型
  is_nullable     -- 是否允许 NULL
FROM information_schema.columns
WHERE table_name = 'test_results' 
  AND column_name = 'completed_at';

-- ============================================
-- 第九部分：基础统计查询
-- ============================================
-- 这些查询用于快速了解测试数据的基本情况

-- 查询 1：总测试数量（所有创建的测试记录）
SELECT COUNT(*) AS total_tests
FROM test_results;

-- 查询 2：已完成测试的数量（用户提交了结果，completed_at 不为 NULL）
SELECT COUNT(*) AS completed_tests
FROM test_results 
WHERE completed_at IS NOT NULL;

-- 查询 3：未完成测试的数量（创建了但未提交，completed_at 为 NULL）
SELECT COUNT(*) AS incomplete_tests
FROM test_results 
WHERE completed_at IS NULL;

-- 查询 4：测试完成率（百分比）
SELECT 
  COUNT(*) AS total_tests,                                                              -- 总测试数
  COUNT(*) FILTER (WHERE completed_at IS NOT NULL) AS completed_tests,                 -- 已完成数
  COUNT(*) FILTER (WHERE completed_at IS NULL) AS incomplete_tests,                     -- 未完成数
  ROUND(                                                                                 -- 四舍五入到2位小数
    COUNT(*) FILTER (WHERE completed_at IS NOT NULL) * 100.0 / NULLIF(COUNT(*), 0),    -- 完成率计算（避免除以0）
    2
  ) AS completion_rate_percent                                                          -- 完成率百分比
FROM test_results;

-- ============================================
-- 第十部分：时间维度统计
-- ============================================
-- 按不同时间维度统计测试数据

-- 查询 1：按日期统计测试数量（最近30天）
SELECT 
  DATE(created_at) AS test_date,                                                       -- 测试日期
  COUNT(*) AS total_tests,                                                             -- 总测试数
  COUNT(*) FILTER (WHERE completed_at IS NOT NULL) AS completed_tests                   -- 已完成数
FROM test_results
GROUP BY DATE(created_at)                                                                -- 按日期分组
ORDER BY test_date DESC                                                                  -- 按日期降序排列
LIMIT 30;                                                                                -- 限制返回30条

-- 查询 2：按小时统计测试数量（查看一天中的活跃时段，最近7天）
SELECT 
  EXTRACT(HOUR FROM created_at) AS hour,                                                -- 小时（0-23）
  COUNT(*) AS total_tests,                                                              -- 总测试数
  COUNT(*) FILTER (WHERE completed_at IS NOT NULL) AS completed_tests                  -- 已完成数
FROM test_results
WHERE created_at >= CURRENT_DATE - INTERVAL '7 days'                                    -- 最近7天的数据
GROUP BY EXTRACT(HOUR FROM created_at)                                                  -- 按小时分组
ORDER BY hour;                                                                          -- 按小时排序

-- 查询 3：今日统计
SELECT 
  COUNT(*) AS today_total,                                                              -- 今日总测试数
  COUNT(*) FILTER (WHERE completed_at IS NOT NULL) AS today_completed,                 -- 今日已完成数
  COUNT(*) FILTER (WHERE completed_at >= CURRENT_DATE) AS today_completed_today         -- 今日完成数（completed_at 在今天）
FROM test_results
WHERE created_at >= CURRENT_DATE;                                                       -- 今天创建的记录

-- 查询 4：本周统计
SELECT 
  COUNT(*) AS week_total,                                                               -- 本周总测试数
  COUNT(*) FILTER (WHERE completed_at IS NOT NULL) AS week_completed                    -- 本周已完成数
FROM test_results
WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE);                                  -- 本周开始时间

-- 查询 5：本月统计
SELECT 
  COUNT(*) AS month_total,                                                              -- 本月总测试数
  COUNT(*) FILTER (WHERE completed_at IS NOT NULL) AS month_completed                   -- 本月已完成数
FROM test_results
WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE);                                 -- 本月开始时间

-- ============================================
-- 第十一部分：测试类型统计
-- ============================================
-- 分析不同类型的测试分布

-- 查询 1：统计单人测试 vs 双人测试
-- 单人测试：只有 user_a，没有 user_b
-- 双人测试：既有 user_a 又有 user_b
SELECT 
  COUNT(*) FILTER (WHERE user_a IS NOT NULL AND user_b IS NULL) AS single_user_tests, -- 单人测试数
  COUNT(*) FILTER (WHERE user_a IS NOT NULL AND user_b IS NOT NULL) AS pair_tests,     -- 双人测试数
  COUNT(*) AS total_tests                                                               -- 总测试数
FROM test_results;

-- 查询 2：统计各动物类型的分布（已完成测试）
SELECT 
  animal,                                                                               -- 动物类型
  COUNT(*) AS count,                                                                    -- 数量
  ROUND(COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER (), 0), 2) AS percentage           -- 百分比（使用窗口函数计算总数）
FROM test_results
WHERE animal IS NOT NULL                                                                -- 只统计有动物类型的记录
  AND completed_at IS NOT NULL                                                          -- 只统计已完成的测试
GROUP BY animal                                                                          -- 按动物类型分组
ORDER BY count DESC;                                                                    -- 按数量降序排列

-- 查询 3：统计各爱情风格分布
SELECT 
  ls_type,                                                                              -- 爱情风格
  COUNT(*) AS count,                                                                    -- 数量
  ROUND(COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER (), 0), 2) AS percentage          -- 百分比
FROM test_results
WHERE ls_type IS NOT NULL                                                               -- 只统计有爱情风格的记录
  AND completed_at IS NOT NULL                                                          -- 只统计已完成的测试
GROUP BY ls_type                                                                        -- 按爱情风格分组
ORDER BY count DESC;                                                                    -- 按数量降序排列

-- 查询 4：统计各依恋类型分布
SELECT 
  at_type,                                                                              -- 依恋类型
  COUNT(*) AS count,                                                                    -- 数量
  ROUND(COUNT(*) * 100.0 / NULLIF(SUM(COUNT(*)) OVER (), 0), 2) AS percentage          -- 百分比
FROM test_results
WHERE at_type IS NOT NULL                                                               -- 只统计有依恋类型的记录
  AND completed_at IS NOT NULL                                                          -- 只统计已完成的测试
GROUP BY at_type                                                                        -- 按依恋类型分组
ORDER BY count DESC;                                                                    -- 按数量降序排列

-- ============================================
-- 第十二部分：详细数据查询
-- ============================================
-- 查看具体的测试记录详情

-- 查询 1：查看最近的测试记录（带完成状态）
SELECT 
  id,                                                                                   -- 记录ID
  created_at,                                                                           -- 创建时间
  completed_at,                                                                         -- 完成时间
  animal,                                                                               -- 动物类型
  ls_type,                                                                             -- 爱情风格
  at_type,                                                                             -- 依恋类型
  CASE 
    WHEN completed_at IS NOT NULL THEN '✅ 已完成'                                      -- 已完成标记
    ELSE '❌ 未完成'                                                                     -- 未完成标记
  END AS status,                                                                        -- 状态
  CASE 
    WHEN user_b IS NOT NULL THEN '双人测试'                                              -- 双人测试标记
    ELSE '单人测试'                                                                      -- 单人测试标记
  END AS test_type                                                                      -- 测试类型
FROM test_results
ORDER BY created_at DESC                                                                -- 按创建时间降序排列
LIMIT 50;                                                                               -- 限制返回50条

-- 查询 2：查看完成时间分布（从创建到完成的时间差，单位：分钟）
SELECT 
  id,                                                                                   -- 记录ID
  created_at,                                                                           -- 创建时间
  completed_at,                                                                        -- 完成时间
  EXTRACT(EPOCH FROM (completed_at - created_at)) / 60 AS minutes_to_complete          -- 完成耗时（分钟）
FROM test_results
WHERE completed_at IS NOT NULL                                                         -- 只查看已完成的测试
ORDER BY completed_at DESC                                                             -- 按完成时间降序排列
LIMIT 50;                                                                               -- 限制返回50条

-- 查询 3：平均完成时间（分钟）
SELECT 
  ROUND(AVG(EXTRACT(EPOCH FROM (completed_at - created_at)) / 60), 2) AS avg_minutes_to_complete  -- 平均完成时间（分钟，保留2位小数）
FROM test_results
WHERE completed_at IS NOT NULL;                                                         -- 只统计已完成的测试

-- ============================================
-- 第十三部分：快速仪表板查询（一键查看所有关键指标）
-- ============================================
-- 这个查询返回所有关键统计指标，适合作为仪表板使用

SELECT 
  -- 总体统计
  (SELECT COUNT(*) FROM test_results) AS total_tests,                                  -- 总测试数
  (SELECT COUNT(*) FROM test_results WHERE completed_at IS NOT NULL) AS completed_tests,  -- 已完成测试数
  (SELECT COUNT(*) FROM test_results WHERE completed_at IS NULL) AS incomplete_tests, -- 未完成测试数
  
  -- 完成率
  ROUND(                                                                                 -- 四舍五入到2位小数
    (SELECT COUNT(*) FROM test_results WHERE completed_at IS NOT NULL) * 100.0 /       -- 已完成数 * 100
    NULLIF((SELECT COUNT(*) FROM test_results), 0),                                    -- 总测试数（避免除以0）
    2
  ) AS completion_rate_percent,                                                        -- 完成率百分比
  
  -- 今日统计
  (SELECT COUNT(*) FROM test_results WHERE created_at >= CURRENT_DATE) AS today_total,        -- 今日总测试数
  (SELECT COUNT(*) FROM test_results WHERE completed_at >= CURRENT_DATE) AS today_completed,  -- 今日已完成数
  
  -- 本周统计
  (SELECT COUNT(*) FROM test_results WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)) AS week_total,        -- 本周总测试数
  (SELECT COUNT(*) FROM test_results WHERE completed_at >= DATE_TRUNC('week', CURRENT_DATE)) AS week_completed,   -- 本周已完成数
  
  -- 本月统计
  (SELECT COUNT(*) FROM test_results WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)) AS month_total,      -- 本月总测试数
  (SELECT COUNT(*) FROM test_results WHERE completed_at >= DATE_TRUNC('month', CURRENT_DATE)) AS month_completed, -- 本月已完成数
  
  -- 测试类型
  (SELECT COUNT(*) FROM test_results WHERE user_b IS NOT NULL) AS pair_tests,          -- 双人测试数
  (SELECT COUNT(*) FROM test_results WHERE user_a IS NOT NULL AND user_b IS NULL) AS single_tests;  -- 单人测试数

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
-- 分析字段（便于查询和索引）：
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
-- 使用建议：
-- 1. 首次设置：执行整个脚本
-- 2. 日常查询：使用第九部分到第十三部分的查询
-- 3. 快速查看：使用第十三部分的仪表板查询
-- 4. 数据分析：根据需要使用时间维度或类型统计查询
-- ============================================
