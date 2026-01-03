/**
 * API Service - Backend ile iletişim
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_URL } from '../constants/config';
import { ApiError } from '../types';

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
    const token = await SecureStore.getItemAsync('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Error handling
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    // 401 Unauthorized - Token geçersiz veya süresi dolmuş
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('auth_token');
      // Auth state'i temizle (store'dan)
    }

    // Error mesajını düzgün formatla
    const apiError: ApiError = {
      error: error.response?.data?.error || 'Bir hata oluştu',
      message: error.response?.data?.message || error.message,
    };

    return Promise.reject(apiError);
  }
);

export default api;

