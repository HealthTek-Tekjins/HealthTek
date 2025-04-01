import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../src/firebase';
import { signOut } from 'firebase/auth';
import LanguageSelector from '../components/LanguageSelector';

const SettingsScreen = () => {
  const { colors, isDarkMode, toggleTheme } = useTheme();
  const { currentLanguage } = useLanguage();
  const navigation = useNavigation();
  const t = translations[currentLanguage];

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Welcome' }],
      });
    } catch (error) {
      Alert.alert(t.error, t.logoutError);
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      t.deleteAccount,
      t.deleteAccountConfirm,
      [
        {
          text: t.cancel,
          style: 'cancel',
        },
        {
          text: t.delete,
          style: 'destructive',
          onPress: async () => {
            try {
              const user = auth.currentUser;
              await user.delete();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              });
            } catch (error) {
              Alert.alert(t.error, t.deleteAccountError);
            }
          },
        },
      ]
    );
  };

  const menuItems = [
    {
      title: t.editProfile,
      icon: 'person',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      title: isDarkMode ? t.darkMode : t.lightMode,
      icon: isDarkMode ? 'dark-mode' : 'light-mode',
      onPress: toggleTheme,
      isToggle: true,
    },
    {
      title: t.privacySettings,
      icon: 'security',
      onPress: () => navigation.navigate('PrivacySettings'),
    },
    {
      title: t.notifications,
      icon: 'notifications',
      onPress: () => Alert.alert(t.notifications, t.notificationsComingSoon),
    },
    {
      title: t.about,
      icon: 'info',
      onPress: () => navigation.navigate('About'),
    },
    {
      title: t.help,
      icon: 'help',
      onPress: () => Alert.alert(t.help, t.helpComingSoon),
    },
    {
      title: t.terms,
      icon: 'description',
      onPress: () => Alert.alert(t.terms, t.termsComingSoon),
    },
    {
      title: t.logout,
      icon: 'logout',
      onPress: handleLogout,
      color: '#FF3B30',
    },
    {
      title: t.deleteAccount,
      icon: 'delete-forever',
      onPress: handleDeleteAccount,
      color: '#FF3B30',
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <LinearGradient
        colors={isDarkMode ? ['#1a1a1a', '#2d2d2d'] : ['#ffffff', '#f0f0f0']}
        style={{ flex: 1 }}
      >
        <ScrollView className="flex-1 p-4">
          <Text 
            style={{ color: colors.text }}
            className="text-2xl font-bold mb-6"
          >
            {t.settings}
          </Text>

          <View 
            style={{ 
              backgroundColor: colors.card,
              borderRadius: 12,
              padding: 16,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text 
              style={{ color: colors.text }}
              className="text-lg font-semibold mb-4"
            >
              {t.language}
            </Text>
            <LanguageSelector />
          </View>

          <View style={[styles.section, { backgroundColor: colors.card }]}>
            <View style={styles.sectionHeader}>
              <MaterialIcons name="settings" size={24} color={colors.text} />
              <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.preferences}</Text>
            </View>
            
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.menuItem,
                  { 
                    borderBottomColor: colors.border,
                    borderBottomWidth: index === menuItems.length - 1 ? 0 : 1,
                  }
                ]}
                onPress={item.onPress}
                disabled={item.isToggle}
              >
                <View style={styles.menuItemLeft}>
                  <MaterialIcons 
                    name={item.icon} 
                    size={24} 
                    color={item.color || colors.text} 
                  />
                  <Text style={[styles.menuItemText, { color: item.color || colors.text }]}>
                    {item.title}
                  </Text>
                </View>
                {item.isToggle ? (
                  <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isDarkMode ? '#FF69B4' : '#f4f3f4'}
                  />
                ) : (
                  <MaterialIcons name="chevron-right" size={24} color={colors.textSecondary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  section: {
    margin: 16,
    borderRadius: 12,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuItemText: {
    fontSize: 16,
    marginLeft: 12,
  },
});

export default SettingsScreen;