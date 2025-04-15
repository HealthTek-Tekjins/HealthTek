import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeftIcon, SunIcon, MoonIcon } from 'react-native-heroicons/solid';
import { LinearGradient } from 'expo-linear-gradient';

export default function ThemeScreen() {
  const navigation = useNavigation();
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { currentLanguage, translations } = useLanguage();
  const t = translations[currentLanguage];

  const themeOptions = [
    {
      id: 'light',
      title: t.lightTheme,
      description: t.lightThemeDesc,
      icon: <SunIcon size={24} color="#FFD700" />,
    },
    {
      id: 'dark',
      title: t.darkTheme,
      description: t.darkThemeDesc,
      icon: <MoonIcon size={24} color="#4169E1" />,
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#ffffff', '#f0f0f0']}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View className="flex-row items-center p-4">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="p-2 rounded-full mr-4"
            style={{ backgroundColor: colors.card }}
          >
            <ArrowLeftIcon size={24} color="#FF69B4" />
          </TouchableOpacity>
          <Text style={{ color: colors.text }} className="text-2xl font-bold">
            {t.theme}
          </Text>
        </View>

        {/* Theme Options */}
        <ScrollView className="flex-1 px-4">
          <View className="space-y-4">
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                onPress={() => {
                  if (option.id === 'dark' && !isDarkMode) {
                    toggleTheme();
                  } else if (option.id === 'light' && isDarkMode) {
                    toggleTheme();
                  }
                }}
                className={`p-4 rounded-xl ${
                  (option.id === 'dark' && isDarkMode) || (option.id === 'light' && !isDarkMode)
                    ? 'bg-[#FF69B4]'
                    : 'bg-white dark:bg-gray-800'
                }`}
                style={{
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center space-x-3">
                    {option.icon}
                    <View>
                      <Text
                        className={`text-lg font-medium ${
                          (option.id === 'dark' && isDarkMode) || (option.id === 'light' && !isDarkMode)
                            ? 'text-white'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {option.title}
                      </Text>
                      <Text
                        className={`text-sm ${
                          (option.id === 'dark' && isDarkMode) || (option.id === 'light' && !isDarkMode)
                            ? 'text-white/80'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {option.description}
                      </Text>
                    </View>
                  </View>
                  <Switch
                    value={(option.id === 'dark' && isDarkMode) || (option.id === 'light' && !isDarkMode)}
                    onValueChange={toggleTheme}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isDarkMode ? '#4169E1' : '#FFD700'}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
} 