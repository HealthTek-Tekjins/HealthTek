import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

const CreatePrescriptionScreen = ({ navigation }) => {
  const { colors, isDarkMode } = useTheme();
  const [showPatientModal, setShowPatientModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    duration: '',
    specialInstructions: '',
    diagnosis: ''
  });

  // Hardcoded patients list (same as in Dashboard)
  const patients = [
    {
      id: '1',
      name: 'John Doe',
      age: 35,
      gender: 'Male',
      bloodType: 'O+',
    },
    {
      id: '2',
      name: 'Jane Smith',
      age: 28,
      gender: 'Female',
      bloodType: 'A-',
    },
    {
      id: '3',
      name: 'Robert Johnson',
      age: 45,
      gender: 'Male',
      bloodType: 'B+',
    }
  ];

  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientModal(false);
  };

  const handleCreatePrescription = () => {
    // Here you would typically save the prescription
    console.log('Prescription created:', { patient: selectedPatient, ...prescription });
    navigation.goBack();
  };

  const renderInput = (label, value, key, multiline = false) => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
            color: colors.text,
            height: multiline ? 100 : 50,
            textAlignVertical: multiline ? 'top' : 'center'
          }
        ]}
        value={value}
        onChangeText={(text) => setPrescription(prev => ({ ...prev, [key]: text }))}
        placeholderTextColor={colors.textSecondary}
        multiline={multiline}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FF69B4" />
          </TouchableOpacity>
          <Text style={[styles.title, { color: colors.text }]}>Create Prescription</Text>
        </View>

        {/* Patient Selection */}
        <TouchableOpacity
          onPress={() => setShowPatientModal(true)}
          style={[styles.patientSelector, {
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
          }]}
        >
          <MaterialCommunityIcons name="account" size={24} color="#FF69B4" />
          <Text style={[styles.patientSelectorText, { color: colors.text }]}>
            {selectedPatient ? selectedPatient.name : 'Select Patient'}
          </Text>
          <MaterialCommunityIcons name="chevron-down" size={24} color="#FF69B4" />
        </TouchableOpacity>

        {selectedPatient && (
          <View style={styles.prescriptionForm}>
            {renderInput('Diagnosis', prescription.diagnosis, 'diagnosis', true)}
            {renderInput('Medication', prescription.medication, 'medication')}
            {renderInput('Dosage', prescription.dosage, 'dosage')}
            {renderInput('Frequency', prescription.frequency, 'frequency')}
            {renderInput('Duration', prescription.duration, 'duration')}
            {renderInput('Special Instructions', prescription.specialInstructions, 'specialInstructions', true)}

            <TouchableOpacity
              style={[styles.createButton, { opacity: 0.9 }]}
              onPress={handleCreatePrescription}
            >
              <Text style={styles.createButtonText}>Create Prescription</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Patient Selection Modal */}
      <Modal
        visible={showPatientModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPatientModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Select Patient</Text>
              <TouchableOpacity onPress={() => setShowPatientModal(false)}>
                <MaterialCommunityIcons name="close" size={24} color="#FF69B4" />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.patientList}>
              {patients.map(patient => (
                <TouchableOpacity
                  key={patient.id}
                  style={[styles.patientItem, {
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                  }]}
                  onPress={() => handleSelectPatient(patient)}
                >
                  <Text style={[styles.patientName, { color: colors.text }]}>{patient.name}</Text>
                  <Text style={[styles.patientInfo, { color: colors.textSecondary }]}>
                    {patient.age} years • {patient.gender} • {patient.bloodType}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  patientSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  patientSelectorText: {
    flex: 1,
    fontSize: 16,
    marginLeft: 12,
  },
  prescriptionForm: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,105,180,0.2)',
  },
  createButton: {
    backgroundColor: '#FF69B4',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 24,
  },
  createButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
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
  patientList: {
    maxHeight: 400,
  },
  patientItem: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  patientName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  patientInfo: {
    fontSize: 14,
  },
});

export default CreatePrescriptionScreen; 