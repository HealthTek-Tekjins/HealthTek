import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeartIcon, CalendarIcon, ExclamationCircleIcon, ChartBarIcon } from 'react-native-heroicons/solid';
import { useTheme } from '../context/ThemeContext';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';

export default function Dashboard({ navigation }) {
  const { colors } = useTheme();
  const { currentLanguage } = useLanguage();
  const t = translations[currentLanguage];

  // Dummy data for health metrics
  const healthMetrics = {
    heartRate: {
      current: 72,
      average: 68,
      trend: '+2',
      unit: 'bpm',
    },
    bloodPressure: {
      current: '120/80',
      average: '118/78',
      trend: 'Stable',
      unit: 'mmHg',
    },
    steps: {
      current: 8432,
      average: 7500,
      trend: '+932',
      unit: 'steps',
    },
    sleep: {
      current: '7h 30m',
      average: '7h 15m',
      trend: '+15m',
      unit: 'hours',
    },
  };

  // Dummy data for heart rate chart
  const heartRateData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [68, 72, 70, 69, 71, 73, 72],
        color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  // Dummy data for steps chart
  const stepsData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: [6500, 7200, 6800, 7500, 8200, 7800, 8432],
        color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const renderMetricCard = (title, data) => (
    <View style={{
      backgroundColor: colors.card,
      borderRadius: 12,
      padding: 16,
      width: '48%',
      marginBottom: 16,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3.84,
      elevation: 5,
    }}>
      <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 8 }}>{title}</Text>
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>{data.current}</Text>
        <Text style={{ fontSize: 14, color: colors.textSecondary, marginLeft: 4 }}>{data.unit}</Text>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
        <Text style={{ fontSize: 12, color: colors.textSecondary }}>Avg: {data.average}</Text>
        <Text style={{ 
          fontSize: 12, 
          fontWeight: '500',
          color: data.trend.startsWith('+') ? '#2ecc71' : '#e74c3c'
        }}>
          {data.trend}
        </Text>
      </View>
    </View>
  );

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
            source={require('../assets/images/RB.png')}
            style={{ width: 100, height: 150, resizeMode: 'contain', borderRadius: 20 }}
            accessibilityLabel="HealthTek Logo"
          />

          {/* Buttons Container */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 32 }}>
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
              accessibilityLabel={t.healthData}
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
              accessibilityLabel={t.appointments}
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
              accessibilityLabel={t.emergencySOS}
            >
              <ExclamationCircleIcon size={24} color={colors.error} />
            </TouchableOpacity>
          </View>

          {/* Button Labels */}
          <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16 }}>
            <Text style={{ width: 56, textAlign: 'center', fontSize: 12, fontWeight: '500', color: colors.textSecondary, marginHorizontal: 12 }}>
              {t.healthData}
            </Text>
            <Text style={{ width: 56, textAlign: 'center', fontSize: 12, fontWeight: '500', color: colors.textSecondary, marginHorizontal: 12 }}>
              {t.appointments}
            </Text>
            <Text style={{ width: 56, textAlign: 'center', fontSize: 12, fontWeight: '500', color: colors.textSecondary, marginHorizontal: 12 }}>
              {t.emergencySOS}
            </Text>
          </View>

          {/* Analytics Section */}
          <View style={{ width: '100%', marginTop: 32 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>
              {t.analytics}
            </Text>
            {/* Add your analytics components here */}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}