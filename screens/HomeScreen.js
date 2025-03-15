import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon, PhoneIcon, UserCircleIcon, UserPlusIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';

export default function HomeScreen() {
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Home Title in Top Right Corner */}
      <View className="pr-4 pt-4">
        <Text className="text-4xl font-bold text-black text-center">Home</Text>
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
          className="py-3 bg-blue-900 rounded-xl w-3/4 mb-4 flex-row justify-center items-center"
          accessibilityLabel="Navigate to login screen"
        >
          <Text className="text-xl font-bold text-white mr-2">Login</Text>
          <UserCircleIcon size={20} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          className="py-3 bg-blue-900 rounded-xl w-3/4 mb-4 flex-row justify-center items-center"
          accessibilityLabel="Navigate to sign up screen"
        >
          <Text className="text-xl font-bold text-white mr-2">Sign Up</Text>
          <UserPlusIcon size={20} color="white" />
        </TouchableOpacity>
        {/* New Contact Support Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ContactSupport')}
          className="py-3 bg-blue-900 rounded-xl w-3/4 flex-row justify-center items-center"
          accessibilityLabel="Navigate to contact support"
        >
          <Text className="text-xl font-bold text-white mr-2">Contact Support</Text>
          <PhoneIcon size={20} color="white" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}