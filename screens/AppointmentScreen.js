import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CalendarIcon, ArrowLeftIcon, ClockIcon, MapPinIcon } from 'react-native-heroicons/solid';
import { useAuth } from '../context/AuthContext';
import { saveAppointment, getUserAppointments } from '../services/firebaseService';

export default function AppointmentScreen({ navigation }) {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    try {
      if (user) {
        const data = await getUserAppointments(user.uid);
        setAppointments(data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load appointments');
    }
  };

  const handleBookAppointment = async () => {
    try {
      if (!user) {
        Alert.alert('Error', 'You must be logged in to book an appointment');
        return;
      }

      Alert.prompt(
        'Book Appointment',
        'Enter appointment details (e.g., "Dr. Smith - Cardiology - Tomorrow 10:00 AM")',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Book',
            onPress: async (details) => {
              const appointmentData = {
                details,
                status: 'scheduled',
                userId: user.uid,
              };

              await saveAppointment(user.uid, appointmentData);
              Alert.alert('Success', 'Appointment booked successfully');
              loadAppointments(); // Reload the appointments
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to book appointment');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-4"
        >
          <ArrowLeftIcon size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-black">Appointments</Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-6 py-4">
        {/* Upcoming Appointments */}
        <View className="bg-[#F5F5F7] rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Upcoming Appointments</Text>
          {appointments.filter(apt => apt.status === 'scheduled').length > 0 ? (
            appointments
              .filter(apt => apt.status === 'scheduled')
              .map((appointment, index) => (
                <View key={index} className="bg-white rounded-lg p-4 shadow-sm mb-2">
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-gray-700 font-medium">{appointment.details}</Text>
                      <Text className="text-gray-500 text-sm">Status: {appointment.status}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-[#007AFF] font-medium">
                        {new Date(appointment.createdAt?.toDate()).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
          ) : (
            <Text className="text-gray-500 text-center">No upcoming appointments</Text>
          )}
        </View>

        {/* Book New Appointment */}
        <View className="bg-[#F5F5F7] rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Book New Appointment</Text>
          <TouchableOpacity 
            className="bg-white rounded-lg p-4 shadow-sm"
            onPress={handleBookAppointment}
          >
            <Text className="text-gray-700 font-medium">Schedule Appointment</Text>
            <Text className="text-gray-500 text-sm">Find and book with a doctor</Text>
          </TouchableOpacity>
        </View>

        {/* Past Appointments */}
        <View className="bg-[#F5F5F7] rounded-xl p-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Past Appointments</Text>
          {appointments.filter(apt => apt.status === 'completed').length > 0 ? (
            appointments
              .filter(apt => apt.status === 'completed')
              .map((appointment, index) => (
                <View key={index} className="bg-white rounded-lg p-4 shadow-sm mb-2">
                  <View className="flex-row justify-between items-center">
                    <View>
                      <Text className="text-gray-700 font-medium">{appointment.details}</Text>
                      <Text className="text-gray-500 text-sm">Status: {appointment.status}</Text>
                    </View>
                    <View className="items-end">
                      <Text className="text-gray-500 text-sm">
                        {new Date(appointment.createdAt?.toDate()).toLocaleDateString()}
                      </Text>
                    </View>
                  </View>
                </View>
              ))
          ) : (
            <Text className="text-gray-500 text-center">No past appointments</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 