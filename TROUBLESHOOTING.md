# 故障排查指南

## 问题：结果保存失败

### 可能原因和解决方案

#### 1. Cloudflare Pages 环境变量未配置 ⚠️ 最常见

**症状：** 生产环境（couple-test.pages.dev）显示"保存结果失败"

**解决方案：**
1. 登录 Cloudflare Dashboard
2. 进入 Pages → couple-test 项目
3. 点击 "Settings" → "Environment variables"
4. 添加以下环境变量：
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://otprifxlonsnlikbwngz.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90cHJpZnhsb25zbmxpa2J3bmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjYwMDQsImV4cCI6MjA3OTc0MjAwNH0.eGBOMf77vpFfjo9b4QbDbAPgr1tqJ9kCkeBifBPbCEk`
5. 确保两个环境变量都设置为 "Production" 和 "Preview"
6. 保存后重新部署

#### 2. Supabase RLS 策略问题

**检查步骤：**
1. 登录 Supabase Dashboard
2. 进入 "Authentication" → "Policies"
3. 确认 `test_results` 表有以下策略：
   - `Allow public read access` (SELECT)
   - `Allow public insert access` (INSERT)
   - `Allow public update access` (UPDATE)

**如果策略不存在，执行以下 SQL：**
```sql
CREATE POLICY "Allow public read access" ON test_results
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON test_results
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update access" ON test_results
  FOR UPDATE USING (true);
```

#### 3. 浏览器控制台检查

**步骤：**
1. 让朋友打开浏览器开发者工具（F12）
2. 切换到 "Console" 标签
3. 重新测试，查看错误信息
4. 常见错误：
   - `Missing environment variables` → 环境变量未配置
   - `new row violates row-level security policy` → RLS 策略问题
   - `relation "test_results" does not exist` → 表未创建
   - `Network error` → 网络连接问题

#### 4. 网络请求检查

**步骤：**
1. 打开浏览器开发者工具（F12）
2. 切换到 "Network" 标签
3. 重新测试，查找对 `supabase.co` 的请求
4. 检查请求状态：
   - `200/201` → 成功
   - `401` → 认证问题（检查 API Key）
   - `403` → 权限问题（检查 RLS 策略）
   - `404` → 表不存在
   - `500` → 服务器错误

#### 5. Supabase 表结构检查

**确认表已创建：**
1. 登录 Supabase Dashboard
2. 进入 "Table Editor"
3. 确认 `test_results` 表存在
4. 确认表结构：
   - `id` (UUID, Primary Key)
   - `created_at` (Timestamptz)
   - `updated_at` (Timestamptz)
   - `user_a` (JSONB)
   - `user_b` (JSONB)

### 快速检查清单

- [ ] Cloudflare Pages 环境变量已配置
- [ ] Supabase RLS 策略已启用并允许公共访问
- [ ] `test_results` 表已创建
- [ ] 浏览器控制台无错误
- [ ] 网络请求返回 200/201 状态码

### 获取详细错误信息

现在代码已改进，会显示详细的错误信息。请让朋友：
1. 查看页面上的错误提示（会显示具体错误原因）
2. 打开浏览器控制台（F12），查看详细日志
3. 将错误信息截图或复制发给你

### 常见错误代码

- `PGRST116` → 记录不存在（正常，会自动创建）
- `42501` → 权限不足（检查 RLS 策略）
- `42P01` → 表不存在（需要创建表）
- `Network error` → 网络问题或环境变量未配置



