import { PermissionsAndroid, Platform, Alert, Linking } from 'react-native';

export const requestSMSPermissions = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    // For Android 10+ we need to request multiple permissions
    const permissions = [
      PermissionsAndroid.PERMISSIONS.SEND_SMS,
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      PermissionsAndroid.PERMISSIONS.WRITE_SMS,
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
    ].filter(permission => permission != null && permission !== ''); // Filter out null/undefined permissions

    if (permissions.length === 0) {
      console.error('No valid permissions to request');
      return false;
    }

    console.log('Requesting permissions:', permissions);

    // Check if permissions are already granted
    const granted = await PermissionsAndroid.requestMultiple(permissions);
    
    const allGranted = Object.values(granted).every(
      result => result === PermissionsAndroid.RESULTS.GRANTED
    );

    if (!allGranted) {
      Alert.alert(
        'SMS Permissions Required',
        'This app needs SMS permissions to function properly. Please grant all permissions in Settings.',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Open Settings',
            onPress: () => {
              Linking.openSettings();
            },
          },
        ]
      );
      return false;
    }

    return true;
  } catch (err) {
    console.warn('Permission request failed:', err);
    return false;
  }
};

export const checkSMSPermissions = async () => {
  if (Platform.OS !== 'android') {
    return true;
  }

  try {
    const permissions = [
      PermissionsAndroid.PERMISSIONS.SEND_SMS,
      PermissionsAndroid.PERMISSIONS.RECEIVE_SMS,
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      PermissionsAndroid.PERMISSIONS.WRITE_SMS,
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
    ].filter(permission => permission != null && permission !== ''); // Filter out null/undefined permissions

    if (permissions.length === 0) {
      console.error('No valid permissions to check');
      return false;
    }

    const results = await Promise.all(
      permissions.map(permission => PermissionsAndroid.check(permission))
    );

    return results.every(result => result === true);
  } catch (err) {
    console.warn('Permission check failed:', err);
    return false;
  }
};