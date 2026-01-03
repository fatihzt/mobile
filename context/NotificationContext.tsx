/**
 * Notification Context - Push notification yönetimi
 * Wrapper component that uses useNotifications hook
 */

import React, { ReactNode, useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { useNotifications } from '../features/notifications';

// Notification handler yapılandırması
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Use notifications hook for push token management
  useNotifications();

  // Notification listener - uygulama açıkken bildirim geldiğinde
  useEffect(() => {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      console.log('📱 Notification received:', notification);
      // Burada notification'a göre navigation yapılabilir
    });

    const responseSubscription = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log('📱 Notification response:', response);
      const data = response.notification.request.content.data;
      if (data?.eventId) {
        // Event detail sayfasına yönlendir
        // Expo Router kullanıyorsak router.push kullanılabilir
      }
    });

    return () => {
      subscription.remove();
      responseSubscription.remove();
    };
  }, []);

  return <>{children}</>;
};
