import { useState } from 'react';
import { SectionList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';
import ScreenHeader from '../components/ScreenHeader';

type Item = {
  id: string;
  title: string;
  text: string;
  time: string;
  icon: keyof typeof Ionicons.glyphMap;
  read: boolean;
};

const initial: { title: string; data: Item[] }[] = [
  {
    title: 'Today',
    data: [
      { id: '1', title: 'Scheduled Appointment', text: 'Your appointment with Dr. Olivia Turner is confirmed. Check the details in Schedule.', time: '2 M', icon: 'calendar-outline', read: false },
      { id: '2', title: 'Scheduled Change', text: 'The doctor changed the time of one of your upcoming appointments.', time: '2 H', icon: 'calendar-outline', read: false },
      { id: '3', title: 'Medical Notes', text: 'New notes were added to your medical record after your last visit.', time: '3 H', icon: 'document-text-outline', read: true },
    ],
  },
  {
    title: 'Yesterday',
    data: [
      { id: '4', title: 'Scheduled Appointment', text: 'Reminder: you have an appointment tomorrow. Please arrive 10 minutes early.', time: '1 D', icon: 'calendar-outline', read: true },
    ],
  },
  {
    title: '15 April',
    data: [
      { id: '5', title: 'Medical History Update', text: 'Your medical history was updated. Review it to make sure everything is correct.', time: '5 D', icon: 'chatbubble-ellipses-outline', read: true },
    ],
  },
];

export default function NotificationsScreen() {
  const [sections, setSections] = useState(initial);
  const unread = sections.some((s) => s.data.some((i) => !i.read));

  const markAll = () => setSections((s) => s.map((x) => ({ ...x, data: x.data.map((i) => ({ ...i, read: true })) })));
  const markOne = (id: string) =>
    setSections((s) => s.map((x) => ({ ...x, data: x.data.map((i) => (i.id === id ? { ...i, read: true } : i)) })));

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Notification"
        right={
          <View style={styles.news}>
            <Text style={styles.newsText}>News</Text>
            {unread && <View style={styles.dot} />}
          </View>
        }
      />

      <SectionList
        sections={sections}
        keyExtractor={(i) => i.id}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={{ paddingBottom: 32 }}
        renderSectionHeader={({ section, section: { title } }) => (
          <View style={styles.sectionRow}>
            <View style={styles.pill}><Text style={styles.pillText}>{title}</Text></View>
            {title === 'Today' && (
              <TouchableOpacity onPress={markAll} disabled={!unread}>
                <Text style={[styles.markAll, !unread && { opacity: 0.4 }]}>Mark all</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => markOne(item.id)}
            style={[styles.item, !item.read && styles.itemUnread]}
          >
            <View style={styles.icon}>
              <Ionicons name={item.icon} size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.itemTitle}>{item.title}</Text>
              <Text style={styles.itemText}>{item.text}</Text>
            </View>
            <Text style={styles.itemTime}>{item.time}</Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  news: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: colors.light,
    borderRadius: 12, paddingHorizontal: 8, paddingVertical: 3,
  },
  newsText: { color: colors.primary, fontSize: 11, fontWeight: '600' },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, marginVertical: 10 },
  pill: { backgroundColor: colors.light, borderRadius: 16, paddingHorizontal: 18, paddingVertical: 5 },
  pillText: { color: colors.primary, fontSize: 16 },
  markAll: { color: colors.primary, fontSize: 13, fontWeight: '700' },
  item: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, paddingHorizontal: 16, paddingVertical: 12 },
  itemUnread: { backgroundColor: colors.light },
  icon: {
    width: 44, height: 44, borderRadius: 22, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
  itemTitle: { color: '#000', fontSize: 16, fontWeight: '600' },
  itemText: { color: colors.text, fontSize: 10, lineHeight: 14, marginTop: 2 },
  itemTime: { color: colors.text, fontSize: 10 },
});
