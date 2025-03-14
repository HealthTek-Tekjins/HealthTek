import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth'; // Verify this path

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user } = useAuth(); // This line throws the error

  if (!user) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <Text className="text-center mt-10">Loading user data...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-row justify-start p-2 bg-gray-200 rounded-tr-2xl rounded-bl-2xl ml-4 mt-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2"
          accessibilityLabel="Go back to previous screen"
        >
          <ArrowLeftIcon size={20} color="black" />
        </TouchableOpacity>
      </View>
      <View className="flex-1 justify-center items-center p-4">
        <Image
          source={{ uri: user?.photoURL || 'https://via.placeholder.com/150' }}
          style={{ width: 150, height: 150, borderRadius: 75 }}
          className="mb-4 shadow-md"
          accessibilityLabel="User profile picture"
        />
        <Text className="text-xl font-bold text-center mb-2">Welcome, {user?.displayName || 'User Name'}</Text>
        <Text className="text-base text-center mb-4">{user?.email || 'user@example.com'}</Text>
        <View className="w-full max-w-md bg-white p-4 rounded-xl mb-4 shadow-lg">
          <Text className="text-lg font-medium text-[#333333]">Health Summary</Text>
          <Text className="text-base text-[#666666]">Symptoms: {user?.metadata?.symptoms || 'N/A'}</Text>
          <Text className="text-base text-[#666666]">Last Appointment: {user?.metadata?.lastAppointment || 'N/A'}</Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')}
          className="py-3 bg-blue-900 rounded-xl w-3/4 mb-4"
        >
          <Text className="text-xl font-bold text-center text-white">Edit Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}