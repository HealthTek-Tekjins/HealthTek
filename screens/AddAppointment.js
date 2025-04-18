import { View, Text, TouchableOpacity, ScrollView, Alert, TextInput, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  CalendarIcon,
  ArrowLeftIcon,
  ExclamationCircleIcon,
  ClockIcon,
  MapPinIcon,
  UserIcon,
  DocumentTextIcon,
  ChevronDownIcon
} from 'react-native-heroicons/solid';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../config/firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

export default function AddAppointment() {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const { translations } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: '',
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
    fetchDoctors();
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

  const fetchDoctors = async () => {
    try {
      const doctorsRef = collection(db, 'doctors');
      const querySnapshot = await getDocs(doctorsRef);
      const doctorsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setDoctors(doctorsList);
    } catch (error) {
      console.error('Error fetching doctors:', error);
      Alert.alert('Error', 'Failed to load doctors list');
    }
  };

  const handleDoctorSelect = (doctorId) => {
    const selectedDoctor = doctors.find(doc => doc.id === doctorId);
    if (selectedDoctor) {
      setFormData({
        ...formData,
        doctorId: doctorId,
        doctorName: selectedDoctor.fullName || 'Unknown',
        specialty: selectedDoctor.specialization || 'Not specified',
        location: selectedDoctor.location ? 
          `${selectedDoctor.location.address || ''}, ${selectedDoctor.location.city || ''}, ${selectedDoctor.location.country || ''}` 
          : 'Location not available'
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.doctorId) {
      newErrors.doctorId = 'Please select a doctor';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
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
        patientId: user.uid,
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

  // Generate time options
  const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const minutes = Array.from({ length: 12 }, (_, i) => (i * 5).toString().padStart(2, '0'));
  const periods = ['AM', 'PM'];

  const pickerContainerStyle = {
    height: 140,
    backgroundColor: colors.card,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 4,
  };

  const pickerStyle = {
    height: '100%',
    color: colors.text,
    backgroundColor: 'transparent',
  };

  const pickerItemStyle = {
    fontSize: 16,
    fontFamily: 'System',
    color: colors.text,
  };

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
                {translations.scheduleAppointment}
              </Text>
            </View>

            {/* Form */}
            <View className="space-y-6">
              {/* Doctor Selection */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
                  {translations.selectDoctor}
                </Text>
                <View style={[pickerContainerStyle, { height: 180, backgroundColor: isDarkMode ? colors.card : '#ffffff' }]}>
                  <Picker
                    selectedValue={formData.doctorId}
                    onValueChange={handleDoctorSelect}
                    style={[pickerStyle, { color: colors.text }]}
                    itemStyle={[pickerItemStyle, { color: colors.text }]}
                  >
                    <Picker.Item 
                      label={translations.selectADoctor} 
                      value="" 
                      color={colors.textSecondary}
                    />
                    {doctors.map(doctor => (
                      <Picker.Item 
                        key={doctor.id} 
                        label={doctor.fullName || translations.unknownDoctor} 
                        value={doctor.id}
                        color={colors.text}
                      />
                    ))}
                  </Picker>
                </View>
                {errors.doctorId && (
                  <Text className="text-red-500 text-sm mt-1">{errors.doctorId}</Text>
                )}
              </View>

              {/* Doctor Info (auto-populated) */}
              {formData.doctorId && (
                <>
                  <View>
                    <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
                      {translations.specialty}
                    </Text>
                    <TextInput
                      value={formData.specialty}
                      editable={false}
                      style={{ 
                        color: colors.text,
                        backgroundColor: isDarkMode ? colors.card : '#ffffff',
                      }}
                      className="rounded-xl px-4 py-3"
                    />
                  </View>

                  <View>
                    <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
                      {translations.location}
                    </Text>
                    <TextInput
                      value={formData.location}
                      editable={false}
                      style={{ 
                        color: colors.text,
                        backgroundColor: isDarkMode ? colors.card : '#ffffff',
                      }}
                      className="rounded-xl px-4 py-3"
                    />
                  </View>
                </>
              )}

              {/* Date Input */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
                  {translations.date}
                </Text>
                <View className="flex-row items-center space-x-2">
                  <CalendarIcon size={20} color="#FF69B4" />
                  <TextInput
                    value={formData.date}
                    onChangeText={(text) => setFormData({ ...formData, date: text })}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor={colors.textSecondary}
                    style={{ 
                      color: colors.text,
                      backgroundColor: isDarkMode ? colors.card : '#ffffff',
                      flex: 1,
                    }}
                    className="rounded-xl px-4 py-3"
                  />
                </View>
                {errors.date && (
                  <Text className="text-red-500 text-sm mt-1">{errors.date}</Text>
                )}
              </View>

              {/* Time Selection */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
                  {translations.time}
                </Text>
                <View className="flex-row space-x-2">
                  {/* Hours Picker */}
                  <View style={[pickerContainerStyle, { flex: 1, backgroundColor: isDarkMode ? colors.card : '#ffffff' }]}>
                    <Picker
                      selectedValue={formData.time.split(':')[0] || '01'}
                      onValueChange={(hour) => {
                        const [_, minute, period] = formData.time.split(':');
                        setFormData({ ...formData, time: `${hour}:${minute || '00'} ${period || 'AM'}` });
                      }}
                      style={[pickerStyle, { color: colors.text }]}
                      itemStyle={[pickerItemStyle, { fontSize: 15, color: colors.text }]}
                    >
                      {hours.map(hour => (
                        <Picker.Item 
                          key={hour} 
                          label={hour} 
                          value={hour}
                          color={colors.text}
                        />
                      ))}
                    </Picker>
                  </View>

                  {/* Minutes Picker */}
                  <View style={[pickerContainerStyle, { flex: 1, backgroundColor: isDarkMode ? colors.card : '#ffffff' }]}>
                    <Picker
                      selectedValue={formData.time.split(':')[1]?.split(' ')[0] || '00'}
                      onValueChange={(minute) => {
                        const [hour, _, period] = formData.time.split(':');
                        setFormData({ ...formData, time: `${hour || '01'}:${minute} ${period || 'AM'}` });
                      }}
                      style={[pickerStyle, { color: colors.text }]}
                      itemStyle={[pickerItemStyle, { fontSize: 15, color: colors.text }]}
                    >
                      {minutes.map(minute => (
                        <Picker.Item 
                          key={minute} 
                          label={minute} 
                          value={minute}
                          color={colors.text}
                        />
                      ))}
                    </Picker>
                  </View>

                  {/* AM/PM Picker */}
                  <View style={[pickerContainerStyle, { flex: 1, backgroundColor: isDarkMode ? colors.card : '#ffffff' }]}>
                    <Picker
                      selectedValue={formData.time.split(' ')[1] || 'AM'}
                      onValueChange={(period) => {
                        const [time] = formData.time.split(' ');
                        setFormData({ ...formData, time: `${time} ${period}` });
                      }}
                      style={[pickerStyle, { color: colors.text }]}
                      itemStyle={[pickerItemStyle, { fontSize: 15, color: colors.text }]}
                    >
                      {periods.map(period => (
                        <Picker.Item 
                          key={period} 
                          label={period} 
                          value={period}
                          color={colors.text}
                        />
                      ))}
                    </Picker>
                  </View>
                </View>
                {errors.time && (
                  <Text className="text-red-500 text-sm mt-1">{errors.time}</Text>
                )}
              </View>

              {/* Notes Input */}
              <View>
                <Text style={{ color: colors.text }} className="text-lg font-semibold mb-3">
                  {translations.notes} ({translations.optional})
                </Text>
                <View className="flex-row items-start space-x-2">
                  <DocumentTextIcon size={20} color="#FF69B4" style={{ marginTop: 12 }} />
                  <TextInput
                    value={formData.notes}
                    onChangeText={(text) => setFormData({ ...formData, notes: text })}
                    placeholder={translations.addNotes}
                    placeholderTextColor={colors.textSecondary}
                    style={{ 
                      color: colors.text,
                      backgroundColor: isDarkMode ? colors.card : '#ffffff',
                      flex: 1,
                    }}
                    multiline
                    numberOfLines={4}
                    className="rounded-xl px-4 py-3"
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
                  {loading ? translations.scheduling : translations.scheduleAppointment}
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
} 