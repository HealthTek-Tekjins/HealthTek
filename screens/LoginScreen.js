import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebase';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
          source={require('../assets/images/TJ.jpg')}
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