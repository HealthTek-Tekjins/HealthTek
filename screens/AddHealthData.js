import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { 
  ChartBarIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from 'react-native-heroicons/solid';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AddHealthData() {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    value: '',
    unit: '',
    date: new Date().toISOString().split('T')[0],
    notes: '',
    trend: 'neutral'
  });
  const [errors, setErrors] = useState({});

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Start animations
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

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.type.trim()) {
      newErrors.type = 'Health data type is required';
    }

    if (!formData.value.trim()) {
      newErrors.value = 'Value is required';
    } else if (isNaN(formData.value) || parseFloat(formData.value) <= 0) {
      newErrors.value = 'Please enter a valid value';
    }

    if (!formData.unit.trim()) {
      newErrors.unit = 'Unit is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setLoading(true);
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const healthDataRef = collection(db, 'healthData');
      await addDoc(healthDataRef, {
        ...formData,
        userId: user.uid,
        createdAt: new Date(),
        value: parseFloat(formData.value)
      });

      Alert.alert(
        'Success',
        'Health data added successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error adding health data:', error);
      Alert.alert('Error', 'Failed to add health data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const healthTypes = [
    { label: 'Blood Pressure', unit: 'mmHg' },
    { label: 'Heart Rate', unit: 'bpm' },
    { label: 'Blood Sugar', unit: 'mg/dL' },
    { label: 'Weight', unit: 'kg' },
    { label: 'Temperature', unit: '°C' },
    { label: 'Oxygen Saturation', unit: '%' },
    { label: 'Cholesterol', unit: 'mg/dL' },
    { label: 'BMI', unit: 'kg/m²' }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#ffffff', '#f0f0f0']}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex-1">
          <Animated.View 
            className="p-4"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            {/* Header */}
            <View className="flex-row items-center mb-6">
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                className="p-2 rounded-full mr-4"
                style={{ backgroundColor: colors.card }}
              >
                <ArrowLeftIcon size={24} color="#FF69B4" />
              </TouchableOpacity>
              <Text style={{ color: colors.text }} className="text-2xl font-bold">
                Add Health Data
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-6">
              {/* Health Type Selection */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
                  Health Data Type
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {healthTypes.map((type) => (
                    <TouchableOpacity
                      key={type.label}
                      onPress={() => {
                        setFormData({
                          ...formData,
                          type: type.label,
                          unit: type.unit
                        });
                      }}
                      className={`px-4 py-2 rounded-full ${
                        formData.type === type.label
                          ? 'bg-[#FF69B4]'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          formData.type === type.label ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {type.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {errors.type && (
                  <Text className="text-red-500 text-sm mt-1">{errors.type}</Text>
                )}
              </View>

              {/* Value Input */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
                  Value
                </Text>
                <View className="flex-row items-center space-x-2">
                  <TextInput
                    value={formData.value}
                    onChangeText={(text) => setFormData({ ...formData, value: text })}
                    keyboardType="numeric"
                    placeholder="Enter value"
                    placeholderTextColor={colors.textSecondary}
                    className="flex-1 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  />
                  <Text style={{ color: colors.text }} className="text-lg">
                    {formData.unit}
                  </Text>
                </View>
                {errors.value && (
                  <Text className="text-red-500 text-sm mt-1">{errors.value}</Text>
                )}
              </View>

              {/* Date Input */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
                  Date
                </Text>
                <TextInput
                  value={formData.date}
                  onChangeText={(text) => setFormData({ ...formData, date: text })}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={colors.textSecondary}
                  className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                />
                {errors.date && (
                  <Text className="text-red-500 text-sm mt-1">{errors.date}</Text>
                )}
              </View>

              {/* Notes Input */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
                  Notes (Optional)
                </Text>
                <TextInput
                  value={formData.notes}
                  onChangeText={(text) => setFormData({ ...formData, notes: text })}
                  placeholder="Add any additional notes..."
                  placeholderTextColor={colors.textSecondary}
                  multiline
                  numberOfLines={4}
                  className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                />
              </View>

              {/* Trend Selection */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
                  Trend
                </Text>
                <View className="flex-row space-x-4">
                  <TouchableOpacity
                    onPress={() => setFormData({ ...formData, trend: 'up' })}
                    className={`flex-1 py-3 rounded-xl ${
                      formData.trend === 'up'
                        ? 'bg-green-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <Text className="text-center font-semibold text-white">
                      Improving
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setFormData({ ...formData, trend: 'down' })}
                    className={`flex-1 py-3 rounded-xl ${
                      formData.trend === 'down'
                        ? 'bg-red-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <Text className="text-center font-semibold text-white">
                      Declining
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setFormData({ ...formData, trend: 'neutral' })}
                    className={`flex-1 py-3 rounded-xl ${
                      formData.trend === 'neutral'
                        ? 'bg-gray-500'
                        : 'bg-gray-200 dark:bg-gray-700'
                    }`}
                  >
                    <Text className="text-center font-semibold text-white">
                      Stable
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Submit Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                disabled={loading}
                className={`bg-[#FF69B4] px-6 py-4 rounded-xl mt-4 ${
                  loading ? 'opacity-50' : ''
                }`}
                style={{
                  shadowColor: '#FF69B4',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <Text className="text-white text-center font-semibold text-lg">
                  {loading ? 'Adding...' : 'Add Health Data'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
} 