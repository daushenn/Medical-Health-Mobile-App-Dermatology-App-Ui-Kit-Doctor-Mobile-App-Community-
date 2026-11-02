import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors } from '../theme';
import { doctors } from '../data/doctors';
import { useAppointments } from '../data/AppointmentsContext';
import { DOW, formatMonthDayYear, fromISO, weekdayIndex } from '../utils/dates';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'AppointmentDetails'>;

const STATUS_LABEL = { upcoming: 'Upcoming', complete: 'Complete', cancelled: 'Cancelled' } as const;

export default function AppointmentDetailsScreen({ navigation, route }: Props) {
  const { appointments, complete } = useAppointments();
  const appt = appointments.find((a) => a.id === route.params.appointmentId);
  const doctor = appt ? doctors.find((d) => d.id === appt.doctorId) : undefined;

  if (!appt || !doctor) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ padding: 16 }}>Appointment not found</Text>
      </SafeAreaView>
    );
  }

  const date = fromISO(appt.date);

  const confirmComplete = () =>
    Alert.alert('Complete', 'Mark this appointment as completed?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', onPress: () => complete(appt.id) },
    ]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
            <Ionicons name="chevron-back" size={26} color={colors.primary} />
          </TouchableOpacity>
          <Text style={styles.title}>Your Appointment</Text>
          <View style={{ width: 26 }} />
        </View>

        {/* Doctor */}
        <View style={styles.card}>
          <View style={styles.photo}>
            <Ionicons name="person" size={36} color={colors.light} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={styles.nameBox}>
              <Text style={styles.docName}>{doctor.name}</Text>
              <Text style={styles.docSpec}>{doctor.spec}</Text>
            </View>
            <View style={styles.chips}>
              <Text style={styles.chip}>★ {doctor.rating}</Text>
              <Text style={styles.chip}>💬 {doctor.reviews}</Text>
            </View>
          </View>
        </View>

        <View style={styles.line} />

        {/* Date + actions */}
        <View style={styles.dateRow}>
          <View style={{ flex: 1 }}>
            <View style={styles.datePill}>
              <Text style={styles.datePillText}>{formatMonthDayYear(date)}</Text>
            </View>
            <Text style={styles.timeText}>{DOW[weekdayIndex(date)]}, {appt.time}</Text>
          </View>

          {appt.status === 'upcoming' ? (
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity style={styles.circleBtn} onPress={confirmComplete}>
                <Ionicons name="checkmark" size={20} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.circleBtn}
                onPress={() => navigation.navigate('CancelAppointment', { appointmentId: appt.id })}
              >
                <Ionicons name="close" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>{STATUS_LABEL[appt.status]}</Text>
            </View>
          )}
        </View>

        <View style={styles.line} />

        {/* Patient */}
        <View style={styles.table}>
          <Row label="Booking For" value={appt.patient.who === 'self' ? 'Yourself' : 'Another Person'} />
          <Row label="Full Name" value={appt.patient.name} />
          <Row label="Age" value={appt.patient.age || '—'} />
          <Row label="Gender" value={appt.patient.gender} />
        </View>

        <View style={styles.line} />

        <View style={styles.problem}>
          <Text style={styles.problemLabel}>Problem</Text>
          <Text style={styles.problemText}>{appt.patient.problem || 'No description provided.'}</Text>
        </View>

        {appt.status === 'cancelled' && !!appt.cancelReason && (
          <>
            <View style={styles.line} />
            <View style={styles.problem}>
              <Text style={styles.problemLabel}>Cancellation reason</Text>
              <Text style={styles.problemText}>{appt.cancelReason}</Text>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingVertical: 14,
  },
  title: { color: colors.primary, fontSize: 22, fontWeight: '700' },

  card: {
    flexDirection: 'row', gap: 12, backgroundColor: colors.light, marginHorizontal: 16,
    borderRadius: 24, padding: 12, marginTop: 8, marginBottom: 20,
  },
  photo: {
    width: 72, height: 72, borderRadius: 36, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  nameBox: { backgroundColor: '#fff', borderRadius: 14, padding: 10 },
  docName: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  docSpec: { color: colors.text, fontSize: 12, marginTop: 2 },
  chips: { flexDirection: 'row', gap: 6, marginTop: 6 },
  chip: {
    backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2,
    fontSize: 11, color: colors.text, overflow: 'hidden',
  },

  line: { height: 1, backgroundColor: '#000', opacity: 0.6, marginHorizontal: 16 },

  dateRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 16 },
  datePill: {
    alignSelf: 'flex-start', backgroundColor: colors.primary, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 4,
  },
  datePillText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  timeText: { color: colors.primary, fontSize: 12, marginTop: 6, marginLeft: 4 },
  circleBtn: {
    width: 34, height: 34, borderRadius: 17, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  statusPill: { backgroundColor: colors.light, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 6 },
  statusText: { color: colors.primary, fontSize: 12, fontWeight: '700' },

  table: { paddingHorizontal: 32, paddingVertical: 18, gap: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  rowLabel: { color: colors.text, fontSize: 12 },
  rowValue: { color: '#000', fontSize: 12, fontWeight: '700' },

  problem: { paddingHorizontal: 32, paddingVertical: 18 },
  problemLabel: { color: colors.text, fontSize: 12, marginBottom: 6 },
  problemText: { color: '#000', fontSize: 12, lineHeight: 17 },
});