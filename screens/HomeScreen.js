import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid'; // For the back button icon
import { useNavigation } from '@react-navigation/native'; // To navigate back

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Back Button */}
      <View className="flex-row justify-start p-4">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-full bg-gray-200"
        >
          <ArrowLeftIcon size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Logo and Content */}
      <View className="flex-1 justify-center items-center">
        <Image
          source={require('../assets/images/TJ+Logo.jpg')} // Replace with the correct path to Tekjins logo
          style={{ width: 200, height: 200, resizeMode: 'contain' }} // Adjust size as needed
          className="mb-4"
        />
        <Text className="text-xl font-bold text-center">Welcome to Tekjins' HealthTek</Text>
      </View>
    </SafeAreaView>
  );
}