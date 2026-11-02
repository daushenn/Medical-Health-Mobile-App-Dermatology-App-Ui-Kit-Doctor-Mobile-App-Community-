import { useState } from 'react';
import { Alert, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { colors } from '../theme';
import AuthField from '../components/AuthField';
import Button from '../components/Button';
import ScreenHeader from '../components/ScreenHeader';
import { useProfile } from '../data/ProfileContext';
import { formatDob } from '../utils/dates';
import type { Nav } from '../navigation/types';

export default function EditProfileScreen() {
  const navigation = useNavigation<Nav>();
  const { profile, update } = useProfile();
  const [name, setName] = useState(profile.name);
  const [phone, setPhone] = useState(profile.phone);
  const [email, setEmail] = useState(profile.email);
  const [dob, setDob] = useState(profile.dob);

  const submit = () => {
    if (!name.trim()) return Alert.alert('Profile', 'Please enter your full name.');
    if (!email.includes('@')) return Alert.alert('Profile', 'Please enter a valid email.');
    update({ name: name.trim(), phone: phone.trim(), email: email.trim(), dob });
    Alert.alert('Profile updated', 'Your changes have been saved.', [
      { text: 'OK', onPress: () => navigation.goBack() },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <ScreenHeader
            title="Profile"
            right={
              <TouchableOpacity onPress={() => navigation.navigate('Settings')} hitSlop={10}>
                <Ionicons name="settings-outline" size={24} color={colors.primary} />
              </TouchableOpacity>
            }
          />

          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={64} color={colors.light} />
            </View>
          </View>

          <View style={{ marginTop: 16, paddingHorizontal: 24 }}>
            <AuthField label="Full Name" value={name} onChangeText={setName} placeholder="John Doe" />
            <AuthField label="Phone Number" value={phone} onChangeText={setPhone} keyboardType="phone-pad" placeholder="+123 567 89000" />
            <AuthField
              label="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              placeholder="johndoe@example.com"
            />
            <AuthField
              label="Date Of Birth"
              value={dob}
              onChangeText={(v) => setDob(formatDob(v))}
              keyboardType="number-pad"
              placeholder="DD / MM / YYYY"
            />
          </View>

          <Button label="Update Profile" onPress={submit} style={{ marginTop: 16, marginHorizontal: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  scroll: { paddingBottom: 32 },
  avatarWrap: { alignSelf: 'center', marginTop: 4 },
  avatar: {
    width: 104, height: 104, borderRadius: 52, backgroundColor: colors.primary,
    alignItems: 'center', justifyContent: 'center',
  },
});
