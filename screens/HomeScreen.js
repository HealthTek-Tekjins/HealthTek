import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  HeartIcon, 
  ChartBarIcon, 
  BellIcon, 
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  ChevronRightIcon
} from 'react-native-heroicons/solid';

export default function HomeScreen({ navigation }) {
  const { colors } = useTheme();
  const { user } = useAuth();

  // Mock data for health insights
  const healthInsights = [
    { type: 'Heart Rate', value: '72', unit: 'bpm', trend: 'up', change: '+2' },
    { type: 'Blood Pressure', value: '120/80', unit: 'mmHg', trend: 'stable', change: '0' },
    { type: 'Steps', value: '8,547', unit: 'steps', trend: 'up', change: '+1,234' },
  ];

  const quickActions = [
    { title: 'Record Health Data', icon: HeartIcon, screen: 'HealthData' },
    { title: 'View Analytics', icon: ChartBarIcon, screen: 'Analytics' },
    { title: 'Upcoming Appointments', icon: CalendarIcon, screen: 'Appointment' },
    { title: 'Health Notifications', icon: BellIcon, screen: 'Notifications' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border
      }}>
        <View>
          <Text style={{ fontSize: 14, color: colors.textSecondary }}>Welcome back,</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>
            {user?.email?.split('@')[0] || 'User'}
          </Text>
        </View>
        <TouchableOpacity 
          style={{ 
            backgroundColor: colors.card,
            padding: 8,
            borderRadius: 20,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <BellIcon size={24} color={colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Health Insights Card */}
        <View style={{ 
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>
            Today's Health Insights
          </Text>
          {healthInsights.map((insight, index) => (
            <View key={index} style={{ 
              flexDirection: 'row', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              marginBottom: 12,
              paddingBottom: 12,
              borderBottomWidth: index < healthInsights.length - 1 ? 1 : 0,
              borderBottomColor: colors.border
            }}>
              <View>
                <Text style={{ fontSize: 16, color: colors.text }}>{insight.type}</Text>
                <Text style={{ fontSize: 14, color: colors.textSecondary }}>
                  {insight.value} {insight.unit}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {insight.trend === 'up' ? (
                  <ArrowTrendingUpIcon size={20} color={colors.success} />
                ) : insight.trend === 'down' ? (
                  <ArrowTrendingDownIcon size={20} color={colors.error} />
                ) : null}
                <Text style={{ 
                  fontSize: 14, 
                  color: insight.trend === 'up' ? colors.success : 
                         insight.trend === 'down' ? colors.error : 
                         colors.textSecondary,
                  marginLeft: 4
                }}>
                  {insight.change}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Quick Actions Grid */}
        <View style={{ marginBottom: 16 }}>
          <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text, marginBottom: 16 }}>
            Quick Actions
          </Text>
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            justifyContent: 'space-between',
            gap: 12
          }}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => navigation.navigate(action.screen)}
                style={{
                  width: '47%',
                  backgroundColor: colors.card,
                  borderRadius: 12,
                  padding: 16,
                  alignItems: 'center',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <action.icon size={32} color={colors.primary} style={{ marginBottom: 8 }} />
                <Text style={{ 
                  color: colors.text, 
                  fontSize: 14, 
                  textAlign: 'center',
                  fontWeight: '500'
                }}>
                  {action.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Health Tips Section */}
        <View style={{ 
          backgroundColor: colors.card,
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: colors.text }}>
              Health Tips
            </Text>
            <TouchableOpacity>
              <ChevronRightIcon size={24} color={colors.primary} />
            </TouchableOpacity>
          </View>
          <Text style={{ color: colors.textSecondary, fontSize: 14, lineHeight: 20 }}>
            Stay hydrated throughout the day. Aim to drink at least 8 glasses of water daily to maintain optimal health and energy levels.
          </Text>
        </View>

        {/* Emergency Section */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Emergency')}
          style={{
            backgroundColor: colors.error,
            borderRadius: 16,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
        >
          <View>
            <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: 'bold', marginBottom: 4 }}>
              Emergency SOS
            </Text>
            <Text style={{ color: '#FFFFFF', opacity: 0.8, fontSize: 14 }}>
              Tap for emergency assistance
            </Text>
          </View>
          <ChevronRightIcon size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}