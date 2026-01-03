/**
 * App Configuration Constants
 * Environment variables ve sabitler
 */

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
export const ENV = process.env.EXPO_PUBLIC_ENV || 'development';

// App Constants
export const APP_NAME = 'EventApp';
export const CACHE_TIME = 5 * 60 * 1000; // 5 dakika

