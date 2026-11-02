import { useState } from 'react';
import { StyleSheet, Switch, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../theme';
import ScreenHeader from '../components/ScreenHeader';

const OPTIONS = [
  { key: 'general', label: 'General Notification', on: true },
  { key: 'sound', label: 'Sound', on: true },
  { key: 'soundCall', label: 'Sound Call', on: true },
  { key: 'vibrate', label: 'Vibrate', on: false },
  { key: 'offers', label: 'Special Offers', on: false },
  { key: 'payments', label: 'Payments', on: true },
  { key: 'promo', label: 'Promo And Discount', on: false },
  { key: 'cashback', label: 'Cashback', on: true },
];

export default function NotificationSettingScreen() {
  const [values, setValues] = useState<Record<string, boolean>>(
    Object.fromEntries(OPTIONS.map((o) => [o.key, o.on])),
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Notification Setting" />
      <View style={styles.list}>
        {OPTIONS.map((o) => (
          <View key={o.key} style={styles.row}>
            <Text style={styles.label}>{o.label}</Text>
            <Switch
              value={values[o.key]}
              onValueChange={(v) => setValues((s) => ({ ...s, [o.key]: v }))}
              trackColor={{ false: colors.light, true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  list: { paddingHorizontal: 24, marginTop: 16, gap: 12 },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 44 },
  label: { color: '#000', fontSize: 16 },
});
