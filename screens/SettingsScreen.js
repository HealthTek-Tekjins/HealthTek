import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeftIcon, 
  BellIcon, 
  ShieldCheckIcon, 
  InformationCircleIcon,
  MoonIcon,
  SunIcon
} from 'react-native-heroicons/solid';

export default function SettingsScreen({ navigation }) {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: colors.border }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{ marginRight: 16 }}
        >
          <ArrowLeftIcon size={24} color={colors.primary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 24, fontWeight: 'bold', color: colors.text }}>Settings</Text>
      </View>

      {/* Main Content */}
      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* User Profile Section */}
        <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 8 }}>Profile</Text>
          <Text style={{ color: colors.textSecondary }}>{user?.email}</Text>
        </View>

        {/* App Settings Section */}
        <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16 }}>App Settings</Text>
          
          {/* Dark Mode Toggle */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {isDarkMode ? (
                <MoonIcon size={24} color={colors.primary} style={{ marginRight: 12 }} />
              ) : (
                <SunIcon size={24} color={colors.primary} style={{ marginRight: 12 }} />
              )}
              <Text style={{ color: colors.text, fontSize: 16 }}>Dark Mode</Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={toggleTheme}
              trackColor={{ false: '#767577', true: colors.primary }}
              thumbColor={isDarkMode ? '#FFFFFF' : '#FFFFFF'}
            />
          </View>

          {/* Notifications */}
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
            <BellIcon size={24} color={colors.primary} style={{ marginRight: 12 }} />
            <Text style={{ color: colors.text, fontSize: 16 }}>Notifications</Text>
          </TouchableOpacity>
        </View>

        {/* Privacy & Security Section */}
        <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16 }}>Privacy & Security</Text>
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}
            onPress={() => navigation.navigate('PrivacySettings')}
          >
            <ShieldCheckIcon size={24} color={colors.primary} style={{ marginRight: 12 }} />
            <Text style={{ color: colors.text, fontSize: 16 }}>Privacy Settings</Text>
          </TouchableOpacity>
        </View>

        {/* About Section */}
        <View style={{ backgroundColor: colors.card, borderRadius: 12, padding: 16, marginBottom: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: '600', color: colors.text, marginBottom: 16 }}>About</Text>
          <TouchableOpacity 
            style={{ flexDirection: 'row', alignItems: 'center' }}
            onPress={() => navigation.navigate('About')}
          >
            <InformationCircleIcon size={24} color={colors.primary} style={{ marginRight: 12 }} />
            <Text style={{ color: colors.text, fontSize: 16 }}>About App</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity 
          style={{ 
            backgroundColor: colors.error,
            borderRadius: 12,
            padding: 16,
            alignItems: 'center',
            marginTop: 16
          }}
          onPress={() => navigation.navigate('Logout')}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '600' }}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}