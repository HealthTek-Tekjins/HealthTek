import { db } from '../config/firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  Timestamp 
} from 'firebase/firestore';

// Health Data Operations
export const saveHealthData = async (userId, healthData) => {
  try {
    const healthDataRef = collection(db, 'healthData');
    const data = {
      ...healthData,
      userId,
      timestamp: Timestamp.now(),
    };
    const docRef = await addDoc(healthDataRef, data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error saving health data:', error);
    throw error;
  }
};

export const getUserHealthData = async (userId) => {
  try {
    const healthDataRef = collection(db, 'healthData');
    const q = query(healthDataRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching health data:', error);
    throw error;
  }
};

// Appointment Operations
export const saveAppointment = async (userId, appointmentData) => {
  try {
    const appointmentsRef = collection(db, 'appointments');
    const data = {
      ...appointmentData,
      userId,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(appointmentsRef, data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error saving appointment:', error);
    throw error;
  }
};

export const getUserAppointments = async (userId) => {
  try {
    const appointmentsRef = collection(db, 'appointments');
    const q = query(appointmentsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching appointments:', error);
    throw error;
  }
};

// Emergency Contacts Operations
export const saveEmergencyContact = async (userId, contactData) => {
  try {
    const contactsRef = collection(db, 'emergencyContacts');
    const data = {
      ...contactData,
      userId,
      createdAt: Timestamp.now(),
    };
    const docRef = await addDoc(contactsRef, data);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error('Error saving emergency contact:', error);
    throw error;
  }
};

export const getUserEmergencyContacts = async (userId) => {
  try {
    const contactsRef = collection(db, 'emergencyContacts');
    const q = query(contactsRef, where('userId', '==', userId));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error fetching emergency contacts:', error);
    throw error;
  }
}; 