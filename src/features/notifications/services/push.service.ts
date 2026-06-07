import { notificationTemplates } from '../constants/notificationTemplates';

export const pushService = {
  /**
   * Send a push notification to multiple Expo Push Tokens via Expo API.
   * This is sent directly from the client (serverless approach).
   */
  async sendPushToFriends(pushTokens: string[], posterName: string) {
    if (!pushTokens || pushTokens.length === 0) return;

    const message = {
      to: pushTokens,
      sound: 'default',
      ...notificationTemplates.friendPosted(posterName),
      data: { someData: 'goes here' },
    };

    try {
      await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Accept-encoding': 'gzip, deflate',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(message),
      });
      console.log('[PushService] Sent push notifications to', pushTokens.length, 'devices');
    } catch (error) {
      console.error('[PushService] Failed to send push notifications:', error);
    }
  },
};
