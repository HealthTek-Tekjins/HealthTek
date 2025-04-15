import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  StyleSheet,
  Platform,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { Picker } from '@react-native-picker/picker';

export default function AddAppointment() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, isDarkMode } = useTheme();
  const { onCreate } = route.params;
  const [loading, setLoading] = useState(true);
  const [doctors, setDoctors] = useState([]);

  const [formData, setFormData] = useState({
    doctorId: '',
    doctorName: '',
    specialty: '',
    date: new Date().toISOString().split('T')[0],
    time: '12:00',
    location: '',
    phone: '',
    notes: ''
  });

  useEffect(() => {
    fetchDoctors();
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
    } finally {
      setLoading(false);
    }
  };

  const handleDoctorSelect = (doctorId) => {
    const selectedDoctor = doctors.find(doc => doc.id === doctorId);
    if (selectedDoctor) {
      let formattedLocation = 'Location not available';
      
      if (selectedDoctor.location) {
        const location = selectedDoctor.location;
        const addressParts = [];
        
        if (location.address) addressParts.push(location.address);
        if (location.city) addressParts.push(location.city);
        if (location.country) addressParts.push(location.country);
        
        if (addressParts.length > 0) {
          formattedLocation = addressParts.join(', ');
        }
      }
      
      setFormData({
        ...formData,
        doctorId: doctorId,
        doctorName: selectedDoctor.fullName || 'Unknown',
        specialty: selectedDoctor.specialization || 'Not specified',
        location: formattedLocation
      });
    }
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.doctorId || !formData.date || !formData.time || !formData.phone) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      const appointmentData = {
        ...formData,
        patientId: auth.currentUser.uid,
        patientName: auth.currentUser.displayName || auth.currentUser.email,
        status: 'scheduled',
        createdAt: new Date().toISOString()
      };

      await onCreate(appointmentData);
      navigation.goBack();
    } catch (error) {
      console.error('Error creating appointment:', error);
      Alert.alert('Error', 'Failed to create appointment. Please try again.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#FF69B4" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#ffffff', '#f0f0f0']}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex-1 p-4">
          <View className="space-y-4">
            <Text style={{ color: colors.text }} className="text-2xl font-bold mb-6">
              Schedule Appointment
            </Text>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2">
                Select Doctor *
              </Text>
              <View
                style={[
                  styles.pickerContainer,
                  { 
                    backgroundColor: isDarkMode ? '#2d2d2d' : '#f5f5f5',
                    borderWidth: 1,
                    borderColor: isDarkMode ? '#404040' : '#e0e0e0'
                  }
                ]}
              >
                <Picker
                  selectedValue={formData.doctorId}
                  onValueChange={handleDoctorSelect}
                  style={[
                    styles.picker,
                    { 
                      color: colors.text,
                      backgroundColor: 'transparent'
                    }
                  ]}
                  dropdownIconColor={isDarkMode ? '#FFFFFF' : '#000000'}
                  mode="dropdown"
                >
                  <Picker.Item 
                    label="Select a doctor" 
                    value="" 
                    style={{
                      fontSize: 16,
                      color: isDarkMode ? '#B0B0B0' : '#666666'
                    }}
                  />
                  {doctors.map(doctor => (
                    <Picker.Item
                      key={doctor.id}
                      label={`${doctor.fullName} (${doctor.specialization})`}
                      value={doctor.id}
                      style={{
                        fontSize: 16,
                        color: colors.text
                      }}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2">
                Date *
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                value={formData.date}
                onChangeText={(text) => setFormData({ ...formData, date: text })}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2">
                Time *
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                value={formData.time}
                onChangeText={(text) => setFormData({ ...formData, time: text })}
                placeholder="HH:MM"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2">
                Location
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                value={formData.location}
                editable={false}
                placeholder="Location will be auto-populated"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2">
                Your Phone Number *
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Enter your phone number"
                placeholderTextColor={colors.textSecondary}
                keyboardType="phone-pad"
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2">
                Notes
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  { backgroundColor: colors.card, color: colors.text }
                ]}
                value={formData.notes}
                onChangeText={(text) => setFormData({ ...formData, notes: text })}
                placeholder="Enter any additional notes"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={4}
              />
            </View>

            <TouchableOpacity
              onPress={handleSubmit}
              className="mt-6 bg-[#FF69B4] py-4 rounded-xl"
              style={{
                shadowColor: '#FF69B4',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Text className="text-white text-center font-semibold text-lg">
                Schedule Appointment
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  input: {
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  pickerContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: 'transparent',
    marginBottom: 8,
  },
  picker: {
    ...Platform.select({
      ios: {
        height: 150,
        backgroundColor: 'transparent',
      },
      android: {
        height: 50,
        backgroundColor: 'transparent',
        color: '#FFFFFF',
      },
    }),
  },
}); 