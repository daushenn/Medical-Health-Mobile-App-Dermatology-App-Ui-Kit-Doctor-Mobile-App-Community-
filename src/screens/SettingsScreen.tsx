import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../navigation/AuthContext';
import type { Nav } from '../navigation/types';

export default function SettingsScreen() {
  const navigation = useNavigation<Nav>();
  const { signOut } = useAuth();

  const deleteAccount = () =>
    Alert.alert('Delete Account', 'This will permanently remove your account and appointments. Continue?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: signOut },
    ]);

  const items: { label: string; icon: keyof typeof Ionicons.glyphMap; onPress: () => void }[] = [
    { label: 'Notification Setting', icon: 'bulb-outline', onPress: () => navigation.navigate('NotificationSetting') },
    { label: 'Password Manager', icon: 'key-outline', onPress: () => navigation.navigate('PasswordManager') },
    { label: 'Delete Account', icon: 'person-outline', onPress: deleteAccount },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Settings" />
      <View style={styles.list}>
        {items.map((it) => (
          <TouchableOpacity key={it.label} style={styles.row} onPress={it.onPress} activeOpacity={0.6}>
            <Ionicons name={it.icon} size={26} color={colors.primary} />
            <Text style={styles.label}>{it.label}</Text>
            <Ionicons name="chevron-forward" size={20} color={colors.primary} />
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  list: { paddingHorizontal: 24, marginTop: 24, gap: 26 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  label: { flex: 1, color: '#000', fontSize: 16 },
});
