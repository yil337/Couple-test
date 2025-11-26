/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cloudflare Pages 适配
  // 使用 standalone 模式，让 next-on-pages 处理转换
  output: 'standalone',
  // 禁用图片优化（Cloudflare Pages 不支持）
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

