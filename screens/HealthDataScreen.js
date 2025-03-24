import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeartIcon, ArrowLeftIcon } from 'react-native-heroicons/solid';
import { useAuth } from '../context/AuthContext';
import { saveHealthData, getUserHealthData } from '../services/firebaseService';

export default function HealthDataScreen({ navigation }) {
  const { user } = useAuth();
  const [healthData, setHealthData] = useState([]);

  useEffect(() => {
    loadHealthData();
  }, []);

  const loadHealthData = async () => {
    try {
      if (user) {
        const data = await getUserHealthData(user.uid);
        setHealthData(data);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load health data');
    }
  };

  const handleSaveHealthData = async (type, value) => {
    try {
      if (!user) {
        Alert.alert('Error', 'You must be logged in to save health data');
        return;
      }

      const data = {
        type,
        value,
        userId: user.uid,
      };

      await saveHealthData(user.uid, data);
      Alert.alert('Success', 'Health data saved successfully');
      loadHealthData(); // Reload the data
    } catch (error) {
      Alert.alert('Error', 'Failed to save health data');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-6 py-4 border-b border-gray-200">
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          className="mr-4"
        >
          <ArrowLeftIcon size={24} color="#007AFF" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-black">Health Data</Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-6 py-4">
        {/* Health Metrics Section */}
        <View className="bg-[#F5F5F7] rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Daily Metrics</Text>
          <View className="space-y-3">
            <TouchableOpacity 
              className="bg-white rounded-lg p-4 shadow-sm"
              onPress={() => {
                // Implement input modal for blood pressure
                Alert.prompt(
                  'Blood Pressure',
                  'Enter your blood pressure (e.g., 120/80)',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Save',
                      onPress: (value) => handleSaveHealthData('bloodPressure', value)
                    }
                  ]
                );
              }}
            >
              <Text className="text-gray-700 font-medium">Blood Pressure</Text>
              <Text className="text-gray-500 text-sm">Tap to record</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-white rounded-lg p-4 shadow-sm"
              onPress={() => {
                Alert.prompt(
                  'Heart Rate',
                  'Enter your heart rate (bpm)',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Save',
                      onPress: (value) => handleSaveHealthData('heartRate', value)
                    }
                  ]
                );
              }}
            >
              <Text className="text-gray-700 font-medium">Heart Rate</Text>
              <Text className="text-gray-500 text-sm">Tap to record</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              className="bg-white rounded-lg p-4 shadow-sm"
              onPress={() => {
                Alert.prompt(
                  'Blood Sugar',
                  'Enter your blood sugar level (mg/dL)',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { 
                      text: 'Save',
                      onPress: (value) => handleSaveHealthData('bloodSugar', value)
                    }
                  ]
                );
              }}
            >
              <Text className="text-gray-700 font-medium">Blood Sugar</Text>
              <Text className="text-gray-500 text-sm">Tap to record</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Recent Records */}
        <View className="bg-[#F5F5F7] rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Recent Records</Text>
          {healthData.length > 0 ? (
            healthData.slice(0, 5).map((record, index) => (
              <View key={index} className="bg-white rounded-lg p-4 shadow-sm mb-2">
                <Text className="text-gray-700 font-medium capitalize">{record.type}</Text>
                <Text className="text-gray-500 text-sm">{record.value}</Text>
                <Text className="text-gray-400 text-xs mt-1">
                  {new Date(record.timestamp?.toDate()).toLocaleString()}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-gray-500 text-center">No records yet</Text>
          )}
        </View>

        {/* Medication Section */}
        <View className="bg-[#F5F5F7] rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Medication Tracker</Text>
          <TouchableOpacity className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-gray-700 font-medium">Add Medication</Text>
            <Text className="text-gray-500 text-sm">Track your medications</Text>
          </TouchableOpacity>
        </View>

        {/* Symptoms Section */}
        <View className="bg-[#F5F5F7] rounded-xl p-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Symptoms Log</Text>
          <TouchableOpacity className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-gray-700 font-medium">Record Symptoms</Text>
            <Text className="text-gray-500 text-sm">Track how you're feeling</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 