import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

interface DisposalAgentsScreenProps {
  navigation: any;
  route: any;
}

interface DisposalAgent {
  id: string;
  name: string;
  address: string;
  phone: string;
  website?: string;
  services: string[];
  rating: number;
  distance: number;
  price: string;
  description: string;
}

const DisposalAgentsScreen: React.FC<DisposalAgentsScreenProps> = ({ navigation, route }) => {
  const { items } = route.params || { items: [] };
  const [loading, setLoading] = useState(true);
  const [agents, setAgents] = useState<DisposalAgent[]>([]);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadDisposalAgents();
  }, []);

  const loadDisposalAgents = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get user location
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Location permission is required to find nearby disposal agents');
        setLoading(false);
        return;
      }

      const userLocation = await Location.getCurrentPositionAsync({});
      setLocation(userLocation);

      // Get categories from cart items
      const categories = [...new Set(items.map((item: any) => item.customCategory || item.category))] as string[];
      
      // In a real app, this would call your n8n webhook
      // For demo purposes, we'll simulate the API call
      await simulateN8nWebhookCall(userLocation, categories);
      
    } catch (err) {
      setError('Failed to load disposal agents. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const simulateN8nWebhookCall = async (userLocation: Location.LocationObject, categories: string[]) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock data - in a real app, this would come from your n8n workflow
    // that searches the web for disposal services based on location and categories
    const mockAgents: DisposalAgent[] = [
      {
        id: '1',
        name: 'EcoWaste Solutions',
        address: '123 Green Street, City Center',
        phone: '+1 (555) 123-4567',
        website: 'https://ecowaste-solutions.com',
        services: ['Electronic', 'Hazardous', 'Metal'],
        rating: 4.8,
        distance: 2.3,
        price: '$25-50',
        description: 'Professional electronic and hazardous waste disposal with certified recycling processes.'
      },
      {
        id: '2',
        name: 'Green Planet Recycling',
        address: '456 Eco Avenue, Downtown',
        phone: '+1 (555) 234-5678',
        website: 'https://greenplanet-recycling.com',
        services: ['Plastic', 'Glass', 'Metal', 'Recyclable'],
        rating: 4.6,
        distance: 3.7,
        price: '$15-30',
        description: 'Comprehensive recycling services for all types of recyclable materials.'
      },
      {
        id: '3',
        name: 'City Waste Management',
        address: '789 Municipal Way, Uptown',
        phone: '+1 (555) 345-6789',
        services: ['Trash', 'Compostable', 'Recyclable'],
        rating: 4.2,
        distance: 5.1,
        price: '$10-25',
        description: 'Municipal waste collection and composting services for residential and commercial.'
      },
      {
        id: '4',
        name: 'TechRecycle Pro',
        address: '321 Digital Drive, Tech District',
        phone: '+1 (555) 456-7890',
        website: 'https://techrecycle-pro.com',
        services: ['Electronic'],
        rating: 4.9,
        distance: 4.2,
        price: '$30-75',
        description: 'Specialized in electronic waste disposal with data destruction and component recovery.'
      }
    ];

    // Filter agents based on the categories we need to dispose
    const relevantAgents = mockAgents.filter(agent => 
      agent.services.some(service => categories.includes(service))
    );

    setAgents(relevantAgents);
  };

  const handleCallAgent = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  const handleVisitWebsite = (website: string) => {
    if (website) {
      Linking.openURL(website);
    }
  };

  const handleGetDirections = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const url = `https://maps.apple.com/?q=${encodedAddress}`;
    Linking.openURL(url);
  };

  const handleContactAgent = (agent: DisposalAgent) => {
    const categories = [...new Set(items.map((item: any) => item.customCategory || item.category))];
    const message = `Hi, I need disposal services for: ${categories.join(', ')}. Can you help?`;
    
    Alert.alert(
      'Contact Agent',
      `Contact ${agent.name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => handleCallAgent(agent.phone) },
        { 
          text: 'Directions', 
          onPress: () => handleGetDirections(agent.address) 
        }
      ]
    );
  };

  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={i} name="star" size={14} color="#FFD700" />);
    }

    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={14} color="#FFD700" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={14} color="#FFD700" />);
    }

    return stars;
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Finding Disposal Agents</Text>
          <View style={styles.headerActions} />
        </View>
        
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
          <Text style={styles.loadingText}>Searching for disposal services near you...</Text>
          <Text style={styles.loadingSubtext}>Using n8n agent to find the best options</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Disposal Agents</Text>
          <View style={styles.headerActions} />
        </View>
        
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle" size={64} color="#F44336" />
          <Text style={styles.errorTitle}>Error Loading Agents</Text>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadDisposalAgents}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Disposal Agents</Text>
        <TouchableOpacity onPress={loadDisposalAgents} style={styles.refreshButton}>
          <Ionicons name="refresh" size={20} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
          <Ionicons name="business" size={32} color="#2196F3" />
          <Text style={styles.introTitle}>Professional Disposal Services</Text>
          <Text style={styles.introText}>
            Found {agents.length} certified disposal agents near you
          </Text>
        </View>

        {agents.map((agent) => (
          <View key={agent.id} style={styles.agentCard}>
            <View style={styles.agentHeader}>
              <Text style={styles.agentName}>{agent.name}</Text>
              <View style={styles.ratingContainer}>
                <View style={styles.stars}>
                  {renderStars(agent.rating)}
                </View>
                <Text style={styles.ratingText}>{agent.rating}</Text>
              </View>
            </View>

            <View style={styles.agentInfo}>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color="#666" />
                <Text style={styles.infoText}>{agent.address}</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="car-outline" size={16} color="#666" />
                <Text style={styles.infoText}>{agent.distance} miles away</Text>
              </View>
              <View style={styles.infoRow}>
                <Ionicons name="cash-outline" size={16} color="#666" />
                <Text style={styles.infoText}>Price range: {agent.price}</Text>
              </View>
            </View>

            <Text style={styles.agentDescription}>{agent.description}</Text>

            <View style={styles.servicesContainer}>
              <Text style={styles.servicesTitle}>Services:</Text>
              <View style={styles.servicesTags}>
                {agent.services.map((service, index) => (
                  <View key={index} style={styles.serviceTag}>
                    <Text style={styles.serviceTagText}>{service}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.agentActions}>
              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleCallAgent(agent.phone)}
              >
                <Ionicons name="call" size={18} color="#4CAF50" />
                <Text style={styles.actionButtonText}>Call</Text>
              </TouchableOpacity>

              {agent.website && (
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleVisitWebsite(agent.website!)}
                >
                  <Ionicons name="globe" size={18} color="#2196F3" />
                  <Text style={styles.actionButtonText}>Website</Text>
                </TouchableOpacity>
              )}

              <TouchableOpacity 
                style={styles.actionButton}
                onPress={() => handleGetDirections(agent.address)}
              >
                <Ionicons name="navigate" size={18} color="#FF9800" />
                <Text style={styles.actionButtonText}>Directions</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, styles.primaryAction]}
                onPress={() => handleContactAgent(agent)}
              >
                <Ionicons name="chatbubble" size={18} color="white" />
                <Text style={[styles.actionButtonText, styles.primaryActionText]}>Contact</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <View style={styles.noteCard}>
          <Ionicons name="information-circle" size={24} color="#2196F3" />
          <Text style={styles.noteTitle}>Note</Text>
          <Text style={styles.noteText}>
            These agents were found using our AI-powered search system. 
            Prices and availability may vary. Please contact them directly for quotes and scheduling.
          </Text>
        </View>

        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
    textAlign: 'center',
  },
  headerActions: {
    width: 40,
  },
  refreshButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 18,
    color: '#333',
    marginTop: 20,
    textAlign: 'center',
  },
  loadingSubtext: {
    fontSize: 14,
    color: '#666',
    marginTop: 8,
    textAlign: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginTop: 20,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  introCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  introTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  introText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
  agentCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 15,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  agentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  agentName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stars: {
    flexDirection: 'row',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  agentInfo: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  agentDescription: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 12,
  },
  servicesContainer: {
    marginBottom: 16,
  },
  servicesTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  servicesTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  serviceTag: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  serviceTagText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
  },
  agentActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    marginHorizontal: 2,
  },
  primaryAction: {
    backgroundColor: '#4CAF50',
  },
  actionButtonText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  primaryActionText: {
    color: 'white',
  },
  noteCard: {
    backgroundColor: '#E3F2FD',
    margin: 20,
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  noteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1976D2',
    marginLeft: 12,
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#1976D2',
    lineHeight: 20,
    marginLeft: 12,
    flex: 1,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default DisposalAgentsScreen;
