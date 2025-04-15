import { View, Text, TouchableOpacity, TextInput, Alert, Animated, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function AdminScreen() {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Animation values
  const fadeAnim = new Animated.Value(0);
  const slideAnim = new Animated.Value(50);
  const scaleAnim = new Animated.Value(0.8);

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
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleAdminLogin = () => {
    if (!email.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    // Simulated admin login (replace with actual authentication)
    if (email === '1' && password === '1') {
      console.log('Navigating to AdminDashboard');
      navigation.replace('AdminDashboard');
    } else {
      setError('Invalid admin credentials');
    }

    setLoading(false);
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
          className="flex-1 justify-center items-center px-8"
          style={{
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim }
            ],
          }}
        >
          {/* Admin Icon Container */}
          <View
            style={{
              width: width * 0.4,
              height: width * 0.4,
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : '#f8f8f8',
              borderRadius: width * 0.2,
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 32,
              shadowColor: '#FF69B4',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.2,
              shadowRadius: 8,
              elevation: 5,
              borderWidth: 2,
              borderColor: 'rgba(255,105,180,0.2)',
            }}
          >
            <MaterialCommunityIcons
              name="shield-account"
              size={width * 0.25}
              color="#FF69B4"
              style={{
                opacity: 0.9,
              }}
            />
          </View>

          <Text style={{ color: colors.text }} className="text-3xl font-bold text-center mb-2">
            Admin Portal
          </Text>
          <Text style={{ color: colors.textSecondary }} className="text-base text-center mb-8">
            Secure access for administrators
          </Text>

          <View style={{ width: '100%', marginBottom: 20 }}>
            <View style={{ marginBottom: 16 }}>
              <Text style={{ color: colors.textSecondary, marginBottom: 8, fontSize: 14, fontWeight: '600' }}>
                Admin Email
              </Text>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: error ? '#FF0000' : 'rgba(255,105,180,0.2)',
              }}>
                <MaterialCommunityIcons
                  name="email"
                  size={20}
                  color="#FF69B4"
                  style={{ marginLeft: 12 }}
                />
                <TextInput
                  className="flex-1 p-4"
                  style={{
                    color: colors.text,
                  }}
                  placeholder="Enter admin email"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value);
                    setError('');
                  }}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  editable={!loading}
                />
              </View>
            </View>

            <View style={{ marginBottom: 24 }}>
              <Text style={{ color: colors.textSecondary, marginBottom: 8, fontSize: 14, fontWeight: '600' }}>
                Admin Password
              </Text>
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: error ? '#FF0000' : 'rgba(255,105,180,0.2)',
              }}>
                <MaterialCommunityIcons
                  name="lock"
                  size={20}
                  color="#FF69B4"
                  style={{ marginLeft: 12 }}
                />
                <TextInput
                  className="flex-1 p-4"
                  style={{
                    color: colors.text,
                  }}
                  secureTextEntry
                  placeholder="Enter admin password"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value);
                    setError('');
                  }}
                  editable={!loading}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleAdminLogin}
            className="rounded-xl w-full mb-6"
            style={{
              backgroundColor: '#FF69B4',
              padding: 16,
              opacity: loading ? 0.7 : 1,
              shadowColor: '#FF69B4',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 5,
            }}
            disabled={loading}
          >
            <View className="flex-row justify-center items-center">
              <MaterialCommunityIcons
                name="shield-lock"
                size={24}
                color="white"
                style={{ marginRight: 8 }}
              />
              <Text className="text-xl font-bold text-center text-white">
                {loading ? 'Logging in...' : 'Login to Admin Portal'}
              </Text>
            </View>
          </TouchableOpacity>

          {error && (
            <View className="flex-row items-center bg-red-100 p-3 rounded-lg">
              <MaterialCommunityIcons 
                name="alert-circle" 
                size={20} 
                color="#FF0000" 
                style={{ marginRight: 8 }} 
              />
              <Text style={{ color: '#FF0000', fontSize: 14 }}>
                {error}
              </Text>
            </View>
          )}
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}
