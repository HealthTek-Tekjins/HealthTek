import { View, Text, Switch, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Back Button */}
      <View className="flex-row justify-start p-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-tr-2xl rounded-bl-2xl bg-gray-200"
          accessibilityLabel="Go back to previous screen"
        >
          <ArrowLeftIcon size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center items-center p-6">
        <Text className="text-3xl font-bold text-center text-[#2A2A72] mb-10">Settings</Text>
        <View className="w-full max-w-md bg-gray-50 p-6 rounded-2xl shadow-lg mb-8">
          <View className="flex-row justify-between items-center">
            <Text className="text-lg font-medium text-gray-800">Notifications</Text>
            <Switch
              className="h-6 w-12"
              trackColor={{ false: '#D1D5DB', true: '#1E90FF' }}
              thumbColor={true ? '#FFFFFF' : '#9CA3AF'}
              accessibilityLabel="Toggle notifications"
            />
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')}
          className="py-4 bg-[#1E90FF] rounded-xl w-4/5 mb-6 shadow-md active:bg-[#1C86EE]"
          accessibilityLabel="Manage privacy settings"
        >
          <Text className="text-xl font-semibold text-white text-center">Privacy Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {/* Logout Logic */}}
          className="py-4 bg-[#1E90FF] rounded-xl w-4/5 shadow-md active:bg-[#1C86EE]"
          accessibilityLabel="Log out of the app"
        >
          <Text className="text-xl font-semibold text-white text-center">Log Out</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}