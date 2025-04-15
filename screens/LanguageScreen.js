import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { LinearGradient } from 'expo-linear-gradient';

export default function LanguageScreen() {
  const navigation = useNavigation();
  const { colors, isDarkMode } = useTheme();
  const { currentLanguage, setLanguage, translations } = useLanguage();
  const t = translations[currentLanguage];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'pt', name: 'Português' },
    { code: 'ru', name: 'Русский' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
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
            {t.language}
          </Text>
        </View>

        {/* Language List */}
        <ScrollView className="flex-1 px-4">
          <View className="space-y-2">
            {languages.map((language) => (
              <TouchableOpacity
                key={language.code}
                onPress={() => setLanguage(language.code)}
                className={`p-4 rounded-xl ${
                  currentLanguage === language.code
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
                <Text
                  className={`text-lg font-medium ${
                    currentLanguage === language.code
                      ? 'text-white'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {language.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
} 