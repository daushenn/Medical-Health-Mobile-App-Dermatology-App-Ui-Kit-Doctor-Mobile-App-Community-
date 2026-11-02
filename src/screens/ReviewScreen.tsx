import { useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors } from '../theme';
import Button from '../components/Button';
import ScreenHeader from '../components/ScreenHeader';
import { doctors } from '../data/doctors';
import { useAppointments } from '../data/AppointmentsContext';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Review'>;

export default function ReviewScreen({ navigation, route }: Props) {
  const { appointments, addReview } = useAppointments();
  const appt = appointments.find((a) => a.id === route.params.appointmentId);
  const doctor = appt ? doctors.find((d) => d.id === appt.doctorId) : undefined;
  const [rating, setRating] = useState(appt?.review?.rating ?? 0);
  const [comment, setComment] = useState(appt?.review?.comment ?? '');

  if (!appt || !doctor) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <Text style={{ padding: 16 }}>Appointment not found</Text>
      </SafeAreaView>
    );
  }

  const submit = () => {
    if (rating === 0) return Alert.alert('Review', 'Please choose a rating.');
    addReview(appt.id, { rating, comment: comment.trim() });
    Alert.alert('Thank you!', 'Your review has been added.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
          <ScreenHeader title="Review" />
          <Text style={styles.desc}>
            How was your visit? Your feedback helps other patients choose the right doctor.
          </Text>

          <View style={styles.photo}>
            <Ionicons name="person" size={90} color={colors.light} />
          </View>
          <Text style={styles.name}>{doctor.name}</Text>
          <Text style={styles.spec}>{doctor.spec}</Text>

          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((n) => (
              <TouchableOpacity key={n} onPress={() => setRating(n)} hitSlop={6}>
                <Ionicons name={n <= rating ? 'star' : 'star-outline'} size={28} color={colors.primary} />
              </TouchableOpacity>
            ))}
          </View>

          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Enter Your Comment Here..."
            placeholderTextColor={colors.placeholder}
            multiline
            textAlignVertical="top"
            style={styles.textarea}
          />

          <Button label="Add Review" onPress={submit} style={{ marginTop: 28, marginHorizontal: 48 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  desc: { color: '#000', fontSize: 12, lineHeight: 17, marginHorizontal: 24, marginTop: 4 },
  photo: {
    alignSelf: 'center', width: 140, height: 140, borderRadius: 70, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center', marginTop: 20,
  },
  name: { color: colors.primary, fontSize: 22, fontWeight: '600', textAlign: 'center', marginTop: 16 },
  spec: { color: '#000', fontSize: 13, textAlign: 'center', marginTop: 4 },
  stars: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 14, marginBottom: 20 },
  textarea: {
    backgroundColor: colors.bg, borderRadius: 24, height: 150, padding: 16,
    marginHorizontal: 24, color: colors.text,
  },
});
