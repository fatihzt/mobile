import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, typography } from '@/shared/theme';

interface MenuItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value?: string;
  onPress: () => void;
  destructive?: boolean;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  label,
  value,
  onPress,
  destructive = false,
}) => {
  const iconColor = destructive ? colors.error : colors.gold;
  const textColor = destructive ? colors.error : colors.champagne;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      accessibilityLabel={`${label}${value ? `, ${value}` : ''}`}
      accessibilityRole="button"
      activeOpacity={0.7}
    >
      <View style={styles.leftContent}>
        <Ionicons name={icon} size={24} color={iconColor} style={styles.icon} />
        <Text style={[styles.label, { color: textColor }]}>{label}</Text>
      </View>
      <View style={styles.rightContent}>
        {value && <Text style={styles.value}>{value}</Text>}
        <Ionicons name="chevron-forward" size={20} color={colors.muted} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
    minHeight: 44,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.separator,
  },
  leftContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  icon: {
    marginRight: spacing.md,
  },
  label: {
    ...typography.body,
    flex: 1,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    ...typography.subheadline,
    color: colors.muted,
    marginRight: spacing.sm,
  },
});
