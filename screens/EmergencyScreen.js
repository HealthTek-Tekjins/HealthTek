import { View, Text, TouchableOpacity, ScrollView, Alert, Linking } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ExclamationCircleIcon, ArrowLeftIcon, PhoneIcon, MapPinIcon, UserIcon } from 'react-native-heroicons/solid';
import { useAuth } from '../context/AuthContext';
import { saveEmergencyContact, getUserEmergencyContacts } from '../services/firebaseService';

export default function EmergencyScreen({ navigation }) {
  const { user } = useAuth();
  const [emergencyContacts, setEmergencyContacts] = useState([]);

  useEffect(() => {
    loadEmergencyContacts();
  }, []);

  const loadEmergencyContacts = async () => {
    try {
      if (user) {
        const contacts = await getUserEmergencyContacts(user.uid);
        setEmergencyContacts(contacts);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to load emergency contacts');
    }
  };

  const handleEmergencyCall = () => {
    Alert.alert(
      "Emergency Call",
      "Are you sure you want to call emergency services?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Call Emergency",
          onPress: () => {
            Linking.openURL('tel:911');
          }
        }
      ]
    );
  };

  const handleAddEmergencyContact = async () => {
    try {
      if (!user) {
        Alert.alert('Error', 'You must be logged in to add emergency contacts');
        return;
      }

      Alert.prompt(
        'Add Emergency Contact',
        'Enter contact name',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Next',
            onPress: (name) => {
              Alert.prompt(
                'Phone Number',
                'Enter contact phone number',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Save',
                    onPress: async (phone) => {
                      const contactData = {
                        name,
                        phone,
                        userId: user.uid,
                      };

                      await saveEmergencyContact(user.uid, contactData);
                      Alert.alert('Success', 'Emergency contact added successfully');
                      loadEmergencyContacts(); // Reload the contacts
                    }
                  }
                ]
              );
            }
          }
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to add emergency contact');
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
        <Text className="text-2xl font-bold text-black">Emergency</Text>
      </View>

      {/* Main Content */}
      <ScrollView className="flex-1 px-6 py-4">
        {/* Emergency Call Button */}
        <TouchableOpacity
          onPress={handleEmergencyCall}
          className="bg-red-500 rounded-xl p-6 mb-6 items-center shadow-lg"
        >
          <ExclamationCircleIcon size={48} color="white" />
          <Text className="text-white text-xl font-bold mt-2">Emergency SOS</Text>
          <Text className="text-white text-sm mt-1">Tap to call emergency services</Text>
        </TouchableOpacity>

        {/* Emergency Contacts */}
        <View className="bg-[#F5F5F7] rounded-xl p-4 mb-4">
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-lg font-semibold text-gray-800">Emergency Contacts</Text>
            <TouchableOpacity onPress={handleAddEmergencyContact}>
              <Text className="text-[#007AFF] font-medium">Add Contact</Text>
            </TouchableOpacity>
          </View>
          {emergencyContacts.length > 0 ? (
            emergencyContacts.map((contact, index) => (
              <TouchableOpacity 
                key={index}
                className="bg-white rounded-lg p-4 shadow-sm mb-2"
                onPress={() => Linking.openURL(`tel:${contact.phone}`)}
              >
                <View className="flex-row items-center">
                  <UserIcon size={24} color="#007AFF" />
                  <View className="ml-3">
                    <Text className="text-gray-700 font-medium">{contact.name}</Text>
                    <Text className="text-gray-500 text-sm">{contact.phone}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text className="text-gray-500 text-center">No emergency contacts added</Text>
          )}
        </View>

        {/* Nearby Hospitals */}
        <View className="bg-[#F5F5F7] rounded-xl p-4 mb-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Nearby Hospitals</Text>
          <TouchableOpacity 
            className="bg-white rounded-lg p-4 shadow-sm"
            onPress={() => Linking.openURL('tel:+15559876543')}
          >
            <View className="flex-row items-center">
              <MapPinIcon size={24} color="#007AFF" />
              <View className="ml-3">
                <Text className="text-gray-700 font-medium">City General Hospital</Text>
                <Text className="text-gray-500 text-sm">2.5 miles away</Text>
              </View>
            </View>
            <TouchableOpacity className="flex-row items-center mt-2">
              <PhoneIcon size={16} color="#007AFF" />
              <Text className="text-[#007AFF] text-sm ml-1">+1 (555) 987-6543</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        </View>

        {/* Emergency Instructions */}
        <View className="bg-[#F5F5F7] rounded-xl p-4">
          <Text className="text-lg font-semibold text-gray-800 mb-3">Emergency Instructions</Text>
          <TouchableOpacity className="bg-white rounded-lg p-4 shadow-sm">
            <Text className="text-gray-700 font-medium">View Emergency Guide</Text>
            <Text className="text-gray-500 text-sm">Important information for emergencies</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
} 