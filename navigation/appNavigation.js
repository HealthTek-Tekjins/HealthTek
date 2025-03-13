import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'; // Added for bottom tabs
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { MaterialIcons } from '@expo/vector-icons'; // For tab icons

// Stack Navigator for the overall app
const Stack = createNativeStackNavigator();
// Tab Navigator for the bottom navigation
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator for Home, Settings, Dashboard, Profile
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          } else if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          }
          return <MaterialIcons name={iconName} size={28} color={focused ? '#ff69b4' : '#757575'} />;
        },
        tabBarActiveTintColor: '#ff69b4', // Pink for active tab
        tabBarInactiveTintColor: '#757575', // Grey for inactive tabs
        tabBarStyle: { backgroundColor: '#f0f0f0', paddingBottom: 5, height: 60 }, // Style the tab bar
        tabBarLabelStyle: { fontSize: 12, marginBottom: 5 }, // Style the labels
        headerShown: false, // Hide header for tab screens
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Stack Navigator for the app
export default function AppNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" options={{ headerShown: false }} component={WelcomeScreen} />
        <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
        <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
        <Stack.Screen name="MainTabs" options={{ headerShown: false }} component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}