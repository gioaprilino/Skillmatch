/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // Fix ESM modules
    config.resolve.extensionAlias = {
      '.js': ['.js', '.ts', '.tsx'],
    };

    const path = require('path');
    config.resolve.alias = {
      ...config.resolve.alias,
      'next-auth/react': path.resolve(__dirname, 'src/lib/auth-client.tsx'),
    };

    // Handle ESM modules in jsonld
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
    }

    // Exclude digitalbazaar + transitive deps from webpack bundling (server only)
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push(({ request }, callback) => {
        const externals = [
          '@digitalbazaar/vc',
          '@digitalbazaar/http-client',
          '@digitalbazaar/ed25519-signature-2020',
          '@digitalbazaar/ed25519-verification-key-2020',
          'jsonld',
          'undici',
          'ky',
        ];
        if (externals.some(pkg => request && (request === pkg || request.startsWith(pkg + '/')))) {
          return callback(null, 'commonjs ' + request);
        }
        callback();
      });
    }

    return config;
  },
  images: {
    domains: ['lh3.googleusercontent.com', 'avatars.githubusercontent.com', 'ipfs.io', 'gateway.pinata.cloud'],
    formats: ['image/avif', 'image/webp'],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
    serverComponentsExternalPackages: [
      '@digitalbazaar/vc',
      '@digitalbazaar/ed25519-signature-2020',
      '@digitalbazaar/ed25519-verification-key-2020',
      '@digitalbazaar/http-client',
      'jsonld',
      'undici',
      'ky',
    ],
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
        ],
      },
      {
        source: '/manifest.json',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=31536000, immutable' },
        ],
      },
      {
        source: '/sw.js',
        headers: [
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Service-Worker-Allowed', value: '/' },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/dashboard/jobs',
        destination: '/jobs',
      },
      {
        source: '/dashboard/jobs/:path*',
        destination: '/jobs/:path*',
      },
      {
        source: '/dashboard/upskilling',
        destination: '/upskilling/assessments',
      },
      {
        source: '/dashboard/upskilling/:path*',
        destination: '/upskilling/:path*',
      },
      {
        source: '/dashboard/applications',
        destination: '/applications',
      },
      {
        source: '/dashboard/applications/:path*',
        destination: '/applications/:path*',
      },
      {
        source: '/dashboard/employer/jobs',
        destination: '/employer/jobs',
      },
      {
        source: '/dashboard/employer/jobs/:path*',
        destination: '/employer/jobs/:path*',
      },
      {
        source: '/api/credentials/:path*',
        destination: '/api/vc/:path*',
      },
      {
        source: '/dashboard/verify',
        destination: '/dashboard/employer/verify',
      },
    ];
  },
};

module.exports = nextConfig;