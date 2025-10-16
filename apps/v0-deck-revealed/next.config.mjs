/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Electron specific config
  output: 'export',  // Static HTML export for Electron
  distDir: '.next',  // Keep the same dist directory
}

export default nextConfig