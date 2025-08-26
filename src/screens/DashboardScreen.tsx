import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
} from 'react-native';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { fetchUserStats, fetchLeaderboard } from '../store/slices/userSlice';
import { Ionicons } from '@expo/vector-icons';

interface DashboardScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

const DashboardScreen: React.FC<DashboardScreenProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { stats, leaderboard, isLoadingStats } = useAppSelector((state) => state.user);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));

  useEffect(() => {
    if (user) {
      dispatch(fetchUserStats(user.id));
      dispatch(fetchLeaderboard());
    }
    
    // Animate in
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
  }, [user, dispatch]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '🌅 Good Morning';
    if (hour < 17) return '🌞 Good Afternoon';
    return '🌙 Good Evening';
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⚡';
    return '💫';
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Enhanced Header */}
      <View style={styles.appHeader}>
        <View style={styles.headerLeft}>
          <TouchableOpacity style={styles.profileButton}>
            <Image 
              source={{ uri: user?.avatar || 'https://via.placeholder.com/40' }} 
              style={styles.profileImage}
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.appTitle}>EcoHaul</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.notificationIcon}>
            <Ionicons name="notifications-outline" size={24} color="#333" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.analyticsIcon}
            onPress={() => navigation.navigate('Analytics')}
          >
            <Ionicons name="analytics-outline" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      <Animated.View style={{
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }]
      }}>
        {/* Enhanced Welcome Card */}
        <View style={styles.welcomeCard}>
          <View style={styles.welcomeBackground}>
            <Ionicons name="leaf-outline" size={120} color="rgba(255,255,255,0.1)" style={styles.backgroundIcon} />
          </View>
          
          <View style={styles.welcomeHeader}>
            <View style={styles.welcomeContent}>
              <Text style={styles.greeting}>{getGreeting()}, {user?.name || 'Sarah'}!</Text>
              <Text style={styles.subtitle}>You've made a real impact today 🌱</Text>
              <View style={styles.streakContainer}>
                <Text style={styles.streakText}>
                  {getStreakEmoji(stats?.currentStreak || 5)} {stats?.currentStreak || 5} day streak
                </Text>
              </View>
            </View>
            <View style={styles.pointsContainer}>
              <View style={styles.pointsIcon}>
                <Ionicons name="diamond" size={16} color="#FFD700" />
              </View>
              <Text style={styles.pointsText}>{user?.points?.toLocaleString() || '2,847'}</Text>
              <Text style={styles.pointsLabel}>points</Text>
            </View>
          </View>
          
          {/* Enhanced Progress Section */}
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>Monthly Challenge</Text>
              <TouchableOpacity style={styles.progressInfoButton}>
                <Ionicons name="information-circle-outline" size={16} color="rgba(255,255,255,0.8)" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.goalStats}>
              <View style={styles.goalStat}>
                <Text style={styles.goalNumber}>{stats?.monthlyItems || 34}</Text>
                <Text style={styles.goalLabel}>Items</Text>
              </View>
              <View style={styles.goalStat}>
                <Text style={styles.goalNumber}>{Math.round(((stats?.monthlyItems || 34) / 50) * 100)}%</Text>
                <Text style={styles.goalLabel}>Complete</Text>
              </View>
              <View style={styles.goalStat}>
                <Text style={styles.goalNumber}>{50 - (stats?.monthlyItems || 34)}</Text>
                <Text style={styles.goalLabel}>Remaining</Text>
              </View>
            </View>
            
            <View style={styles.progressBarContainer}>
              <View style={[styles.progressBar, { width: `${Math.min(((stats?.monthlyItems || 34) / 50) * 100, 100)}%` }]} />
              <View style={styles.progressGlow} />
            </View>
          </View>
        </View>

        {/* Today's Impact Card */}
        <View style={styles.impactCard}>
          <View style={styles.impactHeader}>
            <Ionicons name="earth" size={24} color="#4CAF50" />
            <Text style={styles.impactTitle}>Today's Impact</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.impactScroll}>
            <View style={styles.impactStat}>
              <Text style={styles.impactNumber}>2.3kg</Text>
              <Text style={styles.impactLabel}>CO₂ Saved</Text>
              <Ionicons name="cloud-outline" size={16} color="#4CAF50" />
            </View>
            <View style={styles.impactStat}>
              <Text style={styles.impactNumber}>156L</Text>
              <Text style={styles.impactLabel}>Water Saved</Text>
              <Ionicons name="water-outline" size={16} color="#2196F3" />
            </View>
            <View style={styles.impactStat}>
              <Text style={styles.impactNumber}>8</Text>
              <Text style={styles.impactLabel}>Items Recycled</Text>
              <Ionicons name="refresh-outline" size={16} color="#FF9800" />
            </View>
            <View style={styles.impactStat}>
              <Text style={styles.impactNumber}>0.5m²</Text>
              <Text style={styles.impactLabel}>Landfill Saved</Text>
              <Ionicons name="leaf-outline" size={16} color="#4CAF50" />
            </View>
          </ScrollView>
        </View>

      {/* Recent Achievements */}
      <View style={styles.achievementsSection}>
        <Text style={styles.sectionTitle}>Recent Achievements</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.achievementsScroll}>
          <View style={styles.achievementCard}>
            <Ionicons name="leaf" size={32} color="#4CAF50" />
            <Text style={styles.achievementTitle}>Recycling Champion</Text>
            <Text style={styles.achievementSubtitle}>Recycled 25 items this month</Text>
            <Text style={styles.achievementPoints}>+150 pts</Text>
            <Text style={styles.achievementTime}>Today</Text>
          </View>
          <View style={styles.achievementCard}>
            <Ionicons name="flame" size={32} color="#FF6B35" />
            <Text style={styles.achievementTitle}>Streak Master</Text>
            <Text style={styles.achievementSubtitle}>7 day streak</Text>
            <Text style={styles.achievementPoints}>+100 pts</Text>
            <Text style={styles.achievementTime}>2 days ago</Text>
          </View>
        </ScrollView>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActionsSection}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Scanner')}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="camera" size={24} color="#4CAF50" />
            </View>
            <Text style={styles.actionTitle}>Start Scanning</Text>
            <Text style={styles.actionSubtitle}>Identify items for disposal</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Cart')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
              <Ionicons name="cart" size={24} color="#1976D2" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>3</Text>
              </View>
            </View>
            <Text style={styles.actionTitle}>Disposal Cart</Text>
            <Text style={styles.actionSubtitle}>Review items to dispose</Text>
          </TouchableOpacity>
        </View>
        
        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('DisposalCenters')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FFF3E0' }]}>
              <Ionicons name="location" size={24} color="#F57C00" />
            </View>
            <Text style={styles.actionTitle}>Find Locations</Text>
            <Text style={styles.actionSubtitle}>Nearby disposal services</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('DisposalGuide')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E8F5E8' }]}>
              <Ionicons name="information-circle" size={24} color="#388E3C" />
            </View>
            <Text style={styles.actionTitle}>Disposal Guide</Text>
            <Text style={styles.actionSubtitle}>Learn proper disposal methods</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Community Leaderboard */}
      <View style={styles.leaderboardSection}>
        <View style={styles.leaderboardHeader}>
          <Text style={styles.sectionTitle}>Community Leaderboard</Text>
          <View style={styles.rankBadge}>
            <Text style={styles.rankBadgeText}>Rank #7</Text>
          </View>
        </View>
        
        {[
          { name: 'Alex Chen', location: 'Downtown', points: '3245 pts', rank: 1, items: '87 items' },
          { name: 'Maria Rodriguez', location: 'Midtown', points: '3156 pts', rank: 2, items: '82 items' },
          { name: 'James Wilson', location: 'Uptown', points: '3089 pts', rank: 3, items: '78 items' },
          { name: 'Emma Thompson', location: 'Westside', points: '2934 pts', rank: 4, items: '76 items' },
        ].map((user, index) => (
          <View key={index} style={styles.leaderboardItem}>
            <View style={styles.leaderboardLeft}>
              <View style={[styles.rankCircle, index === 0 && styles.goldRank, index === 1 && styles.silverRank, index === 2 && styles.bronzeRank]}>
                <Text style={[styles.rankNumber, index < 3 && styles.medalRankNumber]}>{user.rank}</Text>
              </View>
              <View style={styles.userAvatar}>
                <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
              </View>
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userLocation}>{user.location}</Text>
              </View>
            </View>
            <View style={styles.leaderboardRight}>
              <Text style={styles.userPoints}>{user.points}</Text>
              <Text style={styles.userItems}>{user.items}</Text>
            </View>
          </View>
        ))}
      </View>
      </Animated.View>

      {/* Floating Scan Button */}
      <TouchableOpacity 
        style={styles.floatingButton}
        onPress={() => navigation.navigate('Scanner')}
      >
        <Ionicons name="camera" size={24} color="white" />
        <Text style={styles.floatingButtonText}>Scan Item</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  headerLeft: {
    width: 40,
  },
  appTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    width: 80,
    justifyContent: 'flex-end',
  },
  notificationIcon: {
    marginRight: 10,
  },
  helpIcon: {},
  welcomeCard: {
    backgroundColor: '#4CAF50',
    margin: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  subtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  pointsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  pointsText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 4,
    fontSize: 14,
  },
  progressSection: {
    marginTop: 10,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 10,
  },
  progressInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressPercentage: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 15,
    width: 50,
  },
  progressBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
  },
  progressBar: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  achievementsSection: {
    marginBottom: 20,
  },
  achievementsScroll: {
    paddingLeft: 20,
  },
  achievementCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: 200,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 8,
  },
  achievementSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  achievementPoints: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF6B35',
    marginTop: 8,
  },
  achievementTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 2,
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  actionsGrid: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginRight: 6,
    marginLeft: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8F5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    position: 'relative',
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF5252',
    borderRadius: 8,
    width: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  actionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#666',
    lineHeight: 16,
  },
  leaderboardSection: {
    paddingHorizontal: 20,
    marginBottom: 100,
  },
  leaderboardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  rankBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rankBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  leaderboardItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  leaderboardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  goldRank: {
    backgroundColor: '#FFD700',
  },
  silverRank: {
    backgroundColor: '#C0C0C0',
  },
  bronzeRank: {
    backgroundColor: '#CD7F32',
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  medalRankNumber: {
    color: 'white',
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  userLocation: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  leaderboardRight: {
    alignItems: 'flex-end',
  },
  userPoints: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  userItems: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 25,
    paddingHorizontal: 20,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
    fontSize: 14,
  },
  // Missing styles for enhanced dashboard components
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  analyticsIcon: {
    marginLeft: 10,
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#FF4444',
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationBadgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  welcomeBackground: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: '100%',
    height: '100%',
    alignItems: 'flex-end',
    justifyContent: 'center',
    paddingRight: 20,
  },
  backgroundIcon: {
    opacity: 0.1,
  },
  welcomeContent: {
    flex: 1,
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '500',
  },
  pointsIcon: {
    marginBottom: 4,
  },
  pointsLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.8)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  progressInfoButton: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  goalStat: {
    alignItems: 'center',
  },
  goalNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  goalLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  progressGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 4,
  },
  impactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  impactScroll: {
    marginHorizontal: -5,
  },
  impactStat: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginHorizontal: 5,
    minWidth: 100,
  },
  impactNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
    textAlign: 'center',
  },
  impactCard: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default DashboardScreen;
