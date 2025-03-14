import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebase';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { GoogleAuthProvider, signInWithCredential, sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { Platform } from 'react-native';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_ANDROID_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '@env';

// Ensure WebBrowser is initialized
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Google SSO configuration with platform-specific client IDs
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: GOOGLE_WEB_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    // For Expo Go, the web client ID is used by default
    // Expo will automatically select the appropriate client ID for native builds
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      handleGoogleSignIn(id_token);
    } else if (response?.type === 'error') {
      console.error('Google SSO error:', response);
      Alert.alert('Error', 'Google sign-in failed. Please try again.');
      setLoading(false);
    }
  }, [response]);

  const handleForgotPassword = async () => {
    const trimmedEmail = email.trim();
    if (trimmedEmail) {
      setLoading(true);
      try {
        await sendPasswordResetEmail(auth, trimmedEmail);
        console.log('Password reset email sent to:', trimmedEmail);
        Alert.alert('Success', 'Password reset email sent. Check your inbox.');
      } catch (err) {
        console.error('Forgot password error:', { code: err.code, message: err.message });
        let errorMessage = 'An error occurred. Please try again.';
        switch (err.code) {
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many requests. Please try again later.';
            break;
          case 'auth/missing-email':
            errorMessage = 'Please provide an email address.';
            break;
          default:
            errorMessage = err.message;
        }
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Email is empty for password reset');
      Alert.alert('Error', 'Please enter your email address.');
    }
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (trimmedEmail && trimmedPassword) {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        console.log('User logged in successfully with email:', trimmedEmail);
        navigation.navigate('MainTabs', { screen: 'Home' });
      } catch (err) {
        console.error('Login error:', { code: err.code, message: err.message });
        let errorMessage = 'An error occurred. Please try again.';
        switch (err.code) {
          case 'auth/invalid-email':
            errorMessage = 'Please enter a valid email address.';
            break;
          case 'auth/user-not-found':
            errorMessage = 'No account found with this email.';
            break;
          case 'auth/wrong-password':
            errorMessage = 'Incorrect password. Please try again.';
            break;
          case 'auth/invalid-credential':
            errorMessage = 'Invalid email or password.';
            break;
          case 'auth/user-disabled':
            errorMessage = 'This account has been disabled. Contact support.';
            break;
          case 'auth/too-many-requests':
            errorMessage = 'Too many login attempts. Please try again later.';
            break;
          default:
            errorMessage = err.message;
        }
        Alert.alert('Error', errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      console.log('Email or password is empty');
      Alert.alert('Error', 'Please fill in both email and password fields.');
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
        case 'auth/user-disabled':
          errorMessage = 'This account has been disabled. Contact support.';
          break;
        default:
          errorMessage = err.message;
      }
      Alert.alert('Error', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
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
          source={require('../assets/images/TJ.jpg')} // Updated to TJ+Logo.jpg
          style={{ width: 220, height: 200, resizeMode: 'contain', borderRadius: 20 }}
          className="mb-4 rounded-2xl"
        />
        <Text className="text-xl font-bold text-center mb-6">Login</Text>

        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-4 w-3/4"
          placeholder="Email"
          value={email}
          onChangeText={(value) => setEmail(value)}
          autoCapitalize="none"
          keyboardType="email-address"
          editable={!loading}
        />

        <TextInput
          className="border border-gray-300 rounded-lg p-3 mb-6 w-3/4"
          secureTextEntry
          placeholder="Password"
          value={password}
          onChangeText={(value) => setPassword(value)}
          editable={!loading}
        />

        <TouchableOpacity
          onPress={handleLogin}
          className="py-3 bg-blue-900 rounded-xl w-3/4 mb-4"
          disabled={loading}
        >
          <Text className="text-xl font-bold text-center text-white">
            {loading ? 'Logging in...' : 'Login'}
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
          <Text className="text-xl font-bold text-center text-black">Login with Google</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleForgotPassword}
          className="mb-4"
        >
          <Text className="text-blue-500 text-center">Forgot Password?</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center mb-4">
          <Text className="text-gray-500 font-semibold">Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            disabled={loading}
          >
            <Text className="font-semibold text-blue-500"> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}