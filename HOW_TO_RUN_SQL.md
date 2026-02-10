# 如何在 Supabase 中执行 SQL 文件

## 方法一：通过 Supabase Dashboard（推荐）

### 步骤 1：登录 Supabase
1. 访问 https://app.supabase.com
2. 登录你的账户
3. 选择你的项目（项目名称通常包含在环境变量中）

### 步骤 2：打开 SQL Editor
1. 在左侧边栏，点击 **"SQL Editor"**（SQL 编辑器）
2. 或者直接访问：`https://app.supabase.com/project/[你的项目ID]/sql/new`

### 步骤 3：执行 SQL 文件
1. 点击 **"New query"**（新建查询）按钮
2. 打开本地的 SQL 文件（如 `SUPABASE_ADD_COMPLETED_AT.sql`）
3. 复制文件中的所有内容（`Cmd+A` 全选，`Cmd+C` 复制）
4. 粘贴到 SQL Editor 的编辑框中
5. 点击右上角的 **"Run"**（运行）按钮，或按 `Cmd+Enter`（Mac）或 `Ctrl+Enter`（Windows/Linux）

### 步骤 4：查看结果
- 如果执行成功，会显示 "Success. No rows returned" 或查询结果
- 如果有错误，会在底部显示错误信息

## 方法二：通过 Supabase CLI（可选）

如果你安装了 Supabase CLI，也可以通过命令行执行：

### 安装 Supabase CLI（如果还没有）
```bash
npm install -g supabase
```

### 登录 Supabase
```bash
supabase login
```

### 链接到项目
```bash
supabase link --project-ref [你的项目ID]
```

### 执行 SQL 文件
```bash
supabase db execute -f SUPABASE_ADD_COMPLETED_AT.sql
```

## 执行 `SUPABASE_ADD_COMPLETED_AT.sql` 的具体步骤

### 1. 打开文件
打开项目中的 `SUPABASE_ADD_COMPLETED_AT.sql` 文件

### 2. 复制内容
文件内容如下：
```sql
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
```

### 3. 在 Supabase Dashboard 中执行
1. 访问：https://app.supabase.com/project/[你的项目ID]/sql/new
2. 粘贴上述 SQL 代码
3. 点击 **"Run"** 按钮

### 4. 验证执行结果
执行后应该看到类似这样的结果：
```
column_name    | data_type   | is_nullable
---------------|-------------|-------------
completed_at   | timestamptz | YES
```

## 常见问题

### Q: 如何找到我的项目 ID？
A: 
1. 在 Supabase Dashboard 中，项目 ID 显示在 URL 中：`https://app.supabase.com/project/[项目ID]`
2. 或者在项目设置（Settings）→ API 页面可以看到

### Q: 执行 SQL 时出现权限错误？
A: 
- 确保你使用的是项目所有者账户
- 检查 RLS（Row Level Security）策略是否允许操作

### Q: 如何确认 SQL 已成功执行？
A: 
- 执行验证查询（文件末尾的 SELECT 语句）应该返回结果
- 或者在 Table Editor 中查看 `test_results` 表，应该能看到新字段

### Q: 可以多次执行同一个 SQL 文件吗？
A: 
- 是的，因为使用了 `IF NOT EXISTS`，重复执行不会报错
- 但如果字段已存在，会跳过创建步骤

## 执行其他 SQL 文件

同样的方法适用于所有 SQL 文件：
- `SUPABASE_SCHEMA_UPDATE.sql`
- `SUPABASE_COMPLETE.sql`
- 等等

只需复制文件内容，粘贴到 SQL Editor，然后运行即可。
