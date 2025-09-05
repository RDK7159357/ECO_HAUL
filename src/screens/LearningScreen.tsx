import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Vibration,
  Modal,
  TextInput,
  FlatList,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../store/hooks';

interface LearningScreenProps {
  navigation: any;
}

interface LearningSession {
  id: string;
  timestamp: string;
  originalDetection: string;
  userCorrection: string;
  confidence: number;
  learningType: string;
}

interface FeedbackItem {
  id: string;
  objectName: string;
  detectedAs: string;
  correctAnswer: string;
  confidence: number;
  timestamp: string;
}

const LearningScreen: React.FC<LearningScreenProps> = ({ navigation }) => {
  const [learningStats, setLearningStats] = useState({
    objectsSeen: 0,
    patternsLearned: 0,
    adaptationLevel: 0,
    learningMode: true,
    totalCorrections: 0,
    accuracyImprovement: 0,
  });
  
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [selectedObject, setSelectedObject] = useState<string>('');
  const [correctionText, setCorrectionText] = useState<string>('');
  const [feedbackList, setFeedbackList] = useState<FeedbackItem[]>([]);
  const [learningSessions, setLearningSessions] = useState<LearningSession[]>([]);
  const [activeTab, setActiveTab] = useState<'stats' | 'feedback' | 'history'>('stats');

  const { items: cartItems } = useAppSelector((state) => state.cart);

  const handleHapticFeedback = () => {
    Vibration.vibrate(50);
  };

  const handleInteractivePress = (callback: () => void) => {
    handleHapticFeedback();
    callback();
  };

  useEffect(() => {
    loadLearningData();
  }, []);

  const loadLearningData = () => {
    // Simulate loading learning data - in real app this would come from storage/API
    const mockStats = {
      objectsSeen: Math.floor(Math.random() * 150) + 50,
      patternsLearned: Math.floor(Math.random() * 80) + 30,
      adaptationLevel: Math.random() * 0.8 + 0.2,
      learningMode: true,
      totalCorrections: Math.floor(Math.random() * 25) + 5,
      accuracyImprovement: Math.random() * 15 + 5,
    };
    setLearningStats(mockStats);

    // Mock feedback data
    const mockFeedback: FeedbackItem[] = [
      {
        id: '1',
        objectName: 'Unknown Item',
        detectedAs: 'Plastic Container',
        correctAnswer: 'Glass Bottle',
        confidence: 0.65,
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: '2',
        objectName: 'Metal Object',
        detectedAs: 'Aluminum Can',
        correctAnswer: 'Steel Container',
        confidence: 0.72,
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ];
    setFeedbackList(mockFeedback);

    // Mock learning sessions
    const mockSessions: LearningSession[] = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        originalDetection: 'Plastic Bottle',
        userCorrection: 'Glass Bottle',
        confidence: 0.85,
        learningType: 'Material Correction',
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        originalDetection: 'Unknown',
        userCorrection: 'Ceramic Mug',
        confidence: 0.45,
        learningType: 'New Object Learning',
      },
    ];
    setLearningSessions(mockSessions);
  };

  const submitFeedback = () => {
    if (!selectedObject || !correctionText.trim()) {
      Alert.alert('Missing Information', 'Please select an object and provide the correct identification.');
      return;
    }

    handleInteractivePress(() => {
      const newFeedback: FeedbackItem = {
        id: Date.now().toString(),
        objectName: selectedObject,
        detectedAs: selectedObject,
        correctAnswer: correctionText,
        confidence: Math.random() * 0.5 + 0.5,
        timestamp: new Date().toISOString(),
      };

      setFeedbackList(prev => [newFeedback, ...prev]);
      setLearningStats(prev => ({
        ...prev,
        totalCorrections: prev.totalCorrections + 1,
        accuracyImprovement: prev.accuracyImprovement + 0.5,
      }));

      setCorrectionText('');
      setSelectedObject('');
      setShowFeedbackModal(false);

      Alert.alert('Thank You!', 'Your feedback has been recorded and will help improve detection accuracy.');
    });
  };

  const renderStatsTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* Learning Progress Overview */}
      <View style={styles.statsCard}>
        <LinearGradient
          colors={['#4CAF50', '#45a049']}
          style={styles.statsHeader}
        >
          <Ionicons name="bulb" size={24} color="#FFFFFF" />
          <Text style={styles.statsHeaderText}>AI Learning Progress</Text>
        </LinearGradient>
        
        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{learningStats.objectsSeen}</Text>
            <Text style={styles.statLabel}>Objects Analyzed</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{learningStats.patternsLearned}</Text>
            <Text style={styles.statLabel}>Patterns Learned</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{(learningStats.adaptationLevel * 100).toFixed(0)}%</Text>
            <Text style={styles.statLabel}>Adaptation Level</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{learningStats.totalCorrections}</Text>
            <Text style={styles.statLabel}>User Corrections</Text>
          </View>
        </View>
      </View>

      {/* Accuracy Improvement */}
      <View style={styles.improvementCard}>
        <View style={styles.improvementHeader}>
          <Ionicons name="trending-up" size={20} color="#4CAF50" />
          <Text style={styles.improvementTitle}>Accuracy Improvement</Text>
        </View>
        <Text style={styles.improvementPercentage}>+{learningStats.accuracyImprovement.toFixed(1)}%</Text>
        <Text style={styles.improvementSubtext}>Based on your feedback and corrections</Text>
      </View>

      {/* Learning Mode Status */}
      <View style={styles.statusCard}>
        <View style={styles.statusHeader}>
          <Ionicons 
            name={learningStats.learningMode ? "checkmark-circle" : "pause-circle"} 
            size={20} 
            color={learningStats.learningMode ? "#4CAF50" : "#FF9800"} 
          />
          <Text style={styles.statusTitle}>Learning Mode</Text>
        </View>
        <Text style={styles.statusText}>
          {learningStats.learningMode 
            ? "Active - System is learning from your corrections" 
            : "Paused - Learning is temporarily disabled"
          }
        </Text>
        <TouchableOpacity
          style={styles.toggleButton}
          onPress={() => handleInteractivePress(() => {
            setLearningStats(prev => ({
              ...prev,
              learningMode: !prev.learningMode
            }));
          })}
        >
          <Text style={styles.toggleButtonText}>
            {learningStats.learningMode ? 'Pause Learning' : 'Resume Learning'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );

  const renderFeedbackTab = () => (
    <ScrollView style={styles.tabContent}>
      {/* Quick Feedback Button */}
      <TouchableOpacity
        style={styles.feedbackButton}
        onPress={() => handleInteractivePress(() => setShowFeedbackModal(true))}
      >
        <LinearGradient
          colors={['#2196F3', '#1976D2']}
          style={styles.feedbackButtonGradient}
        >
          <Ionicons name="add-circle" size={24} color="#FFFFFF" />
          <Text style={styles.feedbackButtonText}>Provide Feedback</Text>
        </LinearGradient>
      </TouchableOpacity>

      {/* Recent Detections for Feedback */}
      <View style={styles.recentDetectionsCard}>
        <Text style={styles.cardTitle}>Recent Detections</Text>
        <Text style={styles.cardSubtitle}>Help improve accuracy by correcting misidentifications</Text>
        
        {cartItems.slice(0, 3).map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.detectionItem}
            onPress={() => handleInteractivePress(() => {
              setSelectedObject(item.name);
              setShowFeedbackModal(true);
            })}
          >
            <View style={styles.detectionInfo}>
              <Text style={styles.detectionName}>{item.name}</Text>
              <Text style={styles.detectionConfidence}>
                Confidence: {((item.confidence || 0.7) * 100).toFixed(0)}%
              </Text>
            </View>
            <Ionicons name="create-outline" size={20} color="#4CAF50" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Feedback Tips */}
      <View style={styles.tipsCard}>
        <Text style={styles.cardTitle}>Feedback Tips</Text>
        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={16} color="#FF9800" />
          <Text style={styles.tipText}>Be specific about material types (plastic, glass, metal)</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={16} color="#FF9800" />
          <Text style={styles.tipText}>Include brand names if visible for better learning</Text>
        </View>
        <View style={styles.tipItem}>
          <Ionicons name="bulb" size={16} color="#FF9800" />
          <Text style={styles.tipText}>Your feedback helps the AI learn for everyone</Text>
        </View>
      </View>
    </ScrollView>
  );

  const renderHistoryTab = () => (
    <ScrollView style={styles.tabContent}>
      <View style={styles.historyCard}>
        <Text style={styles.cardTitle}>Learning History</Text>
        <Text style={styles.cardSubtitle}>Recent AI learning sessions from user feedback</Text>
        
        <FlatList
          data={learningSessions}
          scrollEnabled={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.historyItem}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyType}>{item.learningType}</Text>
                <Text style={styles.historyTime}>
                  {new Date(item.timestamp).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.historyDetails}>
                <Text style={styles.historyDetection}>
                  Detected: <Text style={styles.historyValue}>{item.originalDetection}</Text>
                </Text>
                <Text style={styles.historyCorrection}>
                  Corrected to: <Text style={styles.historyValue}>{item.userCorrection}</Text>
                </Text>
                <Text style={styles.historyConfidence}>
                  Confidence: {(item.confidence * 100).toFixed(0)}%
                </Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Feedback List */}
      <View style={styles.feedbackHistoryCard}>
        <Text style={styles.cardTitle}>Your Feedback History</Text>
        {feedbackList.map((feedback) => (
          <View key={feedback.id} style={styles.feedbackHistoryItem}>
            <View style={styles.feedbackHeader}>
              <Text style={styles.feedbackDate}>
                {new Date(feedback.timestamp).toLocaleDateString()}
              </Text>
              <Text style={styles.feedbackConfidence}>
                {(feedback.confidence * 100).toFixed(0)}%
              </Text>
            </View>
            <Text style={styles.feedbackDetected}>
              Detected as: {feedback.detectedAs}
            </Text>
            <Text style={styles.feedbackCorrected}>
              Corrected to: {feedback.correctAnswer}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#4CAF50', '#45a049']}
        style={styles.header}
      >
        <TouchableOpacity
          onPress={() => handleInteractivePress(() => navigation.goBack())}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>AI Learning Center</Text>
          <Text style={styles.headerSubtitle}>Help improve detection accuracy</Text>
        </View>
      </LinearGradient>

      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'stats' && styles.activeTabButton]}
          onPress={() => handleInteractivePress(() => setActiveTab('stats'))}
        >
          <Ionicons 
            name="analytics" 
            size={20} 
            color={activeTab === 'stats' ? '#FFFFFF' : '#666666'} 
          />
          <Text style={[styles.tabText, activeTab === 'stats' && styles.activeTabText]}>
            Stats
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'feedback' && styles.activeTabButton]}
          onPress={() => handleInteractivePress(() => setActiveTab('feedback'))}
        >
          <Ionicons 
            name="chatbubble-ellipses" 
            size={20} 
            color={activeTab === 'feedback' ? '#FFFFFF' : '#666666'} 
          />
          <Text style={[styles.tabText, activeTab === 'feedback' && styles.activeTabText]}>
            Feedback
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'history' && styles.activeTabButton]}
          onPress={() => handleInteractivePress(() => setActiveTab('history'))}
        >
          <Ionicons 
            name="time" 
            size={20} 
            color={activeTab === 'history' ? '#FFFFFF' : '#666666'} 
          />
          <Text style={[styles.tabText, activeTab === 'history' && styles.activeTabText]}>
            History
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <View style={styles.content}>
        {activeTab === 'stats' && renderStatsTab()}
        {activeTab === 'feedback' && renderFeedbackTab()}
        {activeTab === 'history' && renderHistoryTab()}
      </View>

      {/* Feedback Modal */}
      <Modal
        visible={showFeedbackModal}
        animationType="slide"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Provide Feedback</Text>
              <TouchableOpacity
                onPress={() => handleInteractivePress(() => setShowFeedbackModal(false))}
              >
                <Ionicons name="close" size={24} color="#666666" />
              </TouchableOpacity>
            </View>
            
            <Text style={styles.modalLabel}>Object detected as:</Text>
            <TextInput
              style={styles.modalInput}
              value={selectedObject}
              onChangeText={setSelectedObject}
              placeholder="Enter detected object name"
              placeholderTextColor="#888888"
            />
            
            <Text style={styles.modalLabel}>Correct identification:</Text>
            <TextInput
              style={styles.modalInput}
              value={correctionText}
              onChangeText={setCorrectionText}
              placeholder="What is this object actually?"
              placeholderTextColor="#888888"
            />
            
            <TouchableOpacity
              style={styles.submitButton}
              onPress={submitFeedback}
            >
              <LinearGradient
                colors={['#4CAF50', '#45a049']}
                style={styles.submitButtonGradient}
              >
                <Text style={styles.submitButtonText}>Submit Feedback</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 25,
    marginHorizontal: 5,
  },
  activeTabButton: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666666',
    marginLeft: 8,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  content: {
    flex: 1,
  },
  tabContent: {
    flex: 1,
    padding: 20,
  },
  statsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
  },
  statsHeaderText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    marginBottom: 20,
  },
  statNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
    marginTop: 5,
  },
  improvementCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  improvementHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  improvementTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  improvementPercentage: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  improvementSubtext: {
    fontSize: 14,
    color: '#666666',
    textAlign: 'center',
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginLeft: 8,
  },
  statusText: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
    lineHeight: 20,
  },
  toggleButton: {
    backgroundColor: '#4CAF50',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  toggleButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  feedbackButton: {
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  feedbackButtonGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  feedbackButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  recentDetectionsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 15,
  },
  detectionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  detectionInfo: {
    flex: 1,
  },
  detectionName: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333333',
  },
  detectionConfidence: {
    fontSize: 14,
    color: '#666666',
    marginTop: 2,
  },
  tipsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  tipText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
    flex: 1,
  },
  historyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  historyItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyType: {
    fontSize: 14,
    fontWeight: '600',
    color: '#4CAF50',
  },
  historyTime: {
    fontSize: 12,
    color: '#666666',
  },
  historyDetails: {
    gap: 4,
  },
  historyDetection: {
    fontSize: 14,
    color: '#666666',
  },
  historyCorrection: {
    fontSize: 14,
    color: '#666666',
  },
  historyValue: {
    fontWeight: '500',
    color: '#333333',
  },
  historyConfidence: {
    fontSize: 12,
    color: '#888888',
  },
  feedbackHistoryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  feedbackHistoryItem: {
    backgroundColor: '#F8F9FA',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
  },
  feedbackHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  feedbackDate: {
    fontSize: 12,
    color: '#666666',
  },
  feedbackConfidence: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  feedbackDetected: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 4,
  },
  feedbackCorrected: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333333',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    width: '100%',
    maxWidth: 400,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
  },
  modalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FAFAFA',
    marginBottom: 15,
  },
  submitButton: {
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 10,
  },
  submitButtonGradient: {
    paddingVertical: 15,
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default LearningScreen;
