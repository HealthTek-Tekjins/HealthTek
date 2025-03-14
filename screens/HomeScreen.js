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
      <View className="flex-1 justify-center items-center p-4">
        <Image
          source={require('../assets/images/TJ.jpg')}
          style={{ width: 220, height: 200, resizeMode: 'contain', borderRadius: 20 }}
          className="mb-6 rounded-2xl shadow-md"
          accessibilityLabel="HealthTek Logo"
        />
        <Text className="text-xl font-bold text-center mb-6">Welcome to HealthTek</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          className="py-3 bg-blue-900 rounded-xl w-3/4 mb-4"
          accessibilityLabel="Navigate to login screen"
        >
          <Text className="text-xl font-bold text-center text-white">Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          className="py-3 bg-blue-900 rounded-xl w-3/4"
          accessibilityLabel="Navigate to sign up screen"
        >
          <Text className="text-xl font-bold text-center text-white">Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}