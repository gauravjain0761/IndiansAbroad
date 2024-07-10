import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid} from 'react-native';

export async function requestNotificationUserPermission() {
  if (Platform.OS === 'android') {
    PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
  }
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    if (authStatus === 1) {
      if (Platform.OS === 'ios') {
        await messaging()
          .registerDeviceForRemoteMessages()
          .then(async () => {
            getFirebaseToken();
          })
          .catch(() => {
            getFirebaseToken();
          });
      } else {
        getFirebaseToken();
      }
    } else {
      await messaging().requestPermission();
    }
  } else {
    await messaging().requestPermission();
  }
}

const getFirebaseToken = async () => {
  await messaging()
    .getToken()
    .then(fcmToken => {
      if (fcmToken) {
        console.log('---fcmToken---', fcmToken);
      } else {
        console.log('[FCMService] User does not have a device token');
      }
    })
    .catch(error => {
      let err = `FCm token get error${error}`;
      console.log(err);
    });
};
