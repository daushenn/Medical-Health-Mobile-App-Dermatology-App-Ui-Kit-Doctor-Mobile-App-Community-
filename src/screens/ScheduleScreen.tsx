import { useState } from 'react';
import { Alert, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { colors } from '../theme';
import { doctors } from '../data/doctors';
import { Appointment, Status, useAppointments } from '../data/AppointmentsContext';
import { formatLong, fromISO } from '../utils/dates';
import type { RootStackParamList } from '../navigation/types';

const TABS: { key: Status; label: string }[] = [
  { key: 'complete', label: 'Complete' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'cancelled', label: 'Cancelled' },
];

export default function ScheduleScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { appointments, complete } = useAppointments();
  const [tab, setTab] = useState<Status>('upcoming');

  const list = appointments
    .filter((a) => a.status === tab)
    .sort((a, b) => (tab === 'upcoming' ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date)));

  const confirmComplete = (a: Appointment) =>
    Alert.alert('Complete', 'Mark this appointment as completed?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => complete(a.id) },
    ]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <Text style={styles.title}>All Appointment</Text>

      <View style={styles.tabs}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && { color: '#fff' }]}>{t.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={list}
        keyExtractor={(a) => a.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 110, gap: 12 }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="calendar-outline" size={40} color="#A9B7F5" />
            <Text style={styles.emptyTitle}>No appointments here</Text>
            <Text style={styles.emptyText}>Choose a doctor on the Home tab to book one.</Text>
          </View>
        }
        renderItem={({ item }) => {
          const doctor = doctors.find((d) => d.id === item.doctorId);
          if (!doctor) return null;
          return (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <View style={styles.photo}>
                  <Ionicons name="person" size={32} color={colors.light} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.docName} numberOfLines={1}>{doctor.name}</Text>
                  <Text style={styles.docSpec} numberOfLines={1}>{doctor.spec}</Text>
                </View>
              </View>

              <View style={styles.chips}>
                <View style={styles.chip}>
                  <Ionicons name="calendar-outline" size={12} color={colors.primary} />
                  <Text style={styles.chipText}>{formatLong(fromISO(item.date))}</Text>
                </View>
                <View style={styles.chip}>
                  <Ionicons name="time-outline" size={12} color={colors.primary} />
                  <Text style={styles.chipText}>{item.time}</Text>
                </View>
              </View>

              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.detailsBtn}
                  onPress={() => navigation.navigate('AppointmentDetails', { appointmentId: item.id })}
                >
                  <Text style={styles.detailsText}>Details</Text>
                </TouchableOpacity>
                {item.status === 'upcoming' && (
                  <>
                    <TouchableOpacity style={styles.circleBtn} onPress={() => confirmComplete(item)}>
                      <Ionicons name="checkmark" size={20} color={colors.primary} />
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.circleBtn}
                      onPress={() => navigation.navigate('CancelAppointment', { appointmentId: item.id })}
                    >
                      <Ionicons name="close" size={20} color={colors.primary} />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </View>
          );
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  title: { color: colors.primary, fontSize: 22, fontWeight: '700', textAlign: 'center', marginTop: 16 },

  tabs: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginVertical: 18 },
  tab: { flex: 1, backgroundColor: colors.light, borderRadius: 16, paddingVertical: 6, alignItems: 'center' },
  tabActive: { backgroundColor: colors.primary },
  tabText: { color: colors.primary, fontSize: 13, fontWeight: '600' },

  card: { backgroundColor: colors.light, borderRadius: 24, padding: 14, gap: 10 },
  cardTop: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  photo: {
    width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  docName: { color: colors.primary, fontSize: 14, fontWeight: '700' },
  docSpec: { color: colors.text, fontSize: 12, marginTop: 2 },
  chips: { flexDirection: 'row', gap: 8 },
  chip: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#fff',
    borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3,
  },
  chipText: { color: colors.primary, fontSize: 11 },
  actions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  detailsBtn: {
    flex: 1, height: 36, borderRadius: 18, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  detailsText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  circleBtn: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },

  empty: { alignItems: 'center', marginTop: 60, gap: 8, paddingHorizontal: 32 },
  emptyTitle: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  emptyText: { color: colors.text, fontSize: 13, textAlign: 'center' },
});