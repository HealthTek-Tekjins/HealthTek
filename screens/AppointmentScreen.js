import { View, Text, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  PhoneIcon,
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ExclamationCircleIcon
} from 'react-native-heroicons/solid';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../config/firebase';
import { 
  collection, 
  query, 
  where, 
  getDocs, 
  deleteDoc, 
  doc, 
  updateDoc, 
  addDoc,
  setLogLevel 
} from 'firebase/firestore';

// Enable Firestore debug logging
setLogLevel('debug');

export default function AppointmentScreen() {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const fetchAppointments = async () => {
    try {
      console.log('Starting to fetch appointments...');
      setLoading(true);
      setError(null);
      const user = auth.currentUser;
      
      if (!user) {
        console.log('No authenticated user found');
        throw new Error('User not authenticated');
      }

      console.log('Current user:', {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName
      });

      const appointmentsRef = collection(db, 'appointments');
      console.log('Creating query for appointments with patientId:', user.uid);
      
      // Query for appointments where the user is the patient
      const q = query(
        appointmentsRef,
        where('patientId', '==', user.uid)
      );
      
      console.log('Executing query for patientId:', user.uid);
      const querySnapshot = await getDocs(q);
      console.log('Query completed. Number of appointments:', querySnapshot.size);
      
      // Filter appointments for the current user
      const appointmentsData = querySnapshot.docs
        .map(doc => ({
          id: doc.id,
          ...doc.data()
        }))
        .filter(appointment => appointment.patientId === user.uid);

      console.log('Filtered appointments for user:', appointmentsData.length);

      // Sort appointments by date
      appointmentsData.sort((a, b) => new Date(a.date) - new Date(b.date));
      console.log('Appointments sorted and processed:', appointmentsData.length);
      
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error details:', {
        code: error.code,
        message: error.message,
        stack: error.stack
      });
      setError('Failed to load appointments. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleCreateAppointment = async (appointmentData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const appointmentsRef = collection(db, 'appointments');
      const newAppointment = {
        ...appointmentData,
        patientId: user.uid,
        createdAt: new Date().toISOString(),
        status: 'scheduled'
      };

      const docRef = await addDoc(appointmentsRef, newAppointment);
      console.log('Appointment created with ID:', docRef.id);
      
      // Refresh appointments list
      await fetchAppointments();
      
      return docRef.id;
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  };

  const handleUpdateAppointment = async (appointmentId, updatedData) => {
    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');

      const appointmentRef = doc(db, 'appointments', appointmentId);
      await updateDoc(appointmentRef, {
        ...updatedData,
        updatedAt: new Date().toISOString()
      });

      console.log('Appointment updated successfully');
      
      // Refresh appointments list
      await fetchAppointments();
    } catch (error) {
      console.error('Error updating appointment:', error);
      throw error;
    }
  };

  const handleDeleteAppointment = async (appointmentId) => {
    try {
      Alert.alert(
        'Delete Appointment',
        'Are you sure you want to delete this appointment?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              const appointmentRef = doc(db, 'appointments', appointmentId);
              await deleteDoc(appointmentRef);
              console.log('Appointment deleted successfully');
              
              // Refresh appointments list
              await fetchAppointments();
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error deleting appointment:', error);
      Alert.alert('Error', 'Failed to delete appointment. Please try again.');
    }
  };

  const handleEditAppointment = (appointment) => {
    navigation.navigate('EditAppointment', { 
      appointment,
      onUpdate: handleUpdateAppointment
    });
  };

  const handleAddAppointment = () => {
    navigation.navigate('AddAppointment', {
      onCreate: handleCreateAppointment
    });
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (timeString) => {
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
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
            <View className="flex-row justify-between items-center mb-6">
              <Text style={{ color: colors.text }} className="text-2xl font-bold">
                Appointments
              </Text>
              <TouchableOpacity
                onPress={handleAddAppointment}
                className="bg-[#FF69B4] p-3 rounded-full"
                style={{
                  shadowColor: '#FF69B4',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <PlusIcon size={24} color="white" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View className="items-center justify-center py-8">
                <Text style={{ color: colors.textSecondary }}>Loading appointments...</Text>
              </View>
            ) : error ? (
              <View className="items-center justify-center py-8">
                <ExclamationCircleIcon size={48} color="#FF69B4" />
                <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 8 }}>
                  {error}
                </Text>
                <TouchableOpacity
                  onPress={fetchAppointments}
                  className="mt-4 bg-[#FF69B4] px-6 py-3 rounded-xl"
                >
                  <Text className="text-white font-semibold">Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : appointments.length === 0 ? (
              <View className="items-center justify-center py-8">
                <CalendarIcon size={48} color="#FF69B4" />
                <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 8 }}>
                  No appointments scheduled
                </Text>
                <TouchableOpacity
                  onPress={handleAddAppointment}
                  className="mt-4 bg-[#FF69B4] px-6 py-3 rounded-xl"
                >
                  <Text className="text-white font-semibold">Schedule Appointment</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="space-y-4">
                {appointments.map((appointment) => (
                  <View
                    key={appointment.id}
                    style={{
                      backgroundColor: colors.card,
                      borderRadius: 16,
                      padding: 16,
                      shadowColor: colors.text,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <View className="flex-row justify-between items-start mb-4">
                      <View>
                        <Text style={{ color: colors.text }} className="text-xl font-bold mb-1">
                          {appointment.doctorName}
                        </Text>
                        <Text style={{ color: colors.textSecondary }} className="text-base">
                          {appointment.specialty}
                        </Text>
                      </View>
                      <View className="flex-row space-x-2">
                        <TouchableOpacity
                          onPress={() => handleEditAppointment(appointment)}
                          className="p-2 rounded-full"
                          style={{ backgroundColor: colors.background }}
                        >
                          <PencilIcon size={20} color="#FF69B4" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDeleteAppointment(appointment.id)}
                          className="p-2 rounded-full"
                          style={{ backgroundColor: colors.background }}
                        >
                          <TrashIcon size={20} color="#FF69B4" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View className="space-y-3">
                      <View className="flex-row items-center">
                        <CalendarIcon size={20} color="#FF69B4" style={{ marginRight: 8 }} />
                        <Text style={{ color: colors.text }}>
                          {formatDate(appointment.date)}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <ClockIcon size={20} color="#FF69B4" style={{ marginRight: 8 }} />
                        <Text style={{ color: colors.text }}>
                          {formatTime(appointment.time)}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <MapPinIcon size={20} color="#FF69B4" style={{ marginRight: 8 }} />
                        <Text style={{ color: colors.text }}>
                          {appointment.location}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <PhoneIcon size={20} color="#FF69B4" style={{ marginRight: 8 }} />
                        <Text style={{ color: colors.text }}>
                          {appointment.phone}
                        </Text>
                      </View>
                    </View>

                    {appointment.notes && (
                      <View className="mt-4 pt-4 border-t border-gray-200">
                        <Text style={{ color: colors.textSecondary }} className="text-sm">
                          {appointment.notes}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
} 