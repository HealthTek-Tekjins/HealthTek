import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeartIcon, CalendarIcon, ExclamationCircleIcon } from 'react-native-heroicons/solid';

export default function Dashboard() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Dashboard Title */}
      <View className="pt-12 pb-6">
        <Text className="text-4xl font-bold text-center text-black">Dashboard</Text>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center items-center px-6">
        {/* TJ Logo */}
        <Image
          source={require('../assets/images/TL.png')}
          style={{ width: 100, height: 150, resizeMode: 'contain', borderRadius: 20 }}
          className="mb-10 rounded-2xl shadow-lg"
          accessibilityLabel="HealthTek Logo"
        />

        {/* Buttons in Small Rounded Squares */}
        <View className="flex-row justify-center items-center space-x-6">
          {/* Input Health Data Button */}
          <TouchableOpacity
            className="w-14 h-14 bg-[#F5F5F7] rounded-lg justify-center items-center shadow-md active:bg-gray-200"
            accessibilityLabel="Navigate to input health data"
          >
            <HeartIcon size={24} color="#007AFF" />
          </TouchableOpacity>

          {/* Book Appointment Button */}
          <TouchableOpacity
            className="w-14 h-14 bg-[#F5F5F7] rounded-lg justify-center items-center shadow-md active:bg-gray-200"
            accessibilityLabel="Book an appointment"
          >
            <CalendarIcon size={24} color="#007AFF" />
          </TouchableOpacity>

          {/* SOS Emergency Button */}
          <TouchableOpacity
            className="w-14 h-14 bg-[#F5F5F7] rounded-lg justify-center items-center shadow-md active:bg-red-100"
            accessibilityLabel="Emergency SOS button"
          >
            <ExclamationCircleIcon size={24} color="#FF3B30" />
          </TouchableOpacity>
        </View>

        {/* Button Labels (Optional, Apple-style minimal labels) */}
        <View className="flex-row justify-center items-center space-x-6 mt-4">
          <Text className="w-14 text-center text-xs font-medium text-gray-600">Health Data</Text>
          <Text className="w-13 text-center text-xs font-medium text-gray-1600">Appointment</Text>
          <Text className="w-14 text-center text-xs font-medium text-gray-600">SOS</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}