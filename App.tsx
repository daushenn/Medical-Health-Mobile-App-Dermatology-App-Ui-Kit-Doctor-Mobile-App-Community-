import { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text } from 'react-native';

import SplashScreen from './src/screens/SplashScreen';
import HomeScreen from './src/screens/HomeScreen';
import { colors } from './src/theme';

const Tab = createBottomTabNavigator();

const Placeholder = ({ title }: { title: string }) => (
  <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
    <Text>{title}</Text>
  </View>
);

const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
  Home: 'home-outline',
  Messages: 'chatbubble-ellipses-outline',
  Profile: 'person-outline',
  Schedule: 'calendar-outline',
};

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <SplashScreen />;

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarShowLabel: false,
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
          <Tab.Screen name="Messages">{() => <Placeholder title="Messages" />}</Tab.Screen>
          <Tab.Screen name="Profile">{() => <Placeholder title="Profile" />}</Tab.Screen>
          <Tab.Screen name="Schedule">{() => <Placeholder title="Schedule" />}</Tab.Screen>
        </Tab.Navigator>
      </NavigationContainer>
      <StatusBar style="auto" />
    </SafeAreaProvider>
  );
}