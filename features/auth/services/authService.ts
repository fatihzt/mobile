/**
 * Auth Service - Authentication API calls
 */

import api from '../../../shared/services/api';
import * as SecureStore from 'expo-secure-store';
import { AuthResponse, User } from '../../../shared/types';
import { LoginCredentials, SignupData } from '../types';

const AUTH_ENDPOINTS = {
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
};

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
    const { user, token } = response.data;

    await SecureStore.setItemAsync('auth_token', token);
    return { user, token };
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.SIGNUP, data);
    const { user, token } = response.data;

    await SecureStore.setItemAsync('auth_token', token);
    return { user, token };
  }

  async logout(): Promise<void> {
    await SecureStore.deleteItemAsync('auth_token');
  }

  async getToken(): Promise<string | null> {
    return await SecureStore.getItemAsync('auth_token');
  }

  async getCurrentUser(): Promise<User | null> {
    const token = await this.getToken();
    if (!token) return null;
    // İleride /auth/me endpoint'i eklenebilir
    return null;
  }
}

export default new AuthService();

