/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cloudflare Pages 适配 - 使用 Edge Runtime
  // 注意：Pages Router 不需要显式设置 runtime: 'edge'
  // Edge Runtime 会在 Cloudflare 环境中自动启用
}

module.exports = nextConfig

