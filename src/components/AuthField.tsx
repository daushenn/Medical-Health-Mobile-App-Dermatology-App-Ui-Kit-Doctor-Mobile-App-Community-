import { useState } from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { colors } from '../theme';

type Props = TextInputProps & { label: string; password?: boolean };

export default function AuthField({ label, password, ...rest }: Props) {
  const [hidden, setHidden] = useState(!!password);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.box}>
        <TextInput
          {...rest}
          secureTextEntry={password ? hidden : false}
          placeholderTextColor="#9AA9F0"
          style={styles.input}
        />
        {password && (
          <TouchableOpacity onPress={() => setHidden((h) => !h)} hitSlop={10}>
            <Ionicons name={hidden ? 'eye-off-outline' : 'eye-outline'} size={22} color={colors.text} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 16 },
  label: { color: '#000', fontSize: 16, fontWeight: '600', marginBottom: 8 },
  box: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: colors.bg,
    borderRadius: 16, paddingHorizontal: 16, height: 52,
  },
  input: { flex: 1, color: colors.primary, fontSize: 15 },
});