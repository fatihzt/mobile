/**
 * Events Service - Event API calls
 */

import api from '../../../shared/services/api';
import { Event } from '../../../shared/types';
import { EventFilters } from '../types';

const EVENTS_ENDPOINTS = {
  LIST: '/events',
  DETAIL: (id: string) => `/events/${id}`,
};

class EventsService {
  async getEvents(filters?: EventFilters): Promise<Event[]> {
    try {
      const params = new URLSearchParams();

      if (filters?.city) params.append('city', filters.city);
      if (filters?.category) params.append('category', filters.category);
      if (filters?.search) params.append('search', filters.search);

      const queryString = params.toString();
      const url = queryString ? `${EVENTS_ENDPOINTS.LIST}?${queryString}` : EVENTS_ENDPOINTS.LIST;

      const response = await api.get(url);
      
      // Handle different response formats from backend
      // API might return: { events: [...] }, { data: [...] }, or [...] directly
      const data = response.data;
      if (Array.isArray(data)) {
        return data;
      }
      if (data?.events && Array.isArray(data.events)) {
        return data.events;
      }
      if (data?.data && Array.isArray(data.data)) {
        return data.data;
      }
      
      if (__DEV__) console.warn('Unexpected events response format:', typeof data);
      return [];
    } catch (error: any) {
      if (__DEV__) console.error('GetEvents Error:', error?.message || error?.error);
      throw error;
    }
  }

  async getEventById(id: string): Promise<Event> {
    try {
      const response = await api.get<Event>(EVENTS_ENDPOINTS.DETAIL(id));
      return response.data;
    } catch (error: any) {
      if (__DEV__) console.error('GetEventById Error:', error?.message || error?.error);
      throw error;
    }
  }
}

export default new EventsService();
