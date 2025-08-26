import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { generateDisposalGuide } from '../store/slices/disposalSlice';
import { Ionicons } from '@expo/vector-icons';

interface DisposalGuideScreenProps {
  navigation: any;
}

const DisposalGuideScreen: React.FC<DisposalGuideScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { disposalGuide, isLoadingGuide, guideError } = useAppSelector(
    (state) => state.disposal
  );
  const { items } = useAppSelector((state) => state.cart);

  useEffect(() => {
    if (items.length > 0) {
      dispatch(generateDisposalGuide(items));
    }
  }, [dispatch, items]);

  const regenerateGuide = () => {
    dispatch(generateDisposalGuide(items));
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Disposal Guide</Text>
        <TouchableOpacity onPress={regenerateGuide}>
          <Ionicons name="refresh" size={24} color="#4CAF50" />
        </TouchableOpacity>
      </View>

      {/* Loading State */}
      {isLoadingGuide && (
        <View style={styles.loadingContainer}>
          <Ionicons name="book-outline" size={60} color="#ccc" />
          <Text style={styles.loadingText}>Generating personalized guide...</Text>
          <Text style={styles.loadingSubtext}>This may take a moment</Text>
        </View>
      )}

      {/* Error State */}
      {guideError && (
        <View style={styles.errorContainer}>
          <Ionicons name="warning-outline" size={60} color="#FF5722" />
          <Text style={styles.errorText}>{guideError}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={regenerateGuide}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Guide Content */}
      {disposalGuide && !isLoadingGuide && (
        <ScrollView style={styles.guideContent} showsVerticalScrollIndicator={false}>
          {/* Title */}
          <View style={styles.titleContainer}>
            <Ionicons name="book" size={24} color="#4CAF50" />
            <Text style={styles.guideTitle}>{disposalGuide.title}</Text>
          </View>

          {/* Estimated Time */}
          <View style={styles.timeContainer}>
            <Ionicons name="time" size={16} color="#666" />
            <Text style={styles.timeText}>Estimated time: {disposalGuide.estimatedTime}</Text>
          </View>

          {/* Safety Warnings */}
          {disposalGuide.safetyWarnings.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="warning" size={20} color="#FF5722" />
                <Text style={styles.sectionTitle}>Safety Warnings</Text>
              </View>
              <View style={styles.warningsContainer}>
                {disposalGuide.safetyWarnings.map((warning, index) => (
                  <View key={index} style={styles.warningItem}>
                    <Text style={styles.warningText}>{warning}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Steps */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list" size={20} color="#4CAF50" />
              <Text style={styles.sectionTitle}>Step-by-Step Instructions</Text>
            </View>
            {disposalGuide.steps.map((step, index) => (
              <View key={index} style={styles.stepItem}>
                <View style={styles.stepNumber}>
                  <Text style={styles.stepNumberText}>{index + 1}</Text>
                </View>
                <Text style={styles.stepText}>{step}</Text>
              </View>
            ))}
          </View>

          {/* Tips */}
          {disposalGuide.tips.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Ionicons name="bulb" size={20} color="#FFC107" />
                <Text style={styles.sectionTitle}>Helpful Tips</Text>
              </View>
              {disposalGuide.tips.map((tip, index) => (
                <View key={index} style={styles.tipItem}>
                  <Text style={styles.tipText}>{tip}</Text>
                </View>
              ))}
            </View>
          )}

          {/* Items Summary */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Ionicons name="list-circle" size={20} color="#2196F3" />
              <Text style={styles.sectionTitle}>Your Items</Text>
            </View>
            <View style={styles.itemsGrid}>
              {items.map((item) => (
                <View key={item.id} style={styles.itemSummary}>
                  <Text style={styles.itemSummaryName}>{item.name}</Text>
                  <Text style={styles.itemSummaryCategory}>
                    {item.customCategory || item.category}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionsContainer}>
            <TouchableOpacity 
              style={styles.centersButton}
              onPress={() => navigation.navigate('DisposalCenters')}
            >
              <Ionicons name="location" size={20} color="white" />
              <Text style={styles.centersButtonText}>Find Centers</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.cartButton}
              onPress={() => navigation.navigate('Cart')}
            >
              <Ionicons name="cart" size={20} color="#4CAF50" />
              <Text style={styles.cartButtonText}>Back to Cart</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              This guide is AI-generated based on your items. Always verify with local regulations.
            </Text>
          </View>
        </ScrollView>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '600',
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
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#d32f2f',
    textAlign: 'center',
    marginTop: 20,
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
  guideContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  guideTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
    flex: 1,
  },
  timeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8f0',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
  },
  timeText: {
    fontSize: 14,
    color: '#4CAF50',
    fontWeight: '500',
    marginLeft: 8,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 12,
  },
  warningsContainer: {
    backgroundColor: '#fff3e0',
    borderRadius: 8,
    padding: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#FF5722',
  },
  warningItem: {
    marginBottom: 8,
  },
  warningText: {
    fontSize: 14,
    color: '#d84315',
    lineHeight: 20,
  },
  stepItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  stepNumberText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  stepText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginTop: 4,
  },
  tipItem: {
    backgroundColor: '#fff8e1',
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  tipText: {
    fontSize: 14,
    color: '#f57f17',
    lineHeight: 20,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  itemSummary: {
    backgroundColor: '#e8f5e8',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
    minWidth: 100,
  },
  itemSummaryName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2e7d32',
    textAlign: 'center',
  },
  itemSummaryCategory: {
    fontSize: 10,
    color: '#4caf50',
    marginTop: 2,
    textAlign: 'center',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginVertical: 20,
  },
  centersButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.48,
    justifyContent: 'center',
    marginRight: 10,
  },
  centersButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  cartButton: {
    borderWidth: 1,
    borderColor: '#4CAF50',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 0.48,
    justifyContent: 'center',
  },
  cartButtonText: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  footer: {
    backgroundColor: '#e3f2fd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  footerText: {
    fontSize: 12,
    color: '#1976d2',
    textAlign: 'center',
    lineHeight: 16,
  },
});

export default DisposalGuideScreen;
