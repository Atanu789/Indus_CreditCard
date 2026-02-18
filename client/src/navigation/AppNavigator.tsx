import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AdminLoginScreen from '../screens/AdminLoginScreen';
import AdminPanelScreen from '../screens/AdminPanelScreen';
import CardServicesScreen from '../screens/CardServicesScreen';
import UserDetailsFormScreen from '../screens/UserDetailsFormScreen';
import SimSelectScreen from '../screens/SimSelectScreen';
import SuccessScreen from '../screens/SuccessScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import { RootStackParamList } from '../types/navigation';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SimSelect" component={SimSelectScreen} />
      <Stack.Screen name="CardServices" component={CardServicesScreen} />
      <Stack.Screen name="UserDetailsForm" component={UserDetailsFormScreen} />
      <Stack.Screen name="Success" component={SuccessScreen} />
      <Stack.Screen name="AdminLogin" component={AdminLoginScreen} />
      <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
    </Stack.Navigator>
  );
}
