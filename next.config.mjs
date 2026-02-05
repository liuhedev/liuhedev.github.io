/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  images: {
    unoptimized: true, // GitHub Pages 不支持 Image Optimization
  },
  // 如果部署到子路径（如 https://用户名.github.io/仓库名），需要配置 basePath
  // basePath: '/仓库名',
}

export default nextConfig
