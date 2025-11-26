# Supabase 数据库设置指南

## 1. 创建 Supabase 项目

1. 访问 https://app.supabase.com
2. 创建新项目或使用现有项目
3. 获取项目 URL 和 Anon Key：
   - 进入：Settings → API
   - 复制 `Project URL` 和 `anon public` key

## 2. 创建数据库表

在 Supabase SQL Editor 中执行以下 SQL：

```sql
-- 创建 tests 表
CREATE TABLE tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  user_a JSONB,
  user_b JSONB
);

-- 创建索引以提高查询性能
CREATE INDEX idx_tests_created_at ON tests(created_at);

-- 启用 Row Level Security (RLS)
ALTER TABLE tests ENABLE ROW LEVEL SECURITY;

-- 创建策略：允许所有人读取和写入（用于匿名访问）
CREATE POLICY "Allow public read access" ON tests
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON tests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON tests
  FOR UPDATE USING (true);
```

## 3. 配置环境变量

创建 `.env.local` 文件（参考 `env.example`）：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

## 4. 数据结构说明

### tests 表结构

- `id` (UUID): 主键，配对 ID
- `created_at` (TIMESTAMPTZ): 创建时间
- `updated_at` (TIMESTAMPTZ): 更新时间
- `user_a` (JSONB): 用户A的测试结果
- `user_b` (JSONB): 用户B的测试结果

### user_a / user_b JSONB 结构

```json
{
  "answers": [
    {
      "questionId": 1,
      "selectedOption": {...}
    }
  ],
  "styleScores": {
    "P": 5,
    "G": 3,
    ...
  },
  "attachScores": {
    "S": 4,
    "A": 2,
    ...
  },
  "resultKey": "P-X",
  "resultName": "烈心型",
  "resultDesc": "...",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

## 5. 验证设置

1. 在 Supabase Dashboard 中检查表是否创建成功
2. 检查 RLS 策略是否已启用
3. 测试插入一条记录验证权限

## 6. 部署到 Cloudflare Pages

在 Cloudflare Pages 环境变量中添加：

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 参考

- Supabase 文档：https://supabase.com/docs
- Supabase JavaScript 客户端：https://supabase.com/docs/reference/javascript/introduction

