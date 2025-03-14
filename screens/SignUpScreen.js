import { View, Text, TouchableOpacity, Image, TextInput, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '@env';

// Ensure WebBrowser is initialized
WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: '', surname: '', phoneNumber: '', email: '', password: '' });

  // Google SSO configuration with platform-specific client IDs
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    // For Expo Go, the web client ID is used by default
    // Expo will automatically select the appropriate client ID for native builds
  });

  // Handle Google SSO response
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleSignIn(id_token);
    } else if (response?.type === 'error') {
      console.error('Google SSO error:', response);
      setErrors((prev) => ({ ...prev, email: 'Google sign-in failed. Please try again.' }));
      setLoading(false);
    }
  }, [response]);

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
    if (!handleValidation()) {
      console.log('Validation failed:', errors);
      return;
    }

    setLoading(true);
    console.log('Attempting to sign up with email:', email);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      const user = userCredential.user;
      const displayName = `${name.trim()} ${surname.trim()}`;
      await updateProfile(user, { displayName });
      console.log('User created successfully:', user);
      navigation.navigate('MainTabs', { screen: 'Login' });
    } catch (err) {
      console.error('Sign-up error:', { code: err.code, message: err.message });
      let errorMessage = '';
      switch (err.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already in use.';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address.';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password is too weak.';
          break;
        case 'auth/configuration-not-found':
          errorMessage = 'Firebase configuration error. Please contact support.';
          break;
        default:
          errorMessage = 'An error occurred. Please try again.';
      }
      setErrors((prev) => ({ ...prev, email: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (idToken) => {
    setLoading(true);
    try {
      const credential = GoogleAuthProvider.credential(idToken);
      const userCredential = await signInWithCredential(auth, credential);
      console.log('Google sign-in successful:', userCredential.user);
      navigation.navigate('MainTabs', { screen: 'Home' });
    } catch (err) {
      console.error('Google sign-in error:', { code: err.code, message: err.message });
      let errorMessage = 'Google sign-in failed. Please try again.';
      switch (err.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Invalid Google credentials.';
          break;
        case 'auth/account-exists-with-different-credential':
          errorMessage = 'An account already exists with a different sign-in method.';
          break;
        default:
          errorMessage = err.message;
      }
      setErrors((prev) => ({ ...prev, email: errorMessage }));
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-4 bg-gray-200"
            disabled={loading}
          >
            <ArrowLeftIcon size={20} color="black" />
          </TouchableOpacity>
        </View>
        <View className="flex-1 justify-center items-center">
          <Image
            source={require('../assets/images/TJ+Logo.jpg')} // Updated to TJ+Logo.jpg
            style={{ width: 220, height: 200, resizeMode: 'contain', borderRadius: 20 }}
            className="mb-4 rounded-2xl"
          />
          <Text className="text-xl font-bold text-center mb-6">Sign Up</Text>

          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 w-3/4"
            value={name}
            onChangeText={(value) => setName(value)}
            placeholder="Enter Name"
            autoCapitalize="words"
            editable={!loading}
          />
          {errors.name ? <Text className="text-red-500 text-center mb-4">{errors.name}</Text> : null}

          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 w-3/4"
            value={surname}
            onChangeText={(value) => setSurname(value)}
            placeholder="Enter Surname"
            autoCapitalize="words"
            editable={!loading}
          />
          {errors.surname ? <Text className="text-red-500 text-center mb-4">{errors.surname}</Text> : null}

          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 w-3/4"
            value={phoneNumber}
            onChangeText={(value) => setPhoneNumber(value)}
            placeholder="Enter Phone Number (e.g., 1234567890)"
            keyboardType="phone-pad"
            editable={!loading}
            maxLength={10}
          />
          {errors.phoneNumber ? <Text className="text-red-500 text-center mb-4">{errors.phoneNumber}</Text> : null}

          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-4 w-3/4"
            value={email}
            onChangeText={(value) => setEmail(value)}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          {errors.email ? <Text className="text-red-500 text-center mb-4">{errors.email}</Text> : null}

          <TextInput
            className="border border-gray-300 rounded-lg p-3 mb-6 w-3/4"
            secureTextEntry
            value={password}
            onChangeText={(value) => setPassword(value)}
            placeholder="Password"
            editable={!loading}
          />
          {errors.password ? <Text className="text-red-500 text-center mb-4">{errors.password}</Text> : null}

          <TouchableOpacity
            onPress={handleSubmit}
            className="py-3 bg-blue-900 rounded-xl w-3/4 mb-4"
            disabled={loading}
          >
            <Text className="text-xl font-bold text-center text-white">
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => promptAsync()}
            className="py-3 bg-gray-200 rounded-xl w-3/4 flex-row justify-center items-center mb-4"
            disabled={loading || !request}
          >
            <Image
              source={require('../assets/icons/google.png')}
              style={{ width: 24, height: 24, marginRight: 10 }}
            />
            <Text className="text-xl font-bold text-center text-black">Sign Up with Google</Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mb-4">
            <Text className="text-gray-500 font-semibold">Already have an account?</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
              <Text className="font-semibold text-blue-500"> Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}