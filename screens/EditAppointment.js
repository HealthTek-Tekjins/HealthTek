import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { auth } from '../config/firebase';

export default function EditAppointment() {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, isDarkMode } = useTheme();
  const { appointment, onUpdate } = route.params;

  const [formData, setFormData] = useState({
    doctorName: appointment.doctorName,
    specialty: appointment.specialty,
    date: appointment.date,
    time: appointment.time,
    location: appointment.location,
    phone: appointment.phone,
    notes: appointment.notes || ''
  });

  const handleSubmit = async () => {
    try {
      // Validate required fields
      if (!formData.doctorName || !formData.specialty || !formData.location || !formData.phone) {
        Alert.alert('Error', 'Please fill in all required fields');
        return;
      }

      const updatedData = {
        ...formData,
        status: 'scheduled'
      };

      await onUpdate(appointment.id, updatedData);
      navigation.goBack();
    } catch (error) {
      console.error('Error updating appointment:', error);
      Alert.alert('Error', 'Failed to update appointment. Please try again.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#ffffff', '#f0f0f0']}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex-1 p-4">
          <View className="space-y-4">
            <Text style={{ color: colors.text }} className="text-2xl font-bold mb-6">
              Edit Appointment
            </Text>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2">
                Doctor Name *
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                value={formData.doctorName}
                onChangeText={(text) => setFormData({ ...formData, doctorName: text })}
                placeholder="Enter doctor's name"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2">
                Specialty *
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                value={formData.specialty}
                onChangeText={(text) => setFormData({ ...formData, specialty: text })}
                placeholder="Enter specialty"
                placeholderTextColor={colors.textSecondary}
              />
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
                Location *
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                value={formData.location}
                onChangeText={(text) => setFormData({ ...formData, location: text })}
                placeholder="Enter location"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View>
              <Text style={{ color: colors.text }} className="text-base mb-2">
                Phone Number *
              </Text>
              <TextInput
                style={[styles.input, { backgroundColor: colors.card, color: colors.text }]}
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
                placeholder="Enter phone number"
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
                Update Appointment
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
}); 