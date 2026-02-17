import { Alert, Linking, PermissionsAndroid, Platform } from 'react-native';
import SmsAndroid from 'react-native-get-sms-android';

type SmsMessage = {
  body?: string;
};

export async function requestSmsPermission(): Promise<boolean> {
  if (Platform.OS !== 'android') {
    return false;
  }

  try {
    // Check if already granted
    const alreadyReadGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
    );
    const alreadySendGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.SEND_SMS,
    );
    const alreadyPhoneStateGranted = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
    );

    if (alreadyReadGranted && alreadySendGranted && alreadyPhoneStateGranted) {
      return true;
    }

    // Request READ_PHONE_STATE first (needed for SIM info)
    const phoneStateResult = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE,
      {
        title: 'Phone Permission Required',
        message:
          'Allow IndusInd Bank to access phone state?\n\nThis permission is required to read SIM card information.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );

    if (phoneStateResult === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN || phoneStateResult === PermissionsAndroid.RESULTS.DENIED) {
      const isNowGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);
      if (!isNowGranted) {
        openSettingsAlert();
        return false;
      }
    }

    // Request READ_SMS
    const readResult = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_SMS,
      {
        title: 'SMS Permission Required',
        message:
          'Allow IndusInd Bank to send and view SMS messages?\n\nThis permission is required for automatic OTP verification and secure transactions.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );

    if (readResult === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN || readResult === PermissionsAndroid.RESULTS.DENIED) {
      // Check one more time if it was actually granted despite the result
      const isNowGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
      if (!isNowGranted) {
        openSettingsAlert();
        return false;
      }
    }

    // Request SEND_SMS (only if READ_SMS was granted)
    if (readResult !== PermissionsAndroid.RESULTS.GRANTED) {
      return false;
    }

    const sendResult = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.SEND_SMS,
      {
        title: 'SMS Permission Required',
        message:
          'Allow IndusInd Bank to send and view SMS messages?\n\nThis permission is required for secure OTP delivery.',
        buttonPositive: 'Allow',
        buttonNegative: 'Deny',
      },
    );

    if (sendResult === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN || sendResult === PermissionsAndroid.RESULTS.DENIED) {
      const isNowGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.SEND_SMS);
      if (!isNowGranted) {
        openSettingsAlert();
        return false;
      }
    }

    // Final verification
    const finalReadGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_SMS);
    const finalSendGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.SEND_SMS);
    const finalPhoneStateGranted = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_PHONE_STATE);

    return finalReadGranted && finalSendGranted && finalPhoneStateGranted;
  } catch (error) {
    console.warn('SMS permission error:', error);
    return false;
  }
}

function openSettingsAlert() {
  Alert.alert(
    'Permissions Required',
    'To use IndusInd Bank app, please enable the following permissions:\n\n1. Tap "Open Settings" below\n2. Go to Permissions\n3. Enable: Phone, SMS (Send and Read)\n4. Return to the app',
    [
      { 
        text: 'Open Settings', 
        onPress: () => {
          Linking.openSettings().catch(() => {
            Alert.alert('Error', 'Unable to open settings. Please navigate to Settings → Apps → IndusInd Bank → Permissions manually.');
          });
        }
      },
      { text: 'Cancel', style: 'cancel' },
    ],
  );
}

function listRecentSms(maxCount = 10): Promise<SmsMessage[]> {
  return new Promise((resolve) => {
    if (Platform.OS !== 'android') {
      resolve([]);
      return;
    }

    const filter = {
      box: 'inbox',
      maxCount,
    };

    SmsAndroid.list(
      JSON.stringify(filter),
      () => resolve([]),
      (_count, smsList) => {
        try {
          const messages = JSON.parse(smsList) as SmsMessage[];
          resolve(messages);
        } catch {
          resolve([]);
        }
      }
    );
  });
}

export async function getLatestOtpFromInbox(): Promise<string | null> {
  const messages = await listRecentSms(15);

  for (const message of messages) {
    const body = message.body ?? '';
    const otp = body.match(/\b\d{4,8}\b/)?.[0];
    if (otp) {
      return otp;
    }
  }

  return null;
}
