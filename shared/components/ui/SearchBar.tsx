import React, { useState, useCallback, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, radius } from '@/shared/theme';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  debounceMs?: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  debounceMs = 300,
}) => {
  const [internalValue, setInternalValue] = useState(value);
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  const debouncedOnChange = useCallback(
    (text: string) => {
      const timeoutId = setTimeout(() => {
        onChangeText(text);
      }, debounceMs);

      return () => clearTimeout(timeoutId);
    },
    [onChangeText, debounceMs]
  );

  const handleChangeText = (text: string) => {
    setInternalValue(text);
    const cleanup = debouncedOnChange(text);
    return cleanup;
  };

  const handleClear = () => {
    setInternalValue('');
    onChangeText('');
  };

  return (
    <View
      style={[
        styles.container,
        isFocused && styles.containerFocused,
      ]}
    >
      <Ionicons name="search-outline" size={20} color={colors.muted} style={styles.searchIcon} />
      <TextInput
        style={styles.input}
        value={internalValue}
        onChangeText={handleChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        accessibilityLabel="Search events"
      />
      {internalValue.length > 0 && (
        <TouchableOpacity
          onPress={handleClear}
          style={styles.clearButton}
          accessibilityLabel="Clear search"
          accessibilityRole="button"
        >
          <Ionicons name="close-circle" size={20} color={colors.muted} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderGold,
    paddingHorizontal: spacing.md,
    minHeight: 44,
  },
  containerFocused: {
    borderColor: colors.gold,
  },
  searchIcon: {
    marginRight: spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.champagne,
    paddingVertical: spacing.sm,
  },
  clearButton: {
    padding: spacing.xs,
    marginLeft: spacing.xs,
  },
});
