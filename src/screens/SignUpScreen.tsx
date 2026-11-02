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

type Props = NativeStackScreenProps<RootStackParamList, 'SignUp'>;

const formatDob = (v: string) => {
  const d = v.replace(/\D/g, '').slice(0, 8);
  return [d.slice(0, 2), d.slice(2, 4), d.slice(4, 8)].filter(Boolean).join(' / ');
};

export default function SignUpScreen({ navigation }: Props) {
  const { signIn } = useAuth();
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [dob, setDob] = useState('');

  const submit = () => {
    if (!fullName.trim()) return Alert.alert('Sign Up', 'Please enter your full name.');
    if (!email.includes('@')) return Alert.alert('Sign Up', 'Please enter a valid email.');
    if (password.length < 6) return Alert.alert('Sign Up', 'Password must be at least 6 characters.');
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
            <Text style={styles.title}>New Account</Text>
            <View style={{ width: 26 }} />
          </View>

          <View style={{ marginTop: 24 }}>
            <AuthField label="Full name" placeholder="John Doe" value={fullName} onChangeText={setFullName} />
            <AuthField
              label="Password"
              password
              placeholder="*************"
              value={password}
              onChangeText={setPassword}
            />
            <AuthField
              label="Email"
              placeholder="example@example.com"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <AuthField
              label="Mobile Number"
              placeholder="+7 700 000 00 00"
              value={mobile}
              onChangeText={setMobile}
              keyboardType="phone-pad"
            />
            <AuthField
              label="Date Of Birth"
              placeholder="DD / MM / YYYY"
              value={dob}
              onChangeText={(v) => setDob(formatDob(v))}
              keyboardType="number-pad"
            />
          </View>

          <Text style={styles.terms}>
            By continuing, you agree to{'\n'}
            <Text style={styles.link}>Terms of Use</Text> and <Text style={styles.link}>Privacy Policy.</Text>
          </Text>

          <TouchableOpacity style={styles.btn} onPress={submit}>
            <Text style={styles.btnText}>Sign Up</Text>
          </TouchableOpacity>

          <Text style={styles.or}>or sign up with</Text>
          <SocialRow />

          <Text style={styles.footer}>
            already have an account?{' '}
            <Text style={styles.link} onPress={() => navigation.navigate('Login')}>Log in</Text>
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
  terms: { color: colors.text, fontSize: 10, textAlign: 'center', marginTop: 4, lineHeight: 15 },
  link: { color: colors.primary, fontWeight: '700' },
  btn: {
    backgroundColor: colors.primary, height: 52, borderRadius: 26, marginTop: 16,
    marginHorizontal: 24, alignItems: 'center', justifyContent: 'center',
  },
  btnText: { color: '#fff', fontSize: 18, fontWeight: '600' },
  or: { color: colors.text, fontSize: 11, textAlign: 'center', marginTop: 16 },
  footer: { color: colors.text, fontSize: 12, textAlign: 'center', marginTop: 28 },
});