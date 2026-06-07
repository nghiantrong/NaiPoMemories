import { useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useAuthStore } from '@/store/auth.store';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '@/lib/firebase';
import { notificationTemplates } from '../constants/notificationTemplates';

// Set notification handler for foreground notifications
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function useNotifications() {
  const user = useAuthStore((state) => state.user);
  const notificationListener = useRef<Notifications.Subscription | null>(null);
  const responseListener = useRef<Notifications.Subscription | null>(null);

  useEffect(() => {
    if (user?.uid) {
      registerForPushNotificationsAsync().then((token) => {
        if (token) {
          // Save to Firestore
          savePushToken(user.uid, token);
        }
      });
    }

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      console.log('Notification Received', notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification Response', response);
    });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [user?.uid]);

  const savePushToken = async (userId: string, token: string) => {
    try {
      const userRef = doc(firestore, 'users', userId);
      await updateDoc(userRef, {
        expoPushToken: token,
      });
      console.log('[useNotifications] Push token saved to user doc');
    } catch (e) {
      console.error('[useNotifications] Failed to save push token', e);
    }
  };

  const schedule12HourReminder = async () => {
    try {
      // Cancel all existing scheduled notifications first
      await Notifications.cancelAllScheduledNotificationsAsync();
      
      // Schedule new one for 12 hours from now
      await Notifications.scheduleNotificationAsync({
        content: notificationTemplates.reminder12h,
        trigger: {
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
          seconds: 12 * 60 * 60, // 12 hours
        },
      });
      console.log('[useNotifications] 12-hour reminder scheduled');
    } catch (e) {
      console.error('[useNotifications] Failed to schedule reminder', e);
    }
  };

  return {
    schedule12HourReminder,
  };
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
    
    // Use project ID for Expo Push API
    const projectId =
      Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      
    if (!projectId) {
      console.warn('Project ID not found. Ensure app.json has eas.projectId if using EAS.');
    }
    
    try {
      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId,
        })
      ).data;
      console.log('Expo Push Token:', token);
    } catch (e) {
      console.log('Error getting push token', e);
    }
  } else {
    console.log('Must use physical device for Push Notifications');
  }

  return token;
}
