import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DisposalInstructionsScreenProps {
  navigation: any;
  route: any;
}

const DisposalInstructionsScreen: React.FC<DisposalInstructionsScreenProps> = ({ navigation, route }) => {
  const { items } = route.params || { items: [] };

  const getDisposalInstructions = (category: string) => {
    const instructions: { [key: string]: string[] } = {
      'Plastic': [
        'Clean the plastic item thoroughly to remove any food residue',
        'Check for recycling symbols (1-7) on the bottom',
        'Remove any caps, lids, or labels if they are different plastic types',
        'Place in your recycling bin or take to a plastic recycling center',
        'Plastic bags should be taken to special collection points at grocery stores'
      ],
      'Recyclable': [
        'Sort items by material type (paper, plastic, glass, metal)',
        'Clean containers to remove food waste and liquids',
        'Remove any non-recyclable components (e.g., plastic windows from envelopes)',
        'Place in appropriate recycling bins',
        'Check local recycling guidelines for specific requirements'
      ],
      'Compostable': [
        'Remove any stickers, ties, or non-compostable packaging',
        'Cut larger items into smaller pieces to speed decomposition',
        'Add to your home compost bin or municipal compost collection',
        'Mix with brown materials (leaves, paper) for balanced composting',
        'Keep compost moist but not waterlogged'
      ],
      'Electronic': [
        'Remove batteries if possible (dispose separately)',
        'Delete all personal data from devices',
        'Find a certified e-waste recycling facility',
        'Many retailers offer take-back programs for electronics',
        'Never put electronics in regular trash due to toxic materials'
      ],
      'Hazardous': [
        'Do NOT put in regular trash or recycling',
        'Find your local hazardous waste collection center',
        'Keep items in original containers with labels',
        'Transport safely - no mixing of different chemicals',
        'Many communities have special collection days for hazardous waste'
      ],
      'Glass': [
        'Rinse containers to remove food residue',
        'Remove caps and lids (recycle separately)',
        'Place in glass recycling bin or take to recycling center',
        'Broken glass should be wrapped and labeled before disposal',
        'Different colored glass may need to be separated'
      ],
      'Metal': [
        'Clean cans and containers thoroughly',
        'Remove paper labels (they can stay during recycling)',
        'Crush aluminum cans to save space if desired',
        'Place in metal recycling bin or scrap metal collection',
        'Large metal items may need special pickup or drop-off'
      ],
      'Trash': [
        'Place in regular household waste bin',
        'Ensure item is properly bagged to prevent spillage',
        'Follow local waste collection schedule',
        'Consider if item could be donated, repaired, or repurposed first',
        'Large items may require special pickup arrangement'
      ]
    };

    return instructions[category] || [
      'Check with local waste management for disposal guidelines',
      'Consider if item can be reused, donated, or recycled',
      'Dispose responsibly according to local regulations',
      'When in doubt, contact environmental services for guidance'
    ];
  };

  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case 'plastic': return 'leaf';
      case 'recyclable': return 'refresh';
      case 'compostable': return 'leaf-outline';  
      case 'electronic': return 'hardware-chip';
      case 'glass': return 'wine';
      case 'metal': return 'construct';
      case 'hazardous': return 'warning';
      case 'trash': return 'trash';
      default: return 'help-circle';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'plastic': return '#2196F3';
      case 'recyclable': return '#4CAF50';
      case 'compostable': return '#8BC34A';
      case 'electronic': return '#FF9800';
      case 'glass': return '#00BCD4';
      case 'metal': return '#607D8B';
      case 'hazardous': return '#F44336';
      case 'trash': return '#757575';
      default: return '#9E9E9E';
    }
  };

  // Group items by category
  const itemsByCategory = items.reduce((acc: any, item: any) => {
    const category = item.customCategory || item.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Disposal Instructions</Text>
        <View style={styles.headerActions} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.introCard}>
          <Ionicons name="information-circle" size={32} color="#4CAF50" />
          <Text style={styles.introTitle}>Step-by-Step Disposal Guide</Text>
          <Text style={styles.introText}>
            Follow these instructions to properly dispose of your items and help protect the environment.
          </Text>
        </View>

        {Object.entries(itemsByCategory).map(([category, categoryItems]: [string, any]) => (
          <View key={category} style={styles.categorySection}>
            <View style={styles.categoryHeader}>
              <Ionicons 
                name={getCategoryIcon(category)} 
                size={24} 
                color={getCategoryColor(category)} 
              />
              <Text style={[styles.categoryTitle, { color: getCategoryColor(category) }]}>
                {category}
              </Text>
              <Text style={styles.itemCount}>
                {categoryItems.length} item{categoryItems.length > 1 ? 's' : ''}
              </Text>
            </View>

            <View style={styles.itemsList}>
              {categoryItems.map((item: any, index: number) => (
                <Text key={index} style={styles.itemName}>• {item.name}</Text>
              ))}
            </View>

            <View style={styles.instructionsContainer}>
              <Text style={styles.instructionsTitle}>Disposal Instructions:</Text>
              {getDisposalInstructions(category).map((instruction, index) => (
                <View key={index} style={styles.instructionStep}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={styles.completionCard}>
          <Ionicons name="checkmark-circle" size={32} color="#4CAF50" />
          <Text style={styles.completionTitle}>Great Job!</Text>
          <Text style={styles.completionText}>
            By following these instructions, you're helping create a more sustainable future. 
            Remember to always check local guidelines as they may vary.
          </Text>
          
          <TouchableOpacity 
            style={styles.doneButton}
            onPress={() => navigation.navigate('Dashboard')}
          >
            <Text style={styles.doneButtonText}>Mark as Complete</Text>
          </TouchableOpacity>
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
    lineHeight: 20,
  },
  categorySection: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 16,
    borderRadius: 15,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
    flex: 1,
  },
  itemCount: {
    fontSize: 12,
    color: '#666',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  itemsList: {
    padding: 16,
    paddingTop: 8,
  },
  itemName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  instructionsContainer: {
    padding: 16,
    paddingTop: 0,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  instructionStep: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNumberText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  instructionText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
  completionCard: {
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
  completionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
    marginBottom: 8,
  },
  completionText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  doneButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default DisposalInstructionsScreen;
