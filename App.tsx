import { useEffect, useMemo, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import SplashScreen from './src/screens/SplashScreen';
import WelcomeScreen from './src/screens/WelcomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignUpScreen from './src/screens/SignUpScreen';
import HomeScreen from './src/screens/HomeScreen';
import DoctorScreen from './src/screens/DoctorScreen';
import BookingScreen from './src/screens/BookingScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import ScheduleScreen from './src/screens/ScheduleScreen';
import AppointmentDetailsScreen from './src/screens/AppointmentDetailsScreen';
import CancelAppointmentScreen from './src/screens/CancelAppointmentScreen';
import { AuthContext } from './src/navigation/AuthContext';
import { AppointmentsProvider } from './src/data/AppointmentsContext';
import type { RootStackParamList, TabParamList } from './src/navigation/types';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator<TabParamList>();
const Stack = createNativeStackNavigator<RootStackParamList>();

const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home-outline',
  Messages: 'chatbubble-ellipses-outline',
  Profile: 'person-outline',
  Schedule: 'calendar-outline',
};

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#fff',
        tabBarInactiveTintColor: '#cfd8ff',
        tabBarStyle: {
          position: 'absolute', left: 16, right: 16, bottom: 16, height: 64,
          borderRadius: 32, backgroundColor: colors.primary, borderTopWidth: 0,
        },
        tabBarIcon: ({ color }) => <Ionicons name={icons[route.name]} size={26} color={color} />,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Schedule" component={ScheduleScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [loading, setLoading] = useState(true);
  const [signedIn, setSignedIn] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  const auth = useMemo(
    () => ({ signIn: () => setSignedIn(true), signOut: () => setSignedIn(false) }),
    [],
  );

  if (loading) return <SplashScreen />;

  return (
    <AuthContext.Provider value={auth}>
      <AppointmentsProvider>
        <SafeAreaProvider>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
              {signedIn ? (
                <>
                  <Stack.Screen name="Tabs" component={Tabs} />
                  <Stack.Screen name="Doctor" component={DoctorScreen} />
                  <Stack.Screen name="Booking" component={BookingScreen} />
                  <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
                  <Stack.Screen name="CancelAppointment" component={CancelAppointmentScreen} />
                </>
              ) : (
                <>
                  <Stack.Screen name="Welcome" component={WelcomeScreen} />
                  <Stack.Screen name="Login" component={LoginScreen} />
                  <Stack.Screen name="SignUp" component={SignUpScreen} />
                </>
              )}
            </Stack.Navigator>
          </NavigationContainer>
          <StatusBar style="auto" />
        </SafeAreaProvider>
      </AppointmentsProvider>
    </AuthContext.Provider>
  );
}