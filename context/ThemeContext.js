import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    loadThemePreference();
  }, []);

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem('theme');
      if (savedTheme !== null) {
        setIsDarkMode(savedTheme === 'dark');
      }
    } catch (error) {
      console.error('Error loading theme preference:', error);
    }
  };

  const toggleTheme = async () => {
    try {
      const newTheme = !isDarkMode;
      setIsDarkMode(newTheme);
      await AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
    } catch (error) {
      console.error('Error saving theme preference:', error);
    }
  };

  const theme = {
    isDarkMode,
    toggleTheme,
    colors: isDarkMode ? {
      background: '#1A1A1A',
      card: '#4F4F4F',
      text: '#FFFFFF',
      textSecondary: '#8F8E8E',
      primary: '#FF87B7',
      border: '#3A3A3A',
      error: '#FF453A',
      success: '#32D74B',
    } : {
      background: '#FFFFFF',
      card: '#F5F5F7',
      text: '#000000',
      textSecondary: '#8F8E8E',
      primary: '#FF87B7',
      border: '#E5E5EA',
      error: '#FF3B30',
      success: '#34C759',
    },
    fonts: {
      regular: 'Montserrat',
      medium: 'Montserrat-Medium',
      semiBold: 'Montserrat-SemiBold',
      bold: 'Montserrat-Bold',
    },
    textStyles: {
      h1: {
        fontSize: 32,
        fontFamily: 'Montserrat-Bold',
        color: '#4F4F4F',
      },
      h2: {
        fontSize: 24,
        fontFamily: 'Montserrat-SemiBold',
        color: '#4F4F4F',
      },
      h3: {
        fontSize: 20,
        fontFamily: 'Montserrat-SemiBold',
        color: '#4F4F4F',
      },
      body: {
        fontSize: 16,
        fontFamily: 'Montserrat',
        color: '#4F4F4F',
      },
      caption: {
        fontSize: 14,
        fontFamily: 'Montserrat',
        color: '#4F4F4F',
      },
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 