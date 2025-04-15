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
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

const UpcomingAppointmentsScreen = () => {
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
    },
    {
      id: '4',
      patientName: 'Mary Williams',
      date: '2024-05-10',
      time: '11:30 AM',
      type: 'Consultation',
      doctor: 'Dr. Davis',
      notes: 'Initial consultation for headaches'
    },
    {
      id: '5',
      patientName: 'James Brown',
      date: '2024-05-15',
      time: '02:30 PM',
      type: 'Follow-up',
      doctor: 'Dr. Taylor',
      notes: 'Post-surgery check'
    }
  ];

  const renderAppointmentCard = (appointment) => (
    <View 
      key={appointment.id}
      style={[styles.card, {
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
      }]}
    >
      <View style={styles.cardHeader}>
        <View>
          <Text style={[styles.patientName, { color: colors.text }]}>
            {appointment.patientName}
          </Text>
          <Text style={[styles.appointmentType, { color: colors.textSecondary }]}>
            {appointment.type}
          </Text>
        </View>
        <View style={[styles.dateContainer, {
          backgroundColor: isDarkMode ? 'rgba(255,105,180,0.15)' : 'rgba(255,105,180,0.1)',
        }]}>
          <Text style={[styles.date, { color: '#FF69B4' }]}>
            {appointment.date}
          </Text>
          <Text style={[styles.time, { color: '#FF69B4' }]}>
            {appointment.time}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="doctor" size={20} color="#FF69B4" />
          <Text style={[styles.detailText, { color: colors.text }]}>
            {appointment.doctor}
          </Text>
        </View>
        <View style={styles.detailRow}>
          <MaterialCommunityIcons name="note-text" size={20} color="#FF69B4" />
          <Text style={[styles.detailText, { color: colors.textSecondary }]}>
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
        style={styles.container}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            Upcoming Appointments
          </Text>
          <Text style={[styles.subtitle, { color: isDarkMode ? '#B0B0B0' : '#666666' }]}>
            View scheduled appointments
          </Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {appointments.map(renderAppointmentCard)}
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  patientName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  appointmentType: {
    fontSize: 14,
  },
  dateContainer: {
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  date: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(128, 128, 128, 0.2)',
    marginVertical: 12,
  },
  detailsContainer: {
    gap: 8,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  detailText: {
    fontSize: 14,
    flex: 1,
  },
});

export default UpcomingAppointmentsScreen; 