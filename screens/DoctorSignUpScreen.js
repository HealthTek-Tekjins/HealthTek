import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../config/firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const DoctorSignUpScreen = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    licenseNumber: '',
    phoneNumber: '',
    hospitalAffiliation: ''
  });

  const handleSignUp = async () => {
    // Validate form data
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword ||
        !formData.specialization || !formData.licenseNumber || !formData.phoneNumber) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setLoading(true);
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      
      // Add doctor details to Firestore
      await setDoc(doc(db, 'doctors', userCredential.user.uid), {
        fullName: formData.fullName,
        email: formData.email,
        specialization: formData.specialization,
        licenseNumber: formData.licenseNumber,
        phoneNumber: formData.phoneNumber,
        hospitalAffiliation: formData.hospitalAffiliation || '',
        createdAt: new Date().toISOString(),
        role: 'doctor'
      });

      Alert.alert(
        'Success',
        'Doctor account created successfully',
        [{ text: 'OK', onPress: () => navigation.replace('DoctorDashboard') }]
      );
    } catch (error) {
      console.error('Signup error:', error);
      Alert.alert('Error', error.message || 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#f8f8f8', '#ffffff']}
        style={{ flex: 1 }}
      >
        <ScrollView className="p-6">
          {/* Header */}
          <View className="items-center mb-8">
            <MaterialIcons name="local-hospital" size={64} color="#FF69B4" />
            <Text 
              style={{ color: colors.text }}
              className="text-3xl font-bold mt-4 text-center"
            >
              Doctor Sign Up
            </Text>
            <Text 
              style={{ color: isDarkMode ? '#B0B0B0' : '#666666' }}
              className="text-base mt-2 text-center"
            >
              Create your doctor account
            </Text>
          </View>

          {/* Sign Up Form */}
          <View className="space-y-4">
            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                Full Name *
              </Text>
              <TextInput
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                placeholder="Enter your full name"
                placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                style={{ color: colors.text }}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                Email *
              </Text>
              <TextInput
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder="Enter your email"
                placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                keyboardType="email-address"
                autoCapitalize="none"
                className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                style={{ color: colors.text }}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                Password *
              </Text>
              <TextInput
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                placeholder="Enter your password"
                placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                secureTextEntry
                className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                style={{ color: colors.text }}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                Confirm Password *
              </Text>
              <TextInput
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                placeholder="Confirm your password"
                placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                secureTextEntry
                className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                style={{ color: colors.text }}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                Specialization *
              </Text>
              <TextInput
                value={formData.specialization}
                onChangeText={(text) => setFormData({ ...formData, specialization: text })}
                placeholder="Enter your specialization"
                placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                style={{ color: colors.text }}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                License Number *
              </Text>
              <TextInput
                value={formData.licenseNumber}
                onChangeText={(text) => setFormData({ ...formData, licenseNumber: text })}
                placeholder="Enter your medical license number"
                placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                style={{ color: colors.text }}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                Phone Number *
              </Text>
              <TextInput
                value={formData.phoneNumber}
                onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                placeholder="Enter your phone number"
                placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                keyboardType="phone-pad"
                className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                style={{ color: colors.text }}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                Hospital Affiliation
              </Text>
              <TextInput
                value={formData.hospitalAffiliation}
                onChangeText={(text) => setFormData({ ...formData, hospitalAffiliation: text })}
                placeholder="Enter your hospital affiliation (optional)"
                placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                style={{ color: colors.text }}
              />
            </View>

            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading}
              className={`py-4 rounded-xl mt-4 ${loading ? 'opacity-50' : ''}`}
              style={{ backgroundColor: '#FF69B4' }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">
                  Sign Up
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Back to Login */}
          <TouchableOpacity
            onPress={() => navigation.navigate('DoctorLogin')}
            className="mt-6 mb-8"
          >
            <Text 
              style={{ color: '#FF69B4' }}
              className="text-center text-base font-medium"
            >
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default DoctorSignUpScreen; 