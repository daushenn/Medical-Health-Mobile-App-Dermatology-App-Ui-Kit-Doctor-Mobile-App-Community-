import { View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { colors } from '../theme';
import { doctors } from '../data/doctors';
import type { RootStackParamList } from '../navigation/types';

const days = [
  { d: 9, n: 'MON' }, { d: 10, n: 'TUE' }, { d: 11, n: 'WED', active: true },
  { d: 12, n: 'THU' }, { d: 13, n: 'FRI', active: true }, { d: 14, n: 'SAT', active: true },
];

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <FlatList
        data={doctors}
        keyExtractor={(i) => i.id}
        contentContainerStyle={{ paddingBottom: 110 }}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View style={styles.header}>
              <View style={styles.avatar} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.hi}>Hi, WelcomeBack</Text>
                <Text style={styles.name}>John Doe</Text>
              </View>
              <Ionicons name="notifications-outline" size={26} color={colors.primary} />
            </View>

            {/* Search */}
            <View style={styles.search}>
              <TextInput placeholder="Search doctor..." style={{ flex: 1 }} />
              <Ionicons name="search" size={20} color={colors.primary} />
            </View>

            {/* Days */}
            <View style={styles.daysWrap}>
              {days.map((x) => (
                <View key={x.d} style={[styles.day, x.active && styles.dayActive]}>
                  <Text style={[styles.dayNum, x.active && { color: '#fff' }]}>{x.d}</Text>
                  <Text style={[styles.dayName, x.active && { color: '#fff' }]}>{x.n}</Text>
                </View>
              ))}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('Doctor', { doctorId: item.id })}
          >
            <View style={styles.docPhoto} />
            <View style={{ flex: 1 }}>
              <View style={styles.docInfo}>
                <Text style={styles.docName}>{item.name}</Text>
                <Text style={styles.docSpec}>{item.spec}</Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.chip}>★ {item.rating}</Text>
                <Text style={styles.chip}>💬 {item.reviews}</Text>
                <TouchableOpacity style={{ marginLeft: 'auto' }}>
                  <Ionicons name="heart-outline" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.white },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: colors.light },
  hi: { color: colors.primary, fontSize: 12 },
  name: { color: colors.text, fontSize: 16, fontWeight: '600' },
  search: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.light,
    marginHorizontal: 16, paddingHorizontal: 16, height: 44, borderRadius: 22,
  },
  daysWrap: {
    flexDirection: 'row', justifyContent: 'space-between', backgroundColor: colors.light,
    padding: 16, marginTop: 16, marginBottom: 12,
  },
  day: { width: 48, height: 68, borderRadius: 24, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
  dayActive: { backgroundColor: colors.primary },
  dayNum: { fontSize: 20, fontWeight: '600', color: colors.text },
  dayName: { fontSize: 10, color: colors.text },
  card: {
    flexDirection: 'row', backgroundColor: colors.light, marginHorizontal: 16,
    marginBottom: 12, padding: 10, borderRadius: 24, gap: 10,
  },
  docPhoto: { width: 56, height: 56, borderRadius: 28, backgroundColor: colors.primary },
  docInfo: { backgroundColor: '#fff', borderRadius: 12, padding: 8 },
  docName: { color: colors.primary, fontWeight: '700', fontSize: 13 },
  docSpec: { color: colors.text, fontSize: 12 },
  row: { flexDirection: 'row', gap: 6, marginTop: 6, alignItems: 'center' },
  chip: { backgroundColor: '#fff', borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, fontSize: 11 },
});