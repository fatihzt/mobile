/**
 * Events Service - Event API çağrıları
 */

import api from './api';
import { Event, EventFilters } from '../types';
import { ENDPOINTS } from '../constants/config';

// ENDPOINTS'i burada da tanımlayalım eğer config'den gelmiyorsa
const EVENTS_ENDPOINTS = {
  LIST: '/events',
  DETAIL: (id: string) => `/events/${id}`,
  RSVP: (id: string) => `/events/${id}/rsvp`,
  SYNC: '/events/sync',
};

class EventsService {
  /**
   * Event listesini getir
   */
  async getEvents(filters?: EventFilters): Promise<Event[]> {
    const params = new URLSearchParams();
    
    if (filters?.city) params.append('city', filters.city);
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('search', filters.search);

            const queryString = params.toString();
            const url = queryString ? `${EVENTS_ENDPOINTS.LIST}?${queryString}` : EVENTS_ENDPOINTS.LIST;

    const response = await api.get<Event[]>(url);
    return response.data;
  }

  /**
   * Tek bir event detayını getir
   */
    async getEventById(id: string): Promise<Event> {
        const response = await api.get<Event>(EVENTS_ENDPOINTS.DETAIL(id));
        return response.data;
    }

    /**
     * Event'e RSVP yap
     */
    async rsvpToEvent(eventId: string): Promise<{ message: string }> {
        const response = await api.post<{ message: string }>(EVENTS_ENDPOINTS.RSVP(eventId));
        return response.data;
    }

    /**
     * Manuel sync tetikle (admin için)
     */
    async triggerSync(): Promise<{ message: string; status: string }> {
        const response = await api.post<{ message: string; status: string }>(EVENTS_ENDPOINTS.SYNC);
        return response.data;
    }
}

export default new EventsService();

