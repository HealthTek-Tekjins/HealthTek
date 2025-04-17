import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeartIcon, CalendarIcon, ExclamationCircleIcon } from 'react-native-heroicons/solid';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function Dashboard({ navigation }) {
  const { colors, isDarkMode } = useTheme();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView>
        {/* Dashboard Title */}
        <View style={{ paddingTop: 48, paddingBottom: 24 }}>
          <Text style={{ fontSize: 36, fontWeight: 'bold', textAlign: 'center', color: colors.text }}>
            {t.dashboard}
          </Text>
        </View>

        {/* Main Content */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          {/* TJ Logo */}
          <Image
            source={require('../assets/images/UL.png')}
            style={{ width: 100, height: 150, resizeMode: 'contain', borderRadius: 20 }}
            accessibilityLabel="HealthTek Logo"
          />

          {/* Buttons Container */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginTop: 32,
            gap: 24 
          }}>
            {/* Input Health Data Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('HealthData')}
              style={{
                width: 80,
                height: 80,
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#FF69B4',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              accessibilityLabel={t.healthData}
            >
              <HeartIcon size={32} color="#FF69B4" />
            </TouchableOpacity>

            {/* Book Appointment Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Appointment')}
              style={{
                width: 80,
                height: 80,
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#FF69B4',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              accessibilityLabel={t.appointments}
            >
              <CalendarIcon size={32} color="#FF69B4" />
            </TouchableOpacity>

            {/* SOS Emergency Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Emergency')}
              style={{
                width: 80,
                height: 80,
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                borderRadius: 16,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#FF69B4',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
                elevation: 3,
              }}
              accessibilityLabel={t.emergencySOS}
            >
              <ExclamationCircleIcon size={32} color="#FF69B4" />
            </TouchableOpacity>
          </View>

          {/* Button Labels */}
          <View style={{ 
            flexDirection: 'row', 
            justifyContent: 'center', 
            alignItems: 'center', 
            marginTop: 16,
            gap: 24 
          }}>
            <Text style={{ 
              width: 80, 
              textAlign: 'center', 
              fontSize: 12, 
              fontWeight: '500', 
              color: colors.textSecondary 
            }}>
              {t.healthData}
            </Text>
            <Text style={{ 
              width: 80, 
              textAlign: 'center', 
              fontSize: 12, 
              fontWeight: '500', 
              color: colors.textSecondary 
            }}>
              {t.appointments}
            </Text>
            <Text style={{ 
              width: 80, 
              textAlign: 'center', 
              fontSize: 12, 
              fontWeight: '500', 
              color: colors.textSecondary 
            }}>
              {t.emergencySOS}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}