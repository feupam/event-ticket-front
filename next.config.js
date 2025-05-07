/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  env: {
    VITE_FIREBASE_API_KEY: process.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: process.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: process.env.VITE_FIREBASE_APP_ID,
    VITE_FIREBASE_MEASUREMENT_ID: process.env.VITE_FIREBASE_MEASUREMENT_ID,
    VITE_API_URL: process.env.VITE_API_URL
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'federa-api.firebasestorage.app',
        port: '',
        pathname: '/**',
      }
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/countdown/federa',
        permanent: true,
      },
      {
        source: '/eventos',
        destination: '/countdown/federa',
        permanent: true,
      }
    ]
  },
  webpack: (config, { isServer }) => {
    // Ativar minificação
    config.optimization.minimize = true;
    
    // Configuração simplificada
    config.optimization.splitChunks = {
      chunks: 'all',
      maxInitialRequests: 30,
      maxAsyncRequests: 30,
      minSize: 10000,
      maxSize: 700000, // 700 KB por arquivo (abaixo do limite de 1MB)
      cacheGroups: {
        // Agrupar por biblioteca sem funções complexas
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          priority: 10,
          enforce: true,
        }
      }
    };

    return config;
  },
}

module.exports = nextConfig;
