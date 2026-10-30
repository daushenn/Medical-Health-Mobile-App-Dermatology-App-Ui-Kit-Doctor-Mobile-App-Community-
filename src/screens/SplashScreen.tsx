import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme';

export default function SplashScreen() {
  return (
    <View style={styles.container}>
      <Ionicons name="medical" size={90} color={colors.white} />
      <Text style={styles.title}>Skin First</Text>
      <Text style={styles.sub}>Dermatology Center</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  title: { color: colors.white, fontSize: 40, fontWeight: '300', marginTop: 12 },
  sub: { color: colors.white, fontSize: 13, fontWeight: '700', marginTop: 8 },
});