import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../config/firebase';
import { collection, query, getDocs, where } from 'firebase/firestore';

const MedicineScreen = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    fetchMedicines();
  }, []);

  const fetchMedicines = async () => {
    try {
      setLoading(true);
      const medicinesRef = collection(db, 'medicines');
      const medicinesSnapshot = await getDocs(medicinesRef);
      const medicinesList = medicinesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setMedicines(medicinesList);
    } catch (error) {
      console.error('Error fetching medicines:', error);
      Alert.alert('Error', 'Failed to load medicines');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = (medicine) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === medicine.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.id === medicine.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...medicine, quantity: 1 }];
    });
    Alert.alert('Success', 'Added to cart');
  };

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderMedicineCard = (medicine) => (
    <View 
      key={medicine.id}
      className="rounded-xl p-4 mb-4"
      style={{
        backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
        shadowColor: '#FF69B4',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="flex-row justify-between items-start">
        <View className="flex-1">
          <Text 
            style={{ color: colors.text }}
            className="text-lg font-bold mb-1"
          >
            {medicine.name}
          </Text>
          <Text 
            style={{ color: isDarkMode ? '#B0B0B0' : '#666666' }}
            className="text-sm mb-2"
          >
            {medicine.description}
          </Text>
          <Text 
            style={{ color: '#FF69B4' }}
            className="text-base font-semibold"
          >
            R{medicine.price.toFixed(2)}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => addToCart(medicine)}
          className="p-2 rounded-full"
          style={{
            backgroundColor: isDarkMode ? 'rgba(255,105,180,0.2)' : 'rgba(255,105,180,0.1)',
          }}
        >
          <MaterialIcons name="add-shopping-cart" size={24} color="#FF69B4" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center" style={{ backgroundColor: colors.background }}>
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text style={{ color: colors.text }} className="mt-4">Loading medicines...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#f8f8f8', '#ffffff']}
        style={{ flex: 1 }}
      >
        <View className="p-6">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text style={{ color: colors.text }} className="text-3xl font-bold mb-1">
                Medicines
              </Text>
              <Text style={{ color: isDarkMode ? '#B0B0B0' : '#666666' }} className="text-sm">
                Browse and order medicines
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Cart', { cart })}
              className="p-3 rounded-full relative"
              style={{
                backgroundColor: isDarkMode ? 'rgba(255,105,180,0.2)' : 'rgba(255,105,180,0.1)',
              }}
            >
              <MaterialIcons name="shopping-cart" size={24} color="#FF69B4" />
              {cart.length > 0 && (
                <View 
                  className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#FF69B4] justify-center items-center"
                >
                  <Text className="text-white text-xs font-bold">
                    {cart.reduce((total, item) => total + item.quantity, 0)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View 
            className="flex-row items-center mb-6 rounded-xl p-3"
            style={{
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
            }}
          >
            <MaterialIcons name="search" size={24} color="#FF69B4" />
            <TextInput
              placeholder="Search medicines..."
              placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={{ color: colors.text }}
              className="flex-1 ml-2 text-base"
            />
          </View>

          {/* Medicines List */}
          <ScrollView 
            showsVerticalScrollIndicator={false}
            className="flex-1"
          >
            {filteredMedicines.length > 0 ? (
              filteredMedicines.map(renderMedicineCard)
            ) : (
              <View className="flex-1 justify-center items-center py-8">
                <MaterialIcons name="medication" size={48} color="#FF69B4" />
                <Text 
                  style={{ color: colors.text }}
                  className="text-lg text-center mt-4"
                >
                  No medicines found
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default MedicineScreen; 