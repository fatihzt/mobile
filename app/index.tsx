/**
 * Index Route - Redirects based on auth state
 */

import { Redirect } from 'expo-router';
import { useAuth } from '../features/auth';
import { View, ActivityIndicator, Text } from 'react-native';

export default function Index() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6200ee" />
        <Text className="mt-4 text-gray-600">Loading...</Text>
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/events" />;
  }

  return <Redirect href="/(auth)/login" />;
}

