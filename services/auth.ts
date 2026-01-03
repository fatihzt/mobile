/**
 * Authentication Service
 */

import api from './api';
import * as SecureStore from 'expo-secure-store';
import { AuthResponse, User } from '../types';
// ENDPOINTS'i burada da tanımlayalım
const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
};

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  full_name?: string;
}

class AuthService {
  /**
   * Kullanıcı girişi
   */
    async login(credentials: LoginCredentials): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
    const { user, token } = response.data;

    // Token'ı güvenli şekilde sakla
    await SecureStore.setItemAsync('auth_token', token);

    return { user, token };
  }

  /**
   * Kullanıcı kaydı
   */
    async signup(data: SignupData): Promise<AuthResponse> {
        const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.SIGNUP, data);
    const { user, token } = response.data;

    // Token'ı güvenli şekilde sakla
    await SecureStore.setItemAsync('auth_token', token);

    return { user, token };
  }

  /**
   * Çıkış yap
   */
  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('auth_token');
  }

  /**
   * Mevcut token'ı kontrol et
   */
  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('auth_token');
  }

  /**
   * Kullanıcı bilgilerini al (token'dan decode edilebilir veya API'den çekilebilir)
   */
  async getCurrentUser(): Promise<User | null> {
    const token = await this.getToken();
    if (!token) return null;

    // Token decode edilebilir veya API'den user bilgisi çekilebilir
    // Şimdilik token varsa user var sayıyoruz
    // İleride /auth/me endpoint'i eklenebilir
    return null;
  }
}

export default new AuthService();

