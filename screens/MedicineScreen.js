import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert, ActivityIndicator, StyleSheet, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const MedicineScreen = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState([]);

  // Sample medicine data
  const sampleMedicines = [
    {
      id: '1',
      name: 'Paracetamol 500mg',
      description: 'Pain reliever and fever reducer',
      price: 15.99,
      stock: 100,
      category: 'Pain Relief',
      image: 'https://example.com/paracetamol.jpg'
    },
    {
      id: '2',
      name: 'Ibuprofen 200mg',
      description: 'Anti-inflammatory pain reliever',
      price: 25.99,
      stock: 75,
      category: 'Pain Relief',
      image: 'https://example.com/ibuprofen.jpg'
    },
    {
      id: '3',
      name: 'Amoxicillin 500mg',
      description: 'Antibiotic for bacterial infections',
      price: 45.99,
      stock: 50,
      category: 'Antibiotics',
      image: 'https://example.com/amoxicillin.jpg'
    },
    {
      id: '4',
      name: 'Loratadine 10mg',
      description: 'Antihistamine for allergies',
      price: 35.99,
      stock: 60,
      category: 'Allergy',
      image: 'https://example.com/loratadine.jpg'
    },
    {
      id: '5',
      name: 'Omeprazole 20mg',
      description: 'Proton pump inhibitor for acid reflux',
      price: 55.99,
      stock: 40,
      category: 'Digestive',
      image: 'https://example.com/omeprazole.jpg'
    },
    {
      id: '6',
      name: 'Vitamin C 1000mg',
      description: 'Immune system support',
      price: 29.99,
      stock: 90,
      category: 'Vitamins',
      image: 'https://example.com/vitaminc.jpg'
    },
    {
      id: '7',
      name: 'Cough Syrup',
      description: 'Relieves cough and cold symptoms',
      price: 39.99,
      stock: 30,
      category: 'Cough & Cold',
      image: 'https://example.com/coughsyrup.jpg'
    },
    {
      id: '8',
      name: 'Multivitamin Complex',
      description: 'Daily essential vitamins and minerals',
      price: 49.99,
      stock: 45,
      category: 'Vitamins',
      image: 'https://example.com/multivitamin.jpg'
    }
  ];

  useEffect(() => {
    // For now, we'll use the sample data
    setMedicines(sampleMedicines);
    setLoading(false);
  }, []);

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
  };

  const removeFromCart = (medicineId) => {
    setCart(prevCart => prevCart.filter(item => item.id !== medicineId));
  };

  const updateQuantity = (medicineId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(medicineId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.id === medicineId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const getTotalItems = () => cart.reduce((total, item) => total + item.quantity, 0);

  const getTotalPrice = () =>
    cart.reduce((total, item) => total + item.price * item.quantity, 0);

  const filteredMedicines = medicines.filter(medicine =>
    medicine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    medicine.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#f8f8f8', '#ffffff']}
        style={{ flex: 1 }}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={[styles.title, { color: colors.text }]}>
                Medicines
              </Text>
              <Text style={[styles.subtitle, { color: isDarkMode ? '#B0B0B0' : '#666666' }]}>
                Browse and order medicines
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => navigation.navigate('Cart', { cart })}
              style={[
                styles.cartButton,
                {
                  backgroundColor: isDarkMode ? 'rgba(255,105,180,0.2)' : 'rgba(255,105,180,0.1)',
                }
              ]}
            >
              <MaterialIcons name="shopping-cart" size={24} color="#FF69B4" />
              {cart.length > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>
                    {getTotalItems()}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View 
            style={[
              styles.searchBar,
              {
                backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
              }
            ]}
          >
            <MaterialIcons name="search" size={24} color="#FF69B4" />
            <TextInput
              placeholder="Search medicines..."
              placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[styles.searchInput, { color: colors.text }]}
            />
          </View>

          {/* Medicines List */}
          <ScrollView 
            showsVerticalScrollIndicator={false}
            style={styles.medicinesList}
          >
            {filteredMedicines.map(medicine => (
              <View 
                key={medicine.id}
                style={[
                  styles.medicineCard,
                  {
                    backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
                  }
                ]}
              >
                <View style={styles.medicineCardContent}>
                  <View style={styles.medicineInfo}>
                    <Text style={[styles.medicineName, { color: colors.text }]}>
                      {medicine.name}
                    </Text>
                    <Text style={[styles.medicineDescription, { color: isDarkMode ? '#B0B0B0' : '#666666' }]}>
                      {medicine.description}
                    </Text>
                    <Text style={styles.medicinePrice}>
                      R{medicine.price.toFixed(2)}
                    </Text>
                    <Text style={[styles.medicineStock, { color: isDarkMode ? '#B0B0B0' : '#666666' }]}>
                      Stock: {medicine.stock}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => addToCart(medicine)}
                    style={[
                      styles.addToCartButton,
                      {
                        backgroundColor: isDarkMode ? 'rgba(255,105,180,0.2)' : 'rgba(255,105,180,0.1)',
                      }
                    ]}
                  >
                    <MaterialIcons name="add-shopping-cart" size={24} color="#FF69B4" />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
  },
  cartButton: {
    padding: 12,
    borderRadius: 12,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FF69B4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    padding: 12,
    borderRadius: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
  },
  medicinesList: {
    flex: 1,
  },
  medicineCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  medicineCardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  medicineInfo: {
    flex: 1,
  },
  medicineName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  medicineDescription: {
    fontSize: 14,
    marginBottom: 8,
  },
  medicinePrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF69B4',
  },
  medicineStock: {
    fontSize: 14,
    marginTop: 4,
  },
  addToCartButton: {
    padding: 8,
    borderRadius: 20,
  },
});

export default MedicineScreen; 