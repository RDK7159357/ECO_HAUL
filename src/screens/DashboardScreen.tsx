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
  StatusBar,
  Vibration,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
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
  const [pulseAnim] = useState(new Animated.Value(1));
  const [rotateAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(1));
  const [bounceAnim] = useState(new Animated.Value(0));

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

    // Start pulse animation for floating button
    const pulseAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulseAnimation.start();

    // Rotating icon animation
    const rotateAnimation = Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 20000,
        useNativeDriver: true,
      })
    );
    rotateAnimation.start();

    // Bounce animation for achievements
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(bounceAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(bounceAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    bounceAnimation.start();
  }, [user, dispatch]);

  const getGreeting = () => {
    const hour = new Date().getHours();
    const day = new Date().getDay();
    const isWeekend = day === 0 || day === 6;
    
    if (hour < 6) return '🌙 Late night eco-warrior';
    if (hour < 12) {
      if (isWeekend) return '🌅 Weekend vibes, keep going!';
      return '🌅 Good Morning, Earth Hero!';
    }
    if (hour < 17) {
      if (isWeekend) return '☀️ Weekend eco-mission';
      return '🌞 Afternoon impact time!';
    }
    if (hour < 20) return '� Evening sustainability check';
    return '✨ Night owl making a difference!';
  };

  const getMotivationalQuote = () => {
    const quotes = [
      "Every small action creates waves of change! 🌊",
      "You're building a greener tomorrow! 🌱",
      "Sustainability is your superpower! ⚡",
      "Making the planet proud, one item at a time! 🌍",
      "Eco-warrior mode: ACTIVATED! 🚀",
    ];
    return quotes[Math.floor(Math.random() * quotes.length)];
  };

  const handleHapticFeedback = () => {
    Vibration.vibrate(50);
  };

  const handleActionPress = (screenName: string) => {
    handleHapticFeedback();
    
    // Scale animation on press
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
    
    navigation.navigate(screenName);
  };

  const getStreakEmoji = (streak: number) => {
    if (streak >= 7) return '🔥';
    if (streak >= 3) return '⚡';
    return '💫';
  };

  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#4CAF50" />
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Enhanced Header */}
        <View style={styles.appHeader}>
          <View style={styles.headerLeft}>
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => {
                handleHapticFeedback();
                // Add profile navigation later
              }}
            >
              <LinearGradient
                colors={['#4CAF50', '#45A049']}
                style={styles.profileGradient}
              >
                <Image 
                  source={{ uri: user?.avatar || 'https://via.placeholder.com/40' }} 
                  style={styles.profileImage}
                />
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <Text style={styles.appTitle}>EcoHaul</Text>
          </Animated.View>
          <View style={styles.headerRight}>
            <TouchableOpacity 
              style={styles.notificationIcon}
              onPress={handleHapticFeedback}
            >
              <Ionicons name="notifications-outline" size={24} color="#333" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.analyticsIcon}
              onPress={() => handleActionPress('Analytics')}
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
        <LinearGradient
          colors={['#4CAF50', '#66BB6A', '#43A047']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.welcomeCard}
        >
          <View style={styles.welcomeBackground}>
            <Ionicons name="leaf-outline" size={120} color="rgba(255,255,255,0.1)" style={styles.backgroundIcon} />
          </View>
          
          <View style={styles.welcomeHeader}>
            <View style={styles.welcomeContent}>
              <Text style={styles.greeting}>{getGreeting()}, {user?.name || 'Sarah'}!</Text>
              <Text style={styles.subtitle}>{getMotivationalQuote()}</Text>
              <View style={styles.streakContainer}>
                <Animated.View style={{ transform: [{ translateY: bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -5] }) }] }}>
                  <Text style={styles.streakText}>
                    {getStreakEmoji(stats?.currentStreak || 5)} {stats?.currentStreak || 5} day streak
                  </Text>
                </Animated.View>
              </View>
            </View>
            <TouchableOpacity 
              style={styles.pointsContainer}
              onPress={handleHapticFeedback}
            >
              <View style={styles.pointsIcon}>
                <Animated.View style={{ transform: [{ rotate: rotateAnim.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] }) }] }}>
                  <Ionicons name="diamond" size={16} color="#FFD700" />
                </Animated.View>
              </View>
              <Text style={styles.pointsText}>{user?.points?.toLocaleString() || '2,847'}</Text>
              <Text style={styles.pointsLabel}>points</Text>
            </TouchableOpacity>
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
              <LinearGradient
                colors={['#81C784', '#FFFFFF']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={[styles.progressBar, { width: `${Math.min(((stats?.monthlyItems || 34) / 50) * 100, 100)}%` }]}
              />
              <View style={styles.progressGlow} />
            </View>
          </View>
        </LinearGradient>

        {/* Today's Impact Card */}
        <View style={styles.impactCard}>
          <View style={styles.impactHeader}>
            <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
              <Ionicons name="earth" size={24} color="#4CAF50" />
            </Animated.View>
            <Text style={styles.impactTitle}>Today's Impact</Text>
            <View style={styles.impactSparkle}>
              <Ionicons name="sparkles" size={16} color="#FFD700" />
            </View>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.impactScroll}>
            <Animated.View style={[styles.impactStat, { transform: [{ translateY: bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -2] }) }] }]}>
              <Text style={styles.impactNumber}>2.3kg</Text>
              <Text style={styles.impactLabel}>CO₂ Saved</Text>
              <Ionicons name="cloud-outline" size={16} color="#4CAF50" />
              <View style={styles.statGlow} />
            </Animated.View>
            <Animated.View style={[styles.impactStat, { transform: [{ translateY: bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -3] }) }] }]}>
              <Text style={styles.impactNumber}>156L</Text>
              <Text style={styles.impactLabel}>Water Saved</Text>
              <Ionicons name="water-outline" size={16} color="#2196F3" />
              <View style={[styles.statGlow, { backgroundColor: 'rgba(33, 150, 243, 0.1)' }]} />
            </Animated.View>
            <Animated.View style={[styles.impactStat, { transform: [{ translateY: bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -1] }) }] }]}>
              <Text style={styles.impactNumber}>8</Text>
              <Text style={styles.impactLabel}>Items Recycled</Text>
              <Ionicons name="refresh-outline" size={16} color="#FF9800" />
              <View style={[styles.statGlow, { backgroundColor: 'rgba(255, 152, 0, 0.1)' }]} />
            </Animated.View>
            <Animated.View style={[styles.impactStat, { transform: [{ translateY: bounceAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -4] }) }] }]}>
              <Text style={styles.impactNumber}>0.5m²</Text>
              <Text style={styles.impactLabel}>Landfill Saved</Text>
              <Ionicons name="leaf-outline" size={16} color="#4CAF50" />
              <View style={styles.statGlow} />
            </Animated.View>
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
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => handleActionPress('Scanner')}
            >
              <View style={styles.actionIcon}>
                <Ionicons name="camera" size={24} color="#4CAF50" />
                <View style={styles.iconGlow} />
              </View>
              <Text style={styles.actionTitle}>Start Scanning</Text>
              <Text style={styles.actionSubtitle}>Identify items for disposal</Text>
              <View style={styles.actionArrow}>
                <Ionicons name="arrow-forward" size={16} color="#4CAF50" />
              </View>
            </TouchableOpacity>
          </Animated.View>
          
          <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
            <TouchableOpacity 
              style={styles.actionCard}
              onPress={() => handleActionPress('Cart')}
            >
              <View style={[styles.actionIcon, { backgroundColor: '#E3F2FD' }]}>
                <Ionicons name="cart" size={24} color="#1976D2" />
                {cartItems?.length > 0 && (
                  <Animated.View style={[styles.cartBadge, { transform: [{ scale: pulseAnim }] }]}>
                    <Text style={styles.cartBadgeText}>{cartItems?.length || 0}</Text>
                  </Animated.View>
                )}
                <View style={[styles.iconGlow, { backgroundColor: 'rgba(25, 118, 210, 0.1)' }]} />
              </View>
              <Text style={styles.actionTitle}>Disposal Cart</Text>
              <Text style={styles.actionSubtitle}>
                {cartItems?.length > 0 ? `${cartItems.length} items to dispose` : 'No items yet'}
              </Text>
              <View style={styles.actionArrow}>
                <Ionicons name="arrow-forward" size={16} color="#1976D2" />
              </View>
            </TouchableOpacity>
          </Animated.View>
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

        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Analytics')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#F3E5F5' }]}>
              <Ionicons name="analytics" size={24} color="#7B1FA2" />
            </View>
            <Text style={styles.actionTitle}>Analytics</Text>
            <Text style={styles.actionSubtitle}>View your eco impact</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Learning')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#FFF8E1' }]}>
              <Ionicons name="school" size={24} color="#F57F17" />
            </View>
            <Text style={styles.actionTitle}>AI Learning</Text>
            <Text style={styles.actionSubtitle}>Help improve detection</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.actionsGrid}>
          <TouchableOpacity 
            style={styles.actionCard}
            onPress={() => navigation.navigate('Feedback')}
          >
            <View style={[styles.actionIcon, { backgroundColor: '#E1F5FE' }]}>
              <Ionicons name="chatbubble-ellipses" size={24} color="#0277BD" />
            </View>
            <Text style={styles.actionTitle}>Feedback</Text>
            <Text style={styles.actionSubtitle}>Help us improve</Text>
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
      <Animated.View style={[styles.floatingButtonContainer, { transform: [{ scale: pulseAnim }] }]}>
        <TouchableOpacity 
          onPress={() => handleActionPress('Scanner')}
        >
          <LinearGradient
            colors={['#4CAF50', '#45A049']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.floatingButton}
          >
            <Ionicons name="camera" size={24} color="white" />
            <Text style={styles.floatingButtonText}>Scan Item</Text>
            <View style={styles.floatingGlow} />
          </LinearGradient>
        </TouchableOpacity>
      </Animated.View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f7fa',
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  helpIcon: {},
  welcomeCard: {
    margin: 20,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 10,
  },
  welcomeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  greeting: {
    fontSize: 26,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.9)',
    marginTop: 6,
    letterSpacing: 0.2,
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
    borderRadius: 16,
    padding: 20,
    width: 220,
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
  achievementTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginTop: 12,
    letterSpacing: 0.3,
  },
  achievementSubtitle: {
    fontSize: 13,
    color: '#666',
    marginTop: 6,
    lineHeight: 18,
  },
  achievementPoints: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FF6B35',
    marginTop: 12,
    letterSpacing: 0.3,
  },
  achievementTime: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    fontWeight: '500',
  },
  quickActionsSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
    marginBottom: 18,
    letterSpacing: 0.3,
  },
  actionsGrid: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  actionCard: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    marginRight: 6,
    marginLeft: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.05)',
    position: 'relative',
  },
  actionIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E8F5E8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  iconGlow: {
    position: 'absolute',
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    top: 0,
    left: 0,
  },
  actionArrow: {
    position: 'absolute',
    top: 16,
    right: 16,
    opacity: 0.6,
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
    fontSize: 15,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
    letterSpacing: 0.2,
  },
  actionSubtitle: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    fontWeight: '500',
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
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.05)',
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
  floatingButtonContainer: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    borderRadius: 30,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 12,
  },
  floatingButton: {
    borderRadius: 30,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
  },
  floatingGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  floatingButtonText: {
    color: 'white',
    fontWeight: '700',
    marginLeft: 10,
    fontSize: 16,
    letterSpacing: 0.5,
    zIndex: 1,
  },
  // Missing styles for enhanced dashboard components
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileGradient: {
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
    position: 'relative',
  },
  impactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginLeft: 10,
  },
  impactSparkle: {
    position: 'absolute',
    right: 0,
    opacity: 0.7,
  },
  impactScroll: {
    marginHorizontal: -5,
  },
  impactStat: {
    alignItems: 'center',
    backgroundColor: '#f8fafe',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    marginHorizontal: 6,
    minWidth: 110,
    borderWidth: 1,
    borderColor: 'rgba(76, 175, 80, 0.1)',
    position: 'relative',
  },
  statGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  impactNumber: {
    fontSize: 20,
    fontWeight: '800',
    color: '#333',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  impactLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: '500',
  },
  impactCard: {
    backgroundColor: 'white',
    margin: 20,
    marginTop: 0,
    borderRadius: 18,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.05)',
  },
});

export default DashboardScreen;
