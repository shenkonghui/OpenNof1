/** @type {import('next').NextConfig} */
const blockedApiPaths = [
  '/api/agent/analyze',
  '/api/agent/start',
  '/api/agent/stop',
  '/api/trading/history/reset',
  '/api/trading/history/sync',
]

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // 添加standalone输出模式，用于Docker部署
  webpack: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
      ignored: [
        '**/node_modules/**',
        '**/.next/**',
        '**/.git/**',
        '**/dist/**',
        '**/build/**',
      ],
    }
    return config
  },
  async rewrites() {
    const origin = process.env.BACKEND_ORIGIN || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    return {
      beforeFiles: blockedApiPaths.map((source) => ({
        source,
        destination: '/api/frontend-blocked',
      })),
      afterFiles: [
        {
          source: '/api/:path*',
          destination: `${origin}/api/v1/:path*`,
        },
      ],
      fallback: [],
    }
  },
}

module.exports = nextConfig
