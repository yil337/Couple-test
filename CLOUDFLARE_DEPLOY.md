# Cloudflare Pages 部署指南

## 📋 前置要求

1. 已安装 Node.js 18+ 和 npm
2. 已注册 Cloudflare 账号
3. 已连接 GitHub 仓库到 Cloudflare Pages

## 🚀 部署步骤

### 方法一：通过 Cloudflare Dashboard（推荐）

1. **登录 Cloudflare Dashboard**
   - 访问 https://dash.cloudflare.com/
   - 选择你的账号

2. **创建 Pages 项目**
   - 点击左侧菜单 "Workers & Pages"
   - 点击 "Create application" → "Pages" → "Connect to Git"
   - 选择你的 GitHub 仓库：`yil337/Couple-test`
   - 点击 "Begin setup"

3. **配置构建设置**
   - **Framework preset**: `None`（重要：不要选择 Next.js preset）
   - **Build command**: `npm run cf-build`
   - **Build output directory**: `.vercel/output/static`
   - **Root directory**: `/`（项目根目录）

4. **环境变量（可选）**
   - 如果需要，可以在 "Environment variables" 中添加
   - 本项目使用 CloudBase，配置已硬编码在代码中

5. **部署**
   - 点击 "Save and Deploy"
   - 等待构建完成（通常 3-5 分钟）

### 方法二：通过 Wrangler CLI

1. **安装 Wrangler（如果未安装）**
   ```bash
   npm install -g wrangler
   ```

2. **登录 Cloudflare**
   ```bash
   wrangler login
   ```

3. **构建项目**
   ```bash
   npm run cf-build
   ```

4. **部署**
   ```bash
   npm run deploy
   ```

## ⚙️ 构建配置说明

### Cloudflare Pages Build Settings

```
Framework preset: None
Build command: npm run cf-build
Build output directory: .vercel/output/static
```

**重要提示**：
- ❌ **不要**使用 Cloudflare 的 "Next.js" preset
- ✅ **必须**使用 `None` preset 并手动配置构建命令
- ✅ 构建命令使用 `@cloudflare/next-on-pages` 来转换 Next.js 输出

### 构建流程

1. `npm run cf-build` 执行以下步骤：
   - 运行 `next build` 生成 Next.js 输出
   - 运行 `@cloudflare/next-on-pages` 转换为 Cloudflare Pages 兼容格式
   - 输出到 `.vercel/output/static` 目录

2. Cloudflare Pages 从 `.vercel/output/static` 目录部署

## 🔧 本地测试

在部署前，可以在本地测试 Cloudflare 构建：

```bash
# 构建
npm run cf-build

# 本地预览（需要安装 wrangler）
npx wrangler pages dev .vercel/output/static
```

## 📝 注意事项

### 1. Edge Runtime 兼容性

- 所有页面和 API 路由都使用 Edge Runtime
- 不支持 Node.js 特定 API（fs, path, crypto 等）
- CloudBase SDK 仅在客户端运行（已处理）

### 2. 动态路由

以下路由支持 SSR：
- `/test` - 测试页面
- `/result` - 结果页面
- `/pair/[id]` - 配对页面
- `/match/[id]` - 匹配结果页面
- `/share/[pairId]` - 分享页面

### 3. 环境变量

- 生产环境自动使用 `https://couple-test.pages.dev`
- 开发环境使用 `http://localhost:3000`
- 通过 `process.env.NODE_ENV` 自动区分

### 4. CloudBase 配置

- CloudBase 环境 ID：`cloud1-1gr3cxva723e4e6e`
- 区域：`ap-shanghai`
- 所有数据库操作仅在客户端执行

## 🐛 故障排除

### 构建失败

1. **检查 Node.js 版本**
   ```bash
   node --version  # 应该是 18+
   ```

2. **清除缓存重新构建**
   ```bash
   rm -rf .next node_modules package-lock.json
   npm install
   npm run cf-build
   ```

3. **检查构建日志**
   - 在 Cloudflare Dashboard 查看详细错误信息
   - 检查是否有 Node.js 特定 API 使用

### 运行时错误

1. **检查浏览器控制台**
   - 查看是否有 CloudBase 初始化错误
   - 检查网络请求是否正常

2. **检查 Cloudflare Functions 日志**
   - 在 Cloudflare Dashboard → Workers & Pages → 你的项目 → Functions
   - 查看运行时错误日志

## 📚 相关文档

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [@cloudflare/next-on-pages 文档](https://github.com/cloudflare/next-on-pages)
- [Next.js Edge Runtime](https://nextjs.org/docs/app/api-reference/edge)

## ✅ 部署检查清单

- [ ] 已连接 GitHub 仓库
- [ ] 构建设置已正确配置（Framework: None）
- [ ] 构建命令：`npm run cf-build`
- [ ] 输出目录：`.vercel/output/static`
- [ ] 本地测试构建成功
- [ ] 部署后测试所有页面功能
- [ ] 检查 CloudBase 连接是否正常
- [ ] 验证配对链接生成是否使用生产域名

