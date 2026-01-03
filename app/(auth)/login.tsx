/**
 * Login Screen - Expo Router
 */

import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../features/auth';

export default function LoginScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert(t('common.error'), t('auth.invalidCredentials'));
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.replace('/(tabs)/events');
    } catch (error: any) {
      Alert.alert(t('auth.loginError'), error.message || t('auth.loginError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 justify-center px-5">
        <Text className="text-3xl font-bold text-center mb-2">{t('auth.welcome')}</Text>
        <Text className="text-base text-gray-600 mb-8 text-center">{t('auth.loginSubtitle')}</Text>

        <View>
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

          <TouchableOpacity
            className={`bg-primary rounded-lg p-4 items-center mt-2 ${isLoading ? 'opacity-60' : ''}`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white text-base font-semibold">{t('auth.login')}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4 items-center"
            onPress={() => router.push('/(auth)/signup')}
          >
            <Text className="text-gray-600 text-sm">
              {t('auth.noAccount')}{' '}
              <Text className="text-primary font-semibold">{t('auth.signup')}</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

