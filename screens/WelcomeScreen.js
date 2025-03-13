import { View, Text, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { XMarkIcon } from 'react-native-heroicons/solid'; // Using XMarkIcon for the red "X"
import { useNavigation } from '@react-navigation/native';

export default function WelcomeScreen() {
  const navigation = useNavigation();

  const handleExit = () => {
    // Note: Terminating an app is platform-dependent and may require additional permissions
    // For now, this logs a message and can be extended with BackHandler.exitApp() for Android
    console.log("App termination requested");
    // Uncomment the following line for Android to exit the app (requires import { BackHandler } from 'react-native')
    // BackHandler.exitApp();
  };

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: '#000000' }}>
      <View className="flex-row justify-start">
        <TouchableOpacity
          onPress={handleExit}
          className="p-2 rounded-tr-2xl rounded-bl-2xl ml-4 mt-4 bg-red-500" // Red background for the "X" button
        >
          <XMarkIcon size={20} color="white" /> {/* Red "X" icon */}
        </TouchableOpacity>
      </View>
      <View className="flex-1 justify-center items-center">
        <Image
          source={require('../assets/images/TJ.jpg')}
          style={{ width: 220, height: 200, resizeMode: 'contain', borderRadius: 20 }}
          className="mb-4 rounded-2xl"
        />
        <Text className="text-xl font-bold text-center mb-2 text-white">Welcome</Text>
        <Text className="text-xl font-bold text-center mb-2 text-white">To</Text>
        <Text className="text-lg font-bold text-center mb-6 text-white">HEALTHTEK</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('SignUp')}
          className="py-3 bg-blue-900 rounded-xl w-3/4 mb-4"
        >
          <Text className="text-xl font-bold text-center text-white">Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          className="py-3 bg-gray-200 rounded-xl w-3/4 flex-row justify-center items-center mb-4"
        >
          <Text className="text-xl font-bold text-center text-black">Login</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}