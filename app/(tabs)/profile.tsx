/**
 * Profile Screen - Expo Router
 */

import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../features/auth';

export default function ProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert(t('profile.logoutConfirmTitle'), t('profile.logoutConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('profile.logout'),
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/login');
        },
      },
    ]);
  };

  return (
    <View className="flex-1 bg-gray-50">
      <View className="bg-white p-8 items-center border-b border-gray-200">
        <View className="w-20 h-20 rounded-full bg-primary justify-center items-center mb-4">
          <Text className="text-3xl font-bold text-white">
            {user?.full_name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || 'U'}
          </Text>
        </View>
        <Text className="text-2xl font-bold mb-1 text-gray-900">{user?.full_name || 'Kullanıcı'}</Text>
        <Text className="text-base text-gray-600">{user?.email}</Text>
      </View>

      <View className="mt-4 bg-white">
        <TouchableOpacity className="p-4 border-b border-gray-200">
          <Text className="text-base text-gray-900">{t('profile.settings')}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-4 border-b border-gray-200">
          <Text className="text-base text-gray-900">{t('profile.notifications')}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-4 border-b border-gray-200">
          <Text className="text-base text-gray-900">{t('profile.about')}</Text>
        </TouchableOpacity>
        <TouchableOpacity className="p-4" onPress={handleLogout}>
          <Text className="text-base text-red-600">{t('profile.logout')}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

