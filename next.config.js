/** @type {import('next').NextConfig} */
const nextConfig = {
  // Fix workspace root warning
  outputFileTracingRoot: __dirname,
  experimental: {
    // Reduce CPU usage to avoid Jest worker issues
    cpus: 1
  },
  webpack: (config, { isServer }) => {
    // Reduce parallelism to avoid worker issues
    if (!isServer) {
      config.optimization.splitChunks.cacheGroups = {
        default: false,
        vendors: false,
      }
    }
    return config
  }
}

module.exports = nextConfig