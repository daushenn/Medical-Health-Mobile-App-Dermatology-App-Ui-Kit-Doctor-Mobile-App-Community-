import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../theme';
import ScreenHeader from '../components/ScreenHeader';
import { Method, usePayment } from '../data/PaymentContext';
import type { Nav } from '../navigation/types';

const OTHERS: { key: Exclude<Method, 'card'>; label: string; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'apple', label: 'Apple Pay', icon: 'logo-apple' },
  { key: 'paypal', label: 'Paypal', icon: 'logo-paypal' },
  { key: 'google', label: 'Google Pay', icon: 'logo-google' },
];

export default function PaymentMethodScreen() {
  const navigation = useNavigation<Nav>();
  const { method, setMethod, card } = usePayment();

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Payment Method" />

      <Text style={styles.section}>Credit & Debit Card</Text>
      {card && (
        <Option
          icon="card-outline"
          label={`${card.holder} •••• ${card.last4}`}
          active={method === 'card'}
          onPress={() => setMethod('card')}
        />
      )}
      <Option
        icon="card-outline"
        label="Add New Card"
        active={!card && method === 'card'}
        onPress={() => navigation.navigate('AddCard')}
        showRadio={!card}
      />

      <Text style={[styles.section, { marginTop: 28 }]}>More Payment Option</Text>
      {OTHERS.map((o) => (
        <Option key={o.key} icon={o.icon} label={o.label} active={method === o.key} onPress={() => setMethod(o.key)} />
      ))}
    </SafeAreaView>
  );
}

function Option({
  icon, label, active, onPress, showRadio = true,
}: {
  icon: keyof typeof Ionicons.glyphMap; label: string; active: boolean; onPress: () => void; showRadio?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.option} onPress={onPress} activeOpacity={0.7}>
      <Ionicons name={icon} size={24} color={colors.primary} />
      <Text style={styles.optionText}>{label}</Text>
      {showRadio ? (
        <Ionicons name={active ? 'radio-button-on' : 'radio-button-off'} size={24} color={colors.primary} />
      ) : (
        <Ionicons name="add-circle-outline" size={24} color={colors.primary} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  section: { color: '#000', fontSize: 18, fontWeight: '500', marginHorizontal: 24, marginTop: 16, marginBottom: 12 },
  option: {
    flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.bg,
    borderRadius: 18, height: 52, paddingHorizontal: 16, marginHorizontal: 24, marginBottom: 10,
  },
  optionText: { flex: 1, color: colors.primary, fontSize: 16 },
});
