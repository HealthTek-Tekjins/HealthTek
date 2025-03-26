import { View, Text, TouchableOpacity, ScrollView, Image, Alert, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  };

  const handleEditProfile = () => {
    if (user) {
      navigation.navigate('EditProfile', { user });
    } else {
      Alert.alert('Error', 'User data not available');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View className="flex-1 justify-center items-center">
          <Text style={{ color: colors.text }} className="text-lg">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    navigation.replace('Login');
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#f8f8f8', '#ffffff']}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          <Animated.View 
            className="p-6"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Profile Header */}
            <View className="items-center mb-8">
              <View className="relative">
                <View 
                  className="rounded-full"
                  style={{
                    shadowColor: '#FF69B4',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Image
                    source={{ uri: user?.photoURL || 'https://via.placeholder.com/150' }}
                    className="w-32 h-32 rounded-full border-4 border-white"
                    style={{ backgroundColor: '#f0f0f0' }}
                  />
                </View>
                <TouchableOpacity
                  onPress={handleEditProfile}
                  className="absolute bottom-0 right-0 bg-[#FF69B4] p-3 rounded-full"
                  style={{
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <MaterialIcons name="edit" size={20} color="white" />
                </TouchableOpacity>
              </View>
              <Text 
                style={{ color: colors.text }} 
                className="text-2xl font-bold mt-4 mb-1"
              >
                {user?.displayName || 'User'}
              </Text>
              <Text 
                style={{ color: colors.textSecondary }} 
                className="text-sm"
              >
                {user?.email}
              </Text>
            </View>

            {/* Personal Information Section */}
            <View className="mb-8">
              <Text 
                style={{ color: colors.text }} 
                className="text-xl font-semibold mb-4 px-2"
              >
                Personal Information
              </Text>

              <View className="space-y-4">
                {/* Email */}
                <View 
                  className="flex-row items-center space-x-4 p-4 rounded-2xl"
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3.84,
                    elevation: 2,
                  }}
                >
                  <View className="bg-pink-100 p-2 rounded-full">
                    <MaterialIcons name="email" size={24} color="#FF69B4" />
                  </View>
                  <View className="flex-1">
                    <Text style={{ color: colors.textSecondary }} className="text-sm font-medium">
                      Email
                    </Text>
                    <Text style={{ color: colors.text }} className="text-base mt-1">
                      {user?.email}
                    </Text>
                  </View>
                </View>

                {/* Phone */}
                <View 
                  className="flex-row items-center space-x-4 p-4 rounded-2xl"
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3.84,
                    elevation: 2,
                  }}
                >
                  <View className="bg-pink-100 p-2 rounded-full">
                    <MaterialIcons name="phone" size={24} color="#FF69B4" />
                  </View>
                  <View className="flex-1">
                    <Text style={{ color: colors.textSecondary }} className="text-sm font-medium">
                      Phone
                    </Text>
                    <Text style={{ color: colors.text }} className="text-base mt-1">
                      {user?.phoneNumber || 'Not set'}
                    </Text>
                  </View>
                </View>

                {/* Email Verification Status */}
                <View 
                  className="flex-row items-center space-x-4 p-4 rounded-2xl"
                  style={{
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3.84,
                    elevation: 2,
                  }}
                >
                  <View className="bg-pink-100 p-2 rounded-full">
                    <MaterialIcons 
                      name={user?.emailVerified ? "verified-user" : "error-outline"} 
                      size={24} 
                      color={user?.emailVerified ? "#FF69B4" : "#FFA500"}
                    />
                  </View>
                  <View className="flex-1">
                    <Text style={{ color: colors.textSecondary }} className="text-sm font-medium">
                      Email Verification
                    </Text>
                    <Text 
                      style={{ 
                        color: user?.emailVerified ? '#4CAF50' : '#FFA500',
                      }} 
                      className="text-base mt-1 font-medium"
                    >
                      {user?.emailVerified ? 'Verified' : 'Not verified'}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="space-y-4">
              {/* Edit Profile Button */}
              <TouchableOpacity
                onPress={handleEditProfile}
                className="bg-[#FF69B4] px-6 py-4 rounded-2xl"
                style={{
                  shadowColor: '#FF69B4',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <View className="flex-row items-center justify-center space-x-2">
                  <MaterialIcons name="edit" size={24} color="white" />
                  <Text className="text-white text-center font-bold text-lg">
                    Edit Profile
                  </Text>
                </View>
              </TouchableOpacity>

              {/* Logout Button */}
              <TouchableOpacity
                onPress={handleLogout}
                className="bg-red-500 px-6 py-4 rounded-2xl"
                style={{
                  shadowColor: '#FF0000',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <View className="flex-row items-center justify-center space-x-2">
                  <MaterialIcons name="logout" size={24} color="white" />
                  <Text className="text-white text-center font-bold text-lg">
                    Logout
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ProfileScreen;