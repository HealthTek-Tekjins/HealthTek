import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (!user) {
        navigation.replace('Login');
        return;
      }
      fetchUserData(user);
    });

    return () => unsubscribe();
  }, []);

  const fetchUserData = async (currentUser) => {
    try {
      setLoading(true);
      setError(null);

      if (!currentUser) {
        throw new Error('Not authenticated');
      }

      // Get additional user details from Firestore
      const userDetailsRef = doc(db, 'userDetails', currentUser.uid);
      const userDoc = await getDoc(userDetailsRef);
      
      if (!userDoc.exists()) {
        // Create the document if it doesn't exist
        await setDoc(userDetailsRef, {
          idNumber: '',
          address: '',
          medicalAid: {
            provider: '',
            number: '',
            plan: '',
            expiryDate: ''
          },
          nextOfKin: {
            name: '',
            surname: '',
            phoneNumber: ''
          },
          createdAt: new Date().toISOString()
        });
      }

      setUserData({
        displayName: currentUser.displayName,
        email: currentUser.email,
        phoneNumber: currentUser.phoneNumber,
        ...(userDoc.exists() ? userDoc.data() : {})
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      setError(error.message);
      
      if (error.code === 'permission-denied') {
        Alert.alert(
          'Access Denied',
          'You do not have permission to view this profile. Please log out and log in again.',
          [
            {
              text: 'Log Out',
              onPress: handleLogout,
              style: 'destructive'
            },
            {
              text: 'OK',
              style: 'cancel'
            }
          ]
        );
      } else if (error.message === 'Not authenticated') {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace('Login');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const renderSection = (title, icon, children) => (
    <View 
      className="rounded-xl p-5 mb-4"
      style={{
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
        shadowColor: '#FF69B4',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="flex-row items-center mb-4">
        <View 
          className="p-2 rounded-full mr-3"
          style={{ backgroundColor: isDarkMode ? 'rgba(255,105,180,0.2)' : 'rgba(255,105,180,0.1)' }}
        >
          <MaterialIcons name={icon} size={24} color="#FF69B4" />
        </View>
        <Text 
          style={{ color: colors.text }} 
          className="text-lg font-semibold"
        >
          {title}
        </Text>
      </View>
      <View className="space-y-3">
        {children}
      </View>
    </View>
  );

  const renderInfo = (label, value) => (
    <View className="mb-2">
      <Text 
        style={{ color: isDarkMode ? '#B0B0B0' : '#666666' }} 
        className="text-sm mb-1"
      >
        {label}
      </Text>
      <Text 
        style={{ 
          color: isDarkMode ? '#FFFFFF' : '#333333',
          fontSize: 16,
        }} 
        className="font-medium"
      >
        {value || 'Not provided'}
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text style={{ color: colors.text }} className="mt-4">Loading profile...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center p-4" style={{ backgroundColor: colors.background }}>
        <MaterialIcons name="error-outline" size={48} color="#FF69B4" />
        <Text style={{ color: colors.text }} className="text-lg text-center mt-4">
          {error}
        </Text>
        <TouchableOpacity
          onPress={() => fetchUserData(auth.currentUser)}
          className="mt-4 bg-pink-100 dark:bg-pink-900 px-6 py-3 rounded-full"
        >
          <Text style={{ color: colors.text }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#f8f8f8', '#ffffff']}
        style={{ flex: 1 }}
      >
        <ScrollView 
          className="flex-1" 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={loading}
              onRefresh={() => fetchUserData(auth.currentUser)}
              colors={['#FF69B4']}
              tintColor={isDarkMode ? '#FFFFFF' : '#FF69B4'}
            />
          }
        >
          <View className="p-6">
            {/* Profile Header */}
            <View className="flex-row justify-between items-center mb-6">
              <View>
                <Text style={{ color: colors.text }} className="text-3xl font-bold mb-1">
                  Profile
                </Text>
                <Text style={{ color: isDarkMode ? '#B0B0B0' : '#666666' }} className="text-sm">
                  Manage your personal information
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfile', { 
                  user: auth.currentUser,
                  onUpdate: fetchUserData 
                })}
                className="p-3 rounded-full"
                style={{
                  backgroundColor: isDarkMode ? 'rgba(255,105,180,0.2)' : 'rgba(255,105,180,0.1)',
                }}
              >
                <MaterialIcons name="edit" size={24} color="#FF69B4" />
              </TouchableOpacity>
            </View>

            {/* Basic Information */}
            {renderSection('Basic Information', 'person', (
              <>
                {renderInfo('Name', userData?.displayName)}
                {renderInfo('Email', userData?.email)}
                {renderInfo('Phone', userData?.phoneNumber)}
              </>
            ))}

            {/* Identification & Address */}
            {renderSection('Identification & Address', 'badge', (
              <>
                {renderInfo('ID Number', userData?.idNumber)}
                {renderInfo('Address', userData?.address)}
              </>
            ))}

            {/* Medical Aid Information */}
            {renderSection('Medical Aid Information', 'local-hospital', (
              <>
                {renderInfo('Provider', userData?.medicalAid?.provider)}
                {renderInfo('Number', userData?.medicalAid?.number)}
                {renderInfo('Plan', userData?.medicalAid?.plan)}
                {renderInfo('Expiry Date', userData?.medicalAid?.expiryDate)}
              </>
            ))}

            {/* Next of Kin */}
            {renderSection('Next of Kin', 'people', (
              <>
                {renderInfo('Name', userData?.nextOfKin?.name)}
                {renderInfo('Surname', userData?.nextOfKin?.surname)}
                {renderInfo('Phone Number', userData?.nextOfKin?.phoneNumber)}
              </>
            ))}

            {/* Logout Button */}
            <TouchableOpacity
              onPress={handleLogout}
              className="mt-6 p-4 rounded-xl flex-row justify-center items-center"
              style={{
                backgroundColor: isDarkMode ? 'rgba(255,105,180,0.2)' : 'rgba(255,105,180,0.1)',
                borderWidth: 1,
                borderColor: isDarkMode ? 'rgba(255,105,180,0.3)' : 'rgba(255,105,180,0.2)',
              }}
            >
              <MaterialIcons 
                name="logout" 
                size={24} 
                color="#FF69B4"
                style={{ marginRight: 8 }} 
              />
              <Text 
                style={{ color: '#FF69B4' }}
                className="text-lg font-bold"
              >
                Logout
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default ProfileScreen;