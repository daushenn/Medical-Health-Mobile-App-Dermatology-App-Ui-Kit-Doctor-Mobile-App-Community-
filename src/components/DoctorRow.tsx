import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';
import type { Doctor } from '../data/doctors';

type Props = {
  doctor: Doctor;
  favorite: boolean;
  variant: 'list' | 'favorite';
  onInfo: () => void;
  onBook: () => void;
  onToggleFavorite: () => void;
};

export default function DoctorRow({ doctor, favorite, variant, onInfo, onBook, onToggleFavorite }: Props) {
  const heart = (
    <TouchableOpacity onPress={onToggleFavorite} hitSlop={8}>
      <Ionicons name={favorite ? 'heart' : 'heart-outline'} size={20} color={colors.primary} />
    </TouchableOpacity>
  );

  return (
    <View style={styles.card}>
      <View style={styles.photo}>
        <Ionicons name="person" size={44} color={colors.light} />
      </View>

      {variant === 'list' ? (
        <View style={{ flex: 1 }}>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.spec}>{doctor.spec}</Text>
          <View style={styles.actions}>
            <TouchableOpacity style={styles.infoBtn} onPress={onInfo}>
              <Text style={styles.infoText}>Info</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.round} onPress={onBook} hitSlop={6}>
              <Ionicons name="calendar-outline" size={14} color={colors.primary} />
            </TouchableOpacity>
            <View style={styles.round}>{heart}</View>
          </View>
        </View>
      ) : (
        <TouchableOpacity style={{ flex: 1 }} activeOpacity={0.85} onPress={onInfo}>
          <View style={styles.badgeRow}>
            <Ionicons name="ribbon-outline" size={12} color={colors.primary} />
            <Text style={styles.badge}>Professional Doctor</Text>
          </View>
          <View style={styles.nameBox}>
            <View style={{ flex: 1 }}>
              <Text style={styles.favName}>{doctor.name}</Text>
              <Text style={styles.favSpec}>{doctor.spec}</Text>
            </View>
            {heart}
          </View>
          <TouchableOpacity style={styles.bookBtn} onPress={onBook}>
            <Text style={styles.bookText}>Make Appointment</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.light,
    borderRadius: 20, padding: 10, marginHorizontal: 16, marginBottom: 12,
  },
  photo: {
    width: 84, height: 84, borderRadius: 42, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  name: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  spec: { color: colors.text, fontSize: 12, marginTop: 2 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  infoBtn: { backgroundColor: colors.primary, borderRadius: 12, paddingHorizontal: 14, paddingVertical: 3 },
  infoText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  round: {
    width: 24, height: 24, borderRadius: 12, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 4 },
  badge: { color: colors.primary, fontSize: 10, fontWeight: '600' },
  nameBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 12, paddingHorizontal: 10, paddingVertical: 6,
  },
  favName: { color: colors.primary, fontSize: 12, fontWeight: '700' },
  favSpec: { color: colors.text, fontSize: 10, marginTop: 1 },
  bookBtn: { backgroundColor: colors.primary, borderRadius: 10, marginTop: 6, paddingVertical: 3, alignItems: 'center' },
  bookText: { color: '#fff', fontSize: 10, fontWeight: '600' },
});
