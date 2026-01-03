/**
 * Events Feature Types
 */

import { Event } from '../../shared/types';

export interface EventFilters {
  city?: string;
  category?: string;
  search?: string;
}

export interface EventsState {
  events: Event[];
  selectedEvent: Event | null;
  filters: EventFilters;
}

