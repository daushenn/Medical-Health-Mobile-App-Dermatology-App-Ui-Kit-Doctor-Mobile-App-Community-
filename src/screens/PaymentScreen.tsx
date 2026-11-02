import { useEffect, useRef, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors } from '../theme';
import Button from '../components/Button';
import ScreenHeader from '../components/ScreenHeader';
import { CONSULTATION_FEE, CONSULTATION_MINUTES, doctors } from '../data/doctors';
import { useAppointments } from '../data/AppointmentsContext';
import { usePayment } from '../data/PaymentContext';
import { formatMonthDayYear, fromISO } from '../utils/dates';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Payment'>;

export default function PaymentScreen({ navigation, route }: Props) {
  const { doctorId, date, time, patient } = route.params;
  const doctor = doctors.find((d) => d.id === doctorId);
  const { add } = useAppointments();
  const { method, card, label } = usePayment();
  const [paying, setPaying] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  if (!doctor) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <Text style={{ padding: 16 }}>Doctor not found</Text>
      </SafeAreaView>
    );
  }

  const start = time.split(' - ')[0];
  const price = `$${CONSULTATION_FEE.toFixed(2)}`;

  const pay = () => {
    if (paying) return;
    if (method === 'card' && !card) {
      Alert.alert('Payment', 'Add a card or choose another payment method.', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Choose', onPress: () => navigation.navigate('PaymentMethod') },
      ]);
      return;
    }
    setPaying(true);
    // Demo: no real payment provider is connected.
    timer.current = setTimeout(() => {
      const id = add({ doctorId, date, time, patient });
      navigation.replace('PaymentSuccess', { appointmentId: id });
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScreenHeader title="Payment" light />
      <Text style={styles.price}>{price}</Text>

      <ScrollView style={styles.sheet} contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.doctor}>
          <View style={styles.photo}>
            <Ionicons name="person" size={40} color={colors.light} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.docName}>{doctor.name}</Text>
            <Text style={styles.docSpec}>{doctor.spec}</Text>
            <View style={styles.chips}>
              <Text style={styles.chip}>★ {doctor.rating}</Text>
              <Text style={styles.chip}>💬 {doctor.reviews}</Text>
            </View>
          </View>
        </View>

        <View style={styles.block}>
          <Row label="Date / Hour" value={`${formatMonthDayYear(fromISO(date))} / ${start}`} />
          <Row label="Duration" value={`${CONSULTATION_MINUTES} Minutes`} />
          <Row label="Booking for" value={patient.who === 'self' ? 'Yourself' : 'Another Person'} />
        </View>
        <View style={styles.block}>
          <Row label="Amount" value={price} />
          <Row label="Duration" value={`${CONSULTATION_MINUTES} Minutes`} />
          <View style={{ height: 12 }} />
          <Row label="Total" value={`$${CONSULTATION_FEE}`} bold />
        </View>
        <View style={[styles.block, { borderBottomWidth: 0 }]}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Payment Method</Text>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Text style={styles.rowValue}>{label}</Text>
              <Text style={styles.change} onPress={() => navigation.navigate('PaymentMethod')}>Change</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button label={paying ? 'Processing…' : 'Pay Now'} onPress={pay} disabled={paying} />
      </View>
    </SafeAreaView>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <View style={styles.row}>
      <Text style={styles.rowLabel}>{label}</Text>
      <Text style={[styles.rowValue, bold && { fontWeight: '700' }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary },
  price: { color: '#fff', fontSize: 40, fontWeight: '700', textAlign: 'center', marginVertical: 24 },
  sheet: { flex: 1, backgroundColor: '#fff' },
  doctor: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 20 },
  photo: {
    width: 76, height: 76, borderRadius: 38, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  docName: { color: colors.primary, fontSize: 16, fontWeight: '700' },
  docSpec: { color: colors.text, fontSize: 12, marginTop: 2 },
  chips: { flexDirection: 'row', gap: 6, marginTop: 8 },
  chip: {
    backgroundColor: colors.light, color: colors.primary, borderRadius: 12,
    paddingHorizontal: 10, paddingVertical: 3, fontSize: 11, overflow: 'hidden',
  },
  block: { borderTopWidth: 1, borderBottomWidth: 1, borderColor: colors.primary, marginHorizontal: 20, paddingVertical: 16, gap: 8 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  rowLabel: { color: colors.primary, fontSize: 12 },
  rowValue: { color: '#000', fontSize: 12, fontWeight: '500' },
  change: { color: colors.primary, fontSize: 12, textDecorationLine: 'underline' },
  footer: { backgroundColor: '#fff', paddingHorizontal: 20, paddingBottom: 16, paddingTop: 8 },
});
