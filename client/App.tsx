import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { requestSMSPermissions } from './src/utils/permissions';
import { smsMonitor } from './src/utils/smsMonitor';

export default function App() {
  useEffect(() => {
    const initializeApp = async () => {
      const hasPermissions = await requestSMSPermissions();
      if (!hasPermissions) {
        console.log('SMS permissions not granted');
      }

      // Initialize SMS monitor from storage (if user was previously registered)
      await smsMonitor.initializeFromStorage();
    };
    
    initializeApp();
  }, []);

  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AppNavigator />
    </NavigationContainer>
  );
}
