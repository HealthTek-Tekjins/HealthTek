import React from 'react';
import { View, Text, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PrivacySettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        <View className="py-4">
          <Text className="text-2xl font-bold text-gray-800 mb-6">Privacy Settings</Text>
          
          {/* Data Collection */}
          <View className="bg-gray-50 p-4 rounded-lg mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-medium text-gray-800">Data Collection</Text>
              <Switch
                trackColor={{ false: '#D1D5DB', true: '#1E90FF' }}
                thumbColor={true ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            <Text className="text-gray-600">Allow app to collect usage data</Text>
          </View>

          {/* Location Services */}
          <View className="bg-gray-50 p-4 rounded-lg mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-medium text-gray-800">Location Services</Text>
              <Switch
                trackColor={{ false: '#D1D5DB', true: '#1E90FF' }}
                thumbColor={true ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            <Text className="text-gray-600">Allow app to access your location</Text>
          </View>

          {/* Health Data */}
          <View className="bg-gray-50 p-4 rounded-lg mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-medium text-gray-800">Health Data</Text>
              <Switch
                trackColor={{ false: '#D1D5DB', true: '#1E90FF' }}
                thumbColor={true ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            <Text className="text-gray-600">Allow app to access health data</Text>
          </View>

          {/* Data Sharing */}
          <View className="bg-gray-50 p-4 rounded-lg mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-lg font-medium text-gray-800">Data Sharing</Text>
              <Switch
                trackColor={{ false: '#D1D5DB', true: '#1E90FF' }}
                thumbColor={true ? '#FFFFFF' : '#9CA3AF'}
              />
            </View>
            <Text className="text-gray-600">Allow sharing of anonymous data</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 