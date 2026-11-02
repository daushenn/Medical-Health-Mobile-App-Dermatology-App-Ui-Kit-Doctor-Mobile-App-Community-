import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors } from '../theme';
import Button from '../components/Button';
import { doctors } from '../data/doctors';
import { useAppointments } from '../data/AppointmentsContext';
import { formatMonthDayYear, fromISO } from '../utils/dates';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'PaymentSuccess'>;

export default function PaymentSuccessScreen({ navigation, route }: Props) {
  const { appointments } = useAppointments();
  const appt = appointments.find((a) => a.id === route.params.appointmentId);
  const doctor = appt ? doctors.find((d) => d.id === appt.doctorId) : undefined;

  const goToSchedule = () => navigation.popTo('Tabs', { screen: 'Schedule' });

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity onPress={goToSchedule} hitSlop={10} style={styles.back}>
        <Ionicons name="chevron-back" size={26} color="#fff" />
      </TouchableOpacity>

      <View style={styles.center}>
        <View style={styles.ring}>
          <Ionicons name="checkmark" size={120} color="#fff" />
        </View>
        <Text style={styles.title}>Congratulation</Text>
        <Text style={styles.sub}>Payment is Successfully</Text>

        {appt && doctor && (
          <View style={styles.box}>
            <Text style={styles.boxText}>You have successfully booked an appointment with</Text>
            <Text style={styles.boxName}>{doctor.name}</Text>
            <View style={styles.boxRow}>
              <View style={styles.boxItem}>
                <Ionicons name="calendar-outline" size={16} color="#fff" />
                <Text style={styles.boxItemText}>{formatMonthDayYear(fromISO(appt.date))}</Text>
              </View>
              <View style={styles.boxItem}>
                <Ionicons name="alarm-outline" size={16} color="#fff" />
                <Text style={styles.boxItemText}>{appt.time.split(' - ')[0]}</Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <Button label="View appointments" variant="white" onPress={goToSchedule} style={{ marginBottom: 16 }} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, paddingHorizontal: 24 },
  back: { marginTop: 12, width: 32 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  ring: {
    width: 190, height: 190, borderRadius: 95, borderWidth: 8, borderColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  title: { color: '#fff', fontSize: 34, fontWeight: '700', marginTop: 28 },
  sub: { color: '#fff', fontSize: 18, marginTop: 6 },
  box: {
    alignSelf: 'stretch', borderWidth: 1, borderColor: '#fff', borderRadius: 24,
    padding: 20, marginTop: 40, alignItems: 'center',
  },
  boxText: { color: '#fff', fontSize: 13, textAlign: 'center' },
  boxName: { color: '#fff', fontSize: 18, fontWeight: '700', marginTop: 12 },
  boxRow: { flexDirection: 'row', gap: 24, marginTop: 12 },
  boxItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  boxItemText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
