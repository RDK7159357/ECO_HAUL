import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Platform,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, CameraView } from 'expo-camera';
import { useDispatch, useSelector } from 'react-redux';
import AdaptiveUniversalDetector from '../components/AdaptiveUniversalDetector';

const { width, height } = Dimensions.get('window');

interface NavigationProp {
  navigate: (screen: string) => void;
  goBack: () => void;
}

interface RootState {
  cart: {
    items: Array<{
      id: string;
      name: string;
      category: string;
      confidence: number;
      quantity: number;
    }>;
  };
}

interface DetectionResult {
  success: boolean;
  detectedObjects: Array<{
    id: string;
    objectName: string;
    category: string;
    confidence: number;
    detectionMethod: string;
    features: string[];
    learningOpportunity: boolean;
    description: string;
    suggestions?: string[];
    adaptiveScore: number;
  }>;
  cartItems: Array<{
    id: string;
    name: string;
    category: string;
    confidence: number;
    detectedAt: string;
    quantity: number;
    detectionMethod: string;
    adaptiveFeatures: string[];
    disposalInfo: any;
    environmentalImpact: any;
    improvementSuggestions: string[];
  }>;
  totalDetections: number;
  detectionMethod: string;
  adaptiveConfidence: number;
  systemLearning: {
    objectsSeen: number;
    patternsLearned: number;
    adaptationLevel: number;
    learningMode: boolean;
  };
}

interface SystemLearning {
  objectsSeen: number;
  patternsLearned: number;
  adaptationLevel: number;
  learningMode: boolean;
}

interface AdaptiveStats {
  objectsSeen: number;
  patternsLearned: number;
  adaptationLevel: number;
  learningMode: boolean;
}

const AdaptiveScannerScreen: React.FC<{ navigation: NavigationProp }> = ({ navigation }) => {
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  
  // Camera permission states
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [cameraRef, setCameraRef] = useState<any>(null);
  
  // Detection states
  const [isScanning, setIsScanning] = useState(false);
  const [detectionResults, setDetectionResults] = useState<DetectionResult | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [detector] = useState(new AdaptiveUniversalDetector());
  const [learningMode, setLearningMode] = useState(true);
  const [adaptiveStats, setAdaptiveStats] = useState<AdaptiveStats | null>(null);
  
  // UI states
  const [scanningProgress, setScanningProgress] = useState(0);
  const [detectionMethod, setDetectionMethod] = useState('');
  const [systemLearning, setSystemLearning] = useState<SystemLearning | null>(null);
  
  // Request camera permissions on component mount
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  useEffect(() => {
    // Update adaptive stats periodically
    const interval = setInterval(() => {
      setAdaptiveStats(detector.getSystemLearningStatus());
    }, 2000);
    
    return () => clearInterval(interval);
  }, [detector]);

  const handleScan = async () => {
    if (isScanning || hasPermission !== true) return;
    
    try {
      setIsScanning(true);
      setScanningProgress(0);
      setDetectionMethod('');
      
      // Simulate adaptive scanning progress
      const progressSteps = [
        { progress: 15, method: 'Capturing image...' },
        { progress: 30, method: 'Analyzing materials...' },
        { progress: 50, method: 'Detecting shapes...' },
        { progress: 70, method: 'Applying context analysis...' },
        { progress: 85, method: 'Running adaptive learning...' },
        { progress: 95, method: 'Finalizing results...' }
      ];
      
      for (const step of progressSteps) {
        setScanningProgress(step.progress);
        setDetectionMethod(step.method);
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      
      console.log('📷 Starting adaptive universal detection...');
      
      // Take photo with Expo Camera
      const photo = await cameraRef?.takePictureAsync({
        quality: 0.7,
        base64: true,
      });
      
      console.log('📸 Photo captured, analyzing with adaptive system...');
      
      // Use adaptive detection
      const results = await detector.detectAnyObject(photo?.path || '');
      
      if (results.success && results.detectedObjects.length > 0) {
        setDetectionResults(results as DetectionResult);
        setSystemLearning(results.systemLearning);
        setShowResults(true);
        
        console.log(`✅ Adaptive detection complete: ${results.totalDetections} objects found`);
        console.log(`🧠 Detection method: ${results.detectionMethod}`);
        console.log(`📊 Adaptive confidence: ${((results as any).adaptiveConfidence * 100).toFixed(1)}%`);
      } else {
        Alert.alert(
          'No Objects Detected',
          'The adaptive system could not identify any objects. This might be a learning opportunity!',
          [
            { text: 'Try Again', style: 'default' },
            { text: 'Provide Feedback', onPress: () => handleLearningOpportunity() }
          ]
        );
      }
      
    } catch (error) {
      console.error('Adaptive scanning error:', error);
      Alert.alert('Scanning Error', 'Failed to analyze image. Please try again.');
    } finally {
      setIsScanning(false);
      setScanningProgress(0);
      setDetectionMethod('');
    }
  };

  const handleLearningOpportunity = () => {
    Alert.alert(
      'Learning Mode',
      'Help improve the system by describing what you see. This will enhance future detection accuracy.',
      [
        { text: 'Skip', style: 'cancel' },
        { text: 'Provide Feedback', onPress: () => showLearningInterface() }
      ]
    );
  };

  const showLearningInterface = () => {
    // Navigate to the Learning screen for detailed feedback
    navigation.navigate('Learning');
  };

  const addSelectedItemsToCart = () => {
    if (!detectionResults?.cartItems) return;
    
    detectionResults.cartItems.forEach((item: any) => {
      dispatch({
        type: 'cart/addItem',
        payload: {
          id: item.id,
          name: item.name,
          category: item.category,
          confidence: item.confidence,
          detectedAt: item.detectedAt,
          quantity: item.quantity,
          detectionMethod: item.detectionMethod,
          adaptiveFeatures: item.adaptiveFeatures,
          disposalInfo: item.disposalInfo,
          environmentalImpact: item.environmentalImpact,
          isAdaptive: true
        }
      });
    });
    
    setShowResults(false);
    setDetectionResults(null);
    
    Alert.alert(
      'Items Added Successfully!',
      `Added ${detectionResults.cartItems.length} items to your cart using adaptive detection.`,
      [
        { text: 'Continue Scanning', style: 'default' },
        { text: 'View Cart', onPress: () => navigation.navigate('Cart') }
      ]
    );
  };

  const provideFeedback = (objectId: string, feedback: any) => {
    // Learn from user feedback
    detector.learnFromUserFeedback(objectId, feedback);
    Alert.alert('Thank You!', 'Your feedback will improve future detections.');
  };

  const renderAdaptiveStats = () => {
    if (!adaptiveStats) return null;
    
    return (
      <View style={styles.statsContainer}>
        <Text style={styles.statsTitle}>🧠 Adaptive Learning Status</Text>
        <Text style={styles.statsText}>Objects Learned: {adaptiveStats.objectsSeen}</Text>
        <Text style={styles.statsText}>Patterns Recognized: {adaptiveStats.patternsLearned}</Text>
        <Text style={styles.statsText}>
          Adaptation Level: {(adaptiveStats.adaptationLevel * 100).toFixed(0)}%
        </Text>
      </View>
    );
  };

  const renderDetectionResults = () => (
    <Modal
      visible={showResults}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>🔍 Adaptive Detection Results</Text>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowResults(false)}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>
        
        {detectionResults && (
          <ScrollView style={styles.resultsContainer}>
            <View style={styles.summaryContainer}>
              <Text style={styles.summaryText}>
                📊 Found {detectionResults.totalDetections} objects using {detectionResults.detectionMethod}
              </Text>
              <Text style={styles.summaryText}>
                🎯 Adaptive Confidence: {(detectionResults.adaptiveConfidence * 100).toFixed(1)}%
              </Text>
            </View>
            
            {systemLearning && (
              <View style={styles.learningContainer}>
                <Text style={styles.learningTitle}>🧠 System Learning Info</Text>
                <Text style={styles.learningText}>
                  Objects Seen: {systemLearning.objectsSeen}
                </Text>
                <Text style={styles.learningText}>
                  Patterns Learned: {systemLearning.patternsLearned}
                </Text>
                <Text style={styles.learningText}>
                  Learning Mode: {systemLearning.learningMode ? 'Active' : 'Passive'}
                </Text>
              </View>
            )}
            
            {detectionResults.detectedObjects.map((object, index) => (
              <View key={object.id} style={styles.objectContainer}>
                <View style={styles.objectHeader}>
                  <Text style={styles.objectName}>{object.objectName}</Text>
                  <Text style={styles.objectConfidence}>
                    {(object.adaptiveScore * 100).toFixed(0)}%
                  </Text>
                </View>
                
                <Text style={styles.objectDescription}>{object.description}</Text>
                
                <View style={styles.featuresContainer}>
                  <Text style={styles.featuresTitle}>Detected Features:</Text>
                  {object.features.map((feature, idx) => (
                    <Text key={idx} style={styles.featureText}>• {feature}</Text>
                  ))}
                </View>
                
                {object.learningOpportunity && (
                  <View style={styles.learningOpportunity}>
                    <Text style={styles.learningOpportunityText}>
                      📚 Learning Opportunity - This detection can be improved with feedback
                    </Text>
                    <TouchableOpacity
                      style={styles.feedbackButton}
                      onPress={() => showLearningInterface()}
                    >
                      <Text style={styles.feedbackButtonText}>Provide Feedback</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                {object.suggestions && object.suggestions.length > 0 && (
                  <View style={styles.suggestionsContainer}>
                    <Text style={styles.suggestionsTitle}>💡 Suggestions:</Text>
                    {object.suggestions.map((suggestion, idx) => (
                      <Text key={idx} style={styles.suggestionText}>• {suggestion}</Text>
                    ))}
                  </View>
                )}
              </View>
            ))}
            
            <View style={styles.actionContainer}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={addSelectedItemsToCart}
              >
                <Text style={styles.addButtonText}>
                  ➕ Add All to Cart ({detectionResults.cartItems.length} items)
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.improveButton}
                onPress={() => handleLearningOpportunity()}
              >
                <Text style={styles.improveButtonText}>
                  🧠 Help Improve Detection
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    </Modal>
  );

  const renderScanningOverlay = () => (
    <View style={styles.scanningOverlay}>
      <View style={styles.scanningContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.scanningTitle}>🔍 Adaptive Analysis</Text>
        <Text style={styles.scanningMethod}>{detectionMethod}</Text>
        
        <View style={styles.progressContainer}>
          <View style={[styles.progressBar, { width: `${scanningProgress}%` }]} />
        </View>
        <Text style={styles.progressText}>{scanningProgress}%</Text>
        
        <Text style={styles.scanningInfo}>
          Using universal object detection{'\n'}
          Can identify any material or object
        </Text>
      </View>
    </View>
  );

  // Permission handling function
  const handleRequestPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please enable camera permission in your device settings to use the scanner.',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Open Settings', onPress: () => {
              // On iOS, this will open the app settings
              if (Platform.OS === 'ios') {
                Alert.alert('Please go to Settings > EcoHaul > Camera to enable permissions');
              }
            }}
          ]
        );
      }
    } catch (error) {
      console.error('Permission request failed:', error);
    }
  };  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>
          Camera permission is required for adaptive object detection
        </Text>
        <TouchableOpacity style={styles.permissionButton} onPress={handleRequestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (hasPermission === null) {
    return (
      <View style={styles.errorContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
        <Text style={styles.errorText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Camera permission denied</Text>
        <TouchableOpacity style={styles.permissionButton} onPress={handleRequestPermission}>
          <Text style={styles.permissionButtonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1B5E20" />
      
      {Platform.OS !== 'web' ? (
        <CameraView
          ref={(ref) => setCameraRef(ref)}
          style={styles.camera}
          facing="back"
        />
      ) : (
        <View style={[styles.camera, styles.webCameraPlaceholder]}>
          <Text style={styles.webCameraText}>
            Camera functionality is not available on web.{'\n'}
            Use a mobile device for scanning.
          </Text>
        </View>
      )}
      
      {isScanning && renderScanningOverlay()}
      
      <View style={styles.overlay}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <View style={styles.titleContainer}>
            <Text style={styles.title}>🌍 Universal Scanner</Text>
            <Text style={styles.subtitle}>Detects any object automatically</Text>
          </View>
          
          <TouchableOpacity
            style={styles.cartButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.cartButtonText}>🛒 ({cartItems.length})</Text>
          </TouchableOpacity>
        </View>
        
        {renderAdaptiveStats()}
        
        <View style={styles.scanningFrame}>
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
          
          <Text style={styles.instructionText}>
            🎯 Point camera at any object{'\n'}
            Adaptive AI will identify and classify it
          </Text>
        </View>
        
        <View style={styles.controls}>
          <TouchableOpacity
            style={[styles.scanButton, isScanning && styles.scanButtonDisabled]}
            onPress={handleScan}
            disabled={isScanning}
          >
            <Text style={styles.scanButtonText}>
              {isScanning ? '🔍 Analyzing...' : '📷 Scan Any Object'}
            </Text>
          </TouchableOpacity>
          
          <View style={styles.infoContainer}>
            <Text style={styles.infoText}>
              🧠 Smart Detection: Learns from every scan{'\n'}
              📚 {adaptiveStats?.objectsSeen || 0} objects learned so far
            </Text>
          </View>
        </View>
      </View>
      
      {renderDetectionResults()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  
  camera: {
    flex: 1,
  },
  
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  
  backButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  
  backButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  titleContainer: {
    alignItems: 'center',
  },
  
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  
  subtitle: {
    color: '#E8F5E8',
    fontSize: 12,
    marginTop: 2,
  },
  
  cartButton: {
    backgroundColor: 'rgba(76, 175, 80, 0.8)',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  
  cartButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  statsContainer: {
    margin: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  
  statsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  
  statsText: {
    color: '#E8F5E8',
    fontSize: 14,
    marginBottom: 2,
  },
  
  scanningFrame: {
    flex: 1,
    margin: 40,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  cornerTopLeft: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#4CAF50',
  },
  
  cornerTopRight: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 30,
    height: 30,
    borderTopWidth: 3,
    borderRightWidth: 3,
    borderColor: '#4CAF50',
  },
  
  cornerBottomLeft: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
    borderColor: '#4CAF50',
  },
  
  cornerBottomRight: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderBottomWidth: 3,
    borderRightWidth: 3,
    borderColor: '#4CAF50',
  },
  
  instructionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    padding: 15,
    borderRadius: 10,
  },
  
  controls: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  
  scanButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 15,
  },
  
  scanButtonDisabled: {
    backgroundColor: '#666',
  },
  
  scanButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  infoContainer: {
    alignItems: 'center',
  },
  
  infoText: {
    color: '#E8F5E8',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  
  scanningOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  
  scanningContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: 30,
    borderRadius: 20,
    alignItems: 'center',
    minWidth: width * 0.8,
  },
  
  scanningTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 15,
    marginBottom: 5,
  },
  
  scanningMethod: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  
  progressContainer: {
    width: '100%',
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    marginBottom: 10,
  },
  
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  
  progressText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 15,
  },
  
  scanningInfo: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#4CAF50',
  },
  
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  
  closeButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  closeButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  resultsContainer: {
    flex: 1,
    padding: 15,
  },
  
  summaryContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  
  summaryText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  
  learningContainer: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  
  learningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 8,
  },
  
  learningText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 3,
  },
  
  objectContainer: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
  },
  
  objectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  
  objectName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  
  objectConfidence: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  
  objectDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
    lineHeight: 20,
  },
  
  featuresContainer: {
    marginBottom: 10,
  },
  
  featuresTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  
  featureText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 10,
  },
  
  learningOpportunity: {
    backgroundColor: '#FFF3E0',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  
  learningOpportunityText: {
    fontSize: 13,
    color: '#E65100',
    marginBottom: 8,
  },
  
  feedbackButton: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  
  feedbackButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  
  suggestionsContainer: {
    backgroundColor: '#F3E5F5',
    padding: 10,
    borderRadius: 8,
  },
  
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#7B1FA2',
    marginBottom: 5,
  },
  
  suggestionText: {
    fontSize: 13,
    color: '#666',
    marginLeft: 10,
  },
  
  actionContainer: {
    marginTop: 20,
    gap: 15,
  },
  
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: 'center',
  },
  
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  
  improveButton: {
    backgroundColor: '#2196F3',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  
  improveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  
  permissionText: {
    fontSize: 18,
    textAlign: 'center',
    color: '#333',
    marginBottom: 30,
  },
  
  permissionButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
  },
  
  permissionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  
  errorText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
  },
  
  webCameraPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#333',
  },
  
  webCameraText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});

export default AdaptiveScannerScreen;
