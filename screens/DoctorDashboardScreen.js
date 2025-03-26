import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, ActivityIndicator, Modal, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { auth, db } from '../config/firebase';
import { collection, query, getDocs, addDoc, serverTimestamp, where } from 'firebase/firestore';

const DoctorDashboardScreen = () => {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const [loading, setLoading] = useState(true);
  const [appointments, setAppointments] = useState([]);
  const [showAddMedicineModal, setShowAddMedicineModal] = useState(false);
  const [newMedicine, setNewMedicine] = useState({
    name: '',
    description: '',
    price: '',
    stock: ''
  });

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const appointmentsRef = collection(db, 'appointments');
      const q = query(appointmentsRef, where('doctorId', '==', auth.currentUser.uid));
      const querySnapshot = await getDocs(q);
      const appointmentsList = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setAppointments(appointmentsList);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      Alert.alert('Error', 'Failed to load appointments');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedicine = async () => {
    if (!newMedicine.name || !newMedicine.price || !newMedicine.stock) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      const medicinesRef = collection(db, 'medicines');
      await addDoc(medicinesRef, {
        name: newMedicine.name,
        description: newMedicine.description || '',
        price: parseFloat(newMedicine.price),
        stock: parseInt(newMedicine.stock),
        createdAt: serverTimestamp(),
        createdBy: auth.currentUser.uid
      });

      setShowAddMedicineModal(false);
      setNewMedicine({ name: '', description: '', price: '', stock: '' });
      Alert.alert('Success', 'Medicine added successfully');
    } catch (error) {
      console.error('Error adding medicine:', error);
      Alert.alert('Error', 'Failed to add medicine');
    } finally {
      setLoading(false);
    }
  };

  const renderAppointmentCard = (appointment) => (
    <View 
      key={appointment.id}
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
            {appointment.patientName}
          </Text>
          <Text 
            style={{ color: isDarkMode ? '#B0B0B0' : '#666666' }}
            className="text-sm mb-2"
          >
            {new Date(appointment.date.toDate()).toLocaleString()}
          </Text>
          <Text 
            style={{ color: colors.text }}
            className="text-base"
          >
            {appointment.reason}
          </Text>
        </View>
        <View 
          className="px-3 py-1 rounded-full"
          style={{ backgroundColor: appointment.status === 'pending' ? '#FFB6C1' : '#98FB98' }}
        >
          <Text className="text-white font-medium">
            {appointment.status}
          </Text>
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
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text style={{ color: colors.text }} className="text-3xl font-bold mb-1">
                Dashboard
              </Text>
              <Text style={{ color: isDarkMode ? '#B0B0B0' : '#666666' }} className="text-sm">
                Manage your practice
              </Text>
            </View>
            <TouchableOpacity
              onPress={async () => {
                try {
                  await auth.signOut();
                  navigation.replace('Login');
                } catch (error) {
                  console.error('Error signing out:', error);
                  Alert.alert('Error', 'Failed to sign out');
                }
              }}
              className="p-3 rounded-full"
              style={{
                backgroundColor: isDarkMode ? 'rgba(255,105,180,0.2)' : 'rgba(255,105,180,0.1)',
              }}
            >
              <MaterialIcons name="logout" size={24} color="#FF69B4" />
            </TouchableOpacity>
          </View>

          {/* Quick Actions */}
          <View className="flex-row mb-6 space-x-4">
            <TouchableOpacity
              onPress={() => setShowAddMedicineModal(true)}
              className="flex-1 p-4 rounded-xl items-center"
              style={{
                backgroundColor: isDarkMode ? 'rgba(255,105,180,0.2)' : 'rgba(255,105,180,0.1)',
              }}
            >
              <MaterialIcons name="medical-services" size={24} color="#FF69B4" />
              <Text 
                style={{ color: colors.text }}
                className="text-sm font-medium mt-2"
              >
                Add Medicine
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => navigation.navigate('ManagePatients')}
              className="flex-1 p-4 rounded-xl items-center"
              style={{
                backgroundColor: isDarkMode ? 'rgba(255,105,180,0.2)' : 'rgba(255,105,180,0.1)',
              }}
            >
              <MaterialIcons name="people" size={24} color="#FF69B4" />
              <Text 
                style={{ color: colors.text }}
                className="text-sm font-medium mt-2"
              >
                Manage Patients
              </Text>
            </TouchableOpacity>
          </View>

          {/* Appointments Section */}
          <Text style={{ color: colors.text }} className="text-xl font-bold mb-4">
            Upcoming Appointments
          </Text>

          <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
            {loading ? (
              <ActivityIndicator size="large" color="#FF69B4" />
            ) : appointments.length > 0 ? (
              appointments.map(renderAppointmentCard)
            ) : (
              <View className="flex-1 justify-center items-center py-8">
                <MaterialIcons name="event-busy" size={48} color="#FF69B4" />
                <Text 
                  style={{ color: colors.text }}
                  className="text-lg text-center mt-4"
                >
                  No upcoming appointments
                </Text>
              </View>
            )}
          </ScrollView>

          {/* Add Medicine Modal */}
          <Modal
            visible={showAddMedicineModal}
            transparent
            animationType="slide"
            onRequestClose={() => setShowAddMedicineModal(false)}
          >
            <View className="flex-1 justify-end">
              <View 
                className="rounded-t-3xl p-6"
                style={{ 
                  backgroundColor: isDarkMode ? '#1a1a1a' : 'white',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: -2 },
                  shadowOpacity: 0.25,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                <View className="flex-row justify-between items-center mb-6">
                  <Text style={{ color: colors.text }} className="text-2xl font-bold">
                    Add Medicine
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowAddMedicineModal(false)}
                    className="p-2 rounded-full"
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(255,105,180,0.2)' : 'rgba(255,105,180,0.1)',
                    }}
                  >
                    <MaterialIcons name="close" size={24} color="#FF69B4" />
                  </TouchableOpacity>
                </View>

                <View className="space-y-4">
                  <View>
                    <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                      Name *
                    </Text>
                    <TextInput
                      value={newMedicine.name}
                      onChangeText={(text) => setNewMedicine({ ...newMedicine, name: text })}
                      placeholder="Enter medicine name"
                      placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                      className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                      style={{ color: colors.text }}
                    />
                  </View>

                  <View>
                    <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                      Description
                    </Text>
                    <TextInput
                      value={newMedicine.description}
                      onChangeText={(text) => setNewMedicine({ ...newMedicine, description: text })}
                      placeholder="Enter description"
                      placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                      multiline
                      numberOfLines={3}
                      className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                      style={{ color: colors.text }}
                    />
                  </View>

                  <View>
                    <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                      Price (R) *
                    </Text>
                    <TextInput
                      value={newMedicine.price}
                      onChangeText={(text) => setNewMedicine({ ...newMedicine, price: text })}
                      placeholder="Enter price"
                      placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                      keyboardType="decimal-pad"
                      className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                      style={{ color: colors.text }}
                    />
                  </View>

                  <View>
                    <Text style={{ color: colors.text }} className="text-base mb-2 font-medium">
                      Stock *
                    </Text>
                    <TextInput
                      value={newMedicine.stock}
                      onChangeText={(text) => setNewMedicine({ ...newMedicine, stock: text })}
                      placeholder="Enter stock quantity"
                      placeholderTextColor={isDarkMode ? '#B0B0B0' : '#666666'}
                      keyboardType="number-pad"
                      className={`rounded-xl px-4 py-3 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}
                      style={{ color: colors.text }}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={handleAddMedicine}
                    disabled={loading}
                    className={`py-4 rounded-xl mt-4 ${loading ? 'opacity-50' : ''}`}
                    style={{ backgroundColor: '#FF69B4' }}
                  >
                    {loading ? (
                      <ActivityIndicator color="white" />
                    ) : (
                      <Text className="text-white text-center font-bold text-lg">
                        Add Medicine
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

export default DoctorDashboardScreen; 