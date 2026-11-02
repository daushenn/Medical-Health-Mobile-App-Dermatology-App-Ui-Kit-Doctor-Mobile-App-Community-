import { StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';

export default function SocialRow() {
  return (
    <View style={styles.social}>
      <View style={styles.circle}><Ionicons name="logo-google" size={20} color={colors.primary} /></View>
      <View style={styles.circle}><Ionicons name="logo-facebook" size={22} color={colors.primary} /></View>
      <View style={styles.circle}><Ionicons name="finger-print" size={24} color={colors.primary} /></View>
    </View>
  );
}

const styles = StyleSheet.create({
  social: { flexDirection: 'row', justifyContent: 'center', gap: 14, marginTop: 12 },
  circle: {
    width: 42, height: 42, borderRadius: 21, backgroundColor: colors.light,
    alignItems: 'center', justifyContent: 'center',
  },
});
