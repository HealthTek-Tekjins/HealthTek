import { View, Text, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { 
  UserIcon, 
  EnvelopeIcon, 
  PhoneIcon,
  CalendarIcon,
  PencilIcon,
  ExclamationCircleIcon,
  ArrowRightIcon
} from 'react-native-heroicons/solid';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data());
      } else {
        throw new Error('User data not found');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError('Failed to load profile data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
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

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.replace('Welcome');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile', { userData });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#ffffff', '#f0f0f0']}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex-1">
          <Animated.View 
            className="p-4"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text style={{ color: colors.text }} className="text-2xl font-bold">
                Profile
              </Text>
              <TouchableOpacity
                onPress={handleEditProfile}
                className="p-2 rounded-full"
                style={{ backgroundColor: colors.card }}
              >
                <PencilIcon size={24} color="#FF69B4" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View className="items-center justify-center py-8">
                <Text style={{ color: colors.textSecondary }}>Loading profile...</Text>
              </View>
            ) : error ? (
              <View className="items-center justify-center py-8">
                <ExclamationCircleIcon size={48} color="#FF69B4" />
                <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 8 }}>
                  {error}
                </Text>
                <TouchableOpacity
                  onPress={fetchUserData}
                  className="mt-4 bg-[#FF69B4] px-6 py-3 rounded-xl"
                >
                  <Text className="text-white font-semibold">Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : userData ? (
              <View className="space-y-6">
                {/* Profile Header */}
                <View 
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 16,
                    padding: 16,
                    shadowColor: colors.text,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <View className="items-center">
                    <View 
                      className="w-24 h-24 rounded-full bg-[#FF69B4] items-center justify-center mb-4"
                      style={{
                        shadowColor: '#FF69B4',
                        shadowOffset: { width: 0, height: 4 },
                        shadowOpacity: 0.3,
                        shadowRadius: 8,
                        elevation: 5,
                      }}
                    >
                      <UserIcon size={48} color="white" />
                    </View>
                    <Text style={{ color: colors.text }} className="text-2xl font-bold mb-1">
                      {userData.name} {userData.surname}
                    </Text>
                    <Text style={{ color: colors.textSecondary }} className="text-base">
                      {userData.email}
                    </Text>
                  </View>
                </View>

                {/* Profile Details */}
                <View 
                  style={{
                    backgroundColor: colors.card,
                    borderRadius: 16,
                    padding: 16,
                    shadowColor: colors.text,
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 4,
                    elevation: 3,
                  }}
                >
                  <Text style={{ color: colors.text }} className="text-lg font-semibold mb-4">
                    Personal Information
                  </Text>
                  <View className="space-y-4">
                    <View className="flex-row items-center">
                      <EnvelopeIcon size={20} color="#FF69B4" style={{ marginRight: 12 }} />
                      <Text style={{ color: colors.text }} className="flex-1">{userData.email}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <PhoneIcon size={20} color="#FF69B4" style={{ marginRight: 12 }} />
                      <Text style={{ color: colors.text }} className="flex-1">{userData.phone}</Text>
                    </View>
                    <View className="flex-row items-center">
                      <CalendarIcon size={20} color="#FF69B4" style={{ marginRight: 12 }} />
                      <Text style={{ color: colors.text }} className="flex-1">
                        {new Date(userData.dateOfBirth).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Sign Out Button */}
                <TouchableOpacity
                  onPress={handleSignOut}
                  className="bg-red-500 px-6 py-4 rounded-xl mt-4"
                  style={{
                    shadowColor: '#EF4444',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.3,
                    shadowRadius: 8,
                    elevation: 5,
                  }}
                >
                  <Text className="text-white text-center font-semibold text-lg">
                    Sign Out
                  </Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}