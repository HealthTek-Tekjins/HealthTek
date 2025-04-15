import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Alert,
  Modal,
  TextInput
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const { height } = Dimensions.get('window');

const ManagePatientsScreen = () => {
  const { colors, isDarkMode } = useTheme();
  const [patients, setPatients] = useState([
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
  ]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [editedPatient, setEditedPatient] = useState(null);

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setEditedPatient({ ...patient });
    setShowEditModal(true);
  };

  const handleDelete = (patientId) => {
    Alert.alert(
      'Delete Patient',
      'Are you sure you want to delete this patient? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setPatients(currentPatients => 
              currentPatients.filter(p => p.id !== patientId)
            );
          }
        }
      ]
    );
  };

  const handleSaveEdit = () => {
    if (!editedPatient) return;

    setPatients(currentPatients =>
      currentPatients.map(p =>
        p.id === editedPatient.id ? editedPatient : p
      )
    );
    setShowEditModal(false);
    setSelectedPatient(null);
    setEditedPatient(null);
  };

  const renderEditModal = () => (
    <Modal
      visible={showEditModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowEditModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
          <View style={styles.modalHeader}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Edit Patient</Text>
            <TouchableOpacity onPress={() => setShowEditModal(false)}>
              <MaterialCommunityIcons name="close" size={24} color="#FF69B4" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalScroll}>
            {editedPatient && (
              <View style={styles.editForm}>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Name</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                      color: colors.text,
                      borderColor: 'rgba(255,105,180,0.2)'
                    }]}
                    value={editedPatient.name}
                    onChangeText={(text) => setEditedPatient(prev => ({ ...prev, name: text }))}
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Age</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                      color: colors.text,
                      borderColor: 'rgba(255,105,180,0.2)'
                    }]}
                    value={editedPatient.age.toString()}
                    onChangeText={(text) => setEditedPatient(prev => ({ ...prev, age: parseInt(text) || 0 }))}
                    keyboardType="numeric"
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Gender</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                      color: colors.text,
                      borderColor: 'rgba(255,105,180,0.2)'
                    }]}
                    value={editedPatient.gender}
                    onChangeText={(text) => setEditedPatient(prev => ({ ...prev, gender: text }))}
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Blood Type</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                      color: colors.text,
                      borderColor: 'rgba(255,105,180,0.2)'
                    }]}
                    value={editedPatient.bloodType}
                    onChangeText={(text) => setEditedPatient(prev => ({ ...prev, bloodType: text }))}
                    placeholderTextColor={colors.textSecondary}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Allergies</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                      color: colors.text,
                      borderColor: 'rgba(255,105,180,0.2)'
                    }]}
                    value={editedPatient.allergies}
                    onChangeText={(text) => setEditedPatient(prev => ({ ...prev, allergies: text }))}
                    placeholderTextColor={colors.textSecondary}
                    multiline
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Conditions</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                      color: colors.text,
                      borderColor: 'rgba(255,105,180,0.2)'
                    }]}
                    value={editedPatient.conditions}
                    onChangeText={(text) => setEditedPatient(prev => ({ ...prev, conditions: text }))}
                    placeholderTextColor={colors.textSecondary}
                    multiline
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.textSecondary }]}>Medications</Text>
                  <TextInput
                    style={[styles.input, { 
                      backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                      color: colors.text,
                      borderColor: 'rgba(255,105,180,0.2)'
                    }]}
                    value={editedPatient.medications}
                    onChangeText={(text) => setEditedPatient(prev => ({ ...prev, medications: text }))}
                    placeholderTextColor={colors.textSecondary}
                    multiline
                  />
                </View>
              </View>
            )}
          </ScrollView>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveEdit}
          >
            <Text style={styles.saveButtonText}>Save Changes</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderPatientCard = (patient) => (
    <View 
      key={patient.id}
      style={[styles.card, {
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
      }]}
    >
      <View style={styles.cardHeader}>
        <View style={styles.headerLeft}>
          <Text style={[styles.name, { color: colors.text }]}>
            {patient.name}
          </Text>
          <Text style={[styles.subInfo, { color: isDarkMode ? '#B0B0B0' : '#666666' }]}>
            Age: {patient.age} | {patient.gender} | {patient.bloodType}
          </Text>
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity
            onPress={() => handleEdit(patient)}
            style={[styles.actionButton, { backgroundColor: colors.background }]}
          >
            <MaterialCommunityIcons name="pencil" size={20} color="#FF69B4" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(patient.id)}
            style={[styles.actionButton, { backgroundColor: colors.background }]}
          >
            <MaterialCommunityIcons name="trash-can" size={20} color="#FF69B4" />
          </TouchableOpacity>
        </View>
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

        {renderEditModal()}
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    padding: 8,
    borderRadius: 8,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    maxHeight: '80%',
    borderRadius: 12,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalScroll: {
    maxHeight: height * 0.5,
  },
  editForm: {
    gap: 16,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: '#FF69B4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ManagePatientsScreen; 