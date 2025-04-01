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
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import LanguageSelector from '../components/LanguageSelector';

const DoctorSignUpScreen = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    specialization: '',
    licenseNumber: '',
    phoneNumber: '',
    hospitalAffiliation: '',
    gender: 'male'
  });

  const handleSignUp = async () => {
    // Validate form data
    if (!formData.fullName || !formData.email || !formData.password || !formData.confirmPassword ||
        !formData.specialization || !formData.licenseNumber || !formData.phoneNumber || !formData.gender) {
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
        gender: formData.gender,
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
              {t.doctorSignUp}
            </Text>
            <Text 
              style={{ color: isDarkMode ? '#B0B0B0' : '#666666' }}
              className="text-base mt-2 text-center"
            >
              {t.createDoctorAccount}
            </Text>
          </View>

          <LanguageSelector />

          {/* Sign Up Form */}
          <View className="space-y-4">
            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                {t.fullName} *
              </Text>
              <TextInput
                value={formData.fullName}
                onChangeText={(text) => setFormData({ ...formData, fullName: text })}
                placeholder={t.enterFullName}
                placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                style={{ color: colors.text }}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                {t.gender} *
              </Text>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: formData.gender === 'male' ? '#FF69B4' : isDarkMode ? '#1f2937' : 'white',
                    padding: 15,
                    borderRadius: 12,
                    marginRight: 5,
                    borderWidth: 1,
                    borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                  }}
                  onPress={() => setFormData({ ...formData, gender: 'male' })}
                >
                  <Text
                    style={{
                      color: formData.gender === 'male' ? 'white' : colors.text,
                      textAlign: 'center',
                      fontWeight: formData.gender === 'male' ? 'bold' : 'normal',
                    }}
                  >
                    {t.male}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: formData.gender === 'female' ? '#FF69B4' : isDarkMode ? '#1f2937' : 'white',
                    padding: 15,
                    borderRadius: 12,
                    marginHorizontal: 5,
                    borderWidth: 1,
                    borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                  }}
                  onPress={() => setFormData({ ...formData, gender: 'female' })}
                >
                  <Text
                    style={{
                      color: formData.gender === 'female' ? 'white' : colors.text,
                      textAlign: 'center',
                      fontWeight: formData.gender === 'female' ? 'bold' : 'normal',
                    }}
                  >
                    {t.female}
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={{
                    flex: 1,
                    backgroundColor: formData.gender === 'other' ? '#FF69B4' : isDarkMode ? '#1f2937' : 'white',
                    padding: 15,
                    borderRadius: 12,
                    marginLeft: 5,
                    borderWidth: 1,
                    borderColor: isDarkMode ? '#374151' : '#e5e7eb',
                  }}
                  onPress={() => setFormData({ ...formData, gender: 'other' })}
                >
                  <Text
                    style={{
                      color: formData.gender === 'other' ? 'white' : colors.text,
                      textAlign: 'center',
                      fontWeight: formData.gender === 'other' ? 'bold' : 'normal',
                    }}
                  >
                    {t.other}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                {t.email} *
              </Text>
              <TextInput
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
                placeholder={t.enterEmail}
                placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                keyboardType="email-address"
                autoCapitalize="none"
                className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                style={{ color: colors.text }}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                {t.password} *
              </Text>
              <TextInput
                value={formData.password}
                onChangeText={(text) => setFormData({ ...formData, password: text })}
                placeholder={t.enterPassword}
                placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                secureTextEntry
                className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                style={{ color: colors.text }}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                {t.confirmPassword} *
              </Text>
              <TextInput
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                placeholder={t.confirmYourPassword}
                placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                secureTextEntry
                className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                style={{ color: colors.text }}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                {t.specialization} *
              </Text>
              <TextInput
                value={formData.specialization}
                onChangeText={(text) => setFormData({ ...formData, specialization: text })}
                placeholder={t.enterSpecialization}
                placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                style={{ color: colors.text }}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                {t.licenseNumber} *
              </Text>
              <TextInput
                value={formData.licenseNumber}
                onChangeText={(text) => setFormData({ ...formData, licenseNumber: text })}
                placeholder={t.enterLicenseNumber}
                placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                style={{ color: colors.text }}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                {t.phoneNumber} *
              </Text>
              <TextInput
                value={formData.phoneNumber}
                onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
                placeholder={t.enterPhoneNumber}
                placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                keyboardType="phone-pad"
                className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                style={{ color: colors.text }}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                {t.hospitalAffiliation}
              </Text>
              <TextInput
                value={formData.hospitalAffiliation}
                onChangeText={(text) => setFormData({ ...formData, hospitalAffiliation: text })}
                placeholder={t.enterHospitalAffiliation}
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
                  {t.signUp}
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
              {t.alreadyHaveAccount} {t.login}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default DoctorSignUpScreen; 