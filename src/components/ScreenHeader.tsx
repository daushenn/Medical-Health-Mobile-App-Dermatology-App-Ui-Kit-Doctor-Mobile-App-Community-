import { ReactNode } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../theme';

type Props = {
  title: string;
  right?: ReactNode;
  light?: boolean; // white text for blue backgrounds
  onBack?: () => void;
};

export default function ScreenHeader({ title, right, light, onBack }: Props) {
  const navigation = useNavigation();
  const tint = light ? '#fff' : colors.primary;

  return (
    <View style={styles.bar}>
      <TouchableOpacity onPress={onBack ?? (() => navigation.goBack())} hitSlop={10} style={styles.side}>
        <Ionicons name="chevron-back" size={26} color={tint} />
      </TouchableOpacity>
      <Text style={[styles.title, { color: tint }]} numberOfLines={1}>{title}</Text>
      <View style={[styles.side, { alignItems: 'flex-end' }]}>{right}</View>
    </View>
  );
}

export function HeaderIcon({ name, onPress }: { name: keyof typeof Ionicons.glyphMap; onPress?: () => void }) {
  return (
    <TouchableOpacity style={styles.icon} onPress={onPress} hitSlop={8}>
      <Ionicons name={name} size={15} color={colors.primary} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  bar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 14 },
  side: { width: 48 },
  title: { flex: 1, textAlign: 'center', fontSize: 22, fontWeight: '700' },
  icon: {
    width: 26, height: 26, borderRadius: 13, backgroundColor: colors.light,
    alignItems: 'center', justifyContent: 'center',
  },
});
