import { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';

import { colors } from '../theme';
import AuthField, { SocialRow } from '../components/AuthField';
import { useAuth } from '../navigation/AuthContext';
import type { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');

  const submit = () => {
    if (!login.trim() || !password) {
      Alert.alert('Log In', 'Enter your email or mobile number and password.');
      return;
    }
    signIn();
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={10}>
              <Ionicons name="chevron-back" size={26} color={colors.primary} />
            </TouchableOpacity>
            <Text style={styles.title}>Log In</Text>
            <View style={{ width: 26 }} />
          </View>

          <Text style={styles.welcome}>Welcome</Text>
          <Text style={styles.desc}>
            Log in to book appointments, chat with your doctor and manage your skin care.
          </Text>

          <View style={{ marginTop: 28 }}>
            <AuthField
              label="Email or Mobile Number"
              placeholder="example@example.com"
              value={login}
              onChangeText={setLogin}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <AuthField
              label="Password"
              password
              placeholder="*************"
              value={password}
              onChangeText={setPassword}
            />
            <Text style={styles.forgot}>Forget Password</Text>
          </View>

          <TouchableOpacity style={styles.btn} onPress={submit}>
            <Text style={styles.btnText}>Log In</Text>
          </TouchableOpacity>

          <Text style={styles.or}>or sign up with</Text>
          <SocialRow />

          <Text style={styles.footer}>
            Don't have an account?{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('SignUp')}>Sign Up</Text>
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingHorizontal: 24, paddingBottom: 32 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 12 },
  title: { color: colors.primary, fontSize: 22, fontWeight: '700' },
  welcome: { color: colors.primary, fontSize: 24, fontWeight: '700', marginTop: 28 },
  desc: { color: colors.text, fontSize: 12, marginTop: 6, lineHeight: 17 },
  forgot: { color: colors.primary, fontSize: 12, fontWeight: '700', textAlign: 'right' },
  btn: {
    backgroundColor: colors.primary, height: 52, borderRadius: 26, marginTop: 28,
    marginHorizontal: 24, alignItems: 'center', justifyContent: 'center',
  },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  or: { color: colors.text, fontSize: 11, textAlign: 'center', marginTop: 18 },
  footer: { color: colors.text, fontSize: 12, textAlign: 'center', marginTop: 32 },
  link: { color: colors.primary, fontWeight: '700' },
});