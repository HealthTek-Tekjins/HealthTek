import { View, Text, TouchableOpacity, ScrollView, Alert, Animated } from 'react-native';
import React, { useState, useEffect, useRef } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { 
  HeartIcon, 
  ChartBarIcon, 
  PlusIcon,
  TrashIcon,
  PencilIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon
} from 'react-native-heroicons/solid';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

export default function HealthDataScreen() {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const [healthData, setHealthData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  // Animation values
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  const fetchHealthData = async () => {
    try {
      setLoading(true);
      setError(null);
      const user = auth.currentUser;
      
      if (!user) {
        throw new Error('User not authenticated');
      }

      const healthDataRef = collection(db, 'healthData');
      const q = query(healthDataRef, where('userId', '==', user.uid));
      const querySnapshot = await getDocs(q);
      
      const healthDataItems = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort by date
      healthDataItems.sort((a, b) => new Date(b.date) - new Date(a.date));
      setHealthData(healthDataItems);
    } catch (error) {
      console.error('Error fetching health data:', error);
      setError('Failed to load health data. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchHealthData();
  }, []);

  useEffect(() => {
    // Start animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleDeleteData = async (dataId) => {
    try {
      Alert.alert(
        'Delete Health Data',
        'Are you sure you want to delete this health data entry?',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await deleteDoc(doc(db, 'healthData', dataId));
              setHealthData(healthData.filter(item => item.id !== dataId));
            },
          },
        ]
      );
    } catch (error) {
      console.error('Error deleting health data:', error);
      Alert.alert('Error', 'Failed to delete health data. Please try again.');
    }
  };

  const handleEditData = (data) => {
    navigation.navigate('EditHealthData', { data });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') {
      return <ArrowTrendingUpIcon size={20} color="#4CAF50" />;
    } else if (trend === 'down') {
      return <ArrowTrendingDownIcon size={20} color="#F44336" />;
    }
    return null;
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#ffffff', '#f0f0f0']}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex-1">
          <Animated.View 
            className="p-4"
            style={{
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            }}
          >
            <View className="flex-row justify-between items-center mb-6">
              <Text style={{ color: colors.text }} className="text-2xl font-bold">
                Health Data
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('AddHealthData')}
                className="bg-[#FF69B4] p-3 rounded-full"
                style={{
                  shadowColor: '#FF69B4',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 5,
                }}
              >
                <PlusIcon size={24} color="white" />
              </TouchableOpacity>
            </View>

            {loading ? (
              <View className="items-center justify-center py-8">
                <Text style={{ color: colors.textSecondary }}>Loading health data...</Text>
              </View>
            ) : error ? (
              <View className="items-center justify-center py-8">
                <ExclamationCircleIcon size={48} color="#FF69B4" />
                <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 8 }}>
                  {error}
                </Text>
                <TouchableOpacity
                  onPress={fetchHealthData}
                  className="mt-4 bg-[#FF69B4] px-6 py-3 rounded-xl"
                >
                  <Text className="text-white font-semibold">Try Again</Text>
                </TouchableOpacity>
              </View>
            ) : healthData.length === 0 ? (
              <View className="items-center justify-center py-8">
                <ChartBarIcon size={48} color="#FF69B4" />
                <Text style={{ color: colors.textSecondary, textAlign: 'center', marginTop: 8 }}>
                  No health data recorded yet
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('AddHealthData')}
                  className="mt-4 bg-[#FF69B4] px-6 py-3 rounded-xl"
                >
                  <Text className="text-white font-semibold">Add Health Data</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View className="space-y-4">
                {healthData.map((data) => (
                  <View
                    key={data.id}
                    style={{
                      backgroundColor: colors.card,
                      borderRadius: 16,
                      padding: 16,
                      shadowColor: colors.text,
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <View className="flex-row justify-between items-start mb-4">
                      <View>
                        <Text style={{ color: colors.text }} className="text-xl font-bold mb-1">
                          {data.type}
                        </Text>
                        <Text style={{ color: colors.textSecondary }} className="text-base">
                          {formatDate(data.date)}
                        </Text>
                      </View>
                      <View className="flex-row space-x-2">
                        <TouchableOpacity
                          onPress={() => handleEditData(data)}
                          className="p-2 rounded-full"
                          style={{ backgroundColor: colors.background }}
                        >
                          <PencilIcon size={20} color="#FF69B4" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleDeleteData(data.id)}
                          className="p-2 rounded-full"
                          style={{ backgroundColor: colors.background }}
                        >
                          <TrashIcon size={20} color="#FF69B4" />
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View className="space-y-3">
                      <View className="flex-row items-center justify-between">
                        <Text style={{ color: colors.text }} className="text-lg">
                          Value: {data.value} {data.unit}
                        </Text>
                        {getTrendIcon(data.trend)}
                      </View>
                      
                      {data.notes && (
                        <View className="mt-4 pt-4 border-t border-gray-200">
                          <Text style={{ color: colors.textSecondary }} className="text-sm">
                            {data.notes}
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                ))}
              </View>
            )}
          </Animated.View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
} 