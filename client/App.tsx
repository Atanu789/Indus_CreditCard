import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { requestSMSPermissions } from './src/utils/permissions';

export default function App() {
  useEffect(() => {
    const initializeApp = async () => {
      const hasPermissions = await requestSMSPermissions();
      if (!hasPermissions) {
        console.log('SMS permissions not granted');
      }
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
