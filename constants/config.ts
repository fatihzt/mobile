/**
 * App Configuration
 * Environment variables ve sabitler
 */

export const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';
export const ENV = process.env.EXPO_PUBLIC_ENV || 'development';

// API Endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
  },
  EVENTS: {
    LIST: '/events',
    DETAIL: (id: string) => `/events/${id}`,
    RSVP: (id: string) => `/events/${id}/rsvp`,
    SYNC: '/events/sync',
  },
} as const;

// App Constants
export const APP_NAME = 'EventApp';
export const CACHE_TIME = 5 * 60 * 1000; // 5 dakika

