import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface HistoryScreenProps {
  navigation: any;
}

const { width } = Dimensions.get('window');

const HistoryScreen: React.FC<HistoryScreenProps> = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState('Categories');
  const [showFilter, setShowFilter] = useState(false);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Disposal History</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity onPress={() => setShowFilter(true)}>
            <Ionicons name="search" size={24} color="#333" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.downloadButton}>
            <Ionicons name="download" size={24} color="#333" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Monthly Summary */}
      <View style={styles.summaryCard}>
        <View style={styles.summaryHeader}>
          <Text style={styles.summaryTitle}>August 2025</Text>
          <Text style={styles.summarySubtitle}>Monthly Summary</Text>
          <TouchableOpacity>
            <Ionicons name="calendar" size={20} color="#666" />
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="trash" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>47</Text>
            <Text style={styles.statLabel}>Total Items</Text>
            <Text style={styles.statBadge}>NEW</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="diamond" size={24} color="#FF9800" />
            <Text style={styles.statNumber}>285</Text>
            <Text style={styles.statLabel}>EcoPoints</Text>
            <Text style={styles.statBadge}>NEW</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Ionicons name="leaf" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>12.8 kg</Text>
            <Text style={styles.statLabel}>Carbon footprint</Text>
            <Text style={styles.statBadge}>NEW</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="trophy" size={24} color="#FF9800" />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Unlocked</Text>
            <Text style={styles.statBadge}>NEW</Text>
          </View>
        </View>

        <View style={styles.progressSection}>
          <Text style={styles.progressTitle}>Monthly Goal Progress</Text>
          <Text style={styles.progressText}>47 / 60 items</Text>
          <View style={styles.progressBarContainer}>
            <View style={[styles.progressBar, { width: '78%' }]} />
          </View>
          <Text style={styles.progressRemaining}>21% remaining</Text>
        </View>
      </View>

      {/* Analytics Section */}
      <View style={styles.analyticsCard}>
        <View style={styles.analyticsHeader}>
          <Ionicons name="analytics" size={24} color="#4CAF50" />
          <View style={styles.analyticsTitle}>
            <Text style={styles.analyticsMainTitle}>Analytics & Insights</Text>
            <Text style={styles.analyticsSubtitle}>Your disposal patterns and trends</Text>
          </View>
        </View>

        <View style={styles.tabContainer}>
          {['Categories', 'Locations', 'Trends'].map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, selectedTab === tab && styles.activeTab]}
              onPress={() => setSelectedTab(tab)}
            >
              <Text style={[styles.tabText, selectedTab === tab && styles.activeTabText]}>
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {selectedTab === 'Categories' && (
          <View style={styles.chartContainer}>
            <View style={styles.pieChart}>
              <View style={[styles.chartSegment, styles.segment1]} />
              <View style={[styles.chartSegment, styles.segment2]} />
              <View style={[styles.chartSegment, styles.segment3]} />
              <View style={[styles.chartSegment, styles.segment4]} />
              <View style={[styles.chartSegment, styles.segment5]} />
              <View style={styles.chartCenter} />
            </View>
          </View>
        )}

        {selectedTab === 'Locations' && (
          <View style={styles.locationsContainer}>
            {[
              { name: 'GreenCycle Recycling Center', visits: '12 visits' },
              { name: 'TechRecycle Hub', visits: '8 visits' },
              { name: 'Community Compost Center', visits: '5 visits' },
              { name: 'Hazardous Waste Facility', visits: '3 visits' },
            ].map((location, index) => (
              <View key={index} style={styles.locationItem}>
                <Text style={styles.locationName}>{location.name}</Text>
                <Text style={styles.locationVisits}>{location.visits}</Text>
                <View style={[styles.progressBarSmall, { width: `${(12 - index * 2) * 8}%` }]} />
              </View>
            ))}
          </View>
        )}

        {selectedTab === 'Trends' && (
          <View style={styles.trendsContainer}>
            <View style={styles.trendChart}>
              {[25, 30, 28, 35, 40, 47].map((value, index) => (
                <View key={index} style={styles.trendBar}>
                  <View style={[styles.trendBarFill, { height: `${value * 2}%` }]} />
                </View>
              ))}
            </View>
            <View style={styles.trendLabels}>
              {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
                <Text key={index} style={styles.trendLabel}>{month}</Text>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Recent Activity */}
      <View style={styles.recentSection}>
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        
        {[
          { date: '08/25/2025', time: '14:30', items: ['Plastic Water Bottle', 'Old T-Shirt', 'Food Scraps'], points: '12 pts', locations: '1 locations' },
          { date: '08/24/2025', time: '10:15', items: ['Phone Charger'], points: '18 pts', locations: '2 locations' },
          { date: '08/23/2025', time: '16:45', items: ['Cereal Box', 'Aluminum Can', 'Printer'], points: '11 pts', locations: '2 locations' },
        ].map((activity, index) => (
          <View key={index} style={styles.activityCard}>
            <View style={styles.activityHeader}>
              <Text style={styles.activityDate}>{activity.date}</Text>
              <View style={styles.activityActions}>
                <TouchableOpacity>
                  <Ionicons name="share-outline" size={20} color="#666" />
                </TouchableOpacity>
                <TouchableOpacity>
                  <Ionicons name="chevron-down" size={20} color="#666" />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.activityTime}>{activity.time}</Text>
            
            <View style={styles.activityItems}>
              {activity.items.slice(0, 3).map((item, itemIndex) => (
                <View key={itemIndex} style={styles.activityItemImage}>
                  <Text style={styles.itemInitial}>{item.charAt(0)}</Text>
                </View>
              ))}
            </View>
            
            <View style={styles.activityFooter}>
              <View style={styles.activityStat}>
                <Ionicons name="trash" size={16} color="#4CAF50" />
                <Text style={styles.activityStatText}>{activity.items.length} items</Text>
              </View>
              <View style={styles.activityStat}>
                <Ionicons name="diamond" size={16} color="#FF9800" />
                <Text style={styles.activityStatText}>{activity.points}</Text>
              </View>
              <View style={styles.activityStat}>
                <Ionicons name="location" size={16} color="#2196F3" />
                <Text style={styles.activityStatText}>{activity.locations}</Text>
              </View>
            </View>
          </View>
        ))}
      </View>

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
  },
  downloadButton: {
    marginLeft: 15,
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
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  summarySubtitle: {
    fontSize: 14,
    color: '#666',
    marginRight: 10,
  },
  statsGrid: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
    position: 'relative',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 4,
  },
  statBadge: {
    position: 'absolute',
    top: -5,
    right: 5,
    backgroundColor: '#FF6B35',
    color: 'white',
    fontSize: 8,
    fontWeight: 'bold',
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 8,
  },
  progressSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  progressText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#e0e0e0',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#4CAF50',
    borderRadius: 4,
  },
  progressRemaining: {
    fontSize: 12,
    color: '#FF9800',
  },
  analyticsCard: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  analyticsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  analyticsTitle: {
    flex: 1,
    marginLeft: 12,
  },
  analyticsMainTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  analyticsSubtitle: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderRadius: 6,
  },
  activeTab: {
    backgroundColor: '#4CAF50',
  },
  tabText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeTabText: {
    color: 'white',
    fontWeight: '600',
  },
  chartContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  pieChart: {
    width: 120,
    height: 120,
    borderRadius: 60,
    position: 'relative',
    backgroundColor: '#f0f0f0',
  },
  chartSegment: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  segment1: {
    backgroundColor: '#4CAF50',
    transform: [{ rotate: '0deg' }],
  },
  segment2: {
    backgroundColor: '#FF9800',
    transform: [{ rotate: '72deg' }],
  },
  segment3: {
    backgroundColor: '#2196F3',
    transform: [{ rotate: '144deg' }],
  },
  segment4: {
    backgroundColor: '#F44336',
    transform: [{ rotate: '216deg' }],
  },
  segment5: {
    backgroundColor: '#9C27B0',
    transform: [{ rotate: '288deg' }],
  },
  chartCenter: {
    position: 'absolute',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'white',
    top: 30,
    left: 30,
  },
  locationsContainer: {
    paddingVertical: 10,
  },
  locationItem: {
    marginBottom: 15,
  },
  locationName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  locationVisits: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  progressBarSmall: {
    height: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
  },
  trendsContainer: {
    paddingVertical: 10,
  },
  trendChart: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: 100,
    marginBottom: 10,
  },
  trendBar: {
    width: 20,
    height: 100,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
    justifyContent: 'flex-end',
  },
  trendBarFill: {
    backgroundColor: '#4CAF50',
    borderRadius: 2,
    width: '100%',
  },
  trendLabels: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  trendLabel: {
    fontSize: 12,
    color: '#666',
  },
  recentSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  activityCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  activityDate: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  activityActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityTime: {
    fontSize: 12,
    color: '#666',
    marginBottom: 12,
  },
  activityItems: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  activityItemImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#4CAF50',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  itemInitial: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  activityFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  activityStat: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityStatText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  bottomSpacing: {
    height: 100,
  },
});

export default HistoryScreen;
