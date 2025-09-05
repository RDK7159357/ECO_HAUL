import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  Animated,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { findNearbyDisposalCenters } from '../store/slices/disposalSlice';
import { Ionicons } from '@expo/vector-icons';

interface DisposalCentersScreenProps {
  navigation: any;
}

const DisposalCentersScreen: React.FC<DisposalCentersScreenProps> = ({ navigation }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  
  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;
  
  const dispatch = useAppDispatch();
  const { nearbyDisposalCenters, isLoadingCenters, centersError } = useAppSelector(
    (state) => state.disposal
  );
  const { items } = useAppSelector((state) => state.cart);

  useEffect(() => {
    requestLocationAndSearch();
    
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleHapticFeedback = () => {
    Vibration.vibrate(50);
  };

  const handleInteractivePress = (callback: () => void) => {
    handleHapticFeedback();
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    callback();
  };

  const requestLocationAndSearch = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Location Permission Required',
          'We need location access to find nearby disposal centers.',
          [
            { text: 'Cancel' },
            { text: 'Settings', onPress: () => Linking.openSettings() }
          ]
        );
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      const wasteTypes = [...new Set(items.map(item => item.customCategory || item.category))];
      
      dispatch(findNearbyDisposalCenters({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        wasteTypes,
      }));
    } catch (error) {
      Alert.alert('Error', 'Failed to get location. Please try again.');
    }
  };

  const openMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `maps://app?q=${encodedAddress}`;
    
    Linking.canOpenURL(url).then((canOpen) => {
      if (canOpen) {
        Linking.openURL(url);
      } else {
        // Fallback to Google Maps web
        const googleMapsUrl = `https://maps.google.com?q=${encodedAddress}`;
        Linking.openURL(googleMapsUrl);
      }
    });
  };

  const callCenter = (phone: string) => {
    const phoneUrl = `tel:${phone}`;
    Linking.openURL(phoneUrl);
  };

  const renderRating = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={14}
          color="#FFD700"
        />
      );
    }
    return <View style={styles.rating}>{stars}</View>;
  };

  return (
    <LinearGradient
      colors={['#f0f8f0', '#e8f5e8', '#ffffff']}
      style={styles.container}
    >
      {/* Enhanced Header */}
      <LinearGradient
        colors={['#ffffff', '#f8f9fa']}
        style={styles.header}
      >
        <TouchableOpacity 
          onPress={() => handleInteractivePress(() => navigation.goBack())}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Disposal Centers</Text>
        <TouchableOpacity 
          onPress={() => handleInteractivePress(requestLocationAndSearch)}
          style={styles.refreshButton}
        >
          <LinearGradient
            colors={['#4CAF50', '#45A049']}
            style={styles.refreshGradient}
          >
            <Ionicons name="refresh" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </LinearGradient>

      <Animated.View 
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        {/* Enhanced Location Info */}
        {location && (
          <View style={styles.locationInfo}>
            <LinearGradient
              colors={['#E8F5E8', '#f0f8f0']}
              style={styles.locationGradient}
            >
              <Ionicons name="location" size={20} color="#4CAF50" />
              <Text style={styles.locationText}>
                Showing centers near your location
              </Text>
              <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
            </LinearGradient>
          </View>
        )}

        {/* Enhanced Loading State */}
        {isLoadingCenters && (
          <Animated.View style={styles.loadingContainer}>
            <LinearGradient
              colors={['#f0f8f0', '#e8f5e8']}
              style={styles.loadingGradient}
            >
              <View style={styles.loadingContent}>
                <Ionicons name="hourglass" size={32} color="#4CAF50" />
                <Text style={styles.loadingText}>Finding nearby disposal centers...</Text>
                <Text style={styles.loadingSubtext}>Analyzing your cart items for the best matches</Text>
              </View>
            </LinearGradient>
          </Animated.View>
        )}

        {/* Enhanced Error State */}
        {centersError && (
          <View style={styles.errorContainer}>
            <LinearGradient
              colors={['#ffebee', '#ffcdd2']}
              style={styles.errorGradient}
            >
              <Ionicons name="alert-circle" size={32} color="#f44336" />
              <Text style={styles.errorText}>{centersError}</Text>
              <TouchableOpacity 
                style={styles.retryButtonContainer}
                onPress={() => handleInteractivePress(requestLocationAndSearch)}
              >
                <LinearGradient
                  colors={['#f44336', '#d32f2f']}
                  style={styles.retryButton}
                >
                  <Ionicons name="refresh" size={16} color="white" />
                  <Text style={styles.retryButtonText}>Try Again</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}

        {/* Enhanced Centers List */}
        <ScrollView style={styles.centersList} showsVerticalScrollIndicator={false}>
          {nearbyDisposalCenters.map((center, index) => (
            <Animated.View 
              key={center.id} 
              style={[
                styles.centerCard,
                {
                  transform: [{ scale: scaleAnim }],
                  opacity: fadeAnim,
                }
              ]}
            >
              <LinearGradient
                colors={['#ffffff', '#f8f9fa']}
                style={styles.centerCardGradient}
              >
                <View style={styles.centerHeader}>
                  <View style={styles.centerInfo}>
                    <Text style={styles.centerName}>{center.name}</Text>
                    {center.rating && renderRating(center.rating)}
                  </View>
                  <View style={styles.distanceContainer}>
                    <Ionicons name="navigate" size={16} color="#4CAF50" />
                    <Text style={styles.centerDistance}>{center.distance.toFixed(1)} km</Text>
                  </View>
                </View>

                <TouchableOpacity 
                  style={styles.addressContainer}
                  onPress={() => handleInteractivePress(() => openMaps(center.address))}
                >
                  <Ionicons name="location-outline" size={16} color="#666" />
                  <Text style={styles.centerAddress}>{center.address}</Text>
                  <Ionicons name="chevron-forward" size={16} color="#4CAF50" />
                </TouchableOpacity>

                <View style={styles.centerDetails}>
                  <View style={styles.hoursContainer}>
                    <Ionicons name="time-outline" size={16} color="#666" />
                    <Text style={styles.centerHours}>{center.hours}</Text>
                  </View>
                  
                  {center.phone && (
                    <TouchableOpacity 
                      style={styles.phoneContainer}
                      onPress={() => handleInteractivePress(() => callCenter(center.phone!))}
                    >
                      <Ionicons name="call-outline" size={16} color="#2196F3" />
                      <Text style={styles.centerPhone}>{center.phone}</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <View style={styles.materialsContainer}>
                  <Text style={styles.materialsLabel}>Accepted Materials:</Text>
                  <View style={styles.materialsList}>
                    {center.acceptedMaterials.map((material) => (
                      <LinearGradient
                        key={material}
                        colors={['#E8F5E8', '#f0f8f0']}
                        style={styles.materialTag}
                      >
                        <Text style={styles.materialText}>{material}</Text>
                      </LinearGradient>
                    ))}
                  </View>
                </View>

                <View style={styles.centerActions}>
                  <TouchableOpacity 
                    style={styles.directionsButtonContainer}
                    onPress={() => handleInteractivePress(() => openMaps(center.address))}
                  >
                    <LinearGradient
                      colors={['#4CAF50', '#45A049']}
                      style={styles.directionsButton}
                    >
                      <Ionicons name="navigate" size={16} color="white" />
                      <Text style={styles.directionsText}>Get Directions</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                  
                  {center.phone && (
                    <TouchableOpacity 
                      style={styles.callButtonContainer}
                      onPress={() => handleInteractivePress(() => callCenter(center.phone!))}
                    >
                      <LinearGradient
                        colors={['#2196F3', '#1976D2']}
                        style={styles.callButton}
                      >
                        <Ionicons name="call" size={16} color="white" />
                        <Text style={styles.callText}>Call</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  )}
                </View>
              </LinearGradient>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Enhanced No Results */}
        {!isLoadingCenters && !centersError && nearbyDisposalCenters.length === 0 && (
          <View style={styles.noResultsContainer}>
            <LinearGradient
              colors={['#f0f8f0', '#e8f5e8']}
              style={styles.noResultsGradient}
            >
              <Ionicons name="search" size={48} color="#4CAF50" />
              <Text style={styles.noResultsTitle}>No Centers Found</Text>
              <Text style={styles.noResultsText}>
                We couldn't find any disposal centers near your location that accept your items.
              </Text>
              <TouchableOpacity 
                style={styles.expandSearchContainer}
                onPress={() => handleInteractivePress(requestLocationAndSearch)}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45A049']}
                  style={styles.expandSearchButton}
                >
                  <Ionicons name="refresh" size={16} color="white" />
                  <Text style={styles.expandSearchText}>Try Again</Text>
                </LinearGradient>
              </TouchableOpacity>
            </LinearGradient>
          </View>
        )}
      </Animated.View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.8)',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  refreshButton: {
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  refreshGradient: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  locationInfo: {
    marginVertical: 16,
  },
  locationGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  locationText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 8,
    flex: 1,
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingGradient: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  loadingContent: {
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4CAF50',
    marginTop: 16,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    margin: 16,
  },
  errorGradient: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
    textAlign: 'center',
    marginVertical: 16,
  },
  retryButtonContainer: {
    marginTop: 8,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  centersList: {
    flex: 1,
  },
  centerCard: {
    marginBottom: 16,
  },
  centerCardGradient: {
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  centerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  centerInfo: {
    flex: 1,
  },
  centerName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  centerDistance: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginLeft: 4,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    marginBottom: 12,
  },
  centerAddress: {
    fontSize: 14,
    color: '#666',
    flex: 1,
    marginLeft: 8,
  },
  centerDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  centerHours: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  phoneContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerPhone: {
    fontSize: 14,
    color: '#2196F3',
    marginLeft: 8,
    fontWeight: '500',
  },
  materialsContainer: {
    marginBottom: 16,
  },
  materialsLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  materialsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  materialTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  materialText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  centerActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  directionsButtonContainer: {
    flex: 1,
    marginRight: 8,
  },
  directionsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  directionsText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  callButtonContainer: {
    flex: 1,
    marginLeft: 8,
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
  },
  callText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsGradient: {
    padding: 32,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  expandSearchContainer: {
    marginTop: 8,
  },
  expandSearchButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  expandSearchText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
});

export default DisposalCentersScreen;
