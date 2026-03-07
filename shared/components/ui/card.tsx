import React from 'react';
import { View, ViewProps, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, radius } from '@/shared/theme';

/* ────────────────────────────────────────── */
/* TYPES                                       */
/* ────────────────────────────────────────── */
interface CardProps extends ViewProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

interface CardSectionProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

/* ────────────────────────────────────────── */
/* COMPONENTS                                  */
/* ────────────────────────────────────────── */
export const Card: React.FC<CardProps> = ({ children, style, ...props }) => {
  return (
    <View style={[styles.card, style]} {...props}>
      {children}
    </View>
  );
};

export const CardHeader: React.FC<CardSectionProps> = ({ children, style }) => {
  return <View style={[styles.section, style]}>{children}</View>;
};

export const CardContent: React.FC<CardSectionProps> = ({ children, style }) => {
  return <View style={[styles.section, style]}>{children}</View>;
};

export const CardFooter: React.FC<CardSectionProps> = ({ children, style }) => {
  return <View style={[styles.footer, style]}>{children}</View>;
};

/* ────────────────────────────────────────── */
/* STYLES                                     */
/* ────────────────────────────────────────── */
const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  section: {
    padding: spacing.base,
  },
  footer: {
    paddingHorizontal: spacing.base,
    paddingBottom: spacing.base,
  },
});
