/**
 * TypeScript type definitions
 */

export interface User {
  id: string;
  email: string;
  full_name?: string;
}

export interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  city: string;
  category: string;
  image_url?: string;
  start_time: string;
  end_time?: string;
  source?: string;
  lat?: number;
  lng?: number;
  creator_id?: string;
  creator_name?: string;
  created_at?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface EventFilters {
  city?: string;
  category?: string;
  search?: string;
}

export interface ApiError {
  error: string;
  message?: string;
}

