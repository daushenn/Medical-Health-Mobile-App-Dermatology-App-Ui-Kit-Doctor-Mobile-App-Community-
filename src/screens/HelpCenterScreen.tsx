import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';
import ScreenHeader from '../components/ScreenHeader';

type Topic = 'Popular Topic' | 'General' | 'Services';
const TOPICS: Topic[] = ['Popular Topic', 'General', 'Services'];

const FAQ: { q: string; a: string; topic: Exclude<Topic, 'Popular Topic'>; popular?: boolean }[] = [
  { q: 'How do I book an appointment?', a: 'Open a doctor from the Home tab, pick a date, then choose a time slot, fill in the patient details and pay to confirm.', topic: 'Services', popular: true },
  { q: 'Can I book for another person?', a: 'Yes. On the booking screen choose "Another Person" and enter their name, age and gender.', topic: 'Services', popular: true },
  { q: 'How do I cancel an appointment?', a: 'Go to Schedule, open the Upcoming tab and tap the X button on the appointment. Choose a reason and confirm.', topic: 'Services', popular: true },
  { q: 'How can I leave a review?', a: 'After a visit is marked complete, open it in Schedule and tap the star button to rate your doctor.', topic: 'Services' },
  { q: 'How do I change my payment method?', a: 'Go to Profile > Payment Method. You can add a card or choose another option such as Apple Pay, PayPal or Google Pay.', topic: 'General', popular: true },
  { q: 'How do I change my password?', a: 'Go to Profile > Settings > Password Manager, enter your current password and then the new one.', topic: 'General' },
  { q: 'How do I edit my profile?', a: 'Open Profile > Profile, update your details and tap Update Profile.', topic: 'General' },
  { q: 'Who can see my health information?', a: 'Only the doctor you book can see the details you provide. See the Privacy Policy for more information.', topic: 'General' },
  { q: 'How do I delete my account?', a: 'Go to Profile > Settings > Delete Account and confirm. This action cannot be undone.', topic: 'General' },
];

// Replace these with your real contact details.
const CONTACTS: { label: string; icon: keyof typeof Ionicons.glyphMap; detail: string }[] = [
  { label: 'Customer Service', icon: 'headset-outline', detail: 'support@skinfirst.example\nMon - Sat, 9 AM - 6 PM' },
  { label: 'Website', icon: 'globe-outline', detail: 'www.skinfirst.example' },
  { label: 'Whatsapp', icon: 'logo-whatsapp', detail: '+1 000 000 0000' },
  { label: 'Facebook', icon: 'logo-facebook', detail: 'facebook.com/skinfirst.example' },
  { label: 'Instagram', icon: 'logo-instagram', detail: '@skinfirst.example' },
];

export default function HelpCenterScreen() {
  const [tab, setTab] = useState<'faq' | 'contact'>('faq');
  const [topic, setTopic] = useState<Topic>('Popular Topic');
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState<string | null>(null);

  const faq = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQ.filter((f) => {
      if (q) return f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q);
      return topic === 'Popular Topic' ? f.popular : f.topic === topic;
    });
  }, [query, topic]);

  const toggle = (key: string) => setOpen((o) => (o === key ? null : key));

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <View style={styles.hero}>
        <ScreenHeader title="Help Center" light />
        <Text style={styles.heroSub}>How Can We Help You?</Text>
        <View style={styles.search}>
          <Ionicons name="search" size={18} color={colors.primary} />
          <TextInput
            value={query}
            onChangeText={setQuery}
            placeholder="Search..."
            placeholderTextColor={colors.muted}
            style={{ flex: 1, color: colors.text }}
          />
        </View>
      </View>

      <View style={styles.tabs}>
        {(['faq', 'contact'] as const).map((t) => (
          <TouchableOpacity key={t} style={[styles.tab, tab === t && styles.tabActive]} onPress={() => setTab(t)}>
            <Text style={[styles.tabText, tab === t && { color: '#fff' }]}>{t === 'faq' ? 'FAQ' : 'Contact Us'}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
        {tab === 'faq' ? (
          <>
            {!query.trim() && (
              <View style={styles.topics}>
                {TOPICS.map((t) => (
                  <TouchableOpacity key={t} style={[styles.topic, topic === t && styles.topicActive]} onPress={() => setTopic(t)}>
                    <Text style={[styles.topicText, topic === t && { color: '#fff' }]}>{t}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            {faq.length === 0 && <Text style={styles.empty}>No results found.</Text>}
            {faq.map((f) => {
              const expanded = open === f.q;
              return (
                <View key={f.q} style={{ marginBottom: 10 }}>
                  <TouchableOpacity style={styles.faqRow} onPress={() => toggle(f.q)} activeOpacity={0.7}>
                    <Text style={styles.faqQ}>{f.q}</Text>
                    <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={18} color={colors.primary} />
                  </TouchableOpacity>
                  {expanded && <Text style={styles.faqA}>{f.a}</Text>}
                </View>
              );
            })}
          </>
        ) : (
          CONTACTS.map((c) => {
            const expanded = open === c.label;
            return (
              <View key={c.label} style={{ marginBottom: 14 }}>
                <TouchableOpacity style={styles.contactRow} onPress={() => toggle(c.label)} activeOpacity={0.7}>
                  <View style={styles.contactIcon}>
                    <Ionicons name={c.icon} size={22} color={colors.primary} />
                  </View>
                  <Text style={styles.contactText}>{c.label}</Text>
                  <Ionicons name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color={colors.primary} />
                </TouchableOpacity>
                {expanded && <Text style={styles.contactDetail}>{c.detail}</Text>}
              </View>
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  hero: { backgroundColor: colors.primary, paddingBottom: 20 },
  heroSub: { color: colors.light, fontSize: 13, textAlign: 'center', marginTop: 4 },
  search: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#fff',
    marginHorizontal: 20, marginTop: 14, paddingHorizontal: 14, height: 42, borderRadius: 21,
  },
  tabs: { flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginVertical: 14 },
  tab: { flex: 1, height: 42, borderRadius: 21, backgroundColor: colors.light, alignItems: 'center', justifyContent: 'center' },
  tabActive: { backgroundColor: colors.primary },
  tabText: { color: colors.primary, fontSize: 18, fontWeight: '500' },
  topics: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  topic: { backgroundColor: colors.light, borderRadius: 14, paddingHorizontal: 12, paddingVertical: 4 },
  topicActive: { backgroundColor: colors.primary },
  topicText: { color: colors.primary, fontSize: 11, fontWeight: '700' },
  empty: { color: colors.text, textAlign: 'center', marginTop: 24 },
  faqRow: {
    flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: colors.bg,
    borderRadius: 16, paddingHorizontal: 14, minHeight: 34, paddingVertical: 6,
  },
  faqQ: { flex: 1, color: colors.text, fontSize: 12 },
  faqA: { color: colors.text, fontSize: 11, lineHeight: 16, paddingHorizontal: 18, paddingTop: 8 },
  contactRow: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  contactIcon: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.light,
    alignItems: 'center', justifyContent: 'center',
  },
  contactText: { flex: 1, color: '#000', fontSize: 16 },
  contactDetail: { color: colors.text, fontSize: 12, lineHeight: 18, marginLeft: 56, marginTop: 6 },
});
