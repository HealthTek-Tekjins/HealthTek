import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { 
  UserIcon,
  ArrowLeftIcon,
  EnvelopeIcon,
  PhoneIcon
} from 'react-native-heroicons/solid';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../config/firebase';
import { updateProfile, updateEmail } from 'firebase/auth';

const EditProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = route.params;
  const { colors, isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: user?.displayName || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
  });
  const [errors, setErrors] = useState({});

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.displayName.trim()) {
      newErrors.displayName = 'Display name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const currentUser = auth.currentUser;
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Update display name and photo URL
      await updateProfile(currentUser, {
        displayName: formData.displayName,
      });

      // Update email if changed
      if (formData.email !== currentUser.email) {
        await updateEmail(currentUser, formData.email);
      }

      Alert.alert(
        'Success',
        'Profile updated successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', error.message || 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
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
            {/* Header */}
            <View className="flex-row items-center mb-6">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="p-2 rounded-full mr-4"
                style={{ backgroundColor: colors.card }}
              >
                <ArrowLeftIcon size={24} color="#FF69B4" />
              </TouchableOpacity>
              <Text style={{ color: colors.text }} className="text-2xl font-bold">
                Edit Profile
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-6">
              {/* Personal Information Section */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-4">
                  Personal Information
                </Text>
                
                {/* Display Name Input */}
                <View className="mb-4">
                  <View className="flex-row items-center space-x-2 mb-2">
                    <UserIcon size={20} color="#FF69B4" />
                    <Text style={{ color: colors.text }} className="text-base">Display Name</Text>
                  </View>
                  <TextInput
                    value={formData.displayName}
                    onChangeText={(text) => setFormData({ ...formData, displayName: text })}
                    placeholder="Enter your display name"
                    placeholderTextColor={colors.textSecondary}
                    className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  />
                  {errors.displayName && (
                    <Text className="text-red-500 text-sm mt-1">{errors.displayName}</Text>
                  )}
                </View>

                {/* Email Input */}
                <View className="mb-4">
                  <View className="flex-row items-center space-x-2 mb-2">
                    <EnvelopeIcon size={20} color="#FF69B4" />
                    <Text style={{ color: colors.text }} className="text-base">Email</Text>
                  </View>
                  <TextInput
                    value={formData.email}
                    onChangeText={(text) => setFormData({ ...formData, email: text })}
                    placeholder="Enter your email"
                    placeholderTextColor={colors.textSecondary}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  />
                  {errors.email && (
                    <Text className="text-red-500 text-sm mt-1">{errors.email}</Text>
                  )}
                </View>

                {/* Phone Input (read-only since phone number updates require additional verification) */}
                <View className="mb-4">
                  <View className="flex-row items-center space-x-2 mb-2">
                    <PhoneIcon size={20} color="#FF69B4" />
                    <Text style={{ color: colors.text }} className="text-base">Phone</Text>
                  </View>
                  <TextInput
                    value={formData.phoneNumber}
                    editable={false}
                    placeholder="Phone number can only be updated through phone verification"
                    placeholderTextColor={colors.textSecondary}
                    className="bg-gray-100 dark:bg-gray-700 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  />
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className={`px-6 py-4 rounded-xl mt-4 ${loading ? 'opacity-50' : ''}`}
                style={{
                  backgroundColor: '#FF69B4',
                  shadowColor: '#FF69B4',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  {loading ? 'Updating...' : 'Save Changes'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default EditProfile; 