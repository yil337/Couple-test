# Cloudflare Pages 构建失败 - 故障排除

## 🔍 问题诊断

### 错误信息
```
npm error Missing script: "cf-build"
```

### 可能的原因

1. **Cloudflare 使用了旧的提交**
   - Cloudflare 可能缓存了旧的构建
   - 需要重新触发部署

2. **构建输出目录配置错误**
   - 当前配置：`./vercel/output/static`
   - 应该是：`.vercel/output/static`（没有 `./` 前缀）

3. **GitHub 分支问题**
   - 确认 Cloudflare 连接的是正确的分支（main）

## ✅ 解决方案

### 方案 1：重新触发部署（推荐）

1. **在 Cloudflare Dashboard 中**：
   - 进入你的 Pages 项目
   - 点击 "Retry deployment" 或 "Redeploy"
   - 选择最新的提交（`f2ccee6`）

2. **或者通过 Git 触发**：
   ```bash
   # 创建一个空提交来触发重新部署
   git commit --allow-empty -m "Trigger Cloudflare rebuild"
   git push origin main
   ```

### 方案 2：检查并修复构建输出目录

在 Cloudflare Dashboard 的 Build Settings 中：

**当前配置（可能有问题）：**
```
Build output directory: ./vercel/output/static
```

**应该改为：**
```
Build output directory: .vercel/output/static
```

（移除 `./` 前缀）

### 方案 3：清除构建缓存

1. 在 Cloudflare Dashboard 中：
   - Settings → Builds & deployments
   - 点击 "Clear build cache"
   - 重新触发部署

### 方案 4：验证 GitHub 上的 package.json

访问 GitHub 仓库，确认 `package.json` 包含：
```json
"scripts": {
  "cf-build": "npx @cloudflare/next-on-pages"
}
```

GitHub 链接：https://github.com/yil337/Couple-test/blob/main/package.json

## 🔧 完整检查清单

- [ ] 确认 GitHub 上的 `package.json` 包含 `cf-build` 脚本
- [ ] 确认 Cloudflare 连接的是 `main` 分支
- [ ] 确认构建命令是 `npm run cf-build`（不是 `npm run build`）
- [ ] 确认构建输出目录是 `.vercel/output/static`（不是 `./vercel/output/static`）
- [ ] 清除构建缓存
- [ ] 重新触发部署

## 📝 正确的 Cloudflare Pages 配置

```
Framework preset: None
Build command: npm run cf-build
Build output directory: .vercel/output/static
Root directory: /
Node version: 18 (或更高)
```

## 🚀 快速修复步骤

1. **检查 GitHub 仓库**：
   - 访问 https://github.com/yil337/Couple-test/blob/main/package.json
   - 确认第 8 行有 `"cf-build": "npx @cloudflare/next-on-pages"`

2. **在 Cloudflare Dashboard**：
   - Settings → Builds & deployments
   - 检查 Build command 是否为 `npm run cf-build`
   - 检查 Build output directory 是否为 `.vercel/output/static`（无 `./` 前缀）

3. **清除缓存并重新部署**：
   - 点击 "Clear build cache"
   - 点击 "Retry deployment" 或创建新的部署

## 💡 如果仍然失败

如果按照以上步骤仍然失败，请：

1. **检查构建日志**：
   - 在 Cloudflare Dashboard 中查看完整的构建日志
   - 确认它使用的是哪个提交

2. **验证本地构建**：
   ```bash
   npm run cf-build
   ```
   如果本地也失败，说明是代码问题

3. **检查依赖安装**：
   - 确认 `@cloudflare/next-on-pages` 在 `devDependencies` 中
   - 确认 `package-lock.json` 已提交到 GitHub



