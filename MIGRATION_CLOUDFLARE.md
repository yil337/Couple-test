# Cloudflare Pages 迁移总结

## 📝 迁移完成时间
迁移已完成，项目已适配 Cloudflare Pages + Edge Runtime。

## ✅ 已完成的修改

### 1. 新增文件

#### `wrangler.toml`
- Cloudflare Workers/Pages 配置文件
- 配置了构建命令和兼容性日期

#### `CLOUDFLARE_DEPLOY.md`
- 详细的部署指南
- 包含构建配置、故障排除等完整说明

#### `MIGRATION_CLOUDFLARE.md`（本文件）
- 迁移总结文档

### 2. 修改的文件

#### `package.json`
- ✅ 添加 `@cloudflare/next-on-pages` 依赖
- ✅ 添加 `wrangler` 依赖
- ✅ 添加 `typescript` 依赖（构建需要）
- ✅ 新增 `cf-build` 脚本：`npx @cloudflare/next-on-pages`
- ✅ 新增 `deploy` 脚本：`wrangler pages deploy .vercel/output/static`

#### `next.config.js`
- ✅ 移除了 `experimental.runtime: 'edge'`（Pages Router 不需要）
- ✅ 移除了 `output: 'standalone'`（Cloudflare 使用自己的输出格式）
- ✅ 保持 `reactStrictMode: true`

#### `src/lib/utils.js`
- ✅ 修复 `getBaseUrl()` 函数以兼容 Edge Runtime
- ✅ 使用 `window.location.hostname` 检测生产环境
- ✅ 添加 Edge Runtime 兼容的 `process.env` 检查

#### `.gitignore`
- ✅ 添加 `.vercel/output` 到忽略列表
- ✅ 添加 `.wrangler` 到忽略列表

### 3. 兼容性检查结果

#### ✅ CloudBase SDK
- **状态**：完全兼容
- **原因**：CloudBase SDK 仅在客户端（浏览器）运行
- **处理**：所有 CloudBase 函数都有 `typeof window === 'undefined'` 检查
- **位置**：`src/lib/cloudbase.js`

#### ✅ 无 Node.js 特定 API
- **检查结果**：项目中未使用 `fs`、`path`、`crypto` 等 Node.js 内置模块
- **状态**：无需修改

#### ✅ 无 Vercel 特定代码
- **检查结果**：项目中未使用 `@vercel/*` 包或 Vercel 特定 API
- **状态**：无需修改

#### ✅ 动态路由支持
- **状态**：完全支持
- **路由列表**：
  - `/test` - 静态生成
  - `/result` - 静态生成（客户端数据获取）
  - `/pair/[id]` - 动态路由，支持 SSR
  - `/match/[id]` - 动态路由，支持 SSR
  - `/share/[pairId]` - 动态路由，支持 SSR

#### ✅ API 路由
- **状态**：无 API 路由
- **说明**：项目使用客户端直接调用 CloudBase，无需 API 路由

## 🔧 Cloudflare Pages 构建配置

### Build Settings

```
Framework preset: None
Build command: npm run cf-build
Build output directory: .vercel/output/static
Root directory: /
```

### 构建流程

1. **`npm run cf-build`** 执行：
   ```bash
   next build                    # 构建 Next.js 应用
   @cloudflare/next-on-pages    # 转换为 Cloudflare Pages 格式
   ```

2. **输出目录**：`.vercel/output/static`

3. **Cloudflare Pages** 从输出目录部署

## 📋 部署检查清单

### 部署前检查

- [x] 已安装 `@cloudflare/next-on-pages`
- [x] 已安装 `wrangler`
- [x] 已创建 `wrangler.toml`
- [x] 已更新 `package.json` scripts
- [x] 已更新 `next.config.js`
- [x] 已修复 Edge Runtime 兼容性
- [x] 已测试本地构建：`npm run build` ✅
- [x] 已测试 Cloudflare 构建：`npm run cf-build` ✅

### 部署后检查

- [ ] 所有页面正常加载
- [ ] 动态路由正常工作（`/pair/[id]`, `/match/[id]`, `/share/[pairId]`）
- [ ] CloudBase 连接正常
- [ ] 配对链接生成使用生产域名
- [ ] 分享功能正常

## 🚨 重要注意事项

### 1. 构建命令
- ❌ **不要**使用 Cloudflare 的 "Next.js" preset
- ✅ **必须**使用 "None" preset 并手动配置
- ✅ **必须**使用 `npm run cf-build` 作为构建命令

### 2. 输出目录
- ✅ **必须**设置为 `.vercel/output/static`
- ❌ **不要**使用默认的 `.next` 或 `out`

### 3. Edge Runtime
- ✅ 所有代码已兼容 Edge Runtime
- ✅ CloudBase SDK 仅在客户端运行
- ✅ 无 Node.js 特定 API 使用

### 4. 环境变量
- ✅ 生产环境自动使用 `https://couple-test.pages.dev`
- ✅ 开发环境使用 `http://localhost:3000`
- ✅ 通过 `window.location.hostname` 自动检测

## 📚 相关文档

- [Cloudflare Pages 文档](https://developers.cloudflare.com/pages/)
- [@cloudflare/next-on-pages 文档](https://github.com/cloudflare/next-on-pages)
- [Next.js Edge Runtime](https://nextjs.org/docs/app/api-reference/edge)
- [部署指南](./CLOUDFLARE_DEPLOY.md)

## 🎯 下一步

1. **在 Cloudflare Dashboard 配置项目**
   - 按照 `CLOUDFLARE_DEPLOY.md` 中的步骤操作

2. **首次部署**
   - 连接 GitHub 仓库
   - 配置构建设置
   - 触发首次部署

3. **验证功能**
   - 测试所有页面
   - 验证 CloudBase 连接
   - 检查配对链接生成

4. **自定义域名（可选）**
   - 在 Cloudflare Pages 设置中添加自定义域名
   - 更新 `src/lib/utils.js` 中的域名检测逻辑

## ✨ 迁移成功！

项目已完全适配 Cloudflare Pages，可以开始部署了！





