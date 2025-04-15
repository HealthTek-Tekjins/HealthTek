import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../config/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const CartScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const cart = route.params?.cart || [];

  const updateQuantity = (itemId, change) => {
    const updatedCart = cart.map(item => {
      if (item.id === itemId) {
        const newQuantity = item.quantity + change;
        if (newQuantity < 1) return null;
        return { ...item, quantity: newQuantity };
      }
      return item;
    }).filter(Boolean);
    
    navigation.setParams({ cart: updatedCart });
  };

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    navigation.navigate('Checkout', { cart: cart });
  };

  const renderCartItem = (item) => (
    <View 
      key={item.id}
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
            {item.name}
          </Text>
          <Text 
            style={{ color: '#FF69B4' }}
            className="text-base font-semibold"
          >
            R{item.price.toFixed(2)}
          </Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, -1)}
            className="p-2 rounded-full"
            style={{
              backgroundColor: isDarkMode ? 'rgba(255,105,180,0.2)' : 'rgba(255,105,180,0.1)',
            }}
          >
            <MaterialIcons name="remove" size={20} color="#FF69B4" />
          </TouchableOpacity>
          <Text 
            style={{ color: colors.text }}
            className="mx-3 text-lg font-bold"
          >
            {item.quantity}
          </Text>
          <TouchableOpacity
            onPress={() => updateQuantity(item.id, 1)}
            className="p-2 rounded-full"
            style={{
              backgroundColor: isDarkMode ? 'rgba(255,105,180,0.2)' : 'rgba(255,105,180,0.1)',
            }}
          >
            <MaterialIcons name="add" size={20} color="#FF69B4" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#f8f8f8', '#ffffff']}
        style={{ flex: 1 }}
      >
        <View className="p-6 flex-1">
          {/* Header */}
          <View className="flex-row items-center mb-6">
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              className="p-2 rounded-full mr-4"
              style={{
                backgroundColor: isDarkMode ? 'rgba(255,105,180,0.2)' : 'rgba(255,105,180,0.1)',
              }}
            >
              <MaterialIcons name="arrow-back" size={24} color="#FF69B4" />
            </TouchableOpacity>
            <Text style={{ color: colors.text }} className="text-3xl font-bold">
              Cart
            </Text>
          </View>

          {/* Cart Items */}
          <ScrollView 
            showsVerticalScrollIndicator={false}
            className="flex-1"
          >
            {cart.length > 0 ? (
              cart.map(renderCartItem)
            ) : (
              <View className="flex-1 justify-center items-center py-8">
                <MaterialIcons name="shopping-cart" size={48} color="#FF69B4" />
                <Text 
                  style={{ color: colors.text }}
                  className="text-lg text-center mt-4"
                >
                  Your cart is empty
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Checkout Section */}
          {cart.length > 0 && (
            <View 
              className="pt-4 mt-4 border-t"
              style={{ borderColor: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)' }}
            >
              <View className="flex-row justify-between items-center mb-4">
                <Text 
                  style={{ color: colors.text }}
                  className="text-lg font-bold"
                >
                  Total
                </Text>
                <Text 
                  style={{ color: '#FF69B4' }}
                  className="text-xl font-bold"
                >
                  R{calculateTotal().toFixed(2)}
                </Text>
              </View>
              <TouchableOpacity
                onPress={handleCheckout}
                disabled={loading}
                className={`py-4 rounded-xl ${loading ? 'opacity-50' : ''}`}
                style={{ backgroundColor: '#FF69B4' }}
              >
                <Text className="text-white text-center font-bold text-lg">
                  Checkout
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default CartScreen; 