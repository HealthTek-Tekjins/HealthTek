import React, { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../config/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

const DoctorLoginScreen = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Check if the user is a doctor
      const doctorRef = doc(db, 'doctors', userCredential.user.uid);
      const doctorDoc = await getDoc(doctorRef);
      
      if (!doctorDoc.exists()) {
        await auth.signOut();
        Alert.alert('Error', 'Access denied. This portal is for doctors only.');
        return;
      }

      navigation.replace('DoctorDashboard');
    } catch (error) {
      console.error('Login error:', error);
      Alert.alert('Error', 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#f8f8f8', '#ffffff']}
        style={{ flex: 1 }}
      >
        <View className="p-6 flex-1 justify-center">
          {/* Header */}
          <View className="mb-12 items-center">
            <MaterialIcons name="local-hospital" size={64} color="#FF69B4" />
            <Text 
              style={{ color: colors.text }}
              className="text-3xl font-bold mt-4 text-center"
            >
              Doctor Login
            </Text>
            <Text 
              style={{ color: isDarkMode ? '#B0B0B0' : '#666666' }}
              className="text-base mt-2 text-center"
            >
              Access your doctor dashboard
            </Text>
          </View>

          {/* Login Form */}
          <View className="space-y-4">
            <View>
              <Text 
                style={{ color: colors.text }}
                className="text-base mb-2 font-medium"
              >
                Email
              </Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                keyboardType="email-address"
                autoCapitalize="none"
                className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                style={{ color: colors.text }}
              />
            </View>

            <View>
              <Text 
                style={{ color: colors.text }}
                className="text-base mb-2 font-medium"
              >
                Password
              </Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter your password"
                placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                secureTextEntry
                className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                style={{ color: colors.text }}
              />
            </View>

            <TouchableOpacity
              onPress={handleLogin}
              disabled={loading}
              className={`mt-6 py-4 rounded-xl ${loading ? 'opacity-50' : ''}`}
              style={{ backgroundColor: '#FF69B4' }}
            >
              {loading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-white text-center font-bold text-lg">
                  Login
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <TouchableOpacity
            onPress={() => navigation.navigate('DoctorSignUp')}
            className="mt-6"
          >
            <Text 
              style={{ color: '#FF69B4' }}
              className="text-center text-base font-medium"
            >
              New doctor? Create an account
            </Text>
          </TouchableOpacity>

          {/* Back to Patient Login */}
          <TouchableOpacity
            onPress={() => navigation.navigate('Login')}
            className="mt-4"
          >
            <Text 
              style={{ color: '#FF69B4' }}
              className="text-center text-base font-medium"
            >
              Back to Patient Login
            </Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default DoctorLoginScreen; 