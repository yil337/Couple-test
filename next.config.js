/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cloudflare Pages 适配
  // 禁用 SSR 输出，强制静态生成
  output: 'export',
  // 或者使用 standalone 模式（如果 next-on-pages 需要）
  // output: 'standalone',
  // 禁用图片优化（Cloudflare Pages 不支持）
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig

