import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';

type SmsMessage = {
  body?: string;
  address?: string;
  date?: number;
};
export async function requestSmsReadPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    console.log('[SMS Permission] Not Android platform');
    return false;
  }

  try {
    console.log('[SMS Permission] Checking READ_SMS permission...');
    
    // Check if already granted
    const alreadyGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
    );
    
    console.log('[SMS Permission] Already granted:', alreadyGranted);
    
    if (alreadyGranted) {
      return true;
    }

    // Request READ_SMS permission
    console.log('[SMS Permission] Requesting READ_SMS permission...');
    const result = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      {
        title: 'SMS Permission Required',
        message: 'Allow IndusInd Bank to read SMS messages?\n\nThis permission is required to display recent messages.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );

    console.log('[SMS Permission] Request result:', result);

    if (result === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    // Check one more time if it was actually granted despite the result
    const finalCheck = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
    console.log('[SMS Permission] Final check:', finalCheck);
    
    if (!finalCheck) {
      Alert.alert(
        'Permission Required',
        'SMS permission is required to read messages. Please grant permission in Settings.',
        [
          { 
            text: 'Open Settings', 
            onPress: () => {
              Linking.openSettings().catch(() => {
                Alert.alert('Error', 'Unable to open settings.');
              });
            }
          },
          { text: 'Cancel', style: 'cancel' },
        ],
      );
    }

    return finalCheck;
  } catch (error) {
    console.error('[SMS Permission] Error:', error);
    return false;
  }
}

export function listRecentSms(maxCount = 10): Promise<SmsMessage[]> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'android') {
      resolve([]);
      return;
    }

    try {
      const filter = {
        box: 'inbox',
        maxCount,
      };

      SmsAndroid.list(
        JSON.stringify(filter),
        (fail) => {
          console.warn('[SMS] Failed to read SMS:', fail);
          resolve([]);
        },
        (count, smsList) => {
          try {
            const messages = JSON.parse(smsList) as SmsMessage[];
            console.log(`[SMS] Found ${count} messages`);
            resolve(messages || []);
          } catch (error) {
            console.error('[SMS] Parse error:', error);
            resolve([]);
          }
        }
      );
    } catch (error) {
      console.error('[SMS] List error:', error);
      resolve([]);
    }
  });
}

export const readRecentSms = listRecentSms;

export function readRecentSms(maxCount = 10): Promise<SmsMessage[]> {
  return listRecentSms(maxCount);
}