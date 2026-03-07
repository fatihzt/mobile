/**
 * API Service - Backend ile iletişim
 * Core API client - shared service
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../../config/constants';
import { ApiError } from '../types';

// Global callback for auth state cleanup on 401
let onUnauthorizedCallback: (() => void) | null = null;

export const setOnUnauthorizedCallback = (callback: () => void) => {
  onUnauthorizedCallback = callback;
};

// Axios instance oluştur
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Token ekle
api.interceptors.request.use(
  async (config) => {
    try {
      const token = await SecureStore.getItemAsync('auth_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    } catch (error) {
      if (__DEV__) console.error('Request Interceptor Error:', error);
      return Promise.reject(error);
    }
  },
  (error) => {
    if (__DEV__) console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Error handling ve log
api.interceptors.response.use(
  (response) => {
    // Başarılı response - sadece geliştirme aşamasında debug için kullanılabilir
    // console.log('📥 API Response:', response.config.url, response.status);
    return response;
  },
  async (error: AxiosError<ApiError>) => {
    if (__DEV__) {
      console.error('API Error:', {
        message: error.message,
        status: error.response?.status,
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
      });
    }

    try {
      // 401 Unauthorized - Token geçersiz veya süresi dolmuş
      if (error.response?.status === 401) {
        await SecureStore.deleteItemAsync('auth_token');
        if (onUnauthorizedCallback) {
          onUnauthorizedCallback();
        }
      }

      // Error mesajını düzgün formatla
      const apiError: ApiError = {
        error: error.response?.data?.error || 'Bir hata oluştu',
        message: error.response?.data?.message || error.message,
      };

      return Promise.reject(apiError);
    } catch (interceptorError) {
      if (__DEV__) console.error('Response Interceptor Error:', interceptorError);
      return Promise.reject(error);
    }
  }
);

export default api;

