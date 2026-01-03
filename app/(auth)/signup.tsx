/**
 * Signup Screen - Expo Router
 */

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../features/auth';

export default function SignupScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuth();

  const handleSignup = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('auth.invalidCredentials'));
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(t('common.error'), t('auth.passwordsNotMatch'));
      return;
    }

    if (password.length < 6) {
      Alert.alert(t('common.error'), t('auth.passwordTooShort'));
      return;
    }

    setIsLoading(true);
    try {
      await signup(email, password, fullName || undefined);
      router.replace('/(tabs)/events');
    } catch (error: any) {
      Alert.alert(t('auth.signupError'), error.message || t('auth.signupError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerClassName="flex-grow justify-center px-5 py-8">
        <Text className="text-3xl font-bold text-center mb-2">{t('auth.signup')}</Text>
        <Text className="text-base text-gray-600 mb-8 text-center">{t('auth.signupSubtitle')}</Text>

        <View>
          <TextInput
            className="border border-gray-300 rounded-lg p-4 text-base mb-4 bg-gray-50"
            placeholder={t('auth.fullName')}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />

          <TextInput
            className="border border-gray-300 rounded-lg p-4 text-base mb-4 bg-gray-50"
            placeholder={t('auth.email')}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />

          <TextInput
            className="border border-gray-300 rounded-lg p-4 text-base mb-4 bg-gray-50"
            placeholder={t('auth.password')}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TextInput
            className="border border-gray-300 rounded-lg p-4 text-base mb-4 bg-gray-50"
            placeholder={t('auth.passwordConfirm')}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <TouchableOpacity
            className={`bg-primary rounded-lg p-4 items-center mt-2 ${isLoading ? 'opacity-60' : ''}`}
            onPress={handleSignup}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-semibold">{t('auth.signup')}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4 items-center"
            onPress={() => router.back()}
          >
            <Text className="text-gray-600 text-sm">
              {t('auth.hasAccount')}{' '}
              <Text className="text-primary font-semibold">{t('auth.login')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

