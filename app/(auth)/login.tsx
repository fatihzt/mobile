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
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../../features/auth';

/* ────────────────────────────────────────── */
/* COLORS                                      */
/* ────────────────────────────────────────── */
const colors = {
  background: '#171612',
  surface: '#201d18',
  gold: '#d4af35',
  champagne: '#f2f0e9',
  platinum: '#b6b1a0',
  muted: '#9e9888',
  borderGold: 'rgba(212, 175, 53, 0.3)',
};

/* ────────────────────────────────────────── */
/* SCREEN                                     */
/* ────────────────────────────────────────── */

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const validateEmail = (emailValue: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailValue);
  };

  const handleLogin = async () => {
    if (!email || !email.trim()) {
      Alert.alert(t('common.error'), t('auth.emailRequired') || 'Email is required');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert(t('common.error'), t('auth.invalidEmail') || 'Please enter a valid email address');
      return;
    }

    if (!password) {
      Alert.alert(t('common.error'), t('auth.passwordRequired') || 'Password is required');
      return;
    }

    setIsLoading(true);
    try {
      await login(email.trim(), password);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      router.replace('/(tabs)/events');
    } catch (error: any) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      const errorMessage = error?.message || error?.error || t('auth.loginError') || 'Login failed';
      Alert.alert(t('auth.loginError') || 'Login Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.mainContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.logoText}>◆</Text>
              <Text style={styles.appName}>{t('common.appName') || 'HAPN'}</Text>
            </View>

            {/* Welcome */}
            <View style={styles.welcomeSection}>
              <Text style={styles.titleText}>{t('auth.welcomeBack') || 'Welcome back'}</Text>
              <Text style={styles.subtitleText}>{t('auth.signInToContinue') || 'Sign in to continue'}</Text>

              {/* Form */}
              <View style={styles.form}>
                {/* Email */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t('auth.emailLabel') || 'Email'}</Text>
                  <View style={[styles.inputContainer, focusedInput === 'email' && styles.inputContainerFocused]}>
                    <TextInput
                      style={styles.input}
                      placeholder={t('auth.emailPlaceholder') || 'your@email.com'}
                      placeholderTextColor={colors.muted}
                      value={email}
                      onChangeText={setEmail}
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      autoComplete="email"
                      accessibilityLabel={t('auth.emailLabel') || 'Email'}
                    />
                  </View>
                </View>

                {/* Password */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>{t('auth.passwordLabel') || 'Password'}</Text>
                  <View style={[styles.inputContainer, focusedInput === 'password' && styles.inputContainerFocused]}>
                    <TextInput
                      style={styles.input}
                      placeholder="••••••••"
                      placeholderTextColor={colors.muted}
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      accessibilityLabel={t('auth.passwordLabel') || 'Password'}
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                      accessibilityLabel={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                        size={20}
                        color={colors.muted}
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Submit */}
                <TouchableOpacity
                  onPress={handleLogin}
                  disabled={isLoading}
                  activeOpacity={0.8}
                  style={styles.submitButton}
                  accessibilityLabel={t('auth.signIn') || 'Sign In'}
                  accessibilityRole="button"
                >
                  {isLoading ? (
                    <ActivityIndicator color={colors.background} />
                  ) : (
                    <Text style={styles.submitButtonText}>{t('auth.signIn') || 'Sign In'}</Text>
                  )}
                </TouchableOpacity>
              </View>

              {/* Signup Link */}
              <View style={styles.signupLink}>
                <Text style={styles.signupText}>
                  {t('auth.noAccount') || "Don't have an account?"}{' '}
                </Text>
                <TouchableOpacity
                  onPress={() => router.push('/(auth)/signup')}
                  accessibilityLabel={t('auth.signUp') || 'Sign Up'}
                  accessibilityRole="button"
                >
                  <Text style={styles.signupLinkText}>{t('auth.signUp') || 'Sign Up'}</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

/* ────────────────────────────────────────── */
/* STYLES                                     */
/* ────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  flex: { flex: 1 },
  scrollContent: { flexGrow: 1 },
  mainContent: { flex: 1, paddingHorizontal: 24, paddingTop: 80 },

  header: { alignItems: 'center', marginBottom: 48 },
  logoText: { color: colors.gold, fontSize: 40, marginBottom: 8 },
  appName: { color: colors.gold, fontSize: 24, fontWeight: '300', letterSpacing: 8 },

  welcomeSection: { flex: 1 },
  titleText: { color: colors.champagne, fontSize: 28, fontWeight: '600', marginBottom: 8 },
  subtitleText: { color: colors.muted, fontSize: 16, marginBottom: 40 },

  form: { gap: 20 },
  inputGroup: {},
  label: { color: colors.platinum, fontSize: 13, fontWeight: '500', marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: colors.borderGold, borderRadius: 12, backgroundColor: colors.surface, minHeight: 48 },
  inputContainerFocused: { borderColor: colors.gold },
  input: { flex: 1, paddingHorizontal: 16, paddingVertical: 16, color: colors.champagne, fontSize: 16 },
  eyeButton: { paddingHorizontal: 16, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },

  submitButton: { backgroundColor: colors.gold, borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8, minHeight: 48 },
  submitButtonText: { color: colors.background, fontSize: 16, fontWeight: '600' },

  signupLink: { flexDirection: 'row', justifyContent: 'center', marginTop: 32 },
  signupText: { color: colors.muted, fontSize: 14 },
  signupLinkText: { color: colors.gold, fontSize: 14, fontWeight: '600' },

});
