// Real-World Camera Integration
// Processes actual camera frames with computer vision and machine learning

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Animated,
  Platform
} from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { runOnJS } from 'react-native-reanimated';
import Icon from 'react-native-vector-icons/MaterialIcons';
import RealWorldWasteDetector from './RealWorldWasteDetector';
import RNFS from 'react-native-fs';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const RealWorldCameraScanner = ({ onDetection, onError, isActive = true }) => {
  // Camera state
  const [hasPermission, setHasPermission] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [detector, setDetector] = useState(null);
  const [lastProcessTime, setLastProcessTime] = useState(0);
  
  // Detection state
  const [currentDetections, setCurrentDetections] = useState([]);
  const [processingStats, setProcessingStats] = useState({
    totalProcessed: 0,
    averageTime: 0,
    successRate: 0,
    realWorldMode: true
  });
  
  // UI state
  const [flashEnabled, setFlashEnabled] = useState(false);
  const [autoFocus, setAutoFocus] = useState(true);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  
  // Camera refs
  const camera = useRef(null);
  
  // Processing configuration
  const PROCESSING_INTERVAL = 1000; // Process every 1 second for real-time performance
  const MAX_DETECTIONS_HISTORY = 10;
  const CONFIDENCE_SMOOTHING = 3; // Frames to smooth confidence over
  
  // Detection history for stability
  const detectionHistory = useRef([]);
  const confidenceBuffer = useRef(new Map());

  useEffect(() => {
    initializeRealWorldScanner();
    startPulseAnimation();
    
    return () => {
      cleanup();
    };
  }, []);

  useEffect(() => {
    if (isActive && detector && hasPermission) {
      console.log('🎥 Real-world camera scanner activated');
    }
  }, [isActive, detector, hasPermission]);

  const initializeRealWorldScanner = async () => {
    try {
      console.log('🚀 Initializing real-world camera scanner...');
      
      // Request camera permissions
      const cameraPermission = await Camera.requestCameraPermissionsAsync();
      
      if (cameraPermission.status === 'denied') {
        Alert.alert(
          'Camera Permission Required',
          'This app needs camera access to scan waste items in real-time.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Settings', onPress: () => Camera.openSettings() }
          ]
        );
        return;
      }
      
      setHasPermission(true);
      
      // Initialize real-world detector
      const wasteDetector = new RealWorldWasteDetector();
      await wasteDetector.initializeRealDetector();
      setDetector(wasteDetector);
      
      console.log('✅ Real-world scanner initialized successfully');
      
    } catch (error) {
      console.error('❌ Failed to initialize real-world scanner:', error);
      onError?.(error);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  // Real-time frame processing with computer vision
  const processFrameCapture = useCallback(async () => {
    if (!camera.current || isProcessing || !detector) return;
    
    try {
      setIsProcessing(true);
      
      // Take a photo for processing
      const photo = await camera.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: true,
      });
      
      // Process the captured frame
      await processRealFrame({ uri: photo.uri }, Date.now());
      
    } catch (error) {
      console.error('❌ Frame capture error:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, detector]);
  
  // Set up interval for processing frames
  useEffect(() => {
    if (!isActive || !detector || !hasPermission) return;
    
    const interval = setInterval(processFrameCapture, PROCESSING_INTERVAL);
    return () => clearInterval(interval);
  }, [isActive, detector, hasPermission, processFrameCapture]);

  const processRealFrame = useCallback(async (frame, timestamp) => {
    if (isProcessing || !detector) {
      return;
    }

    try {
      setIsProcessing(true);
      setLastProcessTime(timestamp);
      
      console.log('📸 Processing real camera frame...');
      
      // Save frame to temporary file for processing
      const frameUri = await saveFrameToFile(frame);
      
      // Run real-world detection
      const detectionResult = await detector.detectWasteRealTime(frameUri);
      
      if (detectionResult.success) {
        // Process real detection results
        const processedDetections = processRealTimeDetections(
          detectionResult.detectedObjects,
          detectionResult.confidence,
          timestamp
        );
        
        // Update detections and stats
        setCurrentDetections(processedDetections);
        updateProcessingStats(detectionResult);
        
        // Notify parent component
        onDetection?.(detectionResult);
        
        console.log(`✅ Real detection completed: ${processedDetections.length} objects found`);
      }
      
    } catch (error) {
      console.error('❌ Real frame processing error:', error);
      onError?.(error);
    } finally {
      setIsProcessing(false);
    }
  }, [detector, isProcessing, onDetection, onError]);

  const saveFrameToFile = async (frame) => {
    // Save frame to temporary file for processing
    const timestamp = Date.now();
    const filename = `frame_${timestamp}.jpg`;
    const filepath = `${RNFS.TemporaryDirectoryPath}/${filename}`;
    
    await RNFS.copyFile(frame.uri, filepath);
    return filepath;
  };

  const processRealTimeDetections = (detectedObjects, confidence, timestamp) => {
    // Apply temporal smoothing for stable detections
    const smoothedDetections = applyTemporalSmoothing(detectedObjects, timestamp);
    
    // Filter by confidence and real-world validation
    const validDetections = smoothedDetections.filter(detection => 
      detection.confidence >= 50 && // Minimum confidence for real-world
      detection.realWorldFeatures && // Must have real-world features
      detection.name !== 'Unknown Object' // No unknown objects
    );
    
    // Add real-world context
    return validDetections.map(detection => ({
      ...detection,
      timestamp,
      realTimeDetection: true,
      stabilityScore: calculateStabilityScore(detection.id),
      processingMode: 'real-world',
      frameId: `frame_${timestamp}`
    }));
  };

  const applyTemporalSmoothing = (detections, timestamp) => {
    // Add current detections to history
    detectionHistory.current.push({
      detections,
      timestamp
    });
    
    // Keep only recent history
    const historyLimit = timestamp - (PROCESSING_INTERVAL * MAX_DETECTIONS_HISTORY);
    detectionHistory.current = detectionHistory.current.filter(
      entry => entry.timestamp > historyLimit
    );
    
    // Smooth detections across time
    const smoothedDetections = [];
    
    detections.forEach(detection => {
      // Find similar detections in history
      const similarDetections = findSimilarDetections(detection);
      
      if (similarDetections.length >= CONFIDENCE_SMOOTHING) {
        // Calculate smoothed confidence
        const avgConfidence = similarDetections.reduce(
          (sum, det) => sum + det.confidence, 
          detection.confidence
        ) / (similarDetections.length + 1);
        
        // Add smoothed detection
        smoothedDetections.push({
          ...detection,
          confidence: Math.round(avgConfidence),
          stability: 'high',
          detectionCount: similarDetections.length + 1
        });
      } else if (similarDetections.length > 0) {
        // Partially stable detection
        smoothedDetections.push({
          ...detection,
          stability: 'medium',
          detectionCount: similarDetections.length + 1
        });
      } else {
        // New detection
        smoothedDetections.push({
          ...detection,
          stability: 'low',
          detectionCount: 1
        });
      }
    });
    
    return smoothedDetections;
  };

  const findSimilarDetections = (targetDetection) => {
    const similarDetections = [];
    
    detectionHistory.current.forEach(entry => {
      entry.detections.forEach(detection => {
        // Check if detections are similar (same category, similar position)
        if (
          detection.category === targetDetection.category &&
          calculateSimilarity(detection, targetDetection) > 0.7
        ) {
          similarDetections.push(detection);
        }
      });
    });
    
    return similarDetections;
  };

  const calculateSimilarity = (det1, det2) => {
    // Calculate similarity based on bounding box overlap and features
    const bbox1 = det1.boundingBox || { x: 0.5, y: 0.5, width: 0.3, height: 0.3 };
    const bbox2 = det2.boundingBox || { x: 0.5, y: 0.5, width: 0.3, height: 0.3 };
    
    // Calculate overlap
    const overlap = calculateBoundingBoxOverlap(bbox1, bbox2);
    
    // Calculate feature similarity if available
    let featureSimilarity = 1;
    if (det1.realWorldFeatures && det2.realWorldFeatures) {
      featureSimilarity = calculateFeatureSimilarity(
        det1.realWorldFeatures,
        det2.realWorldFeatures
      );
    }
    
    return (overlap + featureSimilarity) / 2;
  };

  const calculateBoundingBoxOverlap = (bbox1, bbox2) => {
    const x1 = Math.max(bbox1.x, bbox2.x);
    const y1 = Math.max(bbox1.y, bbox2.y);
    const x2 = Math.min(bbox1.x + bbox1.width, bbox2.x + bbox2.width);
    const y2 = Math.min(bbox1.y + bbox1.height, bbox2.y + bbox2.height);
    
    if (x2 <= x1 || y2 <= y1) return 0;
    
    const intersectionArea = (x2 - x1) * (y2 - y1);
    const bbox1Area = bbox1.width * bbox1.height;
    const bbox2Area = bbox2.width * bbox2.height;
    const unionArea = bbox1Area + bbox2Area - intersectionArea;
    
    return intersectionArea / unionArea;
  };

  const calculateFeatureSimilarity = (features1, features2) => {
    // Compare real-world features
    let similarity = 0;
    let comparisons = 0;
    
    // Compare aspect ratio
    if (features1.aspectRatio !== undefined && features2.aspectRatio !== undefined) {
      const aspectSimilarity = 1 - Math.abs(features1.aspectRatio - features2.aspectRatio) / 
        Math.max(features1.aspectRatio, features2.aspectRatio);
      similarity += aspectSimilarity;
      comparisons++;
    }
    
    // Compare edge intensity
    if (features1.edgeIntensity !== undefined && features2.edgeIntensity !== undefined) {
      const edgeSimilarity = 1 - Math.abs(features1.edgeIntensity - features2.edgeIntensity);
      similarity += edgeSimilarity;
      comparisons++;
    }
    
    // Compare dominant colors
    if (features1.dominantColors && features2.dominantColors) {
      const colorSimilarity = calculateColorSimilarity(
        features1.dominantColors,
        features2.dominantColors
      );
      similarity += colorSimilarity;
      comparisons++;
    }
    
    return comparisons > 0 ? similarity / comparisons : 1;
  };

  const calculateColorSimilarity = (colors1, colors2) => {
    if (!colors1.length || !colors2.length) return 0;
    
    // Find best matching colors
    let totalSimilarity = 0;
    const usedColors2 = new Set();
    
    colors1.forEach(color1 => {
      let bestMatch = 0;
      let bestIndex = -1;
      
      colors2.forEach((color2, index) => {
        if (usedColors2.has(index)) return;
        
        const similarity = calculateSingleColorSimilarity(color1.rgb, color2.rgb);
        if (similarity > bestMatch) {
          bestMatch = similarity;
          bestIndex = index;
        }
      });
      
      if (bestIndex >= 0) {
        usedColors2.add(bestIndex);
        totalSimilarity += bestMatch;
      }
    });
    
    return totalSimilarity / colors1.length;
  };

  const calculateSingleColorSimilarity = (rgb1, rgb2) => {
    const distance = Math.sqrt(
      Math.pow(rgb1[0] - rgb2[0], 2) +
      Math.pow(rgb1[1] - rgb2[1], 2) +
      Math.pow(rgb1[2] - rgb2[2], 2)
    );
    
    // Normalize to [0, 1] where 1 is identical
    return Math.max(0, 1 - distance / (255 * Math.sqrt(3)));
  };

  const calculateStabilityScore = (detectionId) => {
    // Calculate how stable this detection has been over time
    const detectionCounts = new Map();
    
    detectionHistory.current.forEach(entry => {
      entry.detections.forEach(detection => {
        const category = detection.category;
        detectionCounts.set(category, (detectionCounts.get(category) || 0) + 1);
      });
    });
    
    const currentDetection = detectionId.split('_')[2]; // Extract category
    const count = detectionCounts.get(currentDetection) || 0;
    const maxCount = Math.max(...Array.from(detectionCounts.values()), 1);
    
    return count / maxCount;
  };

  const updateProcessingStats = (detectionResult) => {
    setProcessingStats(prev => {
      const newTotal = prev.totalProcessed + 1;
      const newAverageTime = (prev.averageTime * prev.totalProcessed + detectionResult.processingTime) / newTotal;
      const newSuccessRate = detectionResult.success ? 
        (prev.successRate * prev.totalProcessed + 100) / newTotal :
        (prev.successRate * prev.totalProcessed) / newTotal;
      
      return {
        totalProcessed: newTotal,
        averageTime: Math.round(newAverageTime),
        successRate: Math.round(newSuccessRate),
        realWorldMode: true
      };
    });
  };

  const handleManualCapture = async () => {
    if (!camera.current || isProcessing) return;
    
    try {
      setIsProcessing(true);
      
      // Take photo
      const photo = await camera.current.takePhoto({
        quality: 85,
        skipMetadata: true,
        flash: flashEnabled ? 'on' : 'off'
      });
      
      // Process the captured photo
      if (detector) {
        const detectionResult = await detector.detectWasteRealTime(`file://${photo.path}`);
        
        if (detectionResult.success) {
          setCurrentDetections(
            processRealTimeDetections(
              detectionResult.detectedObjects,
              detectionResult.confidence,
              Date.now()
            )
          );
          
          onDetection?.(detectionResult);
        }
      }
      
    } catch (error) {
      console.error('❌ Manual capture error:', error);
      Alert.alert('Capture Error', 'Failed to capture and process image');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderDetectionOverlay = () => {
    if (!currentDetections.length) return null;
    
    return (
      <View style={styles.overlayContainer}>
        {currentDetections.map((detection, index) => (
          <View key={detection.id} style={[
            styles.detectionBox,
            {
              left: screenWidth * (detection.boundingBox?.x || 0.2),
              top: screenHeight * 0.15 + (screenHeight * 0.7) * (detection.boundingBox?.y || 0.2),
              width: screenWidth * (detection.boundingBox?.width || 0.3),
              height: (screenHeight * 0.7) * (detection.boundingBox?.height || 0.3),
            }
          ]}>
            <View style={[
              styles.detectionLabel,
              { backgroundColor: getStabilityColor(detection.stability) }
            ]}>
              <Text style={styles.detectionText}>
                {detection.name}
              </Text>
              <Text style={styles.confidenceText}>
                {detection.confidence}% ({detection.stability})
              </Text>
            </View>
            
            {detection.recyclable && (
              <View style={styles.recyclableIcon}>
                <Icon name="recycling" size={20} color="#4CAF50" />
              </View>
            )}
          </View>
        ))}
      </View>
    );
  };

  const getStabilityColor = (stability) => {
    switch (stability) {
      case 'high': return 'rgba(76, 175, 80, 0.9)';
      case 'medium': return 'rgba(255, 193, 7, 0.9)';
      case 'low': return 'rgba(244, 67, 54, 0.9)';
      default: return 'rgba(158, 158, 158, 0.9)';
    }
  };

  const renderControls = () => (
    <View style={styles.controlsContainer}>
      <TouchableOpacity
        style={styles.controlButton}
        onPress={() => setFlashEnabled(!flashEnabled)}
      >
        <Icon 
          name={flashEnabled ? "flash-on" : "flash-off"} 
          size={24} 
          color="white" 
        />
      </TouchableOpacity>
      
      <Animated.View style={[
        styles.captureButton,
        { transform: [{ scale: pulseAnim }] }
      ]}>
        <TouchableOpacity
          style={styles.captureButtonInner}
          onPress={handleManualCapture}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <Icon name="camera-alt" size={30} color="white" />
          )}
        </TouchableOpacity>
      </Animated.View>
      
      <TouchableOpacity
        style={styles.controlButton}
        onPress={() => setAutoFocus(!autoFocus)}
      >
        <Icon 
          name={autoFocus ? "center-focus-strong" : "center-focus-weak"} 
          size={24} 
          color="white" 
        />
      </TouchableOpacity>
    </View>
  );

  const renderStatusBar = () => (
    <View style={styles.statusBar}>
      <View style={styles.statusItem}>
        <Icon name="analytics" size={16} color="white" />
        <Text style={styles.statusText}>
          {processingStats.totalProcessed} processed
        </Text>
      </View>
      
      <View style={styles.statusItem}>
        <Icon name="speed" size={16} color="white" />
        <Text style={styles.statusText}>
          {processingStats.averageTime}ms avg
        </Text>
      </View>
      
      <View style={styles.statusItem}>
        <Icon name="check-circle" size={16} color="white" />
        <Text style={styles.statusText}>
          {processingStats.successRate}% success
        </Text>
      </View>
      
      <View style={styles.statusItem}>
        <Icon name="visibility" size={16} color="white" />
        <Text style={styles.statusText}>
          Real-world mode
        </Text>
      </View>
    </View>
  );

  const cleanup = () => {
    if (detector) {
      detector.dispose();
    }
    
    detectionHistory.current = [];
    confidenceBuffer.current.clear();
  };

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Icon name="camera-alt" size={64} color="#ccc" />
        <Text style={styles.permissionText}>
          Camera permission required for real-time waste detection
        </Text>
        <TouchableOpacity 
          style={styles.permissionButton}
          onPress={initializeRealWorldScanner}
        >
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView
        ref={camera}
        style={styles.camera}
        facing="back"
        flash={flashEnabled ? 'on' : 'off'}
        enableTorch={flashEnabled}
      />
      
      {renderDetectionOverlay()}
      {renderStatusBar()}
      {renderControls()}
      
      {isProcessing && (
        <View style={styles.processingOverlay}>
          <ActivityIndicator size="large" color="white" />
          <Text style={styles.processingText}>
            Processing real-world detection...
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    pointerEvents: 'none',
  },
  detectionBox: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderStyle: 'dashed',
  },
  detectionLabel: {
    position: 'absolute',
    top: -30,
    left: 0,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  detectionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  confidenceText: {
    color: 'white',
    fontSize: 10,
  },
  recyclableIcon: {
    position: 'absolute',
    top: -30,
    right: 0,
    backgroundColor: 'rgba(76, 175, 80, 0.9)',
    borderRadius: 12,
    padding: 4,
  },
  statusBar: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 10,
    right: 10,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 20,
    paddingVertical: 8,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    color: 'white',
    fontSize: 10,
    marginLeft: 4,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 40 : 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureButtonInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  processingText: {
    color: 'white',
    fontSize: 16,
    marginTop: 16,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  permissionText: {
    fontSize: 16,
    textAlign: 'center',
    marginVertical: 20,
    color: '#666',
  },
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    marginTop: 16,
  },
});

export default RealWorldCameraScanner;
