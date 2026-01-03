/**
 * Events Feature - Jotai Atoms
 */

import { atom } from 'jotai';
import { Event } from '../../../shared/types';
import { EventFilters } from '../types';

// Base atoms
export const eventsAtom = atom<Event[]>([]);
export const selectedEventAtom = atom<Event | null>(null);
export const filtersAtom = atom<EventFilters>({});

// Derived atoms
export const filteredEventsAtom = atom((get) => {
  const events = get(eventsAtom);
  const filters = get(filtersAtom);

  return events.filter((event) => {
    if (filters.city && event.city !== filters.city) return false;
    if (filters.category && event.category !== filters.category) return false;
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      if (
        !event.title.toLowerCase().includes(searchLower) &&
        !event.description?.toLowerCase().includes(searchLower)
      ) {
        return false;
      }
    }
    return true;
  });
});

