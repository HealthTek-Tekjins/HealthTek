import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../translations';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { auth } from '../config/firebase';
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
      console.error('Logout error:', error);
      Alert.alert(t.error, t.logoutError || 'Failed to logout. Please try again.');
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
              if (!user) {
                throw new Error('No user logged in');
              }
              await user.delete();
              navigation.reset({
                index: 0,
                routes: [{ name: 'Welcome' }],
              });
            } catch (error) {
              console.error("Delete account error:", error);
              Alert.alert(t.error, t.deleteAccountError || 'Failed to delete account. Please try again.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  const menuItems = [
    {
      id: 'editProfile',
      title: t.editProfile,
      icon: 'person',
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      id: 'themeToggle',
      title: isDarkMode ? t.darkMode : t.lightMode,
      icon: isDarkMode ? 'dark-mode' : 'light-mode',
      isToggle: true,
      onPress: toggleTheme,
    },
    {
      id: 'language',
      title: t.language,
      icon: 'language',
      component: <LanguageSelector />,
    },
    {
      id: 'privacySettings',
      title: t.privacySettings,
      icon: 'security',
      onPress: () => navigation.navigate('PrivacySettings'),
    },
    {
      id: 'notifications',
      title: t.notifications,
      icon: 'notifications',
      onPress: () => navigation.navigate('Notifications'),
    },
    {
      id: 'about',
      title: t.about,
      icon: 'info',
      onPress: () => navigation.navigate('About'),
    },
    {
      id: 'help',
      title: t.help || 'Help',
      icon: 'help',
      onPress: () => Alert.alert(t.help || 'Help', t.helpComingSoon || 'Help section coming soon'),
    },
    {
      id: 'terms',
      title: t.terms || 'Terms',
      icon: 'description',
      onPress: () => Alert.alert(t.terms || 'Terms', t.termsComingSoon || 'Terms section coming soon'),
    },
    {
      id: 'logout',
      title: t.logout || 'Logout',
      icon: 'logout',
      onPress: handleLogout,
      color: colors.danger || '#FF3B30',
    },
    {
      id: 'deleteAccount',
      title: t.deleteAccount || 'Delete Account',
      icon: 'delete-forever',
      onPress: handleDeleteAccount,
      color: colors.danger || '#FF3B30',
    },
  ];

  const accountItems = menuItems.filter(item => ['editProfile', 'themeToggle', 'language'].includes(item.id));
  const supportItems = menuItems.filter(item => ['privacySettings', 'notifications', 'about', 'help', 'terms'].includes(item.id));
  const actionItems = menuItems.filter(item => ['logout', 'deleteAccount'].includes(item.id));

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    scrollViewContent: {
      padding: 16,
    },
    title: {
      fontSize: 28,
      fontWeight: 'bold',
      marginBottom: 24,
      color: colors.text,
      textAlign: 'center',
    },
    sectionContainer: {
      backgroundColor: colors.card,
      borderRadius: 12,
      marginBottom: 20,
      borderWidth: 1,
      borderColor: colors.border,
      overflow: 'hidden',
    },
    menuItem: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: 16,
      backgroundColor: colors.card,
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
    lastMenuItem: {
      borderBottomWidth: 0,
    },
    menuItemLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    menuItemText: {
      fontSize: 16,
      marginLeft: 16,
      fontWeight: '500',
      color: colors.text,
      flex: 1,
    },
    menuItemTextDanger: {
      color: colors.danger || '#FF3B30',
    },
    icon: {
      width: 24,
      textAlign: 'center',
    },
    languageSelectorContainer: {
      padding: 16,
      borderBottomColor: colors.border,
      borderBottomWidth: 1,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textSecondary,
      marginLeft: 16,
      marginBottom: 8,
      marginTop: 16,
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Text style={styles.title}>
          {t.settings}
        </Text>

        <Text style={styles.sectionTitle}>{t.account || 'Account'}</Text>
        <View style={styles.sectionContainer}>
          {accountItems.map((item, index) => (
            item.id === 'language' ? (
              <View key={item.id} style={[styles.languageSelectorContainer, index === accountItems.length - 1 ? styles.lastMenuItem : null]}>
                <View style={styles.menuItemLeft}>
                  <MaterialIcons
                    name={item.icon}
                    size={24}
                    color={colors.text}
                    style={styles.icon}
                  />
                  <Text style={styles.menuItemText}>{item.title}</Text>
                </View>
                {item.component}
              </View>
            ) : (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.menuItem,
                  index === accountItems.length - 1 ? styles.lastMenuItem : null,
                ]}
                onPress={item.onPress}
                disabled={item.isToggle}
              >
                <View style={styles.menuItemLeft}>
                  <MaterialIcons
                    name={item.icon}
                    size={24}
                    color={item.color || colors.text}
                    style={styles.icon}
                  />
                  <Text style={[
                    styles.menuItemText,
                    item.color && styles.menuItemTextDanger
                  ]}>
                    {item.title}
                  </Text>
                </View>
                {item.isToggle ? (
                  <Switch
                    value={isDarkMode}
                    onValueChange={toggleTheme}
                    trackColor={{ false: colors.switchTrackFalse || '#767577', true: colors.switchTrackTrue || '#81b0ff' }}
                    thumbColor={isDarkMode ? (colors.switchThumbDark || '#FF69B4') : (colors.switchThumbLight ||'#f4f3f4')}
                    ios_backgroundColor={colors.switchIosBackground || "#3e3e3e"}
                  />
                ) : (
                  item.onPress && !item.component ? (
                    <MaterialIcons
                      name="chevron-right"
                      size={24}
                      color={colors.textSecondary || colors.text}
                    />
                  ) : null
                )}
              </TouchableOpacity>
            )
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t.support || 'Support'}</Text>
        <View style={styles.sectionContainer}>
          {supportItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === supportItems.length - 1 ? styles.lastMenuItem : null,
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <MaterialIcons
                  name={item.icon}
                  size={24}
                  color={colors.text}
                  style={styles.icon}
                />
                <Text style={styles.menuItemText}>
                  {item.title}
                </Text>
              </View>
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={colors.textSecondary || colors.text}
              />
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.sectionTitle}>{t.dangerZone || 'Danger Zone'}</Text>
        <View style={[styles.sectionContainer, { borderColor: colors.danger || '#FF3B30' }]}>
          {actionItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[
                styles.menuItem,
                index === actionItems.length - 1 ? styles.lastMenuItem : null,
                { borderBottomColor: colors.danger || '#FF3B30' }
              ]}
              onPress={item.onPress}
            >
              <View style={styles.menuItemLeft}>
                <MaterialIcons
                  name={item.icon}
                  size={24}
                  color={item.color}
                  style={styles.icon}
                />
                <Text style={[styles.menuItemText, styles.menuItemTextDanger]}>
                  {item.title}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SettingsScreen;