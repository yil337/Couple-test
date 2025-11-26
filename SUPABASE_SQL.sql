-- ============================================
-- Supabase 数据库表创建脚本
-- ============================================
-- 请在 Supabase SQL Editor 中执行此脚本
-- 访问：https://app.supabase.com/project/otprifxlonsnlikbwngz/editor

-- 1. 创建 test_results 表
CREATE TABLE IF NOT EXISTS test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_a JSONB,
  user_b JSONB
);

-- 2. 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_test_results_created_at ON test_results(created_at);

-- 3. 启用 Row Level Security (RLS)
ALTER TABLE test_results ENABLE ROW LEVEL SECURITY;

-- 4. 删除旧策略（如果存在）- 必须先删除再创建
DROP POLICY IF EXISTS "Allow public read access" ON test_results;
DROP POLICY IF EXISTS "Allow public insert access" ON test_results;
DROP POLICY IF EXISTS "Allow public update access" ON test_results;

-- 5. 创建策略：允许所有人读取和写入（用于匿名访问）
-- 使用 IF NOT EXISTS 或先 DROP 再 CREATE（PostgreSQL 不支持 IF NOT EXISTS for policies）
CREATE POLICY "Allow public read access" ON test_results
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON test_results
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON test_results
  FOR UPDATE USING (true);

-- ============================================
-- 验证查询（可选）
-- ============================================
-- SELECT * FROM test_results LIMIT 10;

