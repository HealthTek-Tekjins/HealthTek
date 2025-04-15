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

// import { View, Text, TouchableOpacity, Image, ScrollView, Dimensions } from 'react-native';
// import React from 'react';
// import { SafeAreaView } from 'react-native-safe-area-context';
// import { HeartIcon, CalendarIcon, ExclamationCircleIcon, ChartBarIcon } from 'react-native-heroicons/solid';
// import { MaterialCommunityIcons } from '@expo/vector-icons';
// import { useTheme } from '../context/ThemeContext';
// import { LineChart, BarChart } from 'react-native-chart-kit';
// import { useLanguage } from '../context/LanguageContext';
// import { translations } from '../translations';

// export default function Dashboard({ navigation }) {
//   const { colors, isDarkMode } = useTheme();
//   const { currentLanguage } = useLanguage();
//   const t = translations[currentLanguage];

//   // Dummy data for health metrics
//   const healthMetrics = {
//     heartRate: {
//       current: 72,
//       average: 68,
//       trend: '+2',
//       unit: 'bpm',
//     },
//     bloodPressure: {
//       current: '120/80',
//       average: '118/78',
//       trend: 'Stable',
//       unit: 'mmHg',
//     },
//     steps: {
//       current: 8432,
//       average: 7500,
//       trend: '+932',
//       unit: 'steps',
//     },
//     sleep: {
//       current: '7h 30m',
//       average: '7h 15m',
//       trend: '+15m',
//       unit: 'hours',
//     },
//   };

//   // Dummy data for heart rate chart
//   const heartRateData = {
//     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//     datasets: [
//       {
//         data: [68, 72, 70, 69, 71, 73, 72],
//         color: (opacity = 1) => `rgba(255, 99, 71, ${opacity})`,
//         strokeWidth: 2,
//       },
//     ],
//   };

//   // Dummy data for steps chart
//   const stepsData = {
//     labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
//     datasets: [
//       {
//         data: [6500, 7200, 6800, 7500, 8200, 7800, 8432],
//         color: (opacity = 1) => `rgba(46, 204, 113, ${opacity})`,
//         strokeWidth: 2,
//       },
//     ],
//   };

//   // Hardcoded appointments data
//   const appointments = [
//     {
//       id: '1',
//       patientName: 'John Doe',
//       date: '2024-04-20',
//       time: '10:00 AM',
//       type: 'Follow-up',
//       doctor: 'Dr. Smith',
//       notes: 'Regular check for diabetes and blood pressure'
//     },
//     {
//       id: '2',
//       patientName: 'Jane Smith',
//       date: '2024-04-05',
//       time: '09:00 AM',
//       type: 'Check-up',
//       doctor: 'Dr. Brown',
//       notes: 'Annual physical examination'
//     },
//     {
//       id: '3',
//       patientName: 'Robert Johnson',
//       date: '2024-04-25',
//       time: '01:00 PM',
//       type: 'Lab Test',
//       doctor: 'Dr. Wilson',
//       notes: 'Cholesterol level check'
//     }
//   ];

//   const renderMetricCard = (title, data) => (
//     <View style={{
//       backgroundColor: colors.card,
//       borderRadius: 12,
//       padding: 16,
//       width: '48%',
//       marginBottom: 16,
//       shadowColor: '#000',
//       shadowOffset: { width: 0, height: 2 },
//       shadowOpacity: 0.1,
//       shadowRadius: 3.84,
//       elevation: 5,
//     }}>
//       <Text style={{ fontSize: 14, color: colors.textSecondary, marginBottom: 8 }}>{title}</Text>
//       <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
//         <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>{data.current}</Text>
//         <Text style={{ fontSize: 14, color: colors.textSecondary, marginLeft: 4 }}>{data.unit}</Text>
//       </View>
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
//         <Text style={{ fontSize: 12, color: colors.textSecondary }}>Avg: {data.average}</Text>
//         <Text style={{ 
//           fontSize: 12, 
//           fontWeight: '500',
//           color: data.trend.startsWith('+') ? '#2ecc71' : '#e74c3c'
//         }}>
//           {data.trend}
//         </Text>
//       </View>
//     </View>
//   );

//   const renderAppointmentCard = (appointment) => (
//     <View 
//       key={appointment.id}
//       style={{
//         backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
//         borderRadius: 12,
//         padding: 16,
//         marginBottom: 16,
//         shadowColor: '#FF69B4',
//         shadowOffset: { width: 0, height: 2 },
//         shadowOpacity: 0.1,
//         shadowRadius: 4,
//         elevation: 3,
//       }}
//     >
//       <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
//         <View>
//           <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4, color: colors.text }}>
//             {appointment.patientName}
//           </Text>
//           <Text style={{ fontSize: 14, color: colors.textSecondary }}>
//             {appointment.type}
//           </Text>
//         </View>
//         <View style={{
//           backgroundColor: isDarkMode ? 'rgba(255,105,180,0.15)' : 'rgba(255,105,180,0.1)',
//           padding: 8,
//           borderRadius: 8,
//           alignItems: 'center'
//         }}>
//           <Text style={{ fontSize: 14, fontWeight: '600', marginBottom: 2, color: '#FF69B4' }}>
//             {appointment.date}
//           </Text>
//           <Text style={{ fontSize: 12, fontWeight: '500', color: '#FF69B4' }}>
//             {appointment.time}
//           </Text>
//         </View>
//       </View>

//       <View style={{ height: 1, backgroundColor: 'rgba(128, 128, 128, 0.2)', marginVertical: 12 }} />

//       <View style={{ gap: 8 }}>
//         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//           <MaterialCommunityIcons name="doctor" size={20} color="#FF69B4" />
//           <Text style={{ fontSize: 14, flex: 1, color: colors.text }}>
//             {appointment.doctor}
//           </Text>
//         </View>
//         <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
//           <MaterialCommunityIcons name="note-text" size={20} color="#FF69B4" />
//           <Text style={{ fontSize: 14, flex: 1, color: colors.textSecondary }}>
//             {appointment.notes}
//           </Text>
//         </View>
//       </View>
//     </View>
//   );

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
//       <ScrollView style={{ flex: 1 }}>
//         <View style={{ padding: 20 }}>
//           {/* Dashboard Title */}
//           <Text style={{ fontSize: 32, fontWeight: 'bold', marginBottom: 4, color: colors.text }}>
//             Dashboard
//           </Text>
//           <Text style={{ fontSize: 16, color: isDarkMode ? '#B0B0B0' : '#666666', marginBottom: 24 }}>
//             Manage your practice
//           </Text>

//           {/* Quick Actions */}
//           <View style={{ flexDirection: 'row', gap: 12, marginBottom: 32 }}>
//             <TouchableOpacity
//               onPress={() => navigation.navigate('CreatePrescription')}
//               style={{
//                 flex: 1,
//                 backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
//                 borderRadius: 12,
//                 padding: 20,
//                 alignItems: 'center',
//                 shadowColor: '#FF69B4',
//                 shadowOffset: { width: 0, height: 2 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 4,
//                 elevation: 3,
//               }}
//             >
//               <MaterialCommunityIcons name="prescription" size={24} color="#FF69B4" />
//               <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>
//                 Create Prescription
//               </Text>
//             </TouchableOpacity>

//             <TouchableOpacity
//               onPress={() => navigation.navigate('ManagePatients')}
//               style={{
//                 flex: 1,
//                 backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
//                 borderRadius: 12,
//                 padding: 20,
//                 alignItems: 'center',
//                 shadowColor: '#FF69B4',
//                 shadowOffset: { width: 0, height: 2 },
//                 shadowOpacity: 0.1,
//                 shadowRadius: 4,
//                 elevation: 3,
//               }}
//             >
//               <MaterialCommunityIcons name="account-group" size={24} color="#FF69B4" />
//               <Text style={{ marginTop: 8, fontSize: 16, color: colors.text }}>
//                 Manage Patients
//               </Text>
//             </TouchableOpacity>
//           </View>

//           {/* Upcoming Appointments Section */}
//           <View>
//             <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 16, color: colors.text }}>
//               Upcoming Appointments
//             </Text>
//             {appointments.length > 0 ? (
//               appointments.map(renderAppointmentCard)
//             ) : (
//               <View style={{ 
//                 alignItems: 'center', 
//                 padding: 32,
//                 backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
//                 borderRadius: 12,
//               }}>
//                 <MaterialCommunityIcons name="calendar-blank" size={48} color="#FF69B4" />
//                 <Text style={{ 
//                   marginTop: 16, 
//                   fontSize: 18, 
//                   color: colors.text,
//                   textAlign: 'center' 
//                 }}>
//                   No upcoming appointments
//                 </Text>
//               </View>
//             )}
//           </View>
//         </View>
//       </ScrollView>
//     </SafeAreaView>
//   );
// }