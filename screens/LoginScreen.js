import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { themeColors } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { signInWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase';
import * as Google from 'expo-auth-session/providers/google'; // For Google SSO
import * as WebBrowser from 'expo-web-browser'; // Required for Google SSO

// Ensure WebBrowser is initialized
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Google SSO configuration
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: 'YOUR_WEB_CLIENT_ID', // Replace with your Web Client ID from Firebase Console
    iosClientId: 'YOUR_IOS_CLIENT_ID', // Replace with your iOS Client ID (optional)
    androidClientId: 'YOUR_ANDROID_CLIENT_ID', // Replace with your Android Client ID (optional)
  });

  // Handle Google SSO response
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
        console.log("Password reset email sent to:", trimmedEmail);
        Alert.alert("Success", "Password reset email sent. Check your inbox.");
      } catch (err) {
        console.error("Forgot password error:", { code: err.code, message: err.message });
        let errorMessage = "An error occurred. Please try again.";
        switch (err.code) {
          case "auth/invalid-email":
            errorMessage = "Please enter a valid email address.";
            break;
          case "auth/user-not-found":
            errorMessage = "No account found with this email.";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many requests. Please try again later.";
            break;
          case "auth/missing-email":
            errorMessage = "Please provide an email address.";
            break;
          default:
            errorMessage = err.message;
        }
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Email is empty for password reset");
      Alert.alert("Error", "Please enter your email address.");
    }
  };

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    if (trimmedEmail && trimmedPassword) {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, trimmedEmail, trimmedPassword);
        console.log("User logged in successfully with email:", trimmedEmail);
        navigation.navigate('Home');
      } catch (err) {
        console.error("Login error:", { code: err.code, message: err.message });
        let errorMessage = "An error occurred. Please try again.";
        switch (err.code) {
          case "auth/invalid-email":
            errorMessage = "Please enter a valid email address.";
            break;
          case "auth/user-not-found":
            errorMessage = "No account found with this email.";
            break;
          case "auth/wrong-password":
            errorMessage = "Incorrect password. Please try again.";
            break;
          case "auth/invalid-credential":
            errorMessage = "Invalid email or password.";
            break;
          case "auth/user-disabled":
            errorMessage = "This account has been disabled. Contact support.";
            break;
          case "auth/too-many-requests":
            errorMessage = "Too many login attempts. Please try again later.";
            break;
          default:
            errorMessage = err.message;
        }
        Alert.alert("Error", errorMessage);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Email or password is empty");
      Alert.alert("Error", "Please fill in both email and password fields.");
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
      <View style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }} className="flex-1 bg-white px-8 pt-8">
        <View className="form space-y-2">
          <Text className="text-gray-700 ml-4">Email Address</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-3"
            placeholder="Email"
            value={email}
            onChangeText={(value) => setEmail(value)}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
          />
          <Text className="text-gray-700 ml-4">Password</Text>
          <TextInput
            className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
            secureTextEntry
            placeholder="Password"
            value={password}
            onChangeText={(value) => setPassword(value)}
            editable={!loading}
          />
          <TouchableOpacity
            className="flex items-end"
            onPress={handleForgotPassword}
            disabled={loading}
          >
            <Text className="text-gray-700 mb-5">Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-3 rounded-xl ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-xl font-bold text-center text-white">
              {loading ? 'Logging in...' : 'Login'}
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
          <Text className="text-gray-500 font-semibold">Don't have an account?</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            disabled={loading}
          >
            <Text className="font-semibold text-blue-500"> Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}