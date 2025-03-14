import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Dashboard() {
  return (
    <SafeAreaView className="flex-1 bg-[#F0F4F8]">
      {/* Back Button (Decorative for mockup) */}
      <View className="flex-row justify-start p-4">
        <TouchableOpacity
          className="p-2 rounded-tr-2xl rounded-bl-2xl bg-gray-200"
          accessibilityLabel="Go back to previous screen (mockup)"
        >
          <View className="w-5 h-5 bg-black rounded" /> {/* Placeholder for ArrowLeftIcon */}
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center items-center p-6">
        <Image
          source={require('../assets/images/TJ.jpg')}
          style={{ width: 240, height: 220, resizeMode: 'contain', borderRadius: 24 }}
          className="mb-8 rounded-2xl shadow-lg"
          accessibilityLabel="HealthTek Logo"
        />
        <Text className="text-3xl font-bold text-center text-[#2A2A72] mb-8">
          Welcome to Tekjin's HealthTek
        </Text>
        <View className="w-full max-w-md space-y-6">
          <TouchableOpacity
            className="bg-[#1E90FF] p-5 rounded-xl shadow-lg active:bg-[#1C86EE]"
            accessibilityLabel="Navigate to input health data"
          >
            <Text className="text-xl font-semibold text-white text-center">Input Health Data</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-[#1E90FF] p-5 rounded-xl shadow-lg active:bg-[#1C86EE]"
            accessibilityLabel="Book an appointment"
          >
            <Text className="text-xl font-semibold text-white text-center">Book Appointment</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="bg-red-500 p-5 rounded-xl shadow-lg active:bg-red-600"
            accessibilityLabel="Emergency SOS button"
          >
            <Text className="text-xl font-semibold text-white text-center">SOS Emergency</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}