import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeartIcon, CalendarIcon, ExclamationCircleIcon } from 'react-native-heroicons/solid';
import { useTheme } from '../context/ThemeContext';

export default function Dashboard({ navigation }) {
  const { colors } = useTheme();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Dashboard Title */}
      <View style={{ paddingTop: 48, paddingBottom: 24 }}>
        <Text style={{ fontSize: 36, fontWeight: 'bold', textAlign: 'center', color: colors.text }}>Dashboard</Text>
      </View>

      {/* Main Content */}
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
        {/* TJ Logo */}
        <Image
          source={require('../assets/images/RB.png')}
          style={{ width: 100, height: 150, resizeMode: 'contain', borderRadius: 20 }}
          accessibilityLabel="HealthTek Logo"
        />

        {/* Buttons in Small Rounded Squares */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 40 }}>
          {/* Input Health Data Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('HealthData')}
            style={{
              width: 56,
              height: 56,
              backgroundColor: colors.card,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            accessibilityLabel="Navigate to input health data"
          >
            <HeartIcon size={24} color={colors.primary} />
          </TouchableOpacity>

          {/* Book Appointment Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Appointment')}
            style={{
              width: 56,
              height: 56,
              backgroundColor: colors.card,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            accessibilityLabel="Book an appointment"
          >
            <CalendarIcon size={24} color={colors.primary} />
          </TouchableOpacity>

          {/* SOS Emergency Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Emergency')}
            style={{
              width: 56,
              height: 56,
              backgroundColor: colors.card,
              borderRadius: 8,
              justifyContent: 'center',
              alignItems: 'center',
              marginHorizontal: 12,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 3,
            }}
            accessibilityLabel="Emergency SOS button"
          >
            <ExclamationCircleIcon size={24} color={colors.error} />
          </TouchableOpacity>
        </View>

        {/* Button Labels */}
        <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
          <Text style={{ width: 56, textAlign: 'center', fontSize: 12, fontWeight: '500', color: colors.textSecondary, marginHorizontal: 12 }}>Health Data</Text>
          <Text style={{ width: 56, textAlign: 'center', fontSize: 12, fontWeight: '500', color: colors.textSecondary, marginHorizontal: 12 }}>Appointment</Text>
          <Text style={{ width: 56, textAlign: 'center', fontSize: 12, fontWeight: '500', color: colors.textSecondary, marginHorizontal: 12 }}>SOS</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}