import { View, Text, TouchableOpacity, Image, TextInput, Alert, Animated, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebase';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
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
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#ffffff', '#f0f0f0']}
        style={{ flex: 1 }}
      >
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
            source={require('../assets/images/TJ.jpg')}
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
            Welcome Back
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
              placeholder="Email"
              placeholderTextColor={colors.textSecondary}
              value={email}
              onChangeText={(value) => setEmail(value)}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!loading}
            />
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
          </View>

          <TouchableOpacity
            onPress={handleLogin}
            className="rounded-xl w-3/4 mb-6"
            style={{ 
              backgroundColor: colors.primary,
              padding: 16,
            }}
            disabled={loading}
          >
            <Text className="text-xl font-bold text-center text-white">
              {loading ? 'Logging in...' : 'Login'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleForgotPassword}
            className="mb-6"
          >
            <Text style={{ color: colors.primary }} className="text-base font-semibold">
              Forgot Password?
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mb-8">
            <Text style={{ color: colors.textSecondary }} className="text-base">
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignUp')}
              disabled={loading}
              className="ml-2"
            >
              <Text style={{ color: colors.primary }} className="text-base font-bold">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}