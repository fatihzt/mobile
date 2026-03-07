import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { colors, spacing, radius } from '@/shared/theme';

interface FilterChipProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export const FilterChip: React.FC<FilterChipProps> = ({ label, selected, onPress }) => {
  const handlePress = async () => {
    await Haptics.selectionAsync();
    onPress();
  };

  return (
    <TouchableOpacity
      style={[styles.chip, selected ? styles.chipSelected : styles.chipUnselected]}
      onPress={handlePress}
      accessibilityLabel={`${label} filter ${selected ? 'selected' : 'not selected'}`}
      accessibilityRole="button"
      activeOpacity={0.7}
    >
      <Text style={[styles.label, selected ? styles.labelSelected : styles.labelUnselected]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.sm,
    minHeight: 44,
    borderRadius: radius.pill,
    justifyContent: 'center',
    alignItems: 'center',
  },
  chipSelected: {
    backgroundColor: colors.gold,
  },
  chipUnselected: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderGold,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  labelSelected: {
    color: colors.background,
  },
  labelUnselected: {
    color: colors.platinum,
  },
});
