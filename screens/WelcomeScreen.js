import { View, Text, TouchableOpacity, Image, Animated, Dimensions } from 'react-native';
import React, { useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  
  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#ffffff', '#f0f0f0']}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-center items-center">
          <Animated.View
            style={{
              opacity: fadeAnim,
              transform: [
                { translateY: slideUpAnim },
                { scale: scaleAnim },
                { rotate: spin },
              ],
            }}
            className="items-center"
          >
            <Image
              source={require('../assets/images/TJ+Logo.jpg')}
              style={{
                width: width * 0.7,
                height: width * 0.7,
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

            <Text style={{ color: colors.text }} className="text-4xl font-bold text-center mb-4">
              Welcome to HealthTek
            </Text>

            <Text style={{ color: colors.textSecondary }} className="text-lg text-center mb-12 px-8">
              Your personal health companion for a better tomorrow
            </Text>

            <Animated.View
              style={{
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }],
              }}
              className="w-full px-8"
            >
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
                className="rounded-xl w-full mb-4"
                style={{
                  backgroundColor: '#FF69B4',
                  padding: 16,
                  shadowColor: '#FF69B4',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <Text className="text-xl font-bold text-center text-white">
                  Login
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
                className="rounded-xl w-full"
                style={{
                  backgroundColor: colors.card,
                  padding: 16,
                  borderWidth: 2,
                  borderColor: '#FF69B4',
                }}
              >
                <Text style={{ color: '#FF69B4' }} className="text-xl font-bold text-center">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </Animated.View>
          </Animated.View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}