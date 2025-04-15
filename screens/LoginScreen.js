import { View, Text, TouchableOpacity, Image, TextInput, Alert, Animated, Dimensions, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebase';
import { sendPasswordResetEmail, signInWithEmailAndPassword } from 'firebase/auth';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function LoginScreen() {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
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

    // Debug available screens
    console.log('Navigator screens:', navigation.getState()?.routeNames);
  }, []);

  const handleForgotPassword = async () => {
    try {
      if (!email.trim()) {
        setErrors({ email: 'Please enter your email address' });
        return;
      }

      setLoading(true);
      await sendPasswordResetEmail(auth, email.trim());
      Alert.alert(
        'Password Reset',
        'Password reset instructions have been sent to your email.',
        [{ text: 'OK', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error) {
      console.error('Password reset error:', error);
      let errorMessage = 'Failed to send reset email';
      
      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        default:
          errorMessage = 'An error occurred. Please try again';
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    try {
      setErrors({});
      setLoading(true);

      if (!email.trim()) {
        setErrors({ email: 'Email is required' });
        return;
      }
      if (!password.trim()) {
        setErrors({ password: 'Password is required' });
        return;
      }

      const userCredential = await signInWithEmailAndPassword(auth, email.trim(), password.trim());
      
      if (userCredential.user) {
        navigation.replace('MainTabs');
      }
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Invalid email or password';
      
      switch (error.code) {
        case 'auth/invalid-credential':
          errorMessage = 'Invalid email or password';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No account found with this email';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many failed attempts. Please try again later';
          break;
        default:
          errorMessage = 'An error occurred. Please try again';
      }
      
      setErrors({ submit: errorMessage });
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
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
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
            className="flex-1 justify-center items-center py-8"
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
              Welcome Back
            </Text>

            <View style={{ width: '85%', marginBottom: 20 }}>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                backgroundColor: colors.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 12,
              }}>
                <MaterialCommunityIcons name="email" size={20} color="#FF69B4" style={{ marginRight: 8 }} />
                <TextInput
                  className="flex-1 py-4"
                  style={{ 
                    color: colors.text,
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
            </View>

            <View style={{ width: '85%', marginBottom: 20 }}>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                backgroundColor: colors.card,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 12,
              }}>
                <MaterialCommunityIcons name="lock" size={20} color="#FF69B4" style={{ marginRight: 8 }} />
                <TextInput
                  className="flex-1 py-4"
                  style={{ 
                    color: colors.text,
                  }}
                  secureTextEntry
                  placeholder="Password"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={(value) => setPassword(value)}
                  editable={!loading}
                />
              </View>
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

            {/* SSO Buttons */}
            <View className="w-3/4 mb-6">
              <Text style={{ color: colors.textSecondary }} className="text-center mb-4">
                Or continue with
              </Text>
              
              <View className="flex-row justify-center space-x-4">
                {/* Google Button */}
                <TouchableOpacity
                  className="p-3 rounded-full"
                  style={{ backgroundColor: '#FFFFFF' }}
                  onPress={() => console.log('Google Sign In pressed')}
                >
                  <MaterialCommunityIcons name="google" size={24} color="#DB4437" />
                </TouchableOpacity>

                {/* Apple Button */}
                <TouchableOpacity
                  className="p-3 rounded-full"
                  style={{ backgroundColor: '#000000' }}
                  onPress={() => console.log('Apple Sign In pressed')}
                >
                  <MaterialCommunityIcons name="apple" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                {/* Facebook Button */}
                <TouchableOpacity
                  className="p-3 rounded-full"
                  style={{ backgroundColor: '#1877F2' }}
                  onPress={() => console.log('Facebook Sign In pressed')}
                >
                  <MaterialCommunityIcons name="facebook" size={24} color="#FFFFFF" />
                </TouchableOpacity>
              </View>
            </View>

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

            {/* Role-based Login Links */}
            <View className="w-full items-center space-y-4 mb-8">
              {/* Doctor Login Link */}
              <TouchableOpacity
                onPress={() => navigation.navigate('DoctorLogin')}
                className="w-3/4 py-3 rounded-xl"
                style={{ backgroundColor: '#FF69B4' }}
              >
                <Text className="text-center text-base font-bold text-white">
                  Are you a doctor? Login here
                </Text>
              </TouchableOpacity>

              {/* Admin Login Link */}
              <TouchableOpacity
                onPress={() => {
                  console.log('Admin button pressed');
                  console.log('Attempting to navigate to Admin screen');
                  console.log('Current navigator screens:', navigation.getState()?.routeNames);
                  if (navigation.getState()?.routeNames.includes('Admin')) {
                    navigation.navigate('Admin');
                    console.log('Navigation to Admin initiated');
                  } else {
                    console.error('Admin screen not found in navigator');
                    Alert.alert('Navigation Error', 'Admin screen is not available');
                  }
                }}
                className="w-3/4 py-3 rounded-xl"
                style={{ backgroundColor: '#4CAF50' }}
              >
                <Text className="text-center text-base font-bold text-white">
                  Administrator Login
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}