/**
 * Notifications Hook
 */

import { useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { expoPushTokenAtom, isRegisteredAtom } from '../store/notificationAtoms';
import notificationService from '../services/notificationService';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../auth/store/authAtoms';

export const useNotifications = () => {
  const [expoPushToken, setExpoPushToken] = useAtom(expoPushTokenAtom);
  const [isRegistered, setIsRegistered] = useAtom(isRegisteredAtom);
  const user = useAtomValue(userAtom);

  const registerForPushNotifications = useCallback(async () => {
    if (!user?.id) return;

    try {
      const token = await notificationService.registerForPushNotifications(user.id);
      if (token) {
        setExpoPushToken(token);
        setIsRegistered(true);
      }
    } catch (error) {
      console.error('Error registering for push notifications:', error);
    }
  }, [user?.id, setExpoPushToken, setIsRegistered]);

  useEffect(() => {
    if (user?.id && !isRegistered) {
      registerForPushNotifications();
    }
  }, [user?.id, isRegistered, registerForPushNotifications]);

  return {
    expoPushToken,
    isRegistered,
    registerForPushNotifications,
  };
};

