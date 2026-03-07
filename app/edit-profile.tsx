import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../features/auth';

const colors = {
  background: '#171612',
  surface: '#201d18',
  gold: '#d4af35',
  champagne: '#f2f0e9',
  platinum: '#b6b1a0',
  muted: '#9e9888',
  borderGold: 'rgba(212, 175, 53, 0.3)',
};

export default function EditProfileScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { user, updateProfile } = useAuth();
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState(false);

  const hasChanges = fullName.trim() !== (user?.full_name || '');

  const handleSave = async () => {
    if (!fullName.trim()) {
      Alert.alert(t('common.error') || 'Error', t('profile.nameRequired') || 'Name is required');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile({ full_name: fullName.trim() });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.back();
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert(
        t('common.error') || 'Error',
        error?.message || t('profile.updateError') || 'Failed to update profile'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
          accessibilityLabel={t('common.close') || 'Go back'}
          accessibilityRole="button"
        >
          <Ionicons name="chevron-back" size={24} color={colors.champagne} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('profile.editProfile') || 'Edit Profile'}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.flex}
      >
        <View style={styles.content}>
          {/* Avatar */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {(fullName || user?.email || '?').charAt(0).toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Full Name Input */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.fullName') || 'Full Name'}</Text>
            <View style={[styles.inputContainer, focusedInput && styles.inputContainerFocused]}>
              <TextInput
                style={styles.input}
                placeholder={t('auth.fullNamePlaceholder') || 'John Doe'}
                placeholderTextColor={colors.muted}
                value={fullName}
                onChangeText={setFullName}
                onFocus={() => setFocusedInput(true)}
                onBlur={() => setFocusedInput(false)}
                autoCapitalize="words"
                autoComplete="name"
                accessibilityLabel={t('auth.fullName') || 'Full Name'}
              />
            </View>
          </View>

          {/* Email (read-only) */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.emailLabel') || 'Email'}</Text>
            <View style={[styles.inputContainer, styles.inputContainerDisabled]}>
              <Text style={styles.disabledText}>{user?.email || ''}</Text>
            </View>
          </View>

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading || !hasChanges}
            activeOpacity={0.8}
            style={[styles.saveButton, (!hasChanges || isLoading) && styles.saveButtonDisabled]}
            accessibilityLabel={t('common.save') || 'Save'}
            accessibilityRole="button"
          >
            {isLoading ? (
              <ActivityIndicator color={colors.background} />
            ) : (
              <Text style={[styles.saveButtonText, (!hasChanges || isLoading) && styles.saveButtonTextDisabled]}>
                {t('common.save') || 'Save'}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(212, 175, 53, 0.15)',
  },
  backButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: colors.champagne,
    fontSize: 18,
    fontWeight: '600',
  },
  headerSpacer: { width: 44 },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
  },
  avatarContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: colors.gold,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.gold,
    fontSize: 32,
    fontWeight: '600',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: colors.platinum,
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 12,
    backgroundColor: colors.surface,
    minHeight: 48,
    justifyContent: 'center',
  },
  inputContainerFocused: {
    borderColor: colors.gold,
  },
  inputContainerDisabled: {
    opacity: 0.6,
  },
  input: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.champagne,
    fontSize: 16,
  },
  disabledText: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: colors.muted,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: colors.gold,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 12,
    minHeight: 48,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: colors.background,
  },
});
