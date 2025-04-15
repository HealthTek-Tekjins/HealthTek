import React from 'react';
import { 
  View, 
  Text, 
  ScrollView,
  StyleSheet,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';

const { height } = Dimensions.get('window');

const ManagePatientsScreen = () => {
  const { colors, isDarkMode } = useTheme();

  // Hardcoded patient data
  const patients = [
    {
      id: '1',
      name: 'John Doe',
      age: 35,
      gender: 'Male',
      bloodType: 'O+',
      allergies: 'Penicillin, Peanuts',
      conditions: 'Hypertension, Diabetes',
      medications: 'Metformin, Lisinopril',
      lastVisit: '2024-03-15',
      nextAppointment: '2024-04-20',
      upcomingAppointments: [
        { date: '2024-04-20', time: '10:00 AM', type: 'Follow-up', doctor: 'Dr. Smith' },
        { date: '2024-05-15', time: '02:30 PM', type: 'Check-up', doctor: 'Dr. Johnson' },
        { date: '2024-06-10', time: '11:00 AM', type: 'Lab Test', doctor: 'Dr. Williams' }
      ]
    },
    {
      id: '2',
      name: 'Jane Smith',
      age: 28,
      gender: 'Female',
      bloodType: 'A-',
      allergies: 'None',
      conditions: 'Asthma',
      medications: 'Albuterol',
      lastVisit: '2024-03-10',
      nextAppointment: '2024-04-05',
      upcomingAppointments: [
        { date: '2024-04-05', time: '09:00 AM', type: 'Follow-up', doctor: 'Dr. Brown' },
        { date: '2024-05-12', time: '03:00 PM', type: 'Check-up', doctor: 'Dr. Davis' },
        { date: '2024-06-08', time: '10:30 AM', type: 'Lab Test', doctor: 'Dr. Miller' }
      ]
    },
    {
      id: '3',
      name: 'Robert Johnson',
      age: 45,
      gender: 'Male',
      bloodType: 'B+',
      allergies: 'Shellfish',
      conditions: 'High Cholesterol',
      medications: 'Atorvastatin',
      lastVisit: '2024-03-20',
      nextAppointment: '2024-04-25',
      upcomingAppointments: [
        { date: '2024-04-25', time: '01:00 PM', type: 'Follow-up', doctor: 'Dr. Wilson' },
        { date: '2024-05-20', time: '11:30 AM', type: 'Check-up', doctor: 'Dr. Taylor' },
        { date: '2024-06-15', time: '02:00 PM', type: 'Lab Test', doctor: 'Dr. Anderson' }
      ]
    }
  ];

  const renderPatientCard = (patient) => (
    <View 
      key={patient.id}
      style={[styles.card, {
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
      }]}
    >
      <View style={styles.header}>
        <Text style={[styles.name, { color: colors.text }]}>
          {patient.name}
        </Text>
        <Text style={[styles.subInfo, { color: isDarkMode ? '#B0B0B0' : '#666666' }]}>
          Age: {patient.age} | {patient.gender} | {patient.bloodType}
        </Text>
      </View>

      <View style={styles.infoSection}>
        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Allergies:
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {patient.allergies}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Conditions:
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {patient.conditions}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>
            Medications:
          </Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {patient.medications}
          </Text>
        </View>

        <View style={styles.appointmentSection}>
          <View>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Last Visit
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {patient.lastVisit}
            </Text>
          </View>
          <View>
            <Text style={[styles.label, { color: colors.textSecondary }]}>
              Next Appointment
            </Text>
            <Text style={[styles.value, { color: colors.text }]}>
              {patient.nextAppointment}
            </Text>
          </View>
        </View>

        <View style={styles.upcomingSection}>
          <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            Upcoming Appointments
          </Text>
          {patient.upcomingAppointments.map((appointment, index) => (
            <View key={index} style={styles.appointmentRow}>
              <Text style={[styles.appointmentDate, { color: colors.text }]}>
                {appointment.date} at {appointment.time}
              </Text>
              <Text style={[styles.appointmentInfo, { color: colors.textSecondary }]}>
                {appointment.type} with {appointment.doctor}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#ffffff', '#f0f0f0']}
        style={styles.container}
      >
        <View style={styles.headerContainer}>
          <Text style={[styles.title, { color: colors.text }]}>
            Manage Patients
          </Text>
          <Text style={[styles.subtitle, { color: isDarkMode ? '#B0B0B0' : '#666666' }]}>
            View and manage patient records
          </Text>
        </View>

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {patients.map(renderPatientCard)}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    padding: 20,
    paddingTop: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subInfo: {
    fontSize: 14,
  },
  infoSection: {
    gap: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  label: {
    width: 100,
    fontSize: 14,
  },
  value: {
    flex: 1,
    fontSize: 14,
  },
  appointmentSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  upcomingSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  appointmentRow: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  appointmentDate: {
    fontSize: 14,
    marginBottom: 2,
  },
  appointmentInfo: {
    fontSize: 12,
  },
});

export default ManagePatientsScreen; 