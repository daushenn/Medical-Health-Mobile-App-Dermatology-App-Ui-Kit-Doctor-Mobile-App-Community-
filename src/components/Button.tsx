import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native';

import { colors } from '../theme';

type Props = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'soft' | 'white';
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Button({ label, onPress, variant = 'primary', disabled, style }: Props) {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      onPress={onPress}
      style={[styles.btn, styles[variant], disabled && { opacity: 0.5 }, style]}
    >
      <Text style={[styles.text, variant === 'primary' ? styles.textPrimary : styles.textAlt]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: { height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: colors.primary },
  soft: { backgroundColor: colors.light },
  white: { backgroundColor: '#fff' },
  text: { fontSize: 18, fontWeight: '600' },
  textPrimary: { color: '#fff' },
  textAlt: { color: colors.primary },
});
