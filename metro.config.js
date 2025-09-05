const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// Add support for additional asset types
config.resolver.assetExts.push(
  // Fonts
  'otf', 'ttf',
  // Images
  'svg', 'png', 'jpg', 'jpeg', 'gif', 'webp',
  // Other
  'bin', 'txt', 'json'
);

// Add support for additional source file types
config.resolver.sourceExts.push('cjs', 'mjs');

// Fix asset registry issues
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// Enable asset registration for Expo Router
config.transformer.assetRegistryPath = 'react-native/Libraries/Image/AssetRegistry';

module.exports = config;
