import React, { useState } from 'react';
import { TextInput, TextInputProps, View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, radius } from '@/shared/theme';

/* ────────────────────────────────────────── */
/* TYPES                                       */
/* ────────────────────────────────────────── */
interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

/* ────────────────────────────────────────── */
/* COMPONENT                                   */
/* ────────────────────────────────────────── */
export const Input: React.FC<InputProps> = ({ label, error, containerStyle, style, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor="rgba(242, 240, 233, 0.3)"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

/* ────────────────────────────────────────── */
/* STYLES                                     */
/* ────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.base,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.gold,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: radius.md,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    minHeight: 44,
    fontSize: 16,
    backgroundColor: colors.surface,
    color: colors.champagne,
  },
  inputFocused: {
    borderColor: colors.gold,
  },
  inputError: {
    borderColor: colors.error,
  },
  errorText: {
    fontSize: 12,
    color: colors.error,
    marginTop: spacing.xs,
  },
});
