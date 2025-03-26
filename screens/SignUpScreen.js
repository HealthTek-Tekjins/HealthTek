import { View, Text, TouchableOpacity, Image, TextInput, ScrollView, Animated, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../config/firebase';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../config/firebase';

const { width } = Dimensions.get('window');

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '', surname: '', phoneNumber: '', email: '', password: '' });

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);

  useEffect(() => {
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

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    return { minLength, hasUpperCase, hasSpecialChar, hasNumber };
  };

  const handleValidation = () => {
    const trimmedName = name.trim();
    const trimmedSurname = surname.trim();
    const trimmedPhoneNumber = phoneNumber.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    let newErrors = { name: '', surname: '', phoneNumber: '', email: '', password: '' };
    let isValid = true;

    if (!trimmedName) {
      newErrors.name = 'Name is required.';
      isValid = false;
    }

    if (!trimmedSurname) {
      newErrors.surname = 'Surname is required.';
      isValid = false;
    }

    if (!trimmedPhoneNumber) {
      newErrors.phoneNumber = 'Phone number is required.';
      isValid = false;
    } else if (!validatePhoneNumber(trimmedPhoneNumber)) {
      newErrors.phoneNumber = 'Phone number must be exactly 10 digits (e.g., 1234567890).';
      isValid = false;
    }

    if (!trimmedEmail) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!validateEmail(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    if (!trimmedPassword) {
      newErrors.password = 'Password is required.';
      isValid = false;
    } else {
      const { minLength, hasUpperCase, hasSpecialChar, hasNumber } = validatePassword(trimmedPassword);
      if (!minLength) {
        newErrors.password = 'Password must be at least 8 characters.';
        isValid = false;
      } else if (!hasUpperCase) {
        newErrors.password = 'Password must include at least one capital letter.';
        isValid = false;
      } else if (!hasSpecialChar) {
        newErrors.password = 'Password must include at least one special character (e.g., !@#$%).';
        isValid = false;
      } else if (!hasNumber) {
        newErrors.password = 'Password must include at least one number.';
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    try {
      // Clear any previous errors
      setErrors({ name: '', surname: '', phoneNumber: '', email: '', password: '' });
      
      // Validate all fields
      const validationErrors = { name: '', surname: '', phoneNumber: '', email: '', password: '' };
      let hasErrors = false;

      if (!name.trim()) {
        validationErrors.name = 'Name is required';
        hasErrors = true;
      }
      
      if (!surname.trim()) {
        validationErrors.surname = 'Surname is required';
        hasErrors = true;
      }
      
      if (!phoneNumber.trim()) {
        validationErrors.phoneNumber = 'Phone number is required';
        hasErrors = true;
      } else if (!/^\d{10}$/.test(phoneNumber.trim())) {
        validationErrors.phoneNumber = 'Phone number must be 10 digits';
        hasErrors = true;
      }
      
      if (!email.trim()) {
        validationErrors.email = 'Email is required';
        hasErrors = true;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        validationErrors.email = 'Invalid email format';
        hasErrors = true;
      }
      
      if (!password.trim()) {
        validationErrors.password = 'Password is required';
        hasErrors = true;
      } else if (password.length < 6) {
        validationErrors.password = 'Password must be at least 6 characters';
        hasErrors = true;
      }

      // If there are validation errors, set them and return
      if (hasErrors) {
        setErrors(validationErrors);
        return;
      }

      setLoading(true);

      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      
      // Update user profile with name and surname
      await updateProfile(userCredential.user, {
        displayName: `${name.trim()} ${surname.trim()}`,
      });

      // Store additional user data in Firestore
      await setDoc(doc(db, 'userDetails', userCredential.user.uid), {
        name: name.trim(),
        surname: surname.trim(),
        email: email.trim(),
        phoneNumber: phoneNumber.trim(),
        createdAt: serverTimestamp(),
        // Initialize other fields with empty values
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

      // Navigate to main app
      navigation.replace('MainTabs');
    } catch (error) {
      console.error('Sign up error:', error);
      let errorMessage = 'An error occurred during sign up';
      
      // Handle specific Firebase error codes
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Network error. Please check your connection';
          break;
        default:
          errorMessage = error.message || 'An error occurred during sign up';
      }
      
      setErrors({ email: errorMessage });
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
          <View className="flex-row justify-start">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-4"
              style={{ backgroundColor: colors.card }}
              disabled={loading}
            >
              <ArrowLeftIcon size={20} color={colors.text} />
            </TouchableOpacity>
          </View>

          <Animated.View 
            className="flex-1 justify-center items-center"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <Image
              source={require('../assets/images/RB.png')}
              style={{ 
                width: width * 0.6, 
                height: width * 0.6, 
                resizeMode: 'contain', 
                borderRadius: 20,
                shadowColor: colors.text,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 5,
              }}
              className="mb-8 rounded-2xl"
            />

            <Text style={{ color: colors.text }} className="text-2xl font-bold text-center mb-8">
              Create Account
            </Text>

            <View style={{ width: '85%', marginBottom: 20 }}>
              <TextInput
                className="rounded-xl p-4"
                style={{ 
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                placeholder="Enter Name"
                placeholderTextColor={colors.textSecondary}
                value={name}
                onChangeText={(value) => setName(value)}
                autoCapitalize="words"
                editable={!loading}
              />
              {errors.name ? <Text style={{ color: colors.error, marginTop: 4 }}>{errors.name}</Text> : null}
            </View>

            <View style={{ width: '85%', marginBottom: 20 }}>
              <TextInput
                className="rounded-xl p-4"
                style={{ 
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                placeholder="Enter Surname"
                placeholderTextColor={colors.textSecondary}
                value={surname}
                onChangeText={(value) => setSurname(value)}
                autoCapitalize="words"
                editable={!loading}
              />
              {errors.surname ? <Text style={{ color: colors.error, marginTop: 4 }}>{errors.surname}</Text> : null}
            </View>

            <View style={{ width: '85%', marginBottom: 20 }}>
              <TextInput
                className="rounded-xl p-4"
                style={{ 
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                placeholder="Enter Phone Number (e.g., 1234567890)"
                placeholderTextColor={colors.textSecondary}
                value={phoneNumber}
                onChangeText={(value) => setPhoneNumber(value)}
                keyboardType="phone-pad"
                editable={!loading}
                maxLength={10}
              />
              {errors.phoneNumber ? <Text style={{ color: colors.error, marginTop: 4 }}>{errors.phoneNumber}</Text> : null}
            </View>

            <View style={{ width: '85%', marginBottom: 20 }}>
              <TextInput
                className="rounded-xl p-4"
                style={{ 
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                placeholder="Email"
                placeholderTextColor={colors.textSecondary}
                value={email}
                onChangeText={(value) => setEmail(value)}
                autoCapitalize="none"
                keyboardType="email-address"
                editable={!loading}
              />
              {errors.email ? <Text style={{ color: colors.error, marginTop: 4 }}>{errors.email}</Text> : null}
            </View>

            <View style={{ width: '85%', marginBottom: 20 }}>
              <TextInput
                className="rounded-xl p-4"
                style={{ 
                  backgroundColor: colors.card,
                  color: colors.text,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
                secureTextEntry
                placeholder="Password"
                placeholderTextColor={colors.textSecondary}
                value={password}
                onChangeText={(value) => setPassword(value)}
                editable={!loading}
              />
              {errors.password ? <Text style={{ color: colors.error, marginTop: 4 }}>{errors.password}</Text> : null}
            </View>

            <TouchableOpacity 
              onPress={handleSubmit}
              className="rounded-xl w-3/4 mb-6"
              style={{ 
                backgroundColor: colors.primary,
                padding: 16,
              }}
              disabled={loading}
            >
              <Text className="text-xl font-bold text-center text-white">
                {loading ? 'Signing Up...' : 'Sign Up'}
              </Text>
            </TouchableOpacity>

            <View className="flex-row justify-center items-center mb-8">
              <Text style={{ color: colors.textSecondary }} className="text-base">
                Already have an account?
              </Text>
              <TouchableOpacity 
                onPress={() => navigation.navigate('Login')} 
                disabled={loading}
                className="ml-2"
              >
                <Text style={{ color: colors.primary }} className="text-base font-bold">
                  Log In
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}