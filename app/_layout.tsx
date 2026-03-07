/**
 * Root Layout - Expo Router
 */

import { useEffect } from 'react';
import '../i18n/config';
import { Stack, useRouter } from 'expo-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as JotaiProvider } from 'jotai';
import { StatusBar } from 'expo-status-bar';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import ErrorBoundary from '../shared/components/ErrorBoundary';

// Notification handler yapılandırması
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

// Push notification izni iste
async function requestNotificationPermission() {
  if (!Device.isDevice) {
    return;
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  if (existingStatus !== 'granted') {
    await Notifications.requestPermissionsAsync();
  }

  // Android için notification channel ayarla
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
    });
  }
}

function RootContent() {
  const router = useRouter();

  // Uygulama açılışında notification izni iste
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  // Notification listener
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      if (__DEV__) console.log('Notification received:', notification);
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      if (__DEV__) console.log('Notification response:', response);
      const data = response.notification.request.content.data;
      if (data?.eventId) {
        router.push(`/event/${data.eventId}`);
      }
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, [router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="event/[id]" />
      <Stack.Screen name="edit-profile" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <RootContent />
              <StatusBar style="light" />
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </JotaiProvider>
    </ErrorBoundary>
  );
}
