import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Back Button */}
      <View className="flex-row justify-start">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-4 bg-gray-200"
        >
          <ArrowLeftIcon size={20} color="black" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View className="flex-1 justify-center items-center">
        <Image
          source={require('../assets/images/TJ+Logo.jpg')}
          style={{ width: 220, height: 200, resizeMode: 'contain', borderRadius: 20 }} // Adjusted size and added rounded corners
          className="mb-4 rounded-2xl"
        />
        <Text className="text-xl font-bold text-center mb-6">Welcome to Tekjin's HealthTek</Text>
        {/* Optional: Adding a button to align with other screens */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Profile')} // Adjust navigation as needed
          className="py-3 bg-blue-900 rounded-xl w-3/4 mb-4"
        >
          <Text className="text-xl font-bold text-center text-white">Go to Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}