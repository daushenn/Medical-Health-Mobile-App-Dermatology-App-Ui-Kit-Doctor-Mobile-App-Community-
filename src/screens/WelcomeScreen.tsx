import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors } from '../theme';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

export default function WelcomeScreen({ navigation }: Props) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.center}>
        <View style={styles.logo}>
          <Ionicons name="medical" size={64} color={colors.primary} />
        </View>
        <Text style={styles.brand}>Skin First</Text>
        <Text style={styles.sub}>Dermatology Center</Text>
      </View>

      <View style={styles.buttons}>
        <TouchableOpacity style={styles.btnWhite} onPress={() => navigation.navigate('Login')}>
          <Text style={styles.btnWhiteText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btnOutline} onPress={() => navigation.navigate('SignUp')}>
          <Text style={styles.btnOutlineText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.primary, paddingHorizontal: 32 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: {
    width: 120, height: 120, borderRadius: 36, backgroundColor: '#fff',
    alignItems: 'center', justifyContent: 'center',
  },
  brand: { color: '#fff', fontSize: 40, fontWeight: '300', marginTop: 24 },
  sub: { color: '#fff', fontSize: 13, fontWeight: '700', marginTop: 6 },
  buttons: { gap: 14, paddingBottom: 32 },
  btnWhite: { backgroundColor: '#fff', height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  btnWhiteText: { color: colors.primary, fontSize: 17, fontWeight: '600' },
  btnOutline: {
    height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: '#fff',
  },
  btnOutlineText: { color: '#fff', fontSize: 17, fontWeight: '600' },
});