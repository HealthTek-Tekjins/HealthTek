import { View, Text, TouchableOpacity, Image, TextInput, Alert, Animated, Dimensions } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

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

    // Log available screens for debugging
    console.log('AdminScreen navigator screens:', navigation.getState()?.routeNames);
  }, []);

  const handleAdminLogin = () => {
    setLoading(true);
    setError('');

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
            Admin Login
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
              placeholder="Admin Email"
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
              placeholder="Admin Password"
              placeholderTextColor={colors.textSecondary}
              value={password}
              onChangeText={(value) => setPassword(value)}
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            onPress={handleAdminLogin}
            className="rounded-xl w-3/4 mb-6"
            style={{
              backgroundColor: '#4CAF50',
              padding: 16,
            }}
            disabled={loading}
          >
            <Text className="text-xl font-bold text-center text-white">
              {loading ? 'Logging in...' : 'Admin Login'}
            </Text>
          </TouchableOpacity>

          {error && (
            <Text style={{ color: 'red', marginTop: 10, textAlign: 'center' }}>
              {error}
            </Text>
          )}
        </Animated.View>
      </LinearGradient>
    </SafeAreaView>
  );
}