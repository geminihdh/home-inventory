import * as Notifications from 'expo-notifications';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const scheduleExpiryNotification = async (itemName: string, expiryDate: Date) => {
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.log('Permission not granted');
    return;
  }

  await Notifications.scheduleNotificationAsync({
    content: {
      title: `${itemName} is expiring`,
      body: `Your item ${itemName} will expire on ${expiryDate.toDateString()}`,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: expiryDate,
    },
  });
};
