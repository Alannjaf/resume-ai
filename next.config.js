/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Handle underscore dependency for mammoth
    config.resolve.fallback = {
      ...config.resolve.fallback,
      underscore: require.resolve('underscore'),
    }
    return config
  },
  async headers() {
    return [
      {
        source: '/pdf.worker.min.mjs',
        headers: [
          {
            key: 'Content-Type',
            value: 'text/javascript',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
        ],
      },
    ];
  },
}

module.exports = nextConfig;