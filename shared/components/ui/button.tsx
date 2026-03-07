import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radius } from '@/shared/theme';

/* ────────────────────────────────────────── */
/* TYPES                                       */
/* ────────────────────────────────────────── */
interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
}

/* ────────────────────────────────────────── */
/* COMPONENT                                   */
/* ────────────────────────────────────────── */
export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  style,
}) => {
  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  const getVariantStyle = (): ViewStyle => {
    switch (variant) {
      case 'outline':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.borderGold };
      case 'ghost':
        return { backgroundColor: 'transparent' };
      case 'destructive':
        return { backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.error };
      default:
        return { backgroundColor: colors.gold };
    }
  };

  const getSizeStyle = (): ViewStyle => {
    switch (size) {
      case 'sm':
        return { paddingHorizontal: spacing.md, paddingVertical: spacing.sm, minHeight: 44 };
      case 'lg':
        return { paddingHorizontal: spacing.lg, paddingVertical: spacing.base, minHeight: 44 };
      default:
        return { paddingHorizontal: spacing.base, paddingVertical: spacing.md, minHeight: 44 };
    }
  };

  const getTextColor = (): string => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return colors.gold;
      case 'destructive':
        return colors.error;
      default:
        return colors.background;
    }
  };

  const getTextSize = (): number => {
    switch (size) {
      case 'sm':
        return 14;
      case 'lg':
        return 18;
      default:
        return 16;
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.base,
        getVariantStyle(),
        getSizeStyle(),
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor(), fontSize: getTextSize() }]}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

/* ────────────────────────────────────────── */
/* STYLES                                     */
/* ────────────────────────────────────────── */
const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    fontWeight: '600',
  },
});
