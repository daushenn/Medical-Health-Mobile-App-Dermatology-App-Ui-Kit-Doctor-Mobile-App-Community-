import { useEffect, useRef, useState } from 'react';
import {
  FlatList, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';
import { useKeyboardVisible } from '../hooks/useKeyboardVisible';

type Msg = { id: string; from: 'me' | 'doc'; text: string; time: string };

const timeNow = () => {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
};

const INITIAL: Msg[] = [
  { id: '1', from: 'me', time: '09:00', text: 'Hello doctor, I have had a rash on my arm for a few days. It itches in the evenings.' },
  { id: '2', from: 'doc', time: '09:30', text: 'Hello John! Thanks for reaching out. Did you start using any new soap or detergent recently?' },
  { id: '3', from: 'me', time: '09:43', text: 'Yes, I switched to a new laundry detergent last week.' },
  { id: '4', from: 'doc', time: '09:50', text: 'That could well be the cause. Please send a photo of the area and we will plan a visit.' },
];

const REPLIES = [
  'Thank you, I will take a look and get back to you shortly.',
  'Understood. In the meantime, avoid scratching and use a gentle moisturiser.',
  'Let us book a visit so I can examine it in person.',
];

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const keyboardVisible = useKeyboardVisible();
  const listRef = useRef<FlatList<Msg>>(null);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const replyIdx = useRef(0);

  const [messages, setMessages] = useState<Msg[]>(INITIAL);
  const [text, setText] = useState('');
  const [typing, setTyping] = useState(false);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const send = () => {
    const value = text.trim();
    if (!value) return;
    setMessages((m) => [...m, { id: String(Date.now()), from: 'me', text: value, time: timeNow() }]);
    setText('');

    setTyping(true);
    const t = setTimeout(() => {
      const reply = REPLIES[replyIdx.current % REPLIES.length];
      replyIdx.current += 1;
      setTyping(false);
      setMessages((m) => [...m, { id: String(Date.now()) + 'd', from: 'doc', text: reply, time: timeNow() }]);
    }, 1800);
    timers.current.push(t);
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior="padding">
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 12 }]}>
        <Text style={styles.headerTitle}>Dr. Olivia Turner</Text>
        <View style={styles.headerBtn}><Ionicons name="call-outline" size={16} color={colors.primary} /></View>
        <View style={styles.headerBtn}><Ionicons name="videocam-outline" size={16} color={colors.primary} /></View>
      </View>

      {/* Messages */}
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id}
        contentContainerStyle={{ padding: 16, gap: 14 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        renderItem={({ item }) => {
          const mine = item.from === 'me';
          return (
            <View style={{ alignItems: mine ? 'flex-end' : 'flex-start' }}>
              <View style={[styles.bubble, mine ? styles.bubbleMe : styles.bubbleDoc]}>
                <Text style={styles.bubbleText}>{item.text}</Text>
              </View>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          );
        }}
      />

      <Text style={styles.typing}>{typing ? 'Dr. Olivia is typing…' : ' '}</Text>

      {/* Input */}
      <View style={[styles.inputBar, { paddingBottom: keyboardVisible ? 12 : 92 }]}>
        <View style={styles.attach}>
          <Ionicons name="attach" size={22} color={colors.primary} />
        </View>
        <View style={styles.inputWrap}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Write Here..."
            placeholderTextColor="#9AA9F0"
            style={styles.input}
            onSubmitEditing={send}
            returnKeyType="send"
          />
          <Ionicons name="mic-outline" size={20} color={colors.primary} />
        </View>
        <TouchableOpacity style={styles.sendBtn} onPress={send}>
          <Ionicons name="send" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, paddingBottom: 18, gap: 8,
  },
  headerTitle: { flex: 1, color: '#fff', fontSize: 20, fontWeight: '700' },
  headerBtn: {
    width: 30, height: 30, borderRadius: 15, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },

  bubble: { maxWidth: '80%', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 12 },
  bubbleMe: { backgroundColor: colors.light, borderBottomRightRadius: 6 },
  bubbleDoc: { backgroundColor: colors.bg, borderBottomLeftRadius: 6 },
  bubbleText: { color: colors.text, fontSize: 13, lineHeight: 18 },
  time: { color: '#9AA9F0', fontSize: 11, marginTop: 4, marginHorizontal: 6 },

  typing: { color: colors.primary, fontSize: 12, paddingHorizontal: 16, paddingBottom: 6 },

  inputBar: {
    flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.light,
    paddingHorizontal: 14, paddingTop: 12,
  },
  attach: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: colors.bg,
    alignItems: 'center', justifyContent: 'center',
  },
  inputWrap: {
    flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff',
    borderRadius: 22, paddingHorizontal: 14, height: 44,
  },
  input: { flex: 1, color: colors.text },
  sendBtn: {
    width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
});