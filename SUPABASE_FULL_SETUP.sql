-- ============================================
-- 完整 Supabase 数据库设置脚本
-- ============================================
-- 请在 Supabase SQL Editor 中执行此脚本
-- 访问：https://app.supabase.com/project/otprifxlonsnlikbwngz/editor
-- ============================================

-- ============================================
-- 步骤 1：删除旧表（如果存在）
-- ============================================
DROP TABLE IF EXISTS test_results CASCADE;

-- ============================================
-- 步骤 2：创建 test_results 表
-- ============================================
CREATE TABLE test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_a JSONB,  -- 注意：必须是 JSONB，不是 JSONB[]
  user_b JSONB   -- 注意：必须是 JSONB，不是 JSONB[]
);

-- ============================================
-- 步骤 3：创建索引以提高查询性能
-- ============================================
CREATE INDEX idx_test_results_created_at ON test_results(created_at);
CREATE INDEX idx_test_results_id ON test_results(id);

-- ============================================
-- 步骤 4：启用 Row Level Security (RLS)
-- ============================================
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- ============================================
-- 步骤 5：删除旧策略（如果存在，防止重复创建错误）
-- ============================================
DROP POLICY IF EXISTS "Allow public read access" ON test_results;
DROP POLICY IF EXISTS "Allow public insert access" ON test_results;
DROP POLICY IF EXISTS "Allow public update access" ON test_results;

-- ============================================
-- 步骤 6：创建 RLS 策略（允许所有人读取和写入）
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
-- 步骤 7：验证表结构
-- ============================================
-- 检查表是否存在
SELECT 
  table_name,
  table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name = 'test_results';

-- 检查列类型（确保 user_a 和 user_b 是 JSONB，不是 JSONB[]）
SELECT 
  column_name, 
  data_type, 
  udt_name
FROM information_schema.columns 
WHERE table_name = 'test_results' 
  AND column_name IN ('user_a', 'user_b');

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
  qual
FROM pg_policies 
WHERE tablename = 'test_results';

-- ============================================
-- 步骤 8：测试插入（可选，用于验证）
-- ============================================
-- 插入一条测试记录
INSERT INTO test_results (user_a) 
VALUES ('{"test": "data"}'::JSONB);

-- 查询测试记录
SELECT * FROM test_results WHERE user_a->>'test' = 'data';

-- 删除测试记录
DELETE FROM test_results WHERE user_a->>'test' = 'data';

-- ============================================
-- 完成！
-- ============================================
-- 表结构：
-- - id (UUID): 主键，自动生成
-- - created_at (TIMESTAMPTZ): 创建时间
-- - updated_at (TIMESTAMPTZ): 更新时间
-- - user_a (JSONB): 用户A的测试结果（单个JSON对象）
-- - user_b (JSONB): 用户B的测试结果（单个JSON对象）
--
-- RLS 策略：
-- - 允许所有人读取（SELECT）
-- - 允许所有人插入（INSERT）
-- - 允许所有人更新（UPDATE）
--
-- 下一步：
-- 1. 在 Supabase Dashboard → Settings → API 中获取：
--    - Project URL: https://otprifxlonsnlikbwngz.supabase.co
--    - anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
--
-- 2. 在 Cloudflare Pages 环境变量中配置：
--    - NEXT_PUBLIC_SUPABASE_URL
--    - NEXT_PUBLIC_SUPABASE_ANON_KEY
-- ============================================

