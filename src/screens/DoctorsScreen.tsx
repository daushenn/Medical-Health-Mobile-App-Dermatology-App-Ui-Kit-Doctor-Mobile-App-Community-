import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors } from '../theme';
import { doctors } from '../data/doctors';
import { useFavorites } from '../data/FavoritesContext';
import DoctorRow from '../components/DoctorRow';
import ScreenHeader, { HeaderIcon } from '../components/ScreenHeader';
import SortBar from '../components/SortBar';
import { matchesQuery, Sort, sortDoctors } from '../utils/doctors';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Doctors'>;

const OPTIONS: Sort[] = ['az', 'rating', 'fav', 'female', 'male'];

export default function DoctorsScreen({ navigation, route }: Props) {
  const { doctorIds, toggleDoctor } = useFavorites();
  const initialQuery = route.params?.query ?? '';
  const [query, setQuery] = useState(initialQuery);
  const [searching, setSearching] = useState(!!initialQuery);
  const [sort, setSort] = useState<Sort>('az');

  const list = useMemo(
    () => sortDoctors(doctors.filter((d) => matchesQuery(d, query)), sort, doctorIds),
    [query, sort, doctorIds],
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScreenHeader
        title="Doctors"
        right={
          <HeaderIcon
            name={searching ? 'close' : 'search'}
            onPress={() => {
              setSearching((v) => !v);
              if (searching) setQuery('');
            }}
          />
        }
      />

      {searching && (
        <View style={styles.search}>
          <TextInput
            autoFocus
            value={query}
            onChangeText={setQuery}
            placeholder="Search doctor or speciality..."
            placeholderTextColor={colors.placeholder}
            style={{ flex: 1, color: colors.text }}
          />
          <Ionicons name="search" size={20} color={colors.primary} />
        </View>
      )}

      <SortBar options={OPTIONS} value={sort} onChange={setSort} />

      <FlatList
        data={list}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ paddingBottom: 32 }}
        ListEmptyComponent={<Text style={styles.empty}>No doctors found.</Text>}
        renderItem={({ item }) => (
          <DoctorRow
            doctor={item}
            variant="list"
            favorite={doctorIds.includes(item.id)}
            onInfo={() => navigation.navigate('Doctor', { doctorId: item.id })}
            onBook={() => navigation.navigate('Booking', { doctorId: item.id })}
            onToggleFavorite={() => toggleDoctor(item.id)}
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  search: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.light,
    marginHorizontal: 16, marginBottom: 12, paddingHorizontal: 16, height: 44, borderRadius: 22,
  },
  empty: { color: colors.text, textAlign: 'center', marginTop: 40 },
});
