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
  webpack: (config, { isServer, dev }) => {
    // Ativar otimizações do webpack mesmo em modo de desenvolvimento
    config.optimization.minimize = true;
    
    // Dividir o bundle em partes menores (chunks)
    config.optimization.splitChunks = {
      chunks: 'all',
      maxInitialRequests: 25,
      minSize: 20000,
      maxSize: 1000000, // 1MB por arquivo
      cacheGroups: {
        // Separar cada biblioteca grande em seu próprio chunk
        firebase: {
          test: /[\\/]node_modules[\\/](firebase|@firebase)[\\/]/,
          name: 'firebase',
          priority: 20,
        },
        framework: {
          test: /[\\/]node_modules[\\/](react|react-dom|next)[\\/]/,
          name: 'framework',
          priority: 10,
        },
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            // Obter o nome do pacote para dar nomes significativos aos chunks
            const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];
            return `npm.${packageName.replace('@', '')}`;
          },
          priority: 5,
        }
      }
    };

    return config;
  },
}

module.exports = nextConfig;
