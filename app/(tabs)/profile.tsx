import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  Linking,
  Switch,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useAuth } from '../../features/auth';

/* ────────────────────────────────────────── */
/* COLORS                                      */
/* ────────────────────────────────────────── */
const colors = {
  background: '#171612',
  surface: '#201d18',
  card: '#25231d',
  gold: '#d4af35',
  champagne: '#f2f0e9',
  platinum: '#b6b1a0',
  muted: '#9e9888',
  error: '#d15e5e',
  borderGold: 'rgba(212, 175, 53, 0.3)',
  borderSubtle: 'rgba(212, 175, 53, 0.15)',
};

/* ────────────────────────────────────────── */
/* UI COMPONENTS                              */
/* ────────────────────────────────────────── */

const SectionCard = ({ children }: { children: React.ReactNode }) => (
  <View style={styles.sectionCard}>{children}</View>
);

const SectionHeader = ({ title }: { title: string }) => (
  <Text style={styles.sectionHeader}>{title.toUpperCase()}</Text>
);

const MenuItem = ({
  iconName,
  title,
  subtitle,
  onPress,
  rightElement,
}: {
  iconName: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle?: string;
  onPress?: () => void;
  rightElement?: React.ReactNode;
}) => (
  <TouchableOpacity
    activeOpacity={onPress ? 0.7 : 1}
    onPress={onPress}
    style={styles.menuItem}
    accessibilityLabel={title}
    accessibilityRole={onPress ? 'button' : 'text'}
  >
    <View style={styles.menuIcon}>
      <Ionicons name={iconName} size={18} color={colors.gold} />
    </View>

    <View style={styles.menuContent}>
      <Text style={styles.menuTitle}>{title}</Text>
      {subtitle && <Text style={styles.menuSubtitle}>{subtitle}</Text>}
    </View>

    {rightElement ? (
      rightElement
    ) : onPress ? (
      <Ionicons name="chevron-forward" size={20} color={colors.muted} />
    ) : null}
  </TouchableOpacity>
);

/* ────────────────────────────────────────── */
/* SCREEN                                     */
/* ────────────────────────────────────────── */

export default function ProfileScreen() {
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    SecureStore.getItemAsync('notification_prefs').then(val => {
      if (val !== null) setNotificationsEnabled(val === 'true');
    });
  }, []);

  const handleNotificationToggle = async (value: boolean) => {
    setNotificationsEnabled(value);
    await SecureStore.setItemAsync('notification_prefs', value.toString());
  };

  const handleLogout = () => {
    Alert.alert(
      t('profile.logoutConfirmTitle') || 'Log Out',
      t('profile.logoutConfirmMessage') || 'Are you sure you want to log out?',
      [
        { text: t('common.cancel') || 'Cancel', style: 'cancel' },
        {
          text: t('profile.logout') || 'Log Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/(auth)/login');
          },
        },
      ]
    );
  };

  const handleLanguagePress = () => {
    Linking.openSettings();
  };

  const handleHelpCenter = () => {
    Linking.openURL('https://hapn.app/help');
  };

  const handlePrivacy = () => {
    Linking.openURL('https://hapn.app/privacy');
  };

  const handleTerms = () => {
    Linking.openURL('https://hapn.app/terms');
  };

  const displayName =
    user?.full_name || user?.email?.split('@')[0] || t('profile.guest') || 'Guest';

  const username = user?.email ? `@${user.email.split('@')[0]}` : '';

  // Mevcut dili al
  const currentLanguage = i18n.language === 'tr' ? 'Türkçe' : 'English';

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {displayName.charAt(0).toUpperCase()}
            </Text>
          </View>

          <Text style={styles.displayName}>{displayName}</Text>

          {username && <Text style={styles.username}>{username}</Text>}
        </View>

        {/* Account Section */}
        {isAuthenticated && (
          <SectionCard>
            <SectionHeader title={t('profile.account') || 'Account'} />
            <MenuItem
              iconName="mail-outline"
              title={t('profile.emailAddress') || 'Email Address'}
              subtitle={user?.email}
            />
            <MenuItem
              iconName="create-outline"
              title={t('profile.editProfile') || 'Edit Profile'}
              onPress={() => router.push('/edit-profile')}
            />
          </SectionCard>
        )}

        {/* Preferences Section */}
        <SectionCard>
          <SectionHeader title={t('profile.preferences') || 'Preferences'} />
          <MenuItem
            iconName="notifications-outline"
            title={t('profile.notifications') || 'Notifications'}
            rightElement={
              <Switch
                value={notificationsEnabled}
                onValueChange={handleNotificationToggle}
                trackColor={{ false: '#3e3e3e', true: 'rgba(212, 175, 53, 0.4)' }}
                thumbColor={notificationsEnabled ? '#d4af35' : '#f4f3f4'}
                accessibilityLabel="Toggle notifications"
              />
            }
          />
          <MenuItem
            iconName="globe-outline"
            title={t('profile.language') || 'Language'}
            subtitle={currentLanguage}
            onPress={handleLanguagePress}
          />
        </SectionCard>

        {/* Support Section */}
        <SectionCard>
          <SectionHeader title={t('profile.support') || 'Support'} />
          <MenuItem iconName="help-circle-outline" title={t('profile.helpCenter') || 'Help Center'} onPress={handleHelpCenter} />
          <MenuItem iconName="document-text-outline" title={t('profile.privacyPolicy') || 'Privacy Policy'} onPress={handlePrivacy} />
          <MenuItem iconName="clipboard-outline" title={t('profile.termsOfService') || 'Terms of Service'} onPress={handleTerms} />
        </SectionCard>

        {/* Logout Button */}
        {isAuthenticated && (
          <View style={styles.logoutContainer}>
            <TouchableOpacity
              onPress={handleLogout}
              activeOpacity={0.85}
              style={styles.logoutButton}
              accessibilityLabel={t('profile.logout') || 'Log Out'}
              accessibilityRole="button"
            >
              <Text style={styles.logoutText}>
                {t('profile.logout') || 'LOG OUT'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <Text style={styles.version}>Version 1.0.0</Text>

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

/* ────────────────────────────────────────── */
/* STYLES                                     */
/* ────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    color: colors.gold,
    fontSize: 32,
    fontWeight: '600',
  },
  displayName: {
    color: colors.champagne,
    fontSize: 20,
    fontWeight: '600',
  },
  username: {
    color: colors.muted,
    fontSize: 14,
    marginTop: 4,
  },
  sectionCard: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.borderGold,
    overflow: 'hidden',
  },
  sectionHeader: {
    color: colors.gold,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: colors.borderSubtle,
    minHeight: 56,
  },
  menuIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    backgroundColor: 'rgba(212, 175, 53, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    color: colors.champagne,
    fontSize: 15,
    fontWeight: '500',
  },
  menuSubtitle: {
    color: colors.muted,
    fontSize: 13,
    marginTop: 2,
  },
  logoutContainer: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(209, 94, 94, 0.4)',
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  logoutText: {
    color: colors.error,
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 1,
  },
  version: {
    textAlign: 'center',
    color: colors.muted,
    fontSize: 12,
  },
});
