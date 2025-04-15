import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function DoctorManagement({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  // Dummy data for doctors
  const [doctors, setDoctors] = useState([
    { id: '1', name: 'Dr. John Smith', specialty: 'Cardiology', contact: 'john.smith@example.com' },
    { id: '2', name: 'Dr. Emily Brown', specialty: 'Pediatrics', contact: 'emily.brown@example.com' },
    { id: '3', name: 'Dr. Michael Lee', specialty: 'Neurology', contact: 'michael.lee@example.com' },
  ]);

  // State for form
  const [form, setForm] = useState({ id: '', name: '', specialty: '', contact: '' });
  const [isEditing, setIsEditing] = useState(false);

  // CRUD Functions
  const createDoctor = () => {
    if (!form.name || !form.specialty || !form.contact) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    const newDoctor = {
      id: String(doctors.length + 1),
      name: form.name,
      specialty: form.specialty,
      contact: form.contact,
    };
    setDoctors([...doctors, newDoctor]);
    setForm({ id: '', name: '', specialty: '', contact: '' });
    Alert.alert('Success', 'Doctor added successfully');
  };

  const updateDoctor = () => {
    if (!form.name || !form.specialty || !form.contact) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }
    setDoctors(
      doctors.map((doc) =>
        doc.id === form.id ? { ...doc, name: form.name, specialty: form.specialty, contact: form.contact } : doc
      )
    );
    setForm({ id: '', name: '', specialty: '', contact: '' });
    setIsEditing(false);
    Alert.alert('Success', 'Doctor updated successfully');
  };

  const deleteDoctor = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this doctor?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setDoctors(doctors.filter((doc) => doc.id !== id));
            Alert.alert('Success', 'Doctor deleted successfully');
          },
        },
      ]
    );
  };

  const editDoctor = (doctor) => {
    setForm(doctor);
    setIsEditing(true);
  };

  const resetForm = () => {
    setForm({ id: '', name: '', specialty: '', contact: '' });
    setIsEditing(false);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView style={{ padding: 20 }}>
        {/* Title */}
        <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 4, color: colors.text }}>
          Doctor Management
        </Text>
        <Text style={{ fontSize: 16, color: isDarkMode ? '#B0B0B0' : '#666666', marginBottom: 24 }}>
          Manage your doctors
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
            placeholder="Doctor Name"
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
            placeholder="Specialty"
            placeholderTextColor={colors.textSecondary}
            value={form.specialty}
            onChangeText={(text) => setForm({ ...form, specialty: text })}
          />
          <TextInput
            style={{
              backgroundColor: isDarkMode ? '#333' : '#f0f0f0',
              borderRadius: 8,
              padding: 12,
              marginBottom: 12,
              color: colors.text,
            }}
            placeholder="Contact Email"
            placeholderTextColor={colors.textSecondary}
            value={form.contact}
            onChangeText={(text) => setForm({ ...form, contact: text })}
            keyboardType="email-address"
          />
          <View style={{ flexDirection: 'row', gap: 12 }}>
            <TouchableOpacity
              style={{
                flex: 1,
                backgroundColor: isEditing ? '#FF69B4' : '#FF69B4',
                borderRadius: 8,
                padding: 12,
                alignItems: 'center',
              }}
              onPress={isEditing ? updateDoctor : createDoctor}
            >
              <Text style={{ color: 'white', fontWeight: 'bold' }}>{isEditing ? 'Update' : 'Add'} Doctor</Text>
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

        {/* Doctor List */}
        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: colors.text }}>
          Doctors
        </Text>
        {doctors.length > 0 ? (
          doctors.map((doctor) => (
            <View
              key={doctor.id}
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
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: colors.text }}>{doctor.name}</Text>
                  <Text style={{ fontSize: 14, color: colors.textSecondary }}>{doctor.specialty}</Text>
                  <Text style={{ fontSize: 14, color: colors.textSecondary }}>{doctor.contact}</Text>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity onPress={() => editDoctor(doctor)}>
                    <MaterialCommunityIcons name="pencil" size={24} color="#FF69B4" />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => deleteDoctor(doctor.id)}>
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
            <MaterialCommunityIcons name="doctor" size={48} color="#FF69B4" />
            <Text style={{ marginTop: 16, fontSize: 18, color: colors.text, textAlign: 'center' }}>
              No doctors available
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}