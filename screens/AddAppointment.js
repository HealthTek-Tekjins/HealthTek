import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { 
  CalendarIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  DocumentTextIcon
} from 'react-native-heroicons/solid';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../config/firebase';
import { collection, addDoc } from 'firebase/firestore';

export default function AddAppointment() {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    doctorName: '',
    specialty: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    location: '',
    notes: '',
    type: 'Regular Checkup',
    status: 'scheduled'
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
    
    if (!formData.doctorName.trim()) {
      newErrors.doctorName = 'Doctor name is required';
    }

    if (!formData.specialty.trim()) {
      newErrors.specialty = 'Specialty is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time.trim()) {
      newErrors.time = 'Time is required';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
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

      const appointmentsRef = collection(db, 'appointments');
      await addDoc(appointmentsRef, {
        ...formData,
        userId: user.uid,
        createdAt: new Date(),
      });

      Alert.alert(
        'Success',
        'Appointment scheduled successfully',
        [
          {
            text: 'OK',
            onPress: () => navigation.goBack()
          }
        ]
      );
    } catch (error) {
      console.error('Error scheduling appointment:', error);
      Alert.alert('Error', 'Failed to schedule appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const appointmentTypes = [
    'Regular Checkup',
    'Follow-up Visit',
    'Consultation',
    'Emergency Visit',
    'Specialist Visit',
    'Lab Test',
    'Vaccination',
    'Physical Therapy'
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
                Schedule Appointment
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-6">
              {/* Appointment Type Selection */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
                  Appointment Type
                </Text>
                <View className="flex-row flex-wrap gap-2">
                  {appointmentTypes.map((type) => (
                    <TouchableOpacity
                      key={type}
                      onPress={() => setFormData({ ...formData, type })}
                      className={`px-4 py-2 rounded-full ${
                        formData.type === type
                          ? 'bg-[#FF69B4]'
                          : 'bg-gray-200 dark:bg-gray-700'
                      }`}
                    >
                      <Text
                        className={`font-medium ${
                          formData.type === type ? 'text-white' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Doctor Name Input */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
                  Doctor Name
                </Text>
                <View className="flex-row items-center space-x-2">
                  <UserIcon size={20} color="#FF69B4" />
                  <TextInput
                    value={formData.doctorName}
                    onChangeText={(text) => setFormData({ ...formData, doctorName: text })}
                    placeholder="Enter doctor's name"
                    placeholderTextColor={colors.textSecondary}
                    className="flex-1 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  />
                </View>
                {errors.doctorName && (
                  <Text className="text-red-500 text-sm mt-1">{errors.doctorName}</Text>
                )}
              </View>

              {/* Specialty Input */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
                  Specialty
                </Text>
                <TextInput
                  value={formData.specialty}
                  onChangeText={(text) => setFormData({ ...formData, specialty: text })}
                  placeholder="Enter doctor's specialty"
                  placeholderTextColor={colors.textSecondary}
                  className="bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                />
                {errors.specialty && (
                  <Text className="text-red-500 text-sm mt-1">{errors.specialty}</Text>
                )}
              </View>

              {/* Date Input */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
                  Date
                </Text>
                <View className="flex-row items-center space-x-2">
                  <CalendarIcon size={20} color="#FF69B4" />
                  <TextInput
                    value={formData.date}
                    onChangeText={(text) => setFormData({ ...formData, date: text })}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.textSecondary}
                    className="flex-1 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  />
                </View>
                {errors.date && (
                  <Text className="text-red-500 text-sm mt-1">{errors.date}</Text>
                )}
              </View>

              {/* Time Input */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
                  Time
                </Text>
                <View className="flex-row items-center space-x-2">
                  <ClockIcon size={20} color="#FF69B4" />
                  <TextInput
                    value={formData.time}
                    onChangeText={(text) => setFormData({ ...formData, time: text })}
                    placeholder="HH:MM AM/PM"
                    placeholderTextColor={colors.textSecondary}
                    className="flex-1 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  />
                </View>
                {errors.time && (
                  <Text className="text-red-500 text-sm mt-1">{errors.time}</Text>
                )}
              </View>

              {/* Location Input */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
                  Location
                </Text>
                <View className="flex-row items-center space-x-2">
                  <MapPinIcon size={20} color="#FF69B4" />
                  <TextInput
                    value={formData.location}
                    onChangeText={(text) => setFormData({ ...formData, location: text })}
                    placeholder="Enter appointment location"
                    placeholderTextColor={colors.textSecondary}
                    className="flex-1 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  />
                </View>
                {errors.location && (
                  <Text className="text-red-500 text-sm mt-1">{errors.location}</Text>
                )}
              </View>

              {/* Notes Input */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
                  Notes (Optional)
                </Text>
                <View className="flex-row items-start space-x-2">
                  <DocumentTextIcon size={20} color="#FF69B4" style={{ marginTop: 12 }} />
                  <TextInput
                    value={formData.notes}
                    onChangeText={(text) => setFormData({ ...formData, notes: text })}
                    placeholder="Add any additional notes..."
                    placeholderTextColor={colors.textSecondary}
                    multiline
                    numberOfLines={4}
                    className="flex-1 bg-white dark:bg-gray-800 rounded-xl px-4 py-3 text-gray-900 dark:text-white"
                  />
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
                  {loading ? 'Scheduling...' : 'Schedule Appointment'}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
} 