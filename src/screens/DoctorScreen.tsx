import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { toISO } from '../utils/dates';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors } from '../theme';
import { doctors } from '../data/doctors';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Doctor'>;

const WEEK = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const MUTED = '#A9B7F5';

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

export default function DoctorScreen({ navigation, route }: Props) {
  const doctor = doctors.find((d) => d.id === route.params.doctorId);

  const today = startOfDay(new Date());
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selected, setSelected] = useState<Date | null>(null);
  const [fav, setFav] = useState(false);

  if (!doctor) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ padding: 16 }}>Doctor not found</Text>
      </SafeAreaView>
    );
  }

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7; // Monday first
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(offset).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];
  while (cells.length % 7 !== 0) cells.push(null);

  const isCurrentMonth = year === today.getFullYear() && month === today.getMonth();
  const shiftMonth = (n: number) => {
    setCursor(new Date(year, month + n, 1));
    setSelected(null);
  };

  const isAvailable = (day: number) => {
    const date = new Date(year, month, day);
    const weekday = (date.getDay() + 6) % 7;
    return date >= today && doctor.workDays.includes(weekday);
  };

  const isSelected = (day: number) =>
    !!selected &&
    selected.getFullYear() === year &&
    selected.getMonth() === month &&
    selected.getDate() === day;

    const book = () => {
    if (!selected) return;
    navigation.navigate('Booking', { doctorId: doctor.id, date: toISO(selected) });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} showsVerticalScrollIndicator={false}>
        {/* Top bar */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
            <Ionicons name="chevron-back" size={26} color={colors.primary} />
          </TouchableOpacity>
          <View style={styles.pill}>
            <Ionicons name="calendar-outline" size={14} color="#fff" />
            <Text style={styles.pillText}>Schedule</Text>
          </View>
          <View style={styles.roundBtn}><Ionicons name="call-outline" size={16} color="#fff" /></View>
          <View style={styles.roundBtn}><Ionicons name="videocam-outline" size={16} color="#fff" /></View>
          <View style={styles.roundBtn}><Ionicons name="chatbubble-outline" size={16} color="#fff" /></View>
          <View style={{ flex: 1 }} />
          <View style={styles.roundBtn}><Ionicons name="help" size={16} color="#fff" /></View>
          <TouchableOpacity style={styles.roundBtn} onPress={() => setFav((v) => !v)}>
            <Ionicons name={fav ? 'heart' : 'heart-outline'} size={16} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Doctor card */}
        <View style={styles.card}>
          <View style={styles.cardTop}>
            <View style={styles.photo}>
              <Ionicons name="person" size={72} color={colors.light} />
            </View>
            <View style={{ flex: 1, gap: 8 }}>
              <View style={styles.expPill}>
                <Ionicons name="ribbon-outline" size={22} color="#fff" />
                <Text style={styles.expText}>{doctor.years} years{'\n'}experience</Text>
              </View>
              <View style={styles.focus}>
                <Text style={styles.focusText}>
                  <Text style={{ fontWeight: '700' }}>Focus: </Text>
                  {doctor.focus}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.nameBox}>
            <Text style={styles.name}>{doctor.name}</Text>
            <Text style={styles.spec}>{doctor.spec}</Text>
          </View>

          <View style={styles.chips}>
            <Text style={styles.chip}>★ {doctor.rating}</Text>
            <Text style={styles.chip}>💬 {doctor.reviews}</Text>
            <Text style={[styles.chip, { flexShrink: 1 }]} numberOfLines={1}>⏰ {doctor.hours}</Text>
          </View>
        </View>

        {/* Profile */}
        <View style={styles.profile}>
          <Text style={styles.profileTitle}>Profile</Text>
          <Text style={styles.profileText}>{doctor.about}</Text>
        </View>

        {/* Calendar */}
        <View style={styles.calendarWrap}>
          <View style={styles.monthRow}>
            <TouchableOpacity onPress={() => shiftMonth(-1)} disabled={isCurrentMonth} hitSlop={10}>
              <Ionicons name="chevron-back" size={20} color={isCurrentMonth ? MUTED : colors.primary} />
            </TouchableOpacity>
            <Text style={styles.monthText}>{MONTHS[month].toUpperCase()} {year}</Text>
            <TouchableOpacity onPress={() => shiftMonth(1)} hitSlop={10}>
              <Ionicons name="chevron-forward" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <View style={styles.weekRow}>
            {WEEK.map((w) => (
              <View key={w} style={styles.weekPill}>
                <Text style={styles.weekText}>{w}</Text>
              </View>
            ))}
          </View>

          <View style={styles.grid}>
            {cells.map((day, i) => {
              if (day === null) return <View key={i} style={styles.cell} />;
              const ok = isAvailable(day);
              const sel = isSelected(day);
              return (
                <TouchableOpacity
                  key={i}
                  style={styles.cell}
                  disabled={!ok}
                  onPress={() => setSelected(new Date(year, month, day))}
                >
                  <View style={[styles.dayCircle, sel && styles.dayCircleSel]}>
                    <Text style={[styles.dayText, !ok && { color: MUTED }, sel && { color: '#fff' }]}>
                      {day}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.bookBtn, !selected && { opacity: 0.5 }]}
          disabled={!selected}
          onPress={book}
        >
          <Text style={styles.bookText}>Book appointment</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  topBar: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 12 },
  pill: {
    flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: colors.primary,
    borderRadius: 14, paddingHorizontal: 10, height: 28,
  },
  pillText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  roundBtn: {
    width: 28, height: 28, borderRadius: 14, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },

  card: { backgroundColor: colors.light, marginHorizontal: 16, borderRadius: 24, padding: 14, gap: 12 },
  cardTop: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  photo: {
    width: 150, height: 150, borderRadius: 75, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  expPill: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.primary,
    borderRadius: 20, paddingHorizontal: 10, paddingVertical: 6,
  },
  expText: { color: '#fff', fontSize: 11, flexShrink: 1 },
  focus: { backgroundColor: colors.primary, borderRadius: 16, padding: 10 },
  focusText: { color: '#fff', fontSize: 11, lineHeight: 15 },
  nameBox: { backgroundColor: '#fff', borderRadius: 14, paddingVertical: 10, alignItems: 'center' },
  name: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  spec: { color: colors.text, fontSize: 12, marginTop: 2 },
  chips: { flexDirection: 'row', gap: 6, alignItems: 'center' },
  chip: {
    backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4,
    fontSize: 11, color: colors.text, overflow: 'hidden',
  },

  profile: { paddingHorizontal: 16, paddingVertical: 20 },
  profileTitle: { color: colors.primary, fontWeight: '700', fontSize: 15, marginBottom: 4 },
  profileText: { color: colors.text, fontSize: 12, lineHeight: 17 },

  calendarWrap: { backgroundColor: colors.light, paddingVertical: 16, paddingHorizontal: 12, gap: 12 },
  monthRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 16 },
  monthText: { color: colors.primary, fontWeight: '700', fontSize: 14 },
  weekRow: { flexDirection: 'row', justifyContent: 'space-between' },
  weekPill: {
    backgroundColor: colors.primary, borderRadius: 10, paddingVertical: 2,
    width: '13.2%', alignItems: 'center',
  },
  weekText: { color: '#fff', fontSize: 9, fontWeight: '600' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fff', borderRadius: 24, padding: 10 },
  cell: { width: `${100 / 7}%`, height: 42, alignItems: 'center', justifyContent: 'center' },
  dayCircle: { width: 34, height: 34, borderRadius: 17, alignItems: 'center', justifyContent: 'center' },
  dayCircleSel: { backgroundColor: colors.primary },
  dayText: { color: colors.text, fontSize: 13 },

  bookBtn: {
    backgroundColor: colors.primary, marginHorizontal: 16, marginTop: 16,
    height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center',
  },
  bookText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});