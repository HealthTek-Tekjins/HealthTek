import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function AdminDashboard({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView>
        {/* Dashboard Title */}
        <View style={{ paddingTop: 48, paddingBottom: 24 }}>
          <Text style={{ fontSize: 36, fontWeight: 'bold', textAlign: 'center', color: colors.text }}>
            Admin Dashboard
          </Text>
          <Text style={{ fontSize: 16, color: isDarkMode ? '#B0B0B0' : '#666666', textAlign: 'center' }}>
            Manage your healthcare system
          </Text>
        </View>

        {/* Main Content */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          {/* Buttons Container */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 32 }}>
            {/* Patient Management Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('PatientManagement')}
              style={{
                width: 80,
                height: 80,
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 12,
                shadowColor: '#FF69B4',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              accessibilityLabel="Patient Management"
            >
              <MaterialCommunityIcons name="account-group" size={32} color="#FF69B4" />
            </TouchableOpacity>

            {/* Doctor Management Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('DoctorManagement')}
              style={{
                width: 80,
                height: 80,
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 12,
                shadowColor: '#FF69B4',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              accessibilityLabel="Doctor Management"
            >
              <MaterialCommunityIcons name="doctor" size={32} color="#FF69B4" />
            </TouchableOpacity>

            {/* Medication Management Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('MedicationManagement')}
              style={{
                width: 80,
                height: 80,
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                marginHorizontal: 12,
                shadowColor: '#FF69B4',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              accessibilityLabel="Medication Management"
            >
              <MaterialCommunityIcons name="pill" size={32} color="#FF69B4" />
            </TouchableOpacity>
          </View>

          {/* Button Labels */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
            <Text
              style={{
                width: 80,
                textAlign: 'center',
                fontSize: 12,
                fontWeight: '500',
                color: colors.textSecondary,
                marginHorizontal: 12,
              }}
            >
              Patient Management
            </Text>
            <Text
              style={{
                width: 80,
                textAlign: 'center',
                fontSize: 12,
                fontWeight: '500',
                color: colors.textSecondary,
                marginHorizontal: 12,
              }}
            >
              Doctor Management
            </Text>
            <Text
              style={{
                width: 80,
                textAlign: 'center',
                fontSize: 12,
                fontWeight: '500',
                color: colors.textSecondary,
                marginHorizontal: 12,
              }}
            >
              Medication Management
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}