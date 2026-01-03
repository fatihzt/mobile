/**
 * Events Service - Event API calls
 */

import api from '../../../shared/services/api';
import { Event } from '../../../shared/types';
import { EventFilters } from '../types';

const EVENTS_ENDPOINTS = {
  LIST: '/events',
  DETAIL: (id: string) => `/events/${id}`,
  RSVP: (id: string) => `/events/${id}/rsvp`,
  SYNC: '/events/sync',
};

class EventsService {
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

  async getEventById(id: string): Promise<Event> {
    const response = await api.get<Event>(EVENTS_ENDPOINTS.DETAIL(id));
    return response.data;
  }

  async rsvpToEvent(eventId: string): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(EVENTS_ENDPOINTS.RSVP(eventId));
    return response.data;
  }

  async triggerSync(): Promise<{ message: string; status: string }> {
    const response = await api.post<{ message: string; status: string }>(EVENTS_ENDPOINTS.SYNC);
    return response.data;
  }
}

export default new EventsService();

