import { View, Text, TouchableOpacity, Image, TextInput } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { themeColors } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { createUserWithEmailAndPassword, updateProfile, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase';
import * as Google from 'expo-auth-session/providers/google'; // For Google SSO
import * as WebBrowser from 'expo-web-browser'; // Required for Google SSO

// Ensure WebBrowser is initialized
WebBrowser.maybeCompleteAuthSession();

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ fullName: '', email: '', password: '' }); // UI error messages

  // Google SSO configuration
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: '827006064376-v2jouoes34eiho63jcch9r7mo7u9p63l.apps.googleusercontent.com', // Replace with your Web Client ID from Firebase Console
    iosClientId: 'YOUR_IOS_GOOGLE_CLIENT_ID', // Replace with your iOS Client ID (if applicable)
    androidClientId: 'YOUR_ANDROID_GOOGLE_CLIENT_ID', // Replace with your Android Client ID (if applicable)
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

  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const hasNumber = /\d/.test(password);
    return { minLength, hasUpperCase, hasSpecialChar, hasNumber };
  };

  const handleValidation = () => {
    const trimmedFullName = fullName.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    let newErrors = { fullName: '', email: '', password: '' };
    let isValid = true;

    // Full Name Validation
    if (!trimmedFullName) {
      newErrors.fullName = 'Full name is required.';
      isValid = false;
    }

    // Email Validation
    if (!trimmedEmail) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!validateEmail(trimmedEmail)) {
      newErrors.email = 'Please enter a valid email address.';
      isValid = false;
    }

    // Password Validation
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
      console.log("Validation failed:", errors);
      return;
    }

    setLoading(true);
    console.log("Attempting to sign up with email:", email);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email.trim(), password.trim());
      const user = userCredential.user;
      await updateProfile(user, { displayName: fullName.trim() });
      console.log("User created successfully:", user);
      navigation.navigate('Home'); // Navigate to Home after successful sign-up
    } catch (err) {
      console.error("Sign-up error:", { code: err.code, message: err.message });
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
      console.log("Google sign-in successful:", userCredential.user);
      navigation.navigate('Home');
    } catch (err) {
      console.error("Google sign-in error:", { code: err.code, message: err.message });
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
    <View className="flex-1 bg-white" style={{ backgroundColor: themeColors.bg }}>
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 rounded-tr-2xl rounded-bl-2xl ml-4"
            disabled={loading}
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center">
          <Image source={require('../assets/images/TJ+Logo.jpg')} style={{ width: 220, height: 200 }} />
        </View>
      </SafeAreaView>
      <View className="flex-1 bg-white px-8 pt-8" style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}>
        <View className="form space-y-2">
          <Text className="text-gray-700 ml-4">Full Name</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
            value={fullName}
            onChangeText={(value) => setFullName(value)}
            placeholder="Enter Name"
            editable={!loading}
          />
          {errors.fullName ? <Text className="text-red-500 ml-4 mb-2">{errors.fullName}</Text> : null}

          <Text className="text-gray-700 ml-4">Email Address</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
            value={email}
            onChangeText={(value) => setEmail(value)}
            placeholder="Enter Email"
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          {errors.email ? <Text className="text-red-500 ml-4 mb-2">{errors.email}</Text> : null}

          <Text className="text-gray-700 ml-4">Password</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-1"
            secureTextEntry
            value={password}
            onChangeText={(value) => setPassword(value)}
            placeholder="Enter Password"
            editable={!loading}
          />
          {errors.password ? <Text className="text-red-500 ml-4 mb-2">{errors.password}</Text> : null}

          <TouchableOpacity
            className={`py-3 rounded-xl ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
            onPress={handleSubmit}
            disabled={loading}
          >
            <Text className="font-xl font-bold text-center text-white">
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
        </View>
        <Text className="text-xl text-gray-700 font-bold text-center py-5">Or</Text>
        <View className="flex-row justify-center space-x-12">
          <TouchableOpacity
            className={`p-2 bg-gray-100 rounded-2xl ${loading ? 'opacity-50' : ''}`}
            onPress={() => promptAsync()}
            disabled={loading || !request}
          >
            <Image source={require('../assets/icons/google.png')} className="w-10 h-10" />
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center mt-7">
          <Text className="text-gray-500 font-semibold">Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')} disabled={loading}>
            <Text className="font-semibold text-blue-500"> Log In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}