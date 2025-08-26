import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppSelector } from '../store/hooks';

interface AnalyticsScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({ navigation }) => {
  const { user } = useAppSelector((state) => state.auth);
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  }, []);

  // Mock data - in a real app, this would come from your API
  const analyticsData = {
    week: {
      totalItems: 23,
      totalPoints: 450,
      co2Saved: 5.8,
      waterSaved: 340,
      categories: [
        { name: 'Plastic', count: 8, percentage: 35, color: '#2196F3' },
        { name: 'Paper', count: 6, percentage: 26, color: '#FF9800' },
        { name: 'Glass', count: 4, percentage: 17, color: '#00BCD4' },
        { name: 'Metal', count: 3, percentage: 13, color: '#607D8B' },
        { name: 'Electronic', count: 2, percentage: 9, color: '#9C27B0' },
      ],
      weeklyProgress: [12, 18, 15, 20, 25, 19, 23],
      impactTimeline: [
        { date: 'Mon', items: 2, points: 40 },
        { date: 'Tue', items: 4, points: 85 },
        { date: 'Wed', items: 1, points: 25 },
        { date: 'Thu', items: 5, points: 95 },
        { date: 'Fri', items: 6, points: 120 },
        { date: 'Sat', items: 3, points: 60 },
        { date: 'Sun', items: 2, points: 35 },
      ]
    },
    month: {
      totalItems: 87,
      totalPoints: 1750,
      co2Saved: 22.4,
      waterSaved: 1280,
      categories: [
        { name: 'Plastic', count: 28, percentage: 32, color: '#2196F3' },
        { name: 'Paper', count: 22, percentage: 25, color: '#FF9800' },
        { name: 'Glass', count: 15, percentage: 17, color: '#00BCD4' },
        { name: 'Metal', count: 12, percentage: 14, color: '#607D8B' },
        { name: 'Electronic', count: 10, percentage: 12, color: '#9C27B0' },
      ],
      weeklyProgress: [15, 18, 25, 29],
      achievements: [
        { title: 'Eco Warrior', description: 'Disposed 50+ items', points: 200, date: '3 days ago' },
        { title: 'Streak Master', description: '14 day streak', points: 150, date: '1 week ago' },
        { title: 'Category Explorer', description: 'Used all categories', points: 100, date: '2 weeks ago' },
      ]
    },
    year: {
      totalItems: 1045,
      totalPoints: 20850,
      co2Saved: 270.8,
      waterSaved: 15400,
      categories: [
        { name: 'Plastic', count: 335, percentage: 32, color: '#2196F3' },
        { name: 'Paper', count: 261, percentage: 25, color: '#FF9800' },
        { name: 'Glass', count: 178, percentage: 17, color: '#00BCD4' },
        { name: 'Metal', count: 146, percentage: 14, color: '#607D8B' },
        { name: 'Electronic', count: 125, percentage: 12, color: '#9C27B0' },
      ],
      monthlyProgress: [45, 52, 68, 78, 85, 95, 102, 118, 125, 98, 87, 132],
    }
  };

  const currentData = analyticsData[selectedPeriod as keyof typeof analyticsData];

  const renderProgressChart = () => {
    const progressData = selectedPeriod === 'year' 
      ? (currentData as any).monthlyProgress 
      : (currentData as any).weeklyProgress;
    const maxValue = Math.max(...(progressData || []));
    
    return (
      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>
          {selectedPeriod === 'week' ? 'Daily Progress' : 
           selectedPeriod === 'month' ? 'Weekly Progress' : 'Monthly Progress'}
        </Text>
        <View style={styles.chart}>
          {(progressData || []).map((value: number, index: number) => (
            <View key={index} style={styles.chartColumn}>
              <View style={styles.chartBarContainer}>
                <Animated.View 
                  style={[
                    styles.chartBar,
                    { 
                      height: `${(value / maxValue) * 100}%`,
                      backgroundColor: value === maxValue ? '#4CAF50' : '#E8F5E8'
                    }
                  ]}
                />
              </View>
              <Text style={styles.chartLabel}>
                {selectedPeriod === 'week' 
                  ? ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index]
                  : selectedPeriod === 'month'
                  ? `W${index + 1}`
                  : ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][index]
                }
              </Text>
              <Text style={styles.chartValue}>{value}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };

  const renderCategoryBreakdown = () => (
    <View style={styles.categoryContainer}>
      <Text style={styles.sectionTitle}>Category Breakdown</Text>
      <View style={styles.categoryChart}>
        {currentData.categories.map((category, index) => (
          <View key={index} style={styles.categoryItem}>
            <View style={styles.categoryInfo}>
              <View style={[styles.categoryDot, { backgroundColor: category.color }]} />
              <Text style={styles.categoryName}>{category.name}</Text>
            </View>
            <View style={styles.categoryStats}>
              <Text style={styles.categoryCount}>{category.count}</Text>
              <Text style={styles.categoryPercentage}>{category.percentage}%</Text>
            </View>
            <View style={styles.categoryBarContainer}>
              <View 
                style={[
                  styles.categoryBar, 
                  { 
                    width: `${category.percentage}%`,
                    backgroundColor: category.color 
                  }
                ]} 
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analytics</Text>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <Animated.View style={{ opacity: fadeAnim }}>
          {/* Period Selector */}
          <View style={styles.periodSelector}>
            {['week', 'month', 'year'].map((period) => (
              <TouchableOpacity
                key={period}
                style={[
                  styles.periodButton,
                  selectedPeriod === period && styles.periodButtonActive
                ]}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text style={[
                  styles.periodButtonText,
                  selectedPeriod === period && styles.periodButtonTextActive
                ]}>
                  {period.charAt(0).toUpperCase() + period.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Overview Stats */}
          <View style={styles.overviewContainer}>
            <View style={styles.overviewCard}>
              <Ionicons name="trash" size={32} color="#4CAF50" />
              <Text style={styles.overviewNumber}>{currentData.totalItems}</Text>
              <Text style={styles.overviewLabel}>Items Disposed</Text>
            </View>
            <View style={styles.overviewCard}>
              <Ionicons name="diamond" size={32} color="#FFD700" />
              <Text style={styles.overviewNumber}>{currentData.totalPoints.toLocaleString()}</Text>
              <Text style={styles.overviewLabel}>Points Earned</Text>
            </View>
          </View>

          {/* Environmental Impact */}
          <View style={styles.impactContainer}>
            <Text style={styles.sectionTitle}>Environmental Impact</Text>
            <View style={styles.impactGrid}>
              <View style={styles.impactCard}>
                <View style={styles.impactIcon}>
                  <Ionicons name="cloud-outline" size={24} color="#4CAF50" />
                </View>
                <Text style={styles.impactNumber}>{currentData.co2Saved}kg</Text>
                <Text style={styles.impactLabel}>CO₂ Reduced</Text>
              </View>
              <View style={styles.impactCard}>
                <View style={styles.impactIcon}>
                  <Ionicons name="water-outline" size={24} color="#2196F3" />
                </View>
                <Text style={styles.impactNumber}>{currentData.waterSaved}L</Text>
                <Text style={styles.impactLabel}>Water Saved</Text>
              </View>
              <View style={styles.impactCard}>
                <View style={styles.impactIcon}>
                  <Ionicons name="leaf-outline" size={24} color="#8BC34A" />
                </View>
                <Text style={styles.impactNumber}>{Math.round(currentData.totalItems * 0.15)}m²</Text>
                <Text style={styles.impactLabel}>Landfill Saved</Text>
              </View>
              <View style={styles.impactCard}>
                <View style={styles.impactIcon}>
                  <Ionicons name="globe-outline" size={24} color="#FF9800" />
                </View>
                <Text style={styles.impactNumber}>{Math.round(currentData.totalItems * 0.8)}</Text>
                <Text style={styles.impactLabel}>Trees Equivalent</Text>
              </View>
            </View>
          </View>

          {/* Progress Chart */}
          {renderProgressChart()}

          {/* Category Breakdown */}
          {renderCategoryBreakdown()}

          {/* Recent Achievements (for month/year view) */}
          {selectedPeriod !== 'week' && (
            <View style={styles.achievementsContainer}>
              <Text style={styles.sectionTitle}>Recent Achievements</Text>
              {(analyticsData.month.achievements || []).map((achievement, index) => (
                <View key={index} style={styles.achievementCard}>
                  <View style={styles.achievementIcon}>
                    <Ionicons name="trophy" size={24} color="#FFD700" />
                  </View>
                  <View style={styles.achievementContent}>
                    <Text style={styles.achievementTitle}>{achievement.title}</Text>
                    <Text style={styles.achievementDescription}>{achievement.description}</Text>
                    <Text style={styles.achievementDate}>{achievement.date}</Text>
                  </View>
                  <View style={styles.achievementPoints}>
                    <Text style={styles.achievementPointsText}>+{achievement.points}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Goals and Streaks */}
          <View style={styles.goalsContainer}>
            <Text style={styles.sectionTitle}>Goals & Streaks</Text>
            <View style={styles.goalCard}>
              <View style={styles.goalHeader}>
                <Ionicons name="trophy" size={24} color="#4CAF50" />
                <Text style={styles.goalTitle}>Monthly Challenge</Text>
              </View>
              <View style={styles.goalProgress}>
                <Text style={styles.goalText}>87 / 100 items</Text>
                <View style={styles.goalBar}>
                  <View style={[styles.goalBarFill, { width: '87%' }]} />
                </View>
              </View>
            </View>
            
            <View style={styles.streakCard}>
              <View style={styles.streakIcon}>
                <Ionicons name="flame" size={32} color="#FF6B35" />
              </View>
              <View style={styles.streakContent}>
                <Text style={styles.streakNumber}>14</Text>
                <Text style={styles.streakLabel}>Day Streak</Text>
                <Text style={styles.streakSubtext}>Your longest streak this year!</Text>
              </View>
            </View>
          </View>

          <View style={styles.bottomSpacing} />
        </Animated.View>
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
  shareButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  periodSelector: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  periodButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  periodButtonActive: {
    backgroundColor: '#4CAF50',
  },
  periodButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  periodButtonTextActive: {
    color: 'white',
  },
  overviewContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  overviewCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  overviewNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  impactContainer: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  impactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  impactCard: {
    width: (width - 80) / 2,
    alignItems: 'center',
    paddingVertical: 15,
    marginBottom: 15,
  },
  impactIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  impactNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  impactLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  chartContainer: {
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
  chartTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 20,
  },
  chart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 150,
    justifyContent: 'space-between',
  },
  chartColumn: {
    flex: 1,
    alignItems: 'center',
  },
  chartBarContainer: {
    height: 120,
    width: 20,
    justifyContent: 'flex-end',
    marginBottom: 8,
  },
  chartBar: {
    backgroundColor: '#4CAF50',
    borderRadius: 10,
    minHeight: 4,
  },
  chartLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  chartValue: {
    fontSize: 10,
    color: '#999',
  },
  categoryContainer: {
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
  categoryChart: {
    marginTop: 10,
  },
  categoryItem: {
    marginBottom: 15,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 10,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    flex: 1,
  },
  categoryStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryCount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginRight: 10,
  },
  categoryPercentage: {
    fontSize: 12,
    color: '#666',
  },
  categoryBarContainer: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
  },
  categoryBar: {
    height: '100%',
    borderRadius: 3,
  },
  achievementsContainer: {
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
  achievementCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF8E1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  achievementContent: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  achievementDescription: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  achievementDate: {
    fontSize: 10,
    color: '#999',
    marginTop: 4,
  },
  achievementPoints: {
    backgroundColor: '#E8F5E8',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  achievementPointsText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4CAF50',
  },
  goalsContainer: {
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
  goalCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  goalProgress: {
    marginTop: 8,
  },
  goalText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  goalBar: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
  },
  goalBarFill: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  streakCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 12,
    padding: 15,
  },
  streakIcon: {
    marginRight: 15,
  },
  streakContent: {
    flex: 1,
  },
  streakNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FF6B35',
  },
  streakLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  streakSubtext: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  bottomSpacing: {
    height: 40,
  },
});

export default AnalyticsScreen;
