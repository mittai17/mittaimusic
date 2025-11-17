/** @type {import('next').NextConfig} */
const webpack = require('webpack');

const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost'],
    unoptimized: true, // For static export if needed
  },
  // Transpile shared packages (Next.js 13+)
  transpilePackages: ['@youtify/services', '@youtify/ui'],
  webpack: (config, { isServer }) => {
    // Support for react-native-web - alias react-native to react-native-web
    // This must happen before webpack tries to resolve any modules
    config.resolve.alias = {
      ...config.resolve.alias,
      'react-native$': 'react-native-web',
      // Also alias common react-native subpaths
      'react-native/Libraries/Components/View/ViewStylePropTypes$': 'react-native-web/dist/exports/View/ViewStylePropTypes',
      'react-native/Libraries/EventEmitter/NativeEventEmitter$': 'react-native-web/dist/vendor/react-native/NativeEventEmitter',
    };

    // Use NormalModuleReplacementPlugin to replace react-native with react-native-web
    // This ensures the replacement happens before webpack tries to parse the file
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(
        /^react-native$/,
        'react-native-web'
      )
    );

    // Ensure proper module resolution order
    config.resolve.modules = ['node_modules', ...(config.resolve.modules || [])];

    // Add web extensions for better compatibility
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...(config.resolve.extensions || []),
    ];

    return config;
  },
};

module.exports = nextConfig;

