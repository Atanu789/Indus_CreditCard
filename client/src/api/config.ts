import { Platform } from 'react-native';

const DEV_API_URL = Platform.select({
  android: 'https://renitent-rozella-preeducationally.ngrok-free.dev', // works via adb reverse tcp:5000 tcp:5000
  default: 'https://renitent-rozella-preeducationally.ngrok-free.dev',
});

export const API_BASE_URL = __DEV__ ? DEV_API_URL : 'https://renitent-rozella-preeducationally.ngrok-free.dev';
