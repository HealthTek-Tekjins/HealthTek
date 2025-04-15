import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../config/firebase';
import { collection, addDoc, serverTimestamp, writeBatch, doc, increment } from 'firebase/firestore';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { colors, isDarkMode } = useTheme();
  const [loading, setLoading] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    name: '',
    email: '',
    phone: '',
    reference: `ORD-${Math.floor(Math.random() * 1000000)}`
  });

  const cart = route.params?.cart || [];
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const handlePayment = () => {
    navigation.navigate('Payment', { total: total });
  };

  const renderInput = (label, value, key, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          { 
            backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
            color: colors.text,
          }
        ]}
        value={value}
        onChangeText={(text) => setPaymentDetails(prev => ({ ...prev, [key]: text }))}
        placeholderTextColor={colors.textSecondary}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#ffffff', '#f0f0f0']}
        style={{ flex: 1 }}
      >
        <ScrollView style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <MaterialCommunityIcons name="arrow-left" size={24} color="#FF69B4" />
            </TouchableOpacity>
            <Text style={[styles.title, { color: colors.text }]}>Checkout</Text>
          </View>

          {/* Order Summary */}
          <View style={[
            styles.section,
            {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
            }
          ]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Order Summary</Text>
            {cart.map((item, index) => (
              <View key={index} style={styles.orderItem}>
                <View style={styles.orderItemInfo}>
                  <Text style={[styles.orderItemName, { color: colors.text }]}>
                    {item.name}
                  </Text>
                  <Text style={[styles.orderItemQuantity, { color: colors.textSecondary }]}>
                    {item.quantity} x R{item.price.toFixed(2)}
                  </Text>
                </View>
                <Text style={[styles.orderItemTotal, { color: colors.text }]}>
                  R{(item.price * item.quantity).toFixed(2)}
                </Text>
              </View>
            ))}
            <View style={styles.totalContainer}>
              <Text style={[styles.totalLabel, { color: colors.text }]}>Total</Text>
              <Text style={[styles.totalAmount, { color: '#FF69B4' }]}>
                R{total.toFixed(2)}
              </Text>
            </View>
          </View>

          {/* Payment Details */}
          <View style={[
            styles.section,
            {
              backgroundColor: isDarkMode ? 'rgba(255,255,255,0.05)' : 'white',
            }
          ]}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Payment Details</Text>
            {renderInput('Full Name', paymentDetails.name, 'name')}
            {renderInput('Email', paymentDetails.email, 'email', 'email-address')}
            {renderInput('Phone Number', paymentDetails.phone, 'phone', 'phone-pad')}
            <View style={styles.referenceContainer}>
              <Text style={[styles.referenceLabel, { color: colors.textSecondary }]}>
                Reference Number
              </Text>
              <Text style={[styles.referenceValue, { color: colors.text }]}>
                {paymentDetails.reference}
              </Text>
            </View>
          </View>

          {/* Payment Button */}
          <TouchableOpacity
            style={[styles.payButton, loading && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <MaterialCommunityIcons name="lock" size={20} color="white" />
                <Text style={styles.payButtonText}>Pay R{total.toFixed(2)}</Text>
              </>
            )}
          </TouchableOpacity>

          {/* Security Notice */}
          <View style={styles.securityNotice}>
            <MaterialCommunityIcons name="shield-check" size={20} color="#FF69B4" />
            <Text style={[styles.securityText, { color: colors.textSecondary }]}>
              Your payment is secure and encrypted
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    marginRight: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  section: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  orderItemInfo: {
    flex: 1,
  },
  orderItemName: {
    fontSize: 16,
    fontWeight: '500',
  },
  orderItemQuantity: {
    fontSize: 14,
    marginTop: 2,
  },
  orderItemTotal: {
    fontSize: 16,
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
  },
  input: {
    borderRadius: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,105,180,0.2)',
  },
  referenceContainer: {
    marginTop: 8,
  },
  referenceLabel: {
    fontSize: 14,
    marginBottom: 4,
  },
  referenceValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  payButton: {
    backgroundColor: '#FF69B4',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  payButtonDisabled: {
    opacity: 0.7,
  },
  payButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  securityNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  securityText: {
    fontSize: 14,
    marginLeft: 8,
  },
});

export default CheckoutScreen; 