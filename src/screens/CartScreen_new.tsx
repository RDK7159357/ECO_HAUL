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
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { removeItemFromCart, updateItemCategory, clearCart } from '../store/slices/cartSlice';
import { Ionicons } from '@expo/vector-icons';

interface CartScreenProps {
  navigation: any;
}

const CartScreen: React.FC<CartScreenProps> = ({ navigation }) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const dispatch = useAppDispatch();
  const { items, totalItems, totalPoints } = useAppSelector((state) => state.cart);

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
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="chevron-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart (0 items)</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity>
              <Ionicons name="share-outline" size={24} color="#333" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.moreButton}>
              <Ionicons name="ellipsis-vertical" size={24} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={64} color="#ccc" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <Text style={styles.emptySubtext}>Start scanning items to add them to your cart</Text>
          <TouchableOpacity 
            style={styles.scanButton}
            onPress={() => navigation.navigate('Scanner')}
          >
            <Ionicons name="camera" size={20} color="white" />
            <Text style={styles.scanButtonText}>Start Scanning</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const categoryCounts = getCategoryCounts();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart ({totalItems} items)</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity>
            <Ionicons name="share-outline" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <Ionicons name="ellipsis-vertical" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Summary */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Category Summary</Text>
        <View style={styles.categoryGrid}>
          {Object.entries(categoryCounts).map(([category, count]) => (
            <View key={category} style={styles.categoryBox}>
              <Ionicons 
                name={getCategoryIcon(category)} 
                size={24} 
                color={getCategoryColor(category)} 
              />
              <Text style={styles.categoryCount}>{count}</Text>
              <Text style={styles.categoryLabel}>{category}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Items List */}
      {items.map((item) => (
        <View key={item.id} style={styles.itemCard}>
          <Image source={{ uri: item.image }} style={styles.itemImage} />
          <View style={styles.itemContent}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemName}>{item.name}</Text>
              <TouchableOpacity 
                onPress={() => handleEditCategory(item.id, item.customCategory || item.category)}
                style={styles.editButton}
              >
                <Ionicons name="pencil" size={16} color="#4CAF50" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.categoryTag}>
              <Text style={styles.categoryText}>{item.customCategory || item.category}</Text>
            </View>
            
            <View style={styles.itemFooter}>
              <View style={styles.confidenceContainer}>
                <Ionicons name="checkmark-circle" size={16} color="#4CAF50" />
                <Text style={styles.confidenceText}>Confidence: {Math.round((item.confidence || 0.95) * 100)}%</Text>
              </View>
              <TouchableOpacity 
                style={styles.infoButton}
                onPress={() => Alert.alert('Item Info', `${item.name}\nCategory: ${item.customCategory || item.category}\nPoints: ${item.points}`)}
              >
                <Ionicons name="information-circle" size={20} color="#2196F3" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}

      {/* Action Button */}
      <TouchableOpacity 
        style={styles.findLocationsButton}
        onPress={handleFindDisposalCenters}
      >
        <Ionicons name="location" size={20} color="white" />
        <Text style={styles.findLocationsText}>Find Locations</Text>
      </TouchableOpacity>
      
      <View style={styles.bottomSpacing} />
    </ScrollView>
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
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  scanButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 30,
  },
  scanButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
  summaryCard: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryBox: {
    width: '22%',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    marginBottom: 8,
  },
  categoryCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  categoryLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    textAlign: 'center',
  },
  itemCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 15,
    padding: 16,
    flexDirection: 'row',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 16,
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
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '500',
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
    backgroundColor: '#4CAF50',
    marginHorizontal: 20,
    borderRadius: 25,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  findLocationsText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
    marginLeft: 8,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default CartScreen;
