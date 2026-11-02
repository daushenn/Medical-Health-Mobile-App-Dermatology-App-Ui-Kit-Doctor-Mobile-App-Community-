import { useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../theme';
import AuthField from '../components/AuthField';
import Button from '../components/Button';
import ScreenHeader from '../components/ScreenHeader';
import { usePayment } from '../data/PaymentContext';

const digits = (v: string) => v.replace(/\D/g, '');
const formatNumber = (v: string) => digits(v).slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
const formatExpiry = (v: string) => {
  const d = digits(v).slice(0, 4);
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d;
};

const validExpiry = (v: string) => {
  const m = /^(\d{2})\/(\d{2})$/.exec(v);
  if (!m) return false;
  const month = Number(m[1]);
  const year = 2000 + Number(m[2]);
  const now = new Date();
  return month >= 1 && month <= 12 && (year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1));
};

export default function AddCardScreen() {
  const navigation = useNavigation();
  const { saveCard } = usePayment();
  const [holder, setHolder] = useState('');
  const [number, setNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');

  const submit = () => {
    const n = digits(number);
    if (!holder.trim()) return Alert.alert('Add Card', 'Please enter the card holder name.');
    if (n.length !== 16) return Alert.alert('Add Card', 'Card number must have 16 digits.');
    if (!validExpiry(expiry)) return Alert.alert('Add Card', 'Enter a valid expiry date (MM/YY).');
    if (cvv.length < 3) return Alert.alert('Add Card', 'Enter the CVV code.');
    saveCard({ holder: holder.trim(), last4: n.slice(-4), expiry });
    Alert.alert('Card saved', 'Your card has been added.', [{ text: 'OK', onPress: () => navigation.goBack() }]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }} keyboardShouldPersistTaps="handled">
          <ScreenHeader title="Add Card" />

          <View style={styles.card}>
            <View style={styles.chipRow}>
              <View style={styles.slot} />
            </View>
            <Text style={styles.number}>{number || '0000 0000 0000 0000'}</Text>
            <View style={styles.cardBottom}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardLabel}>Card Holder Name</Text>
                <Text style={styles.cardValue} numberOfLines={1}>{holder || 'John Doe'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardLabel}>Expiry Date</Text>
                <Text style={styles.cardValue}>{expiry || 'MM/YY'}</Text>
              </View>
              <Ionicons name="hardware-chip-outline" size={34} color="#fff" />
            </View>
          </View>

          <View style={{ paddingHorizontal: 24, marginTop: 20 }}>
            <AuthField label="Card Holder Name" placeholder="John Doe" value={holder} onChangeText={setHolder} />
            <AuthField
              label="Card Number"
              placeholder="0000 0000 0000 0000"
              value={number}
              onChangeText={(v) => setNumber(formatNumber(v))}
              keyboardType="number-pad"
            />
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <AuthField
                  label="Expiry Date"
                  placeholder="MM/YY"
                  value={expiry}
                  onChangeText={(v) => setExpiry(formatExpiry(v))}
                  keyboardType="number-pad"
                />
              </View>
              <View style={{ flex: 1 }}>
                <AuthField
                  label="CVV"
                  password
                  placeholder="0000"
                  value={cvv}
                  onChangeText={(v) => setCvv(digits(v).slice(0, 4))}
                  keyboardType="number-pad"
                />
              </View>
            </View>
          </View>

          <Button label="Save Card" onPress={submit} style={{ marginTop: 12, marginHorizontal: 24 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: { backgroundColor: colors.primary, borderRadius: 24, marginHorizontal: 24, padding: 20, height: 180, justifyContent: 'space-between' },
  chipRow: { alignItems: 'flex-end' },
  slot: { width: 36, height: 10, borderRadius: 3, borderWidth: 1.5, borderColor: '#fff' },
  number: { color: '#fff', fontSize: 20, letterSpacing: 1.5 },
  cardBottom: { flexDirection: 'row', alignItems: 'flex-end', gap: 8 },
  cardLabel: { color: '#fff', fontSize: 10 },
  cardValue: { color: '#fff', fontSize: 13, fontWeight: '700', marginTop: 2 },
});
