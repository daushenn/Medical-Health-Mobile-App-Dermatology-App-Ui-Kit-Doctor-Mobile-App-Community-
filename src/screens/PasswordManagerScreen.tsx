import { useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../theme';
import AuthField from '../components/AuthField';
import Button from '../components/Button';
import ScreenHeader from '../components/ScreenHeader';
import type { Nav } from '../navigation/types';

export default function PasswordManagerScreen() {
  const navigation = useNavigation<Nav>();
  const [current, setCurrent] = useState('');
  const [next, setNext] = useState('');
  const [confirm, setConfirm] = useState('');

  const submit = () => {
    if (!current) return Alert.alert('Password Manager', 'Enter your current password.');
    if (next.length < 6) return Alert.alert('Password Manager', 'New password must be at least 6 characters.');
    if (next === current) return Alert.alert('Password Manager', 'New password must differ from the current one.');
    if (next !== confirm) return Alert.alert('Password Manager', 'Passwords do not match.');
    Alert.alert('Password changed', 'Your password has been updated.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <ScreenHeader title="Password Manager" />
          <View style={{ marginTop: 16, paddingHorizontal: 16 }}>
            <AuthField label="Current Password" password placeholder="*************" value={current} onChangeText={setCurrent} />
            <Text style={styles.forgot} onPress={() => navigation.navigate('SetPassword')}>Forgot Password?</Text>
            <AuthField label="New Password" password placeholder="*************" value={next} onChangeText={setNext} />
            <AuthField label="Confirm New Password" password placeholder="*************" value={confirm} onChangeText={setConfirm} />
          </View>
          <Button label="Change Password" onPress={submit} style={{ marginTop: 24, marginHorizontal: 16 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 32 },
  forgot: {
    color: colors.primary, fontSize: 12, fontWeight: '700', textAlign: 'right',
    textDecorationLine: 'underline', marginTop: -8, marginBottom: 16,
  },
});
