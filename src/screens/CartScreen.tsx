import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Image,
  Alert,
  Modal,
  Animated,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { removeItemFromCart, updateItemCategory, clearCart } from '../store/slices/cartSlice';
import { Ionicons } from '@expo/vector-icons';

interface CartScreenProps {
  navigation: any;
}

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [scaleAnim] = useState(new Animated.Value(1));
  const [fadeAnim] = useState(new Animated.Value(0));
  
  const dispatch = useAppDispatch();
  const { items, totalItems, totalPoints } = useAppSelector((state) => state.cart);

  React.useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
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

  const handleEditCategory = (itemId: string, currentCategory: string) => {
    setEditingItem(itemId);
    setSelectedCategory(currentCategory);
  };

  const handleFindDisposalCenters = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart first.');
      return;
    }
    navigation.navigate('DisposalCenters');
  };

  const getCategoryCounts = () => {
    const counts: { [key: string]: number } = {};
    items.forEach(item => {
      const category = item.customCategory || item.category;
      counts[category] = (counts[category] || 0) + 1;
    });
    return counts;
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'plastic': return 'leaf';
      case 'recyclable': return 'refresh';
      case 'compostable': return 'leaf-outline';  
      case 'trash': return 'trash';
      case 'hazardous': return 'warning';
      default: return 'help-circle';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'plastic': return '#2196F3';
      case 'recyclable': return '#2196F3';
      case 'compostable': return '#4CAF50';
      case 'trash': return '#757575';
      case 'hazardous': return '#F44336';
      default: return '#9E9E9E';
    }
  };

  if (items.length === 0) {
    return (
      <View style={styles.container}>
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
          <Text style={styles.headerTitle}>Cart (0 items)</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={handleHapticFeedback}>
              <Ionicons name="share-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreButton} onPress={handleHapticFeedback}>
              <Ionicons name="ellipsis-vertical" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <Animated.View style={[styles.emptyContainer, { opacity: fadeAnim }]}>
          <View style={styles.emptyIconContainer}>
            <LinearGradient
              colors={['#E8F5E8', '#f0f8f0']}
              style={styles.emptyIconGradient}
            >
              <Ionicons name="cart-outline" size={64} color="#4CAF50" />
            </LinearGradient>
          </View>
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>Start scanning items to add them to your cart and make a positive impact!</Text>
          <TouchableOpacity 
            style={styles.scanButtonContainer}
            onPress={() => handleInteractivePress(() => navigation.navigate('Scanner'))}
          >
            <LinearGradient
              colors={['#4CAF50', '#45A049']}
              style={styles.scanButton}
            >
              <Ionicons name="camera" size={20} color="white" />
              <Text style={styles.scanButtonText}>Start Scanning</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    );
  }

  const categoryCounts = getCategoryCounts();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
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
        <Text style={styles.headerTitle}>Cart ({totalItems} items)</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={handleHapticFeedback}>
            <Ionicons name="share-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton} onPress={handleHapticFeedback}>
            <Ionicons name="ellipsis-vertical" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <Animated.View style={{ opacity: fadeAnim }}>
        {/* Enhanced Impact Summary */}
        <View style={styles.impactSummary}>
          <LinearGradient
            colors={['#4CAF50', '#66BB6A']}
            style={styles.impactGradient}
          >
            <View style={styles.impactHeader}>
              <Ionicons name="leaf" size={24} color="white" />
              <Text style={styles.impactTitle}>Your Environmental Impact</Text>
            </View>
            <View style={styles.impactStats}>
              <View style={styles.impactStat}>
                <Text style={styles.impactNumber}>{Math.round(totalItems * 2.3)}kg</Text>
                <Text style={styles.impactLabel}>CO₂ Saved</Text>
              </View>
              <View style={styles.impactStat}>
                <Text style={styles.impactNumber}>{totalItems * 15}L</Text>
                <Text style={styles.impactLabel}>Water Saved</Text>
              </View>
              <View style={styles.impactStat}>
                <Text style={styles.impactNumber}>{totalPoints}</Text>
                <Text style={styles.impactLabel}>Points</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Category Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <Ionicons name="pie-chart" size={20} color="#4CAF50" />
            <Text style={styles.summaryTitle}>Category Summary</Text>
          </View>
          <View style={styles.categoryGrid}>
            {Object.entries(categoryCounts).map(([category, count]) => (
              <View key={category} style={styles.categoryBox}>
                <View style={[styles.categoryIconContainer, { backgroundColor: `${getCategoryColor(category)}15` }]}>
                  <Ionicons 
                    name={getCategoryIcon(category)} 
                    size={24} 
                    color={getCategoryColor(category)} 
                  />
                </View>
                <Text style={styles.categoryCount}>{count}</Text>
                <Text style={styles.categoryLabel}>{category}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Items List */}
        {items.map((item, index) => (
          <Animated.View 
            key={item.id} 
            style={[
              styles.itemCard,
              { 
                transform: [{ scale: scaleAnim }],
                opacity: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [0, 1],
                })
              }
            ]}
          >
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemContent}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemName}>{item.name}</Text>
                <TouchableOpacity 
                  onPress={() => handleInteractivePress(() => handleEditCategory(item.id, item.customCategory || item.category))}
                  style={styles.editButton}
                >
                  <Ionicons name="pencil" size={16} color="#4CAF50" />
                </TouchableOpacity>
              </View>
              
              <View style={[styles.categoryTag, { backgroundColor: `${getCategoryColor(item.customCategory || item.category)}15` }]}>
                <Text style={[styles.categoryText, { color: getCategoryColor(item.customCategory || item.category) }]}>
                  {item.customCategory || item.category}
                </Text>
              </View>
              
              <View style={styles.itemFooter}>
                <View style={styles.confidenceContainer}>
                  <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                  <Text style={styles.confidenceText}>Confidence: {Math.round((item.confidence || 0.95) * 100)}%</Text>
                </View>
                <TouchableOpacity 
                  style={styles.infoButton}
                  onPress={() => handleInteractivePress(() => Alert.alert('Item Info', `${item.name}\nCategory: ${item.customCategory || item.category}\nPoints: ${item.points}`))}
                >
                  <Ionicons name="information-circle" size={20} color="#2196F3" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.itemGlow} />
          </Animated.View>
        ))}

        {/* Action Button */}
        <TouchableOpacity 
          style={styles.findLocationsButtonContainer}
          onPress={() => handleInteractivePress(handleFindDisposalCenters)}
        >
          <LinearGradient
            colors={['#4CAF50', '#45A049']}
            style={styles.findLocationsButton}
          >
            <Ionicons name="location" size={20} color="white" />
            <Text style={styles.findLocationsText}>Find Disposal Locations</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </LinearGradient>
        </TouchableOpacity>
        
        <View style={styles.bottomSpacing} />
      </Animated.View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
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
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
    flexDirection: 'row',
    alignItems: 'center',
    width: 70,
    justifyContent: 'flex-end',
  },
  moreButton: {
    marginLeft: 15,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIconContainer: {
    marginBottom: 24,
  },
  emptyIconGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
    marginTop: 20,
    letterSpacing: 0.5,
  },
  emptySubtext: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  scanButtonContainer: {
    marginTop: 40,
  },
  scanButton: {
    borderRadius: 30,
    paddingHorizontal: 32,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  scanButtonText: {
    color: 'white',
    fontWeight: '700',
    marginLeft: 12,
    fontSize: 16,
    letterSpacing: 0.5,
  },
  // Impact Summary Styles
  impactSummary: {
    margin: 20,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  impactGradient: {
    padding: 24,
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  impactTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 12,
    letterSpacing: 0.3,
  },
  impactStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  impactStat: {
    alignItems: 'center',
    flex: 1,
  },
  impactNumber: {
    color: 'white',
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 4,
  },
  impactLabel: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 12,
    fontWeight: '500',
    textAlign: 'center',
  },
  // Summary Card Styles
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 18,
  },
  categoryIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  // Item Card Styles
  itemGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.05)',
  },
  // Button Styles
  findLocationsButtonContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  // Removed duplicate definition of scanButtonText
  summaryCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginLeft: 8,
    letterSpacing: 0.3,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryBox: {
    width: '22%',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    backgroundColor: '#f8fafe',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.1)',
  },
  categoryCount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#333',
    marginTop: 12,
    letterSpacing: 0.5,
  },
  categoryLabel: {
    fontSize: 11,
    color: '#666',
    marginTop: 6,
    textAlign: 'center',
    fontWeight: '600',
  },
  itemCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 18,
    padding: 20,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.05)',
    position: 'relative',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 16,
    marginRight: 20,
    borderWidth: 2,
    borderColor: 'rgba(76, 175, 80, 0.1)',
  },
  itemContent: {
    flex: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  editButton: {
    padding: 4,
  },
  categoryTag: {
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignSelf: 'flex-start',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.2)',
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  confidenceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confidenceText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  infoButton: {
    padding: 4,
  },
  findLocationsButton: {
    paddingVertical: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  findLocationsText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
    marginLeft: 12,
    marginRight: 8,
    letterSpacing: 0.5,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default CartScreen;
