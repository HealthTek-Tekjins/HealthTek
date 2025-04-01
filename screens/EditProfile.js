import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Animated, Switch } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../config/firebase';
import { updateProfile, updateEmail, signOut } from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

const EditProfile = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    phoneNumber: '',
    idNumber: '',
    address: '',
    medicalAid: {
      provider: '',
      number: '',
      plan: '',
      expiryDate: ''
    },
    nextOfKin: {
      name: '',
      surname: '',
      phoneNumber: ''
    }
  });
  const [errors, setErrors] = useState({});

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert(
        'Authentication Error',
        'Please log in again to edit your profile.',
        [{ text: 'OK', onPress: () => navigation.replace('Login') }]
      );
      return;
    }

    // Initialize form data with current user's basic info
    setFormData(prevState => ({
      ...prevState,
      displayName: currentUser.displayName || '',
      email: currentUser.email || '',
      phoneNumber: currentUser.phoneNumber || ''
    }));

    fetchUserData(currentUser.uid);
    startAnimations();
  }, []);

  const startAnimations = () => {
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
  };

  const fetchUserData = async (userId) => {
    try {
      const userDetailsRef = doc(db, 'userDetails', userId);
      const userDoc = await getDoc(userDetailsRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setFormData(prevState => ({
          ...prevState,
          idNumber: userData.idNumber || '',
          address: userData.address || '',
          medicalAid: {
            provider: userData.medicalAid?.provider || '',
            number: userData.medicalAid?.number || '',
            plan: userData.medicalAid?.plan || '',
            expiryDate: userData.medicalAid?.expiryDate || ''
          },
          nextOfKin: {
            name: userData.nextOfKin?.name || '',
            surname: userData.nextOfKin?.surname || '',
            phoneNumber: userData.nextOfKin?.phoneNumber || ''
          }
        }));
      } else {
        // If the document doesn't exist, create it with default values
        await setDoc(userDetailsRef, {
          idNumber: '',
          address: '',
          medicalAid: {
            provider: '',
            number: '',
            plan: '',
            expiryDate: ''
          },
          nextOfKin: {
            name: '',
            surname: '',
            phoneNumber: ''
          },
          createdAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      if (error.code === 'permission-denied') {
        Alert.alert(
          'Access Denied',
          'You do not have permission to view this profile. Please log out and log in again.',
          [
            {
              text: 'Log Out',
              onPress: async () => {
                try {
                  await signOut(auth);
                  navigation.replace('Login');
                } catch (e) {
                  console.error('Error signing out:', e);
                }
              },
              style: 'destructive'
            },
            { text: 'OK', style: 'cancel' }
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to load profile data. Please try again.');
      }
    }
  };

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

    // ID Number validation (13 digits for South African ID)
    if (formData.idNumber && formData.idNumber.length !== 13) {
      newErrors.idNumber = 'ID number must be 13 digits';
    } else if (formData.idNumber && !/^\d+$/.test(formData.idNumber)) {
      newErrors.idNumber = 'ID number must contain only digits';
    }

    // Medical Aid validation
    if (formData.medicalAid.provider && !formData.medicalAid.number) {
      newErrors.medicalAidNumber = 'Medical aid number is required if provider is specified';
    }

    // Next of Kin validation
    if (formData.nextOfKin.name || formData.nextOfKin.surname || formData.nextOfKin.phoneNumber) {
      if (!formData.nextOfKin.name.trim()) {
        newErrors.nextOfKinName = 'Next of kin name is required';
      }
      if (!formData.nextOfKin.surname.trim()) {
        newErrors.nextOfKinSurname = 'Next of kin surname is required';
      }
      if (!formData.nextOfKin.phoneNumber.trim()) {
        newErrors.nextOfKinPhone = 'Next of kin phone number is required';
      }
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
        Alert.alert(
          'Authentication Error',
          'Please log in again to update your profile.',
          [{ text: 'OK', onPress: () => navigation.replace('Login') }]
        );
        return;
      }

      // Update display name in Firebase Auth
      await updateProfile(currentUser, {
        displayName: formData.displayName,
      });

      // Only update email if it has changed
      if (formData.email !== currentUser.email) {
        await updateEmail(currentUser, formData.email);
      }

      // Save additional user details to Firestore
      const userDetailsRef = doc(db, 'userDetails', currentUser.uid);
      await setDoc(userDetailsRef, {
        idNumber: formData.idNumber || '',
        address: formData.address || '',
        medicalAid: {
          provider: formData.medicalAid.provider || '',
          number: formData.medicalAid.number || '',
          plan: formData.medicalAid.plan || '',
          expiryDate: formData.medicalAid.expiryDate || ''
        },
        nextOfKin: {
          name: formData.nextOfKin.name || '',
          surname: formData.nextOfKin.surname || '',
          phoneNumber: formData.nextOfKin.phoneNumber || ''
        },
        updatedAt: new Date().toISOString()
      }, { merge: true });

      Alert.alert(
        'Success',
        'Profile updated successfully',
        [{ 
          text: 'OK', 
          onPress: () => {
            navigation.goBack();
            if (route.params?.onUpdate) {
              route.params.onUpdate(currentUser);
            }
          }
        }]
      );
    } catch (error) {
      console.error('Error updating profile:', error);
      let errorMessage = 'Failed to update profile. Please try again.';
      
      if (error.code === 'auth/requires-recent-login') {
        Alert.alert(
          'Session Expired',
          'Please log in again to update your profile.',
          [{ text: 'OK', onPress: () => navigation.replace('Login') }]
        );
        return;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (label, value, onChangeText, icon, keyboardType = 'default', error = null, isDisabled = false) => (
    <View className="mb-4">
      <View className="flex-row items-center space-x-2 mb-2">
        <MaterialIcons name={icon} size={20} color="#FF69B4" />
        <Text style={{ color: colors.text }} className="text-base">{label}</Text>
      </View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={`Enter ${label.toLowerCase()}`}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType}
        editable={!isDisabled}
        className={`${isDisabled ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} rounded-xl px-4 py-3 text-gray-900 dark:text-white`}
      />
      {error && <Text className="text-red-500 text-sm mt-1">{error}</Text>}
    </View>
  );

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
            {/* Header */}
            <View className="flex-row items-center mb-6">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="p-2 rounded-full mr-4"
                style={{ backgroundColor: colors.card }}
              >
                <MaterialIcons name="arrow-back" size={24} color="#FF69B4" />
              </TouchableOpacity>
              <Text style={{ color: colors.text }} className="text-2xl font-bold">
                {t.editProfile}
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-6">
              {/* Personal Information Section */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-4">
                  {t.personalInfo}
                </Text>
                
                {renderInput('Display Name', formData.displayName, 
                  (text) => setFormData({ ...formData, displayName: text }), 
                  'person', 'default', errors.displayName)}

                {renderInput('Email', formData.email,
                  (text) => setFormData({ ...formData, email: text }),
                  'email', 'email-address', errors.email)}

                {renderInput('Phone', formData.phoneNumber, null,
                  'phone', 'phone-pad', null, true)}

                {renderInput('ID Number', formData.idNumber,
                  (text) => setFormData({ ...formData, idNumber: text }),
                  'badge', 'numeric', errors.idNumber)}

                {renderInput('Address', formData.address,
                  (text) => setFormData({ ...formData, address: text }),
                  'location-on', 'default', errors.address)}
              </View>

              {/* Medical Aid Section */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-4">
                  {t.medicalAidInfo}
                </Text>

                {renderInput('Medical Aid Provider', formData.medicalAid.provider,
                  (text) => setFormData({
                    ...formData,
                    medicalAid: { ...formData.medicalAid, provider: text }
                  }),
                  'local-hospital')}

                {renderInput('Medical Aid Number', formData.medicalAid.number,
                  (text) => setFormData({
                    ...formData,
                    medicalAid: { ...formData.medicalAid, number: text }
                  }),
                  'credit-card', 'default', errors.medicalAidNumber)}

                {renderInput('Medical Aid Plan', formData.medicalAid.plan,
                  (text) => setFormData({
                    ...formData,
                    medicalAid: { ...formData.medicalAid, plan: text }
                  }),
                  'description')}

                {renderInput('Medical Aid Expiry Date', formData.medicalAid.expiryDate,
                  (text) => setFormData({
                    ...formData,
                    medicalAid: { ...formData.medicalAid, expiryDate: text }
                  }),
                  'event', 'default', null)}
              </View>

              {/* Next of Kin Section */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-4">
                  {t.nextOfKin}
                </Text>

                {renderInput('Next of Kin Name', formData.nextOfKin.name,
                  (text) => setFormData({
                    ...formData,
                    nextOfKin: { ...formData.nextOfKin, name: text }
                  }),
                  'person', 'default', errors.nextOfKinName)}

                {renderInput('Next of Kin Surname', formData.nextOfKin.surname,
                  (text) => setFormData({
                    ...formData,
                    nextOfKin: { ...formData.nextOfKin, surname: text }
                  }),
                  'person', 'default', errors.nextOfKinSurname)}

                {renderInput('Next of Kin Phone', formData.nextOfKin.phoneNumber,
                  (text) => setFormData({
                    ...formData,
                    nextOfKin: { ...formData.nextOfKin, phoneNumber: text }
                  }),
                  'phone', 'phone-pad', errors.nextOfKinPhone)}
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
                <Text className="text-white text-center font-bold text-lg">
                  {loading ? 'Updating...' : t.save}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = {
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
};

export default EditProfile; 