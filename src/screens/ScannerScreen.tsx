import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { scanWasteItem } from '../store/slices/cartSlice';
import { Ionicons } from '@expo/vector-icons';

interface ScannerScreenProps {
  navigation: any;
}

const { width, height } = Dimensions.get('window');

const ScannerScreen: React.FC<ScannerScreenProps> = ({ navigation }) => {
  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  
  const dispatch = useAppDispatch();
  const { isScanning, scanError } = useAppSelector((state) => state.cart);
  
  const cameraRef = useRef<CameraView>(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    if (!permission?.granted) {
      const { status } = await requestPermission();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission Required',
          'Please grant camera permission to scan waste items.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const takePicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: false,
        });
        
        if (photo?.uri) {
          setCapturedImage(photo.uri);
          // Dispatch scan action
          await dispatch(scanWasteItem(photo.uri)).unwrap();
          
          Alert.alert(
            'Items Detected!',
            'Items have been added to your cart. Would you like to continue scanning or review your cart?',
            [
              { text: 'Continue Scanning', onPress: () => setCapturedImage(null) },
              { text: 'Review Cart', onPress: () => navigation.navigate('Cart') },
            ]
          );
        }
      } catch (error) {
        console.error('Error taking picture:', error);
        Alert.alert('Error', 'Failed to take picture. Please try again.');
      }
    }
  };

  const pickImageFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const imageUri = result.assets[0].uri;
        setCapturedImage(imageUri);
        
        await dispatch(scanWasteItem(imageUri)).unwrap();
        
        Alert.alert(
          'Items Detected!',
          'Items have been added to your cart. Would you like to select another image or review your cart?',
          [
            { text: 'Select Another', onPress: () => setCapturedImage(null) },
            { text: 'Review Cart', onPress: () => navigation.navigate('Cart') },
          ]
        );
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to process image. Please try again.');
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  if (!permission) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Requesting camera permissions...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>Camera permission is required to scan items</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Scan Waste Items</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Camera or Captured Image */}
      <View style={styles.cameraContainer}>
        {capturedImage ? (
          <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
        ) : (
          <CameraView 
            style={styles.camera} 
            facing={facing}
            ref={cameraRef}
          >
            {/* Scanning Overlay */}
            <View style={styles.scanningOverlay}>
              <View style={styles.scanningFrame} />
              <Text style={styles.scanningText}>
                Position items within the frame
              </Text>
            </View>
          </CameraView>
        )}
      </View>

      {/* Instructions */}
      <View style={styles.instructionsContainer}>
        <Text style={styles.instructionsTitle}>How to Scan</Text>
        <Text style={styles.instructionsText}>
          • Position items clearly within the frame{'\n'}
          • Ensure good lighting for better detection{'\n'}
          • Multiple items can be scanned at once
        </Text>
      </View>

      {/* Controls */}
      <View style={styles.controls}>
        <TouchableOpacity 
          style={styles.controlButton}
          onPress={pickImageFromGallery}
        >
          <Ionicons name="images" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.captureButton, isScanning && styles.captureButtonDisabled]}
          onPress={capturedImage ? () => setCapturedImage(null) : takePicture}
          disabled={isScanning}
        >
          {isScanning ? (
            <Text style={styles.captureButtonText}>Scanning...</Text>
          ) : (
            <Ionicons 
              name={capturedImage ? "refresh" : "camera"} 
              size={32} 
              color="white" 
            />
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.controlButton}
          onPress={toggleCameraFacing}
        >
          <Ionicons name="camera-reverse" size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Cart Button */}
      <TouchableOpacity 
        style={styles.cartButton}
        onPress={() => navigation.navigate('Cart')}
      >
        <Ionicons name="cart" size={20} color="white" />
        <Text style={styles.cartButtonText}>View Cart</Text>
      </TouchableOpacity>

      {scanError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{scanError}</Text>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  placeholder: {
    width: 40,
  },
  cameraContainer: {
    flex: 1,
    marginHorizontal: 15,
    marginVertical: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  camera: {
    flex: 1,
  },
  capturedImage: {
    flex: 1,
    width: '100%',
  },
  scanningOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scanningFrame: {
    width: width * 0.75,
    height: width * 0.75,
    borderWidth: 2,
    borderColor: '#4CAF50',
    borderRadius: 12,
    borderStyle: 'dashed',
  },
  scanningText: {
    color: 'white',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  instructionsContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginHorizontal: 15,
    marginBottom: 10,
    borderRadius: 12,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 20,
  },
  controls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 25,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  controlButton: {
    width: 55,
    height: 55,
    borderRadius: 27.5,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 35,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  captureButtonDisabled: {
    backgroundColor: '#666',
  },
  captureButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  cartButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cartButtonText: {
    color: 'white',
    marginLeft: 4,
    fontSize: 12,
    fontWeight: '600',
  },
  errorContainer: {
    position: 'absolute',
    bottom: 120,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(244, 67, 54, 0.9)',
    borderRadius: 8,
    padding: 12,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 14,
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
    color: 'white',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
    alignSelf: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ScannerScreen;
