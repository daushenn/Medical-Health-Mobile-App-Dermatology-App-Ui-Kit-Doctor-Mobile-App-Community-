import { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors } from '../theme';
import { doctors } from '../data/doctors';
import { useAppointments } from '../data/AppointmentsContext';
import {
  DOW, MONTHS, SLOT_COUNT, addDays, daysBetween, formatLong, fromISO,
  slotRange, startOfDay, timeAt, toISO, weekdayIndex,
} from '../utils/dates';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Booking'>;

const GENDERS = ['Male', 'Female', 'Other'] as const;
const MUTED = '#A9B7F5';
const SOFT = '#E3E9FF';
const SLOT_INDEXES = Array.from({ length: SLOT_COUNT }, (_, i) => i);

// Demo: some slots are "taken". Replace with real data later.
const demoBooked = (date: Date, idx: number) => (date.getDate() + idx) % 3 === 0;

export default function BookingScreen({ navigation, route }: Props) {
  const doctor = doctors.find((d) => d.id === route.params.doctorId) ?? doctors[0];
  const { appointments, add } = useAppointments();
  const today = startOfDay(new Date());

  const isWorkDay = (d: Date) => doctor.workDays.includes(weekdayIndex(d));

  const firstAvailable = () => {
    for (let i = 0; i < 14; i++) {
      const d = addDays(today, i);
      if (isWorkDay(d)) return d;
    }
    return today;
  };
  const requested = route.params.date ? fromISO(route.params.date) : null;
  const initialDate = requested && requested >= today ? requested : firstAvailable();

  const [weekOffset, setWeekOffset] = useState(() => Math.floor(daysBetween(today, initialDate) / 6));
  const [selected, setSelected] = useState<Date>(initialDate);
  const [slot, setSlot] = useState<number | null>(null);
  const [who, setWho] = useState<'self' | 'other'>('self');
  const [name, setName] = useState('John Doe');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState<(typeof GENDERS)[number]>('Male');
  const [problem, setProblem] = useState('');

  const days = Array.from({ length: 6 }, (_, i) => addDays(today, weekOffset * 6 + i));

  const isTaken = (date: Date, i: number) =>
    appointments.some(
      (a) =>
        a.doctorId === doctor.id &&
        a.status === 'upcoming' &&
        a.date === toISO(date) &&
        a.time === slotRange(i),
    );

  const pickWho = (value: 'self' | 'other') => {
    setWho(value);
    setName(value === 'self' ? 'John Doe' : '');
  };

  const book = () => {
    if (slot === null) return Alert.alert('Choose a time', 'Please select an available time slot.');
    if (!name.trim()) return Alert.alert('Patient name', 'Please enter the patient name.');

    add({
      doctorId: doctor.id,
      date: toISO(selected),
      time: slotRange(slot),
      patient: { who, name: name.trim(), age, gender, problem: problem.trim() },
    });

    Alert.alert('Appointment booked', `${doctor.name}\n${formatLong(selected)}\n${slotRange(slot)}`, [
      { text: 'OK', onPress: () => navigation.popTo('Tabs', { screen: 'Schedule' }) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          contentContainerStyle={{ paddingBottom: 32 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Doctor bar */}
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
              <Ionicons name="chevron-back" size={26} color={colors.primary} />
            </TouchableOpacity>
            <View style={styles.namePill}>
              <Text style={styles.namePillText} numberOfLines={1}>{doctor.name}</Text>
            </View>
            <View style={styles.roundBtn}><Ionicons name="call-outline" size={15} color="#fff" /></View>
            <View style={styles.roundBtn}><Ionicons name="videocam-outline" size={15} color="#fff" /></View>
            <View style={styles.roundBtn}><Ionicons name="chatbubble-outline" size={15} color="#fff" /></View>
          </View>

          {/* Days strip */}
          <View style={styles.daysWrap}>
            <Text style={styles.monthText}>
              {MONTHS[selected.getMonth()]} {selected.getFullYear()}
            </Text>
            <View style={styles.daysRow}>
              <TouchableOpacity
                disabled={weekOffset <= 0}
                onPress={() => setWeekOffset((o) => o - 1)}
                hitSlop={10}
              >
                <Ionicons name="chevron-back" size={20} color={weekOffset <= 0 ? MUTED : colors.primary} />
              </TouchableOpacity>

              {days.map((d) => {
                const ok = isWorkDay(d);
                const sel = d.getTime() === selected.getTime();
                return (
                  <TouchableOpacity
                    key={d.getTime()}
                    disabled={!ok}
                    style={[styles.day, sel && styles.daySel]}
                    onPress={() => {
                      setSelected(d);
                      setSlot(null);
                    }}
                  >
                    <Text style={[styles.dayNum, !ok && { color: MUTED }, sel && { color: '#fff' }]}>
                      {d.getDate()}
                    </Text>
                    <Text style={[styles.dayName, !ok && { color: MUTED }, sel && { color: '#fff' }]}>
                      {DOW[weekdayIndex(d)]}
                    </Text>
                  </TouchableOpacity>
                );
              })}

              <TouchableOpacity onPress={() => setWeekOffset((o) => o + 1)} hitSlop={10}>
                <Ionicons name="chevron-forward" size={20} color={colors.primary} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Available time */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Time</Text>
            <View style={styles.slots}>
              {SLOT_INDEXES.map((i) => {
                const booked = demoBooked(selected, i) || isTaken(selected, i);
                const sel = slot === i;
                return (
                  <TouchableOpacity
                    key={i}
                    disabled={booked}
                    onPress={() => setSlot(i)}
                    style={[styles.slot, booked ? styles.slotBooked : styles.slotFree, sel && styles.slotSel]}
                  >
                    <Text style={[styles.slotText, booked && { color: MUTED }, sel && { color: '#fff' }]}>
                      {timeAt(i)}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View style={styles.divider} />

          {/* Patient details */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Patient Details</Text>
            <View style={styles.pillRow}>
              <Chip label="Yourself" active={who === 'self'} onPress={() => pickWho('self')} />
              <Chip label="Another Person" active={who === 'other'} onPress={() => pickWho('other')} />
            </View>

            <Text style={styles.fieldLabel}>Full Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Jane Doe"
              placeholderTextColor={MUTED}
              style={styles.field}
            />

            <Text style={styles.fieldLabel}>Age</Text>
            <TextInput
              value={age}
              onChangeText={setAge}
              placeholder="30"
              placeholderTextColor={MUTED}
              keyboardType="number-pad"
              maxLength={3}
              style={styles.field}
            />

            <Text style={styles.fieldLabel}>Gender</Text>
            <View style={styles.pillRow}>
              {GENDERS.map((g) => (
                <Chip key={g} label={g} active={gender === g} onPress={() => setGender(g)} wide />
              ))}
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.section}>
            <Text style={styles.fieldLabel}>Describe your problem</Text>
            <TextInput
              value={problem}
              onChangeText={setProblem}
              placeholder="Enter Your Problem Here..."
              placeholderTextColor={MUTED}
              multiline
              textAlignVertical="top"
              style={styles.textarea}
            />
          </View>

          <TouchableOpacity style={styles.bookBtn} onPress={book}>
            <Text style={styles.bookText}>Book appointment</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function Chip({
  label, active, onPress, wide,
}: { label: string; active: boolean; onPress: () => void; wide?: boolean }) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.chip, wide && { paddingHorizontal: 22 }, active && styles.chipActive]}
    >
      <Text style={[styles.chipText, active && { color: '#fff' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  topBar: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 12 },
  namePill: {
    flex: 1, backgroundColor: colors.primary, borderRadius: 14, paddingHorizontal: 12,
    height: 28, justifyContent: 'center',
  },
  namePillText: { color: '#fff', fontSize: 12, fontWeight: '700' },
  roundBtn: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },

  daysWrap: { backgroundColor: colors.light, paddingVertical: 12, paddingHorizontal: 8 },
  monthText: { color: colors.primary, fontWeight: '700', fontSize: 14, marginLeft: 8, marginBottom: 8 },
  daysRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  day: {
    flex: 1, height: 74, borderRadius: 24, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  daySel: { backgroundColor: colors.primary },
  dayNum: { fontSize: 18, fontWeight: '600', color: colors.text },
  dayName: { fontSize: 9, color: colors.text, marginTop: 2 },

  section: { paddingHorizontal: 16, paddingVertical: 14 },
  sectionTitle: { color: colors.primary, fontWeight: '700', fontSize: 14, marginBottom: 10 },
  slots: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: 8 },
  slot: { width: '18.4%', borderRadius: 12, paddingVertical: 6, alignItems: 'center' },
  slotFree: { backgroundColor: colors.light },
  slotBooked: { backgroundColor: SOFT },
  slotSel: { backgroundColor: colors.primary },
  slotText: { fontSize: 10, color: colors.primary, fontWeight: '600' },

  divider: { height: 1, backgroundColor: '#000', marginHorizontal: 16, opacity: 0.6 },

  pillRow: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  chip: {
    borderWidth: 1, borderColor: colors.light, borderRadius: 14,
    paddingHorizontal: 14, paddingVertical: 4,
  },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.primary, fontSize: 11 },

  fieldLabel: { color: colors.text, fontSize: 12, marginBottom: 6 },
  field: {
    backgroundColor: SOFT, borderRadius: 16, height: 46, paddingHorizontal: 16,
    color: colors.primary, marginBottom: 12,
  },
  textarea: {
    borderWidth: 1, borderColor: colors.light, borderRadius: 16, height: 120,
    padding: 12, color: colors.text,
  },

  bookBtn: {
    backgroundColor: colors.primary, marginHorizontal: 16, marginTop: 8,
    height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center',
  },
  bookText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});