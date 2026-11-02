import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../theme';
import { doctors, services } from '../data/doctors';
import { useFavorites } from '../data/FavoritesContext';
import DoctorRow from '../components/DoctorRow';
import ScreenHeader from '../components/ScreenHeader';
import SortBar from '../components/SortBar';
import { Sort, sortDoctors } from '../utils/doctors';
import type { Nav } from '../navigation/types';

const OPTIONS: Sort[] = ['az', 'rating', 'female', 'male'];

export default function FavoritesScreen() {
  const navigation = useNavigation<Nav>();
  const { doctorIds, serviceNames, toggleDoctor, toggleService } = useFavorites();
  const [tab, setTab] = useState<'doctors' | 'services'>('doctors');
  const [sort, setSort] = useState<Sort>('az');
  const [open, setOpen] = useState<string | null>(null);

  const favDoctors = useMemo(
    () => sortDoctors(doctors.filter((d) => doctorIds.includes(d.id)), sort),
    [doctorIds, sort],
  );
  const favServices = useMemo(
    () => services.filter((s) => serviceNames.includes(s.name)).sort((a, b) => a.name.localeCompare(b.name)),
    [serviceNames],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Favorite" />
      {tab === 'doctors' && <SortBar options={OPTIONS} value={sort} onChange={setSort} />}

      <View style={styles.tabs}>
        {(['doctors', 'services'] as const).map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, tab === t && styles.tabActive]}
            onPress={() => setTab(t)}
          >
            <Text style={[styles.tabText, tab === t && { color: '#fff' }]}>
              {t === 'doctors' ? 'Doctors' : 'Services'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {tab === 'doctors' ? (
          favDoctors.length === 0 ? (
            <Text style={styles.empty}>No favorite doctors yet. Tap the heart on a doctor to add one.</Text>
          ) : (
            favDoctors.map((d) => (
              <DoctorRow
                key={d.id}
                doctor={d}
                variant="favorite"
                favorite
                onInfo={() => navigation.navigate('Doctor', { doctorId: d.id })}
                onBook={() => navigation.navigate('Booking', { doctorId: d.id })}
                onToggleFavorite={() => toggleDoctor(d.id)}
              />
            ))
          )
        ) : favServices.length === 0 ? (
          <Text style={styles.empty}>No favorite services yet.</Text>
        ) : (
          <View style={{ paddingHorizontal: 16, gap: 8 }}>
            {favServices.map((s) => {
              const expanded = open === s.name;
              return (
                <View key={s.name} style={{ gap: 8 }}>
                  <TouchableOpacity
                    style={styles.service}
                    activeOpacity={0.85}
                    onPress={() => setOpen(expanded ? null : s.name)}
                  >
                    <TouchableOpacity onPress={() => toggleService(s.name)} hitSlop={8}>
                      <Ionicons name="heart" size={18} color="#fff" />
                    </TouchableOpacity>
                    <Text style={styles.serviceText}>{s.name}</Text>
                    <Ionicons name={expanded ? 'chevron-up-circle' : 'chevron-down-circle'} size={24} color="#fff" />
                  </TouchableOpacity>
                  {expanded && (
                    <>
                      <View style={styles.serviceBody}>
                        <Text style={styles.serviceBodyText}>{s.text}</Text>
                      </View>
                      <TouchableOpacity
                        style={styles.looking}
                        onPress={() => navigation.navigate('Doctors', { query: s.name })}
                      >
                        <Text style={styles.lookingText}>looking doctors</Text>
                      </TouchableOpacity>
                    </>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabs: { flexDirection: 'row', gap: 12, paddingHorizontal: 16, marginBottom: 16 },
  tab: { flex: 1, height: 40, borderRadius: 20, backgroundColor: colors.light, alignItems: 'center', justifyContent: 'center' },
  tabActive: { backgroundColor: colors.primary },
  tabText: { color: colors.primary, fontSize: 16, fontWeight: '500' },
  empty: { color: colors.text, textAlign: 'center', marginTop: 40, paddingHorizontal: 32, fontSize: 13 },
  service: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primary,
    borderRadius: 20, paddingHorizontal: 14, height: 40,
  },
  serviceText: { flex: 1, color: '#fff', fontSize: 14, fontWeight: '700' },
  serviceBody: { backgroundColor: colors.light, borderRadius: 20, padding: 16 },
  serviceBodyText: { color: colors.text, fontSize: 11, lineHeight: 16, textAlign: 'center' },
  looking: { backgroundColor: colors.light, borderRadius: 20, height: 40, alignItems: 'center', justifyContent: 'center' },
  lookingText: { color: colors.primary, fontSize: 16, fontWeight: '600' },
});
