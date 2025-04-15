import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../config/firebase';

const DoctorDashboardScreen = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();

  // Hardcoded appointments data
  const appointments = [
    {
      id: '1',
      patientName: 'John Doe',
      date: '2024-04-20',
      time: '10:00 AM',
      type: 'Follow-up',
      doctor: 'Dr. Smith',
      notes: 'Regular check for diabetes and blood pressure'
    },
    {
      id: '2',
      patientName: 'Jane Smith',
      date: '2024-04-05',
      time: '09:00 AM',
      type: 'Check-up',
      doctor: 'Dr. Brown',
      notes: 'Annual physical examination'
    },
    {
      id: '3',
      patientName: 'Robert Johnson',
      date: '2024-04-25',
      time: '01:00 PM',
      type: 'Lab Test',
      doctor: 'Dr. Wilson',
      notes: 'Cholesterol level check'
    }
  ];

  const renderAppointmentCard = (appointment) => (
    <View 
      key={appointment.id}
      style={{
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        shadowColor: '#FF69B4',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <View>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4, color: colors.text }}>
            {appointment.patientName}
          </Text>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>
            {appointment.type}
          </Text>
        </View>
        <View style={{
          backgroundColor: isDarkMode ? 'rgba(255,105,180,0.15)' : 'rgba(255,105,180,0.1)',
          padding: 8,
          borderRadius: 8,
          alignItems: 'center'
        }}>
          <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 2, color: '#FF69B4' }}>
            {appointment.date}
          </Text>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#FF69B4' }}>
            {appointment.time}
          </Text>
        </View>
      </View>

      <View style={{ height: 1, backgroundColor: 'rgba(128, 128, 128, 0.2)', marginVertical: 12 }} />

      <View style={{ gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MaterialCommunityIcons name="doctor" size={20} color="#FF69B4" />
          <Text style={{ fontSize: 14, flex: 1, color: colors.text }}>
            {appointment.doctor}
          </Text>
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <MaterialCommunityIcons name="note-text" size={20} color="#FF69B4" />
          <Text style={{ fontSize: 14, flex: 1, color: colors.textSecondary }}>
            {appointment.notes}
          </Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#ffffff', '#f0f0f0']}
        style={{ flex: 1 }}
      >
        <ScrollView style={{ flex: 1 }}>
          <View style={{ padding: 20 }}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <View>
                <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 4, color: colors.text }}>
                  Dashboard
                </Text>
                <Text style={{ fontSize: 16, color: isDarkMode ? '#B0B0B0' : '#666666' }}>
                  Manage your practice
                </Text>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('DoctorSettings')}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: isDarkMode ? 'rgba(255,105,180,0.15)' : 'rgba(255,105,180,0.1)',
                  }}
                >
                  <MaterialCommunityIcons name="cog" size={24} color="#FF69B4" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={async () => {
                    try {
                      await auth.signOut();
                      navigation.replace('Login');
                    } catch (error) {
                      console.error('Error signing out:', error);
                      Alert.alert('Error', 'Failed to sign out');
                    }
                  }}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: isDarkMode ? 'rgba(255,105,180,0.15)' : 'rgba(255,105,180,0.1)',
                  }}
                >
                  <MaterialCommunityIcons name="logout" size={24} color="#FF69B4" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Actions */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
              <TouchableOpacity
                onPress={() => navigation.navigate('CreatePrescription')}
                style={{
                  flex: 1,
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                  borderRadius: 12,
                  padding: 20,
                  alignItems: 'center',
                  shadowColor: '#FF69B4',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <MaterialCommunityIcons name="prescription" size={24} color="#FF69B4" />
                <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>
                  Create Prescription
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                              onPress={() => navigation.navigate('PatientManagement')}

                style={{
                  flex: 1,
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                  borderRadius: 12,
                  padding: 20,
                  alignItems: 'center',
                  shadowColor: '#FF69B4',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <MaterialCommunityIcons name="account-group" size={24} color="#FF69B4" />
                <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>
                  Manage Patients
                </Text>
              </TouchableOpacity>
            </View>

            {/* Upcoming Appointments Section */}
            <View>
              <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: colors.text }}>
                Upcoming Appointments
              </Text>
              {appointments.length > 0 ? (
                appointments.map(renderAppointmentCard)
              ) : (
                <View style={{ 
                  alignItems: 'center', 
                  padding: 32,
                  backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                  borderRadius: 12,
                }}>
                  <MaterialCommunityIcons name="calendar-blank" size={48} color="#FF69B4" />
                  <Text style={{ 
                    marginTop: 16, 
                    fontSize: 18, 
                    color: colors.text,
                    textAlign: 'center' 
                  }}>
                    No upcoming appointments
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default DoctorDashboardScreen; 

