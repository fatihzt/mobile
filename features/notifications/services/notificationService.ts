/**
 * Notification Service - Push notification management
 */

import api from '../../../shared/services/api';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

class NotificationService {
  async registerForPushNotifications(userId: string): Promise<string | null> {
    if (!Device.isDevice) {
      if (__DEV__) console.warn('⚠️ Push notifications only work on physical devices');
      return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      if (__DEV__) console.warn('⚠️ Failed to get push token for push notification!');
      return null;
    }

    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID,
    });

    const token = tokenData.data;

    // Backend'e token gönder
    try {
      if (__DEV__) console.log('📱 RegisterPushToken Request:', { userId, platform: Platform.OS });
      const response = await api.post('/notifications/register', {
        token,
        platform: Platform.OS,
        userId,
      });
      if (__DEV__) console.log('✅ Push token registered successfully:', response.data);
    } catch (error: any) {
      if (__DEV__) console.error('❌ Failed to register push token:', {
        message: error?.message,
        error: error?.error,
        response: error?.response,
        userId,
      });
    }

    return token;
  }
}

export default new NotificationService();

