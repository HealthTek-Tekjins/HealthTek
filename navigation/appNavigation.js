import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import WelcomeScreen from '../screens/WelcomeScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfile from '../screens/EditProfile';
import PrivacySettingsScreen from '../screens/PrivacySettingsScreen';
import AboutScreen from '../screens/AboutScreen';
import LogoutScreen from '../screens/LogoutScreen';
import HealthDataScreen from '../screens/HealthDataScreen';
import AppointmentScreen from '../screens/AppointmentScreen';
import EmergencyScreen from '../screens/EmergencyScreen';
import AddHealthData from '../screens/AddHealthData';
import AddAppointment from '../screens/AddAppointment';
import MedicineScreen from '../screens/MedicineScreen';
import CartScreen from '../screens/CartScreen';
import DoctorLoginScreen from '../screens/DoctorLoginScreen';
import DoctorSignUpScreen from '../screens/DoctorSignUpScreen';
import DoctorDashboardScreen from '../screens/DoctorDashboardScreen';
import AnalyticsScreen from '../screens/AnalyticsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MainTabs() {
  const { colors, isDarkMode } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'home';
          } else if (route.name === 'Dashboard') {
            iconName = 'dashboard';
          } else if (route.name === 'Profile') {
            iconName = 'person';
          } else if (route.name === 'Settings') {
            iconName = 'settings';
          } else if (route.name === 'Medicine') {
            iconName = 'medical-services';
          } else if (route.name === 'Analytics') {
            iconName = 'analytics';
          }
          return (
            <MaterialIcons 
              name={iconName} 
              size={28} 
              color={focused ? '#FF69B4' : colors.textSecondary} 
            />
          );
        },
        tabBarActiveTintColor: '#FF69B4',
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: { 
          backgroundColor: colors.card,
          borderTopColor: colors.border,
          paddingBottom: 5,
          height: 60,
          elevation: 0,
          shadowOpacity: 0,
        },
        tabBarLabelStyle: { 
          fontSize: 12,
          marginBottom: 5,
          fontWeight: '500',
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarItemStyle: {
          padding: 5,
        },
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          tabBarLabel: 'Dashboard',
        }}
      />
      <Tab.Screen 
        name="Analytics" 
        component={AnalyticsScreen}
        options={{
          tabBarLabel: 'Analytics',
        }}
      />
      <Tab.Screen 
        name="Medicine" 
        component={MedicineScreen}
        options={{
          tabBarLabel: 'Medicine',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
      <Tab.Screen 
        name="Settings" 
        component={SettingsScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigation() {
  const { colors } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator 
        initialRouteName="Welcome"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          cardStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="Welcome" options={{ headerShown: false }} component={WelcomeScreen} />
        <Stack.Screen name="Login" options={{ headerShown: false }} component={LoginScreen} />
        <Stack.Screen name="SignUp" options={{ headerShown: false }} component={SignUpScreen} />
        <Stack.Screen name="MainTabs" options={{ headerShown: false }} component={MainTabs} />
        <Stack.Screen 
          name="EditProfile" 
          options={{ 
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }} 
          component={EditProfile} 
        />
        <Stack.Screen 
          name="PrivacySettings" 
          options={{ 
            headerShown: true, 
            title: 'Privacy Settings',
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTintColor: colors.text,
          }} 
          component={PrivacySettingsScreen} 
        />
        <Stack.Screen 
          name="About" 
          options={{ 
            headerShown: true, 
            title: 'About',
            headerStyle: {
              backgroundColor: colors.card,
            },
            headerTintColor: colors.text,
          }} 
          component={AboutScreen} 
        />
        <Stack.Screen name="Logout" options={{ headerShown: false }} component={LogoutScreen} />
        <Stack.Screen 
          name="HealthData" 
          options={{ 
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }} 
          component={HealthDataScreen} 
        />
        <Stack.Screen 
          name="Appointment" 
          options={{ 
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }} 
          component={AppointmentScreen} 
        />
        <Stack.Screen 
          name="Emergency" 
          options={{ 
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }} 
          component={EmergencyScreen} 
        />
        <Stack.Screen 
          name="AddHealthData" 
          component={AddHealthData}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="AddAppointment" 
          component={AddAppointment}
          options={{
            headerShown: false,
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="Cart" 
          component={CartScreen}
          options={{
            headerShown: false,
            presentation: 'modal',
            animation: 'slide_from_bottom',
          }}
        />
        <Stack.Screen 
          name="DoctorLogin" 
          component={DoctorLoginScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="DoctorSignUp" 
          component={DoctorSignUpScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen 
          name="DoctorDashboard" 
          component={DoctorDashboardScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}