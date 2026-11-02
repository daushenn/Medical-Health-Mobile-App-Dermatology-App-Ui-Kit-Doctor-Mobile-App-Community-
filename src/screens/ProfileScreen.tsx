import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';
import { useAuth } from '../navigation/AuthContext';

type Item = { label: string; icon: keyof typeof Ionicons.glyphMap; chevron?: boolean; onPress?: () => void };

export default function ProfileScreen() {
  const { signOut } = useAuth();

  const items: Item[] = [
    { label: 'Profile', icon: 'person-outline', chevron: true },
    { label: 'Favorite', icon: 'heart-outline', chevron: true },
    { label: 'Payment Method', icon: 'wallet-outline', chevron: true },
    { label: 'Privacy Policy', icon: 'lock-closed-outline', chevron: true },
    { label: 'Settings', icon: 'settings-outline', chevron: true },
    { label: 'Help', icon: 'help-outline', chevron: true },
    {
      label: 'Logout',
      icon: 'log-out-outline',
      onPress: () =>
        Alert.alert('Logout', 'Are you sure you want to log out?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Logout', style: 'destructive', onPress: signOut },
        ]),
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>My Profile</Text>

        <View style={styles.avatarWrap}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={64} color={colors.light} />
          </View>
          <TouchableOpacity style={styles.editBadge}>
            <Ionicons name="pencil" size={14} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>John Doe</Text>

        <View style={styles.list}>
          {items.map((it) => (
            <TouchableOpacity key={it.label} style={styles.row} activeOpacity={0.6} onPress={it.onPress}>
              <View style={styles.iconCircle}>
                <Ionicons name={it.icon} size={22} color={colors.primary} />
              </View>
              <Text style={styles.label}>{it.label}</Text>
              {it.chevron && <Ionicons name="chevron-forward" size={18} color="#A9B7F5" />}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { color: colors.primary, fontSize: 22, fontWeight: '700', textAlign: 'center', marginTop: 16 },
  avatarWrap: { alignSelf: 'center', marginTop: 12 },
  avatar: {
    width: 104, height: 104, borderRadius: 52, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  editBadge: {
    position: 'absolute', right: 0, bottom: 4, width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.primary, borderWidth: 2, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  name: { color: '#000', fontSize: 20, fontWeight: '700', textAlign: 'center', marginTop: 10 },
  list: { marginTop: 24, paddingHorizontal: 24, gap: 18 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 20 },
  iconCircle: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.light,
    alignItems: 'center', justifyContent: 'center',
  },
  label: { flex: 1, color: '#000', fontSize: 16 },
});