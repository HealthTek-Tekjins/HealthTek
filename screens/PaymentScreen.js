import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const PaymentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, isDarkMode } = useTheme();
  const { total } = route.params || {};

  const banks = [
    { id: 1, name: 'CAPITEC', logo: require('../assets/images/capitec.png') },
    { id: 2, name: 'FNB', logo: require('../assets/images/fnb.png') },
    { id: 3, name: 'STANDARD BANK', logo: require('../assets/images/standardbank.png') },
    { id: 4, name: 'ABSA', logo: require('../assets/images/absa.png') },
    { id: 5, name: 'NEDBANK', logo: require('../assets/images/nedbank.png') },
    { id: 6, name: 'INVESTEC', logo: require('../assets/images/investec.png') },
    { id: 7, name: 'TYME BANK', logo: require('../assets/images/tymebank.png') },
    { id: 8, name: 'AFRICAN BANK', logo: require('../assets/images/africanbank.png') },
  ];

  const handleBankSelect = (bank) => {
    // Here you would typically handle the bank selection and payment process
    navigation.navigate('Medicine');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#1B2541' }}>
      <View style={{ padding: 20, flex: 1 }}>
        {/* Header with Cancel button */}
        <View style={{ flexDirection: 'row', justifyContent: 'flex-end', marginBottom: 20 }}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <Text style={{ color: '#fff', marginRight: 5 }}>HELP?</Text>
            <Text style={{ color: '#fff', marginRight: 5 }}>CANCEL</Text>
          </TouchableOpacity>
        </View>

        {/* Payment Info Card */}
        <View style={{ 
          backgroundColor: '#fff', 
          borderRadius: 15,
          padding: 20,
          marginBottom: 30
        }}>
          {/* Ozow Logo */}
          <Image 
            source={require('../assets/images/ozow.png')}
            style={{ height: 30, width: 100, marginBottom: 15 }}
            resizeMode="contain"
          />

          {/* Payment Amount */}
          <Text style={{ fontSize: 16, color: '#666' }}>Pay</Text>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#000', marginBottom: 5 }}>
            R {total?.toFixed(2) || '0.00'}
          </Text>
          <Text style={{ fontSize: 12, color: '#666' }}>Ref: {Date.now()}</Text>

          {/* Shop Local Badge */}
          <Image 
            source={require('../assets/images/shoplocal.png')}
            style={{ height: 30, width: 120, marginTop: 10 }}
            resizeMode="contain"
          />
        </View>

        {/* Bank Selection Section */}
        <Text style={{ color: '#fff', fontSize: 18, marginBottom: 20 }}>
          Step 1: Select your bank
        </Text>
        <Text style={{ color: '#8890A6', fontSize: 14, marginBottom: 20 }}>
          Select the bank you want to pay with
        </Text>

        {/* Banks Grid */}
        <ScrollView>
          <View style={{ 
            flexDirection: 'row', 
            flexWrap: 'wrap', 
            justifyContent: 'space-between',
            gap: 10
          }}>
            {banks.map((bank) => (
              <TouchableOpacity
                key={bank.id}
                onPress={() => handleBankSelect(bank)}
                style={{
                  width: '48%',
                  backgroundColor: '#fff',
                  borderRadius: 10,
                  padding: 20,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 10,
                  height: 80,
                }}
              >
                <Image
                  source={bank.logo}
                  style={{ height: 40, width: '80%' }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        {/* Footer */}
        <View style={{ marginTop: 20 }}>
          <Text style={{ color: '#8890A6', fontSize: 12, textAlign: 'center' }}>
            By clicking on the following link to proceed our Privacy Policy and Zero-rated T's and C's will apply.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentScreen; 