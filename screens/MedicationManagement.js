import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function MedicationManagement({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  // Dummy data for medications
  const [medications, setMedications] = useState([
    { id: '1', name: 'Aspirin', dosage: '100mg', instructions: 'Take once daily with food' },
    { id: '2', name: 'Metformin', dosage: '500mg', instructions: 'Take twice daily' },
    { id: '3', name: 'Lisinopril', dosage: '10mg', instructions: 'Take once daily in the morning' },
  ]);

  // State for form
  const [form, setForm] = useState({ id: '', name: '', dosage: '', instructions: '' });
  const [isEditing, setIsEditing] = useState(false);

  // CRUD Functions
  const createMedication = () => {
    if (!form.name || !form.dosage || !form.instructions) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    const newMedication = {
      id: String(medications.length + 1),
      name: form.name,
      dosage: form.dosage,
      instructions: form.instructions,
    };
    setMedications([...medications, newMedication]);
    setForm({ id: '', name: '', dosage: '', instructions: '' });
    Alert.alert('Success', 'Medication added successfully');
  };

  const updateMedication = () => {
    if (!form.name || !form.dosage || !form.instructions) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setMedications(
      medications.map((med) =>
        med.id === form.id ? { ...med, name: form.name, dosage: form.dosage, instructions: form.instructions } : med
      )
    );
    setForm({ id: '', name: '', dosage: '', instructions: '' });
    setIsEditing(false);
    Alert.alert('Success', 'Medication updated successfully');
  };

  const deleteMedication = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this medication?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setMedications(medications.filter((med) => med.id !== id));
            Alert.alert('Success', 'Medication deleted successfully');
          },
        },
      ]
    );
  };

  const editMedication = (medication) => {
    setForm(medication);
    setIsEditing(true);
  };

  const resetForm = () => {
    setForm({ id: '', name: '', dosage: '', instructions: '' });
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ padding: 20 }}>
        {/* Title */}
        <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 4, color: colors.text }}>
          Medication Management
        </Text>
        <Text style={{ fontSize: 16, color: isDarkMode ? '#B0B0B0' : '#666666', marginBottom: 24 }}>
          Manage your medications
        </Text>

        {/* Form */}
        <View style={{
          backgroundColor: colors.card,
          borderRadius: 12,
          padding: 16,
          marginBottom: 24,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <TextInput
            style={{
              backgroundColor: isDarkMode ? '#333' : '#f0f0f0',
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
              color: colors.text,
            }}
            placeholder="Medication Name"
            placeholderTextColor={colors.textSecondary}
            value={form.name}
            onChangeText={(text) => setForm({ ...form, name: text })}
          />
          <TextInput
            style={{
              backgroundColor: isDarkMode ? '#333' : '#f0f0f0',
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
              color: colors.text,
            }}
            placeholder="Dosage (e.g., 100mg)"
            placeholderTextColor={colors.textSecondary}
            value={form.dosage}
            onChangeText={(text) => setForm({ ...form, dosage: text })}
          />
          <TextInput
            style={{
              backgroundColor: isDarkMode ? '#333' : '#f0f0f0',
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
              color: colors.text,
            }}
            placeholder="Instructions"
            placeholderTextColor={colors.textSecondary}
            value={form.instructions}
            onChangeText={(text) => setForm({ ...form, instructions: text })}
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: isEditing ? '#FF69B4' : '#4CAF50',
                borderRadius: 8,
                padding: 12,
                alignItems: 'center',
              }}
              onPress={isEditing ? updateMedication : createMedication}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{isEditing ? 'Update' : 'Add'} Medication</Text>
            </TouchableOpacity>
            {isEditing && (
              <TouchableOpacity
                style={{
                  flex: 1,
                  backgroundColor: '#e74c3c',
                  borderRadius: 8,
                  padding: 12,
                  alignItems: 'center',
                }}
                onPress={resetForm}
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Cancel</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Medication List */}
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: colors.text }}>
          Medications
        </Text>
        {medications.length > 0 ? (
          medications.map((medication) => (
            <View
              key={medication.id}
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
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>{medication.name}</Text>
                  <Text style={{ fontSize: 14, color: colors.textSecondary }}>{medication.dosage}</Text>
                  <Text style={{ fontSize: 14, color: colors.textSecondary }}>{medication.instructions}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity onPress={() => editMedication(medication)}>
                    <MaterialCommunityIcons name="pencil" size={24} color="#FF69B4" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteMedication(medication.id)}>
                    <MaterialCommunityIcons name="delete" size={24} color="#e74c3c" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        ) : (
          <View style={{
            alignItems: 'center',
            padding: 32,
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
            borderRadius: 12,
          }}>
            <MaterialCommunityIcons name="pill" size={48} color="#FF69B4" />
            <Text style={{ marginTop: 16, fontSize: 18, color: colors.text, textAlign: 'center' }}>
              No medications available
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}