import { ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../theme';
import ScreenHeader from '../components/ScreenHeader';

const INTRO = [
  'Skin First respects your privacy. This policy explains what information we collect when you use the app, how we use it and the choices you have.',
  'We only collect the information needed to book appointments, let you talk to your doctor and keep your account secure.',
];

const TERMS = [
  'Information we collect: your name, contact details, date of birth, appointment details and messages you send to doctors. Payment card numbers are handled by the payment provider and are not stored in the app.',
  'How we use it: to schedule and manage your appointments, send reminders and notifications you have enabled, provide support and improve the service.',
  'Sharing: your health information is shared only with the doctor you book. We do not sell your personal data.',
  'Your choices: you can edit your profile, switch notifications on or off and delete your account from Settings at any time.',
  'Security: we use reasonable technical and organisational measures to protect your data. No system is completely secure, so please keep your password private.',
  'Changes: if we update this policy we will change the date above and notify you in the app.',
];

export default function PrivacyPolicyScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader title="Privacy Policy" />
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.updated}>Last Update: 31/10/2026</Text>
        {INTRO.map((t) => (
          <Text key={t} style={styles.body}>{t}</Text>
        ))}
        <Text style={styles.heading}>Terms & Conditions</Text>
        {TERMS.map((t, i) => (
          <Text key={i} style={styles.body}>{i + 1}. {t}</Text>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingHorizontal: 24, paddingBottom: 40 },
  updated: { color: colors.muted, fontSize: 11, marginBottom: 12 },
  body: { color: '#000', fontSize: 12, lineHeight: 18, marginBottom: 14 },
  heading: { color: colors.primary, fontSize: 18, fontWeight: '600', marginVertical: 8 },
});
