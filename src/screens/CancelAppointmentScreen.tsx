import { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors } from '../theme';
import { useAppointments } from '../data/AppointmentsContext';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'CancelAppointment'>;

const REASONS = ['Rescheduling', 'Weather Conditions', 'Unexpected Work', 'Others'] as const;

export default function CancelAppointmentScreen({ navigation, route }: Props) {
  const { cancel } = useAppointments();
  const [reason, setReason] = useState<(typeof REASONS)[number]>('Rescheduling');
  const [note, setNote] = useState('');

  const submit = () => {
    const extra = note.trim();
    if (reason === 'Others' && !extra) {
      return Alert.alert('Cancel Appointment', 'Please describe your reason.');
    }
    const text = reason === 'Others' ? extra : extra ? `${reason}: ${extra}` : reason;
    cancel(route.params.appointmentId, text);
    Alert.alert('Appointment cancelled', 'Your appointment has been cancelled.', [
      { text: 'OK', onPress: () => navigation.popTo('Tabs', { screen: 'Schedule' }) },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
              <Ionicons name="chevron-back" size={26} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Cancel Appointment</Text>
            <View style={{ width: 26 }} />
          </View>

          <Text style={styles.desc}>
            Please tell us why you want to cancel. This helps us improve our service.
          </Text>

          <View style={{ marginTop: 20, gap: 6 }}>
            {REASONS.map((r) => {
              const active = reason === r;
              return (
                <TouchableOpacity
                  key={r}
                  style={[styles.reasonRow, active && styles.reasonRowActive]}
                  onPress={() => setReason(r)}
                >
                  <View style={styles.radio}>
                    {active && <View style={styles.radioDot} />}
                  </View>
                  <Text style={styles.reasonText}>{r}</Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.hint}>Add more details (required for "Others").</Text>
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Enter Your Reason Here..."
            placeholderTextColor="#9AA9F0"
            multiline
            textAlignVertical="top"
            style={styles.textarea}
          />

          <TouchableOpacity style={styles.btn} onPress={submit}>
            <Text style={styles.btnText}>Cancel Appointment</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingHorizontal: 20, paddingBottom: 32 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  title: { color: colors.primary, fontSize: 22, fontWeight: '700' },
  desc: { color: colors.text, fontSize: 13, lineHeight: 18, marginTop: 20 },

  reasonRow: {
    flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10,
    paddingHorizontal: 8, borderRadius: 20,
  },
  reasonRowActive: { backgroundColor: colors.light },
  radio: {
    width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: colors.primary },
  reasonText: { color: '#000', fontSize: 15 },

  hint: { color: '#9AA9F0', fontSize: 12, marginTop: 20, marginBottom: 10 },
  textarea: {
    backgroundColor: colors.bg, borderRadius: 24, height: 180, padding: 16, color: colors.primary,
  },
  btn: {
    backgroundColor: colors.primary, height: 52, borderRadius: 26, marginTop: 32,
    marginHorizontal: 20, alignItems: 'center', justifyContent: 'center',
  },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
});