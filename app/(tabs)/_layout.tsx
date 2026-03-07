import { Tabs } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';

/* ────────────────────────────────────────── */
/* COLORS                                      */
/* ────────────────────────────────────────── */
const colors = {
  background: '#171612',
  gold: '#d4af35',
  champagne: '#f2f0e9',
  platinum: '#b6b1a0',
  muted: '#9e9888',
  borderGold: 'rgba(212, 175, 53, 0.15)',
};

/* ────────────────────────────────────────── */
/* COMPONENTS                                  */
/* ────────────────────────────────────────── */

const TabIcon = ({ focused, label, iconName }: { focused: boolean; label: string; iconName: keyof typeof Ionicons.glyphMap }) => (
  <View style={styles.tabIconContainer}>
    <Ionicons
      name={iconName}
      size={24}
      color={focused ? colors.gold : colors.muted}
      style={styles.tabIcon}
    />
    <Text style={[styles.tabLabel, focused && styles.tabLabelActive]} numberOfLines={1}>
      {label}
    </Text>
  </View>
);

/* ────────────────────────────────────────── */
/* LAYOUT                                     */
/* ────────────────────────────────────────── */

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: colors.background,
          borderBottomWidth: 1,
          borderBottomColor: colors.borderGold,
          elevation: 0,
          shadowOpacity: 0,
        },
        headerTitleStyle: {
          color: colors.champagne,
          fontSize: 18,
          fontWeight: '600',
        },
        headerTintColor: colors.gold,
        tabBarStyle: {
          backgroundColor: colors.background,
          borderTopWidth: 1,
          borderTopColor: colors.borderGold,
          height: 85,
          paddingBottom: 25,
          paddingTop: 8,
        },
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.gold,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tabs.Screen
        name="events"
        options={{
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label={t('nav.home') || 'Home'}
              iconName={focused ? 'home' : 'home-outline'}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile.title') || 'Profile',
          tabBarIcon: ({ focused }) => (
            <TabIcon
              focused={focused}
              label={t('nav.profile') || 'Profile'}
              iconName={focused ? 'person' : 'person-outline'}
            />
          ),
        }}
      />
    </Tabs>
  );
}

/* ────────────────────────────────────────── */
/* STYLES                                     */
/* ────────────────────────────────────────── */

const styles = StyleSheet.create({
  tabIconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 8,
    minHeight: 44,
    minWidth: 44,
  },
  tabIcon: {
    marginBottom: 4,
  },
  tabLabel: {
    fontSize: 10,
    color: colors.muted,
  },
  tabLabelActive: {
    color: colors.gold,
    fontWeight: '500',
  },
});
