import React from 'react';
import { View, Text, ScrollView, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';

export default function AboutScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 px-4">
        <View className="py-4">
          <Text className="text-2xl font-bold text-gray-800 mb-6">About HealthTek</Text>
          
          {/* App Version */}
          <View className="bg-gray-50 p-4 rounded-lg mb-4">
            <Text className="text-lg font-medium text-gray-800">Version</Text>
            <Text className="text-gray-600">1.0.0</Text>
          </View>

          {/* App Description */}
          <View className="bg-gray-50 p-4 rounded-lg mb-4">
            <Text className="text-lg font-medium text-gray-800 mb-2">About Us</Text>
            <Text className="text-gray-600">
              HealthTek is your personal health companion, designed to help you track and improve your well-being. 
              We combine cutting-edge technology with user-friendly design to make health management simple and effective.
            </Text>
          </View>

          {/* Contact Support */}
          <TouchableOpacity 
            className="bg-gray-50 p-4 rounded-lg mb-4 flex-row justify-between items-center"
            onPress={() => Linking.openURL('mailto:support@healthtek.com')}
          >
            <View>
              <Text className="text-lg font-medium text-gray-800">Contact Support</Text>
              <Text className="text-gray-600">Get help with any issues</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="#007AFF" />
          </TouchableOpacity>

          {/* Terms of Service */}
          <TouchableOpacity 
            className="bg-gray-50 p-4 rounded-lg mb-4 flex-row justify-between items-center"
            onPress={() => Linking.openURL('https://healthtek.com/terms')}
          >
            <View>
              <Text className="text-lg font-medium text-gray-800">Terms of Service</Text>
              <Text className="text-gray-600">Read our terms and conditions</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="#007AFF" />
          </TouchableOpacity>

          {/* Privacy Policy */}
          <TouchableOpacity 
            className="bg-gray-50 p-4 rounded-lg mb-4 flex-row justify-between items-center"
            onPress={() => Linking.openURL('https://healthtek.com/privacy')}
          >
            <View>
              <Text className="text-lg font-medium text-gray-800">Privacy Policy</Text>
              <Text className="text-gray-600">Learn about our data practices</Text>
            </View>
            <MaterialIcons name="arrow-forward-ios" size={20} color="#007AFF" />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 