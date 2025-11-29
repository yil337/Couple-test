# 环境变量配置指南

## ⚠️ 重要提示

**环境变量不能在 SQL 中设置**，需要在以下位置配置：

---

## 1. Supabase 环境变量（已自动配置）

Supabase 项目会自动提供以下信息，无需手动设置：

- **Project URL**: `https://otprifxlonsnlikbwngz.supabase.co`
- **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90cHJpZnhsb25zbmxpa2J3bmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjYwMDQsImV4cCI6MjA3OTc0MjAwNH0.eGBOMf77vpFfjo9b4QbDbAPgr1tqJ9kCkeBifBPbCEk`

### 如何获取（如果需要确认）：

1. 登录 Supabase Dashboard: https://app.supabase.com/project/otprifxlonsnlikbwngz
2. 进入 **Settings** → **API**
3. 复制以下信息：
   - **Project URL** → 用作 `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → 用作 `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 2. 本地开发环境变量

在项目根目录创建 `.env.local` 文件：

```bash
NEXT_PUBLIC_SUPABASE_URL=https://otprifxlonsnlikbwngz.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90cHJpZnhsb25zbmxpa2J3bmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjYwMDQsImV4cCI6MjA3OTc0MjAwNH0.eGBOMf77vpFfjo9b4QbDbAPgr1tqJ9kCkeBifBPbCEk
```

---

## 3. Cloudflare Pages 环境变量

### 配置步骤：

1. 登录 Cloudflare Dashboard: https://dash.cloudflare.com
2. 进入 **Pages** → **couple-test** 项目
3. 点击 **Settings** → **Environment variables**
4. 添加以下两个变量：

#### 变量 1：
- **Name**: `NEXT_PUBLIC_SUPABASE_URL`
- **Value**: `https://otprifxlonsnlikbwngz.supabase.co`
- **Environment**: 选择 **Production** 和 **Preview**

#### 变量 2：
- **Name**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Value**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im90cHJpZnhsb25zbmxpa2J3bmd6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNjYwMDQsImV4cCI6MjA3OTc0MjAwNH0.eGBOMf77vpFfjo9b4QbDbAPgr1tqJ9kCkeBifBPbCEk`
- **Environment**: 选择 **Production** 和 **Preview**

5. 点击 **Save**
6. 重新部署项目（或等待自动重新部署）

---

## 4. 验证环境变量

### 本地验证：

```bash
# 在项目根目录执行
npm run dev
```

打开浏览器控制台，应该看到：
- 没有 "Missing environment variables" 错误
- Supabase 客户端初始化成功

### 生产环境验证：

访问 `https://couple-test.pages.dev`，打开浏览器控制台：
- 检查是否有环境变量相关的错误
- 测试保存功能是否正常

---

## 5. 环境变量说明

| 变量名 | 说明 | 必需 | 示例值 |
|--------|------|------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase 项目 URL | ✅ 是 | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase 匿名公钥 | ✅ 是 | `eyJhbGci...` |

**注意**：
- `NEXT_PUBLIC_` 前缀表示这些变量会在客户端代码中可用
- 这些变量是公开的，可以安全地暴露在客户端代码中
- `anon key` 是公开密钥，用于客户端访问，不是敏感信息

---

## 6. 故障排查

### 问题：环境变量未生效

**解决方案**：
1. 确保变量名以 `NEXT_PUBLIC_` 开头
2. 重启开发服务器（`npm run dev`）
3. 清除浏览器缓存
4. 在 Cloudflare Pages 中重新部署

### 问题：生产环境无法访问 Supabase

**解决方案**：
1. 检查 Cloudflare Pages 环境变量是否已配置
2. 确认变量值是否正确（没有多余空格）
3. 检查 Supabase RLS 策略是否允许公共访问
4. 查看浏览器控制台的详细错误信息

---

## 完成检查清单

- [ ] Supabase 表已创建（执行 `SUPABASE_FULL_SETUP.sql`）
- [ ] 本地 `.env.local` 文件已配置
- [ ] Cloudflare Pages 环境变量已配置
- [ ] 本地开发服务器可以正常连接 Supabase
- [ ] 生产环境可以正常保存和读取数据


