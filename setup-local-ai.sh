#!/bin/bash

# Complete setup script for local AI integration
echo "🚀 Setting up local AI for EcoHaul..."

# Navigate to project directory
cd /Users/ramadugudhanush/Documents/EcoHaul

echo "📦 Installing TensorFlow.js packages..."
npm install @tensorflow/tfjs @tensorflow/tfjs-react-native @tensorflow/tfjs-platform-react-native @tensorflow/tfjs-backend-webgl

echo "📦 Installing React Native Vision Camera..."
npm install react-native-vision-camera

echo "📦 Installing file system utilities..."
npm install react-native-fs

echo "📦 Installing image processing..."
npm install react-native-image-resizer

echo "🔧 Installing development dependencies..."
npm install --save-dev metro-config

# Create metro config for TensorFlow.js
echo "⚙️ Creating Metro configuration..."
cat > metro.config.js << 'EOF'
const { getDefaultConfig } = require('metro-config');

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig();
  
  return {
    resolver: {
      assetExts: [...assetExts, 'bin', 'txt', 'jpg', 'png', 'json'],
      sourceExts: [...sourceExts, 'jsx', 'js', 'ts', 'tsx'],
    },
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: true,
        },
      }),
    },
  };
})();
EOF

# Add TensorFlow.js setup to App.tsx
echo "🔧 Creating TensorFlow setup..."
cat > src/utils/setupTensorFlow.js << 'EOF'
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

export const initializeTensorFlow = async () => {
  // Wait for tf to be ready
  await tf.ready();
  
  // Enable production mode for better performance
  tf.env().set('WEBGL_VERSION', 2);
  tf.env().set('WEBGL_CPU_FORWARD', false);
  
  console.log('TensorFlow.js initialized');
  console.log('Backend:', tf.getBackend());
  
  return true;
};
EOF

# Update package.json to include TensorFlow platform initialization
echo "📝 Updating package.json scripts..."

# iOS setup
if [ -d "ios" ]; then
    echo "🍎 Setting up iOS..."
    cd ios
    
    # Add camera permissions to Info.plist
    if [ -f "EcoHaul/Info.plist" ]; then
        echo "Adding camera permissions to Info.plist..."
        # Note: You'll need to manually add these to Info.plist:
        # <key>NSCameraUsageDescription</key>
        # <string>This app needs camera access to scan waste items</string>
    fi
    
    # Run pod install
    pod install
    cd ..
fi

# Android setup
if [ -d "android" ]; then
    echo "🤖 Setting up Android..."
    
    # Add camera permissions to AndroidManifest.xml
    if [ -f "android/app/src/main/AndroidManifest.xml" ]; then
        echo "Adding camera permissions to AndroidManifest.xml..."
        # Note: You'll need to manually add these to AndroidManifest.xml:
        # <uses-permission android:name="android.permission.CAMERA" />
    fi
fi

echo ""
echo "✅ Local AI setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Add camera permissions to Info.plist (iOS) and AndroidManifest.xml (Android)"
echo "2. Download a pre-trained TensorFlow.js model or use MobileNet"
echo "3. Test the enhanced scanner screen"
echo ""
echo "🎯 Camera Permissions needed:"
echo "iOS Info.plist:"
echo "  <key>NSCameraUsageDescription</key>"
echo "  <string>This app needs camera access to scan waste items</string>"
echo ""
echo "Android AndroidManifest.xml:"
echo "  <uses-permission android:name=\"android.permission.CAMERA\" />"
