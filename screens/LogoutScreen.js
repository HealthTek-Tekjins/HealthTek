import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

export default function LogoutScreen() {
  const navigation = useNavigation();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: () => {
            // Here you would typically clear any user data, tokens, etc.
            // For now, we'll just navigate back to the Welcome screen
            navigation.reset({
              index: 0,
              routes: [{ name: 'Welcome' }],
            });
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 justify-center items-center px-6">
        <View className="w-full max-w-md">
          <Text className="text-2xl font-bold text-gray-800 text-center mb-6">
            Logout
          </Text>
          
          <Text className="text-gray-600 text-center mb-8">
            Are you sure you want to logout of your account?
          </Text>

          <TouchableOpacity
            onPress={handleLogout}
            className="bg-red-500 p-4 rounded-lg mb-4"
            activeOpacity={0.8}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Logout
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="bg-gray-200 p-4 rounded-lg"
            activeOpacity={0.8}
          >
            <Text className="text-gray-800 text-center font-semibold text-lg">
              Cancel
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
} 