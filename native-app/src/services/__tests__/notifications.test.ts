import { scheduleExpiryNotification } from '../notifications';
import * as Notifications from 'expo-notifications';

jest.mock('expo-notifications');

describe('scheduleExpiryNotification', () => {
  it('should request permissions and schedule notification', async () => {
    const requestPermissionsAsync = Notifications.requestPermissionsAsync as jest.Mock;
    requestPermissionsAsync.mockResolvedValue({ status: 'granted' });
    
    const scheduleNotificationAsync = Notifications.scheduleNotificationAsync as jest.Mock;
    scheduleNotificationAsync.mockResolvedValue('notification-id');

    const expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + 1); // tomorrow

    await scheduleExpiryNotification('Item 1', expiryDate);

    expect(requestPermissionsAsync).toHaveBeenCalled();
    expect(scheduleNotificationAsync).toHaveBeenCalledWith(expect.objectContaining({
      content: {
        title: 'Item 1 is expiring',
        body: 'Your item Item 1 will expire on ' + expiryDate.toDateString(),
      },
      trigger: expect.any(Object),
    }));
  });
});
