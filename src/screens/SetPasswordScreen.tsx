import { useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../theme';
import AuthField from '../components/AuthField';
import Button from '../components/Button';
import ScreenHeader from '../components/ScreenHeader';

export default function SetPasswordScreen() {
  const navigation = useNavigation();
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  const submit = () => {
    if (password.length < 6) return Alert.alert('Set Password', 'Password must be at least 6 characters.');
    if (password !== confirm) return Alert.alert('Set Password', 'Passwords do not match.');
    Alert.alert('Password updated', 'Your new password has been saved.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <ScreenHeader title="Set Password" />
          <Text style={styles.desc}>
            Choose a new password for your account. Use at least 6 characters.
          </Text>
          <View style={{ marginTop: 24, paddingHorizontal: 16 }}>
            <AuthField label="Password" password placeholder="*************" value={password} onChangeText={setPassword} />
            <AuthField label="Confirm Password" password placeholder="*************" value={confirm} onChangeText={setConfirm} />
          </View>
          <Button label="Create New Password" onPress={submit} style={{ marginTop: 24, marginHorizontal: 16 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 32 },
  desc: { color: colors.text, fontSize: 12, lineHeight: 17, marginHorizontal: 16, marginTop: 8 },
});
