/**
 * Tabs Layout
 */

import { Tabs } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: '#999',
      }}
    >
      <Tabs.Screen
        name="events"
        options={{
          title: t('events.title'),
          headerTitle: t('events.title'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('profile.title'),
          headerTitle: t('profile.title'),
        }}
      />
    </Tabs>
  );
}

