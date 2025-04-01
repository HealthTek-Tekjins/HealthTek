import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { useTheme } from '../context/ThemeContext';

const LanguageSelector = () => {
  const { currentLanguage, changeLanguage } = useLanguage();
  const { colors, isDarkMode } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        {translations[currentLanguage].selectLanguage}
      </Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.languageButton,
            {
              backgroundColor: currentLanguage === 'en' ? colors.primary : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => changeLanguage('en')}
        >
          <Text
            style={[
              styles.buttonText,
              { color: currentLanguage === 'en' ? 'white' : colors.text },
            ]}
          >
            {translations[currentLanguage].english}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.languageButton,
            {
              backgroundColor: currentLanguage === 'st' ? colors.primary : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => changeLanguage('st')}
        >
          <Text
            style={[
              styles.buttonText,
              { color: currentLanguage === 'st' ? 'white' : colors.text },
            ]}
          >
            {translations[currentLanguage].sesotho}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.languageButton,
            {
              backgroundColor: currentLanguage === 'af' ? colors.primary : colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => changeLanguage('af')}
        >
          <Text
            style={[
              styles.buttonText,
              { color: currentLanguage === 'af' ? 'white' : colors.text },
            ]}
          >
            {translations[currentLanguage].afrikaans}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width: '100%',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  languageButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 4,
  },
  buttonText: {
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default LanguageSelector; 