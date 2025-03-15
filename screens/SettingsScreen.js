import { View, Text, Switch, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ShieldCheckIcon, ArrowRightOnRectangleIcon, InformationCircleIcon } from 'react-native-heroicons/solid';

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Settings Title in Top Right Corner */}
      <View className="pr-4 pt-4">
        <Text className="text-4xl font-bold text-black text-center">Settings</Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center items-center px-6">
        {/* Notifications Section */}
        <View className="w-full max-w-md bg-[#F5F5F7] p-6 rounded-2xl shadow-lg mb-10">
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

        {/* Buttons in Small Rounded Squares */}
        <View className="flex-row justify-center items-center space-x-6">
          {/* Privacy Settings Button */}
          <TouchableOpacity
            className="w-14 h-14 bg-[#F5F5F7] rounded-lg justify-center items-center shadow-md active:bg-gray-200"
            accessibilityLabel="Manage privacy settings"
          >
            <ShieldCheckIcon size={24} color="#007AFF" />
          </TouchableOpacity>

          {/* About Page Button */}
          <TouchableOpacity
            className="w-14 h-14 bg-[#F5F5F7] rounded-lg justify-center items-center shadow-md active:bg-gray-200"
            accessibilityLabel="Navigate to about page"
          >
            <InformationCircleIcon size={24} color="#007AFF" />
          </TouchableOpacity>

          {/* Log Out Button */}
          <TouchableOpacity
            className="w-14 h-14 bg-[#F5F5F7] rounded-lg justify-center items-center shadow-md active:bg-gray-200"
            accessibilityLabel="Log out of the app"
          >
            <ArrowRightOnRectangleIcon size={24} color="#007AFF" />
          </TouchableOpacity>
        </View>

        {/* Button Labels */}
        <View className="flex-row justify-center items-center space-x-6 mt-4">
          <Text className="w-14 text-center text-xs font-medium text-gray-600">Privacy</Text>
          <Text className="w-14 text-center text-xs font-medium text-gray-600">About</Text>
          <Text className="w-14 text-center text-xs font-medium text-gray-600">Log Out</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}