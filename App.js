import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigation from './navigation/appNavigation';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';

export default function App() {
  return (
    <NavigationContainer>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <AppNavigation />
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </NavigationContainer>
  );
}
