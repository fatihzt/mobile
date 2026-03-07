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
  UPDATE_PROFILE: '/auth/profile',
};

const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  USER: 'user_data',
};

class AuthService {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, credentials);
      const { user, token } = response.data;
      await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token);
      await this.saveUser(user);
      return { user, token };
    } catch (error: any) {
      if (__DEV__) console.error('Login Error:', error?.message || error?.error);
      throw error;
    }
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.SIGNUP, data);
      const { user, token } = response.data;
      await SecureStore.setItemAsync(STORAGE_KEYS.TOKEN, token);
      await this.saveUser(user);
      return { user, token };
    } catch (error: any) {
      if (__DEV__) console.error('Signup Error:', error?.message || error?.error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(STORAGE_KEYS.TOKEN);
      await SecureStore.deleteItemAsync(STORAGE_KEYS.USER);
    } catch (error: any) {
      if (__DEV__) console.error('Logout Error:', error);
      throw error;
    }
  }

  async getToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(STORAGE_KEYS.TOKEN);
    } catch (error: any) {
      if (__DEV__) console.error('GetToken Error:', error);
      return null;
    }
  }

  async saveUser(user: User): Promise<void> {
    try {
      await SecureStore.setItemAsync(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (error: any) {
      if (__DEV__) console.error('SaveUser Error:', error);
    }
  }

  async getUser(): Promise<User | null> {
    try {
      const userData = await SecureStore.getItemAsync(STORAGE_KEYS.USER);
      if (userData) {
        return JSON.parse(userData);
      }
      return null;
    } catch (error: any) {
      if (__DEV__) console.error('GetUser Error:', error);
      return null;
    }
  }

  async updateProfile(data: { full_name: string }): Promise<User> {
    try {
      const response = await api.put<{ user: User }>(AUTH_ENDPOINTS.UPDATE_PROFILE, data);
      const { user } = response.data;
      await this.saveUser(user);
      return user;
    } catch (error: any) {
      if (__DEV__) console.error('UpdateProfile Error:', error?.message || error?.error);
      throw error;
    }
  }
}

export default new AuthService();
