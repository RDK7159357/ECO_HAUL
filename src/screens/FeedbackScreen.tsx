import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
  Vibration,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface FeedbackScreenProps {
  navigation: any;
}

interface FeedbackData {
  rating: number;
  category: string;
  feedback: string;
  email?: string;
  suggestion: string;
}

const FeedbackScreen: React.FC<FeedbackScreenProps> = ({ navigation }) => {
  const [feedbackData, setFeedbackData] = useState<FeedbackData>({
    rating: 0,
    category: '',
    feedback: '',
    email: '',
    suggestion: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const feedbackCategories = [
    { id: 'app_performance', label: 'App Performance', icon: 'speedometer-outline' },
    { id: 'detection_accuracy', label: 'Detection Accuracy', icon: 'camera-outline' },
    { id: 'user_interface', label: 'User Interface', icon: 'phone-portrait-outline' },
    { id: 'disposal_guidance', label: 'Disposal Guidance', icon: 'leaf-outline' },
    { id: 'general', label: 'General Feedback', icon: 'chatbubble-outline' },
    { id: 'bug_report', label: 'Bug Report', icon: 'bug-outline' },
  ];

  const handleHapticFeedback = () => {
    Vibration.vibrate(50);
  };

  const handleInteractivePress = (callback: () => void) => {
    handleHapticFeedback();
    callback();
  };

  const handleRatingPress = (rating: number) => {
    handleInteractivePress(() => {
      setFeedbackData(prev => ({ ...prev, rating }));
    });
  };

  const handleCategoryPress = (category: string) => {
    handleInteractivePress(() => {
      setFeedbackData(prev => ({ ...prev, category }));
    });
  };

  const validateFeedback = (): boolean => {
    if (feedbackData.rating === 0) {
      Alert.alert('Rating Required', 'Please provide a rating for your experience.');
      return false;
    }
    if (!feedbackData.category) {
      Alert.alert('Category Required', 'Please select a feedback category.');
      return false;
    }
    if (!feedbackData.feedback.trim()) {
      Alert.alert('Feedback Required', 'Please provide your feedback.');
      return false;
    }
    return true;
  };

  const submitFeedback = async () => {
    if (!validateFeedback()) return;

    handleInteractivePress(async () => {
      setIsSubmitting(true);

      try {
        // Simulate API call to submit feedback
        await new Promise(resolve => setTimeout(resolve, 2000));

        // In a real app, you would send this to your backend
        console.log('Feedback submitted:', feedbackData);

        Alert.alert(
          'Thank You!',
          'Your feedback has been submitted successfully. We appreciate your input to help us improve EcoHaul.',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack()
            }
          ]
        );
      } catch (error) {
        Alert.alert('Error', 'Failed to submit feedback. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const renderStarRating = () => {
    return (
      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>How would you rate your experience?</Text>
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => handleRatingPress(star)}
              style={styles.starButton}
            >
              <Ionicons
                name={star <= feedbackData.rating ? 'star' : 'star-outline'}
                size={36}
                color={star <= feedbackData.rating ? '#FFD700' : '#CCCCCC'}
              />
            </TouchableOpacity>
          ))}
        </View>
        {feedbackData.rating > 0 && (
          <Text style={styles.ratingText}>
            {feedbackData.rating === 1 && 'Poor'}
            {feedbackData.rating === 2 && 'Fair'}
            {feedbackData.rating === 3 && 'Good'}
            {feedbackData.rating === 4 && 'Very Good'}
            {feedbackData.rating === 5 && 'Excellent'}
          </Text>
        )}
      </View>
    );
  };

  const renderCategorySelection = () => {
    return (
      <View style={styles.categoryContainer}>
        <Text style={styles.categoryLabel}>What type of feedback is this?</Text>
        <View style={styles.categoriesGrid}>
          {feedbackCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => handleCategoryPress(category.id)}
              style={[
                styles.categoryButton,
                feedbackData.category === category.id && styles.categoryButtonSelected
              ]}
            >
              <Ionicons
                name={category.icon as any}
                size={24}
                color={feedbackData.category === category.id ? '#FFFFFF' : '#4CAF50'}
              />
              <Text style={[
                styles.categoryButtonText,
                feedbackData.category === category.id && styles.categoryButtonTextSelected
              ]}>
                {category.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

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
          <Text style={styles.headerTitle}>Feedback</Text>
          <Text style={styles.headerSubtitle}>Help us improve EcoHaul</Text>
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Star Rating Section */}
          {renderStarRating()}

          {/* Category Selection */}
          {renderCategorySelection()}

          {/* Feedback Text Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Your Feedback *</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={6}
              placeholder="Please share your thoughts, suggestions, or any issues you've encountered..."
              placeholderTextColor="#888888"
              value={feedbackData.feedback}
              onChangeText={(text) => setFeedbackData(prev => ({ ...prev, feedback: text }))}
              textAlignVertical="top"
            />
          </View>

          {/* Suggestion Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Suggestions for Improvement</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              placeholder="What features or improvements would you like to see?"
              placeholderTextColor="#888888"
              value={feedbackData.suggestion}
              onChangeText={(text) => setFeedbackData(prev => ({ ...prev, suggestion: text }))}
              textAlignVertical="top"
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Email (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="your.email@example.com"
              placeholderTextColor="#888888"
              value={feedbackData.email}
              onChangeText={(text) => setFeedbackData(prev => ({ ...prev, email: text }))}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <Text style={styles.emailNote}>
              Provide your email if you'd like us to follow up on your feedback
            </Text>
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            onPress={submitFeedback}
            disabled={isSubmitting}
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          >
            <LinearGradient
              colors={isSubmitting ? ['#CCCCCC', '#AAAAAA'] : ['#4CAF50', '#45a049']}
              style={styles.submitGradient}
            >
              {isSubmitting ? (
                <View style={styles.submittingContainer}>
                  <Text style={styles.submitButtonText}>Submitting...</Text>
                </View>
              ) : (
                <>
                  <Ionicons name="send" size={20} color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>Submit Feedback</Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Thank You Note */}
          <View style={styles.thankYouContainer}>
            <Ionicons name="heart" size={20} color="#4CAF50" />
            <Text style={styles.thankYouText}>
              Thank you for helping us make EcoHaul better for everyone!
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  content: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  ratingContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
    textAlign: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
  },
  starButton: {
    marginHorizontal: 5,
    padding: 5,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#4CAF50',
  },
  categoryContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  categoryLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 15,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryButton: {
    width: '48%',
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  categoryButtonSelected: {
    backgroundColor: '#4CAF50',
    borderColor: '#4CAF50',
  },
  categoryButtonText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333333',
    textAlign: 'center',
    marginTop: 5,
  },
  categoryButtonTextSelected: {
    color: '#FFFFFF',
  },
  inputContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FAFAFA',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#333333',
    backgroundColor: '#FAFAFA',
    minHeight: 100,
  },
  emailNote: {
    fontSize: 12,
    color: '#888888',
    marginTop: 5,
    fontStyle: 'italic',
  },
  submitButton: {
    borderRadius: 15,
    marginBottom: 20,
    overflow: 'hidden',
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  submittingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  submitButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginLeft: 8,
  },
  thankYouContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 15,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  thankYouText: {
    fontSize: 14,
    color: '#666666',
    marginLeft: 8,
    textAlign: 'center',
    flex: 1,
    fontStyle: 'italic',
  },
});

export default FeedbackScreen;
