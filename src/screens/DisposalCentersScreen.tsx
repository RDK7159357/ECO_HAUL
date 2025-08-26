import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import * as Location from 'expo-location';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { findNearbyDisposalCenters } from '../store/slices/disposalSlice';
import { Ionicons } from '@expo/vector-icons';

interface DisposalCentersScreenProps {
  navigation: any;
}

const DisposalCentersScreen: React.FC<DisposalCentersScreenProps> = ({ navigation }) => {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  
  const dispatch = useAppDispatch();
  const { nearbyDisposalCenters, isLoadingCenters, centersError } = useAppSelector(
    (state) => state.disposal
  );
  const { items } = useAppSelector((state) => state.cart);

  useEffect(() => {
    requestLocationAndSearch();
  }, []);

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

  const visitWebsite = (website: string) => {
    let url = website;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`;
    }
    Linking.openURL(url);
  };

  const renderRating = (rating?: number) => {
    if (!rating) return null;
    
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color="#FFD700"
        />
      );
    }
    return <View style={styles.ratingContainer}>{stars}</View>;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Disposal Centers</Text>
        <TouchableOpacity onPress={requestLocationAndSearch}>
          <Ionicons name="refresh" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Location Info */}
      {location && (
        <View style={styles.locationInfo}>
          <Ionicons name="location" size={16} color="#4CAF50" />
          <Text style={styles.locationText}>
            Showing centers near your location
          </Text>
        </View>
      )}

      {/* Loading State */}
      {isLoadingCenters && (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Finding nearby disposal centers...</Text>
        </View>
      )}

      {/* Error State */}
      {centersError && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{centersError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={requestLocationAndSearch}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Centers List */}
      <ScrollView style={styles.centersList} showsVerticalScrollIndicator={false}>
        {nearbyDisposalCenters.map((center) => (
          <View key={center.id} style={styles.centerCard}>
            <View style={styles.centerHeader}>
              <View style={styles.centerInfo}>
                <Text style={styles.centerName}>{center.name}</Text>
                {renderRating(center.rating)}
              </View>
              <Text style={styles.centerDistance}>{center.distance.toFixed(1)} km</Text>
            </View>

            <TouchableOpacity 
              style={styles.addressContainer}
              onPress={() => openMaps(center.address)}
            >
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.centerAddress}>{center.address}</Text>
              <Ionicons name="chevron-forward" size={16} color="#666" />
            </TouchableOpacity>

            <View style={styles.centerDetails}>
              <View style={styles.hoursContainer}>
                <Ionicons name="time-outline" size={16} color="#666" />
                <Text style={styles.centerHours}>{center.hours}</Text>
              </View>
              
              {center.phone && (
                <TouchableOpacity 
                  style={styles.phoneContainer}
                  onPress={() => callCenter(center.phone!)}
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
                  <View key={material} style={styles.materialTag}>
                    <Text style={styles.materialText}>{material}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.centerActions}>
              <TouchableOpacity 
                style={styles.directionsButton}
                onPress={() => openMaps(center.address)}
              >
                <Ionicons name="navigate" size={16} color="white" />
                <Text style={styles.directionsButtonText}>Directions</Text>
              </TouchableOpacity>
              
              {center.website && (
                <TouchableOpacity 
                  style={styles.websiteButton}
                  onPress={() => visitWebsite(center.website!)}
                >
                  <Ionicons name="globe-outline" size={16} color="#4CAF50" />
                  <Text style={styles.websiteButtonText}>Website</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* No Results */}
      {!isLoadingCenters && !centersError && nearbyDisposalCenters.length === 0 && (
        <View style={styles.noResultsContainer}>
          <Ionicons name="location-outline" size={60} color="#ccc" />
          <Text style={styles.noResultsTitle}>No centers found</Text>
          <Text style={styles.noResultsText}>
            Try expanding your search radius or check back later.
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#f0f8f0',
  },
  locationText: {
    fontSize: 14,
    color: '#4CAF50',
    marginLeft: 6,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  centersList: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  centerCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
  ratingContainer: {
    flexDirection: 'row',
  },
  centerDistance: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
    backgroundColor: '#f0f8f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  addressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  centerAddress: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginHorizontal: 8,
  },
  centerDetails: {
    marginBottom: 12,
  },
  hoursContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
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
  },
  materialsContainer: {
    marginBottom: 16,
  },
  materialsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  materialsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  materialTag: {
    backgroundColor: '#e8f5e8',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 6,
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
  directionsButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.48,
    justifyContent: 'center',
  },
  directionsButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  websiteButton: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.48,
    justifyContent: 'center',
  },
  websiteButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  noResultsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  noResultsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 22,
  },
});

export default DisposalCentersScreen;
