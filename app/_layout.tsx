import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { store } from '../src/store/store';
import { useAppDispatch, useAppSelector } from '../src/store/hooks';
import { loadStoredAuth } from '../src/store/slices/authSlice';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';

// Screens
import AuthScreen from '../src/screens/AuthScreen';
import DashboardScreen from '../src/screens/DashboardScreen';
import ScannerScreen from '../src/screens/AdaptiveScannerScreen';
import CartScreen from '../src/screens/CartScreen';
import DisposalCentersScreen from '../src/screens/DisposalCentersScreen';
import DisposalGuideScreen from '../src/screens/DisposalGuideScreen';
import DisposalInstructionsScreen from '../src/screens/DisposalInstructionsScreen';
import DisposalAgentsScreen from '../src/screens/DisposalAgentsScreen';
import AnalyticsScreen from '../src/screens/AnalyticsScreen';
import FeedbackScreen from '../src/screens/FeedbackScreen';
import LearningScreen from '../src/screens/LearningScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Main Tab Navigator for authenticated users
const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Dashboard') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Scanner') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Cart') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else {
            iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
        tabBarStyle: {
          backgroundColor: 'white',
          borderTopWidth: 1,
          borderTopColor: '#e0e0e0',
        },
      })}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{ title: 'Home' }}
      />
      <Tab.Screen 
        name="Scanner" 
        component={ScannerScreen}
        options={{ title: 'Scan' }}
      />
      <Tab.Screen 
        name="Cart" 
        component={CartScreen}
        options={{ title: 'Cart' }}
      />
    </Tab.Navigator>
  );
};

// App Navigator Component
const AppNavigator: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Load stored authentication on app start
    dispatch(loadStoredAuth());
  }, [dispatch]);

  if (isLoading) {
    // You can add a loading screen component here
    return null;
  }

  return (
    <Stack.Navigator 
      screenOptions={{ 
        headerShown: false,
        cardStyle: { backgroundColor: 'white' }
      }}
    >
      {isAuthenticated ? (
        // Authenticated stack
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="DisposalCenters" component={DisposalCentersScreen} />
          <Stack.Screen name="DisposalGuide" component={DisposalGuideScreen} />
          <Stack.Screen name="DisposalInstructions" component={DisposalInstructionsScreen} />
          <Stack.Screen name="DisposalAgents" component={DisposalAgentsScreen} />
          <Stack.Screen name="Analytics" component={AnalyticsScreen} />
          <Stack.Screen name="Feedback" component={FeedbackScreen} />
          <Stack.Screen name="Learning" component={LearningScreen} />
        </>
      ) : (
        // Unauthenticated stack
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
};

// Main App Component
export default function RootLayout() {
  return (
    <Provider store={store}>
      <StatusBar style="auto" />
      <AppNavigator />
    </Provider>
  );
}
