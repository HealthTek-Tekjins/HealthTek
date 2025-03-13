import { View, Text } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Main Content */}
      <View className="flex-1 justify-center items-center">
        <Text className="text-xl font-bold text-center">Settings Screen</Text>
      </View>
    </SafeAreaView>
  );
}