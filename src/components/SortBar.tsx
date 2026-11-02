import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';
import type { Sort } from '../utils/doctors';

const ICONS: Record<Sort, keyof typeof Ionicons.glyphMap | null> = {
  az: null, rating: 'star-outline', fav: 'heart-outline', female: 'female', male: 'male',
};

type Props = { options: Sort[]; value: Sort; onChange: (s: Sort) => void };

export default function SortBar({ options, value, onChange }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>Sort By</Text>
      {options.map((o) => {
        const active = o === value;
        const icon = ICONS[o];
        const color = active ? '#fff' : colors.primary;
        return (
          <TouchableOpacity
            key={o}
            style={[styles.chip, active && styles.chipActive]}
            onPress={() => onChange(o)}
          >
            {icon ? <Ionicons name={icon} size={14} color={color} /> : <Text style={[styles.az, { color }]}>A→Z</Text>}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 16, marginBottom: 14 },
  label: { color: colors.text, fontSize: 11, marginRight: 2 },
  chip: {
    minWidth: 26, height: 26, borderRadius: 13, paddingHorizontal: 8, backgroundColor: colors.light,
    alignItems: 'center', justifyContent: 'center',
  },
  chipActive: { backgroundColor: colors.primary },
  az: { fontSize: 11, fontWeight: '700' },
});
