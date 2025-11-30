# Cloudflare Pages 构建配置指南

## 问题说明

如果看到 `/_next/static/chunks/pages/index-xxxx.js` 这样的路径，说明 Cloudflare Pages 仍然在使用 Next.js 的传统 SSR 模式，而不是 Next-on-Pages 转换后的静态模式。

## 正确的构建流程

### 1. Cloudflare Pages 设置

在 Cloudflare Dashboard → Pages → 你的项目 → Settings → Builds & deployments：

**Build command:**
```bash
npm run cf-build
```

**Build output directory:**
```
.vercel/output/static
```

**Root directory:**
```
/ (项目根目录)
```

**Node.js version:**
```
18.x 或 20.x
```

### 2. 本地构建测试

在本地测试构建：

```bash
# 1. 安装依赖
npm install

# 2. 运行构建命令
npm run cf-build

# 3. 检查输出目录
ls -la .vercel/output/static

# 4. 应该看到静态文件，而不是 .next/server 目录
```

### 3. 验证构建输出

构建成功后，`.vercel/output/static` 目录应该包含：

- `_next/static/` - 静态资源
- `index.html` - 首页
- `test.html` - 测试页面
- 等等...

**不应该包含：**
- `.next/server/` - SSR 服务器文件
- `node_modules/` - Node.js 模块

### 4. 常见问题

#### 问题 1: 构建命令错误

**错误：** Cloudflare 使用 `npm run build` 而不是 `npm run cf-build`

**解决：** 在 Cloudflare Pages 设置中明确指定构建命令为 `npm run cf-build`

#### 问题 2: 输出目录错误

**错误：** 输出目录设置为 `.next` 或 `out`

**解决：** 必须设置为 `.vercel/output/static`

#### 问题 3: Next.js 配置问题

**错误：** `next.config.js` 没有正确配置

**解决：** 确保使用 `output: 'export'` 或 `output: 'standalone'`

### 5. 部署检查清单

- [ ] Cloudflare Pages 构建命令设置为 `npm run cf-build`
- [ ] 输出目录设置为 `.vercel/output/static`
- [ ] `package.json` 中的 `cf-build` 脚本正确
- [ ] `wrangler.toml` 配置正确
- [ ] `next.config.js` 配置了 `output: 'export'` 或 `output: 'standalone'`
- [ ] 本地构建测试成功
- [ ] 构建输出不包含 `.next/server/` 目录

### 6. 验证部署

部署后，检查页面源代码：

**正确（Next-on-Pages）：**
```html
<script src="/_next/static/chunks/webpack-xxxx.js"></script>
<!-- 没有 /_next/static/chunks/pages/ 路径 -->
```

**错误（传统 SSR）：**
```html
<script src="/_next/static/chunks/pages/index-xxxx.js"></script>
<!-- 这是 SSR 模式 -->
```

## 参考文档

- [Cloudflare Next-on-Pages 文档](https://developers.cloudflare.com/pages/framework-guides/nextjs/)
- [Next-on-Pages GitHub](https://github.com/cloudflare/next-on-pages)



