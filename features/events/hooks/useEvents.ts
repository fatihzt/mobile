/**
 * Events Hook - Events state management
 */

import React from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { useQuery } from '@tanstack/react-query';
import { selectedEventAtom, filtersAtom } from '../store/eventsAtoms';
import eventsService from '../services/eventsService';
import { EventFilters } from '../types';

export const useEvents = (filters?: EventFilters) => {
  const [selectedEvent, setSelectedEvent] = useAtom(selectedEventAtom);
  const setFilters = useSetAtom(filtersAtom);

  const {
    data: events = [],
    isLoading,
    isFetching: isRefreshing,
    refetch,
  } = useQuery({
    queryKey: ['events', filters],
    queryFn: () => eventsService.getEvents(filters),
  });

  // Update filters atom when filters change
  React.useEffect(() => {
    if (filters) {
      setFilters(filters);
    }
  }, [filters?.city, filters?.category, filters?.search, setFilters]);

  // Extract unique cities from events
  const cities = React.useMemo(() => {
    if (!Array.isArray(events) || events.length === 0) return [];
    const uniqueCities = [...new Set(events.map((event: any) => event.city).filter(Boolean))];
    return uniqueCities.sort();
  }, [events]);

  // Extract unique categories from events
  const categories = React.useMemo(() => {
    if (!Array.isArray(events) || events.length === 0) return [];
    const uniqueCategories = [...new Set(events.map((event: any) => event.category).filter(Boolean))];
    return uniqueCategories.sort();
  }, [events]);

  return {
    events,
    cities,
    categories,
    selectedEvent,
    isLoading,
    isRefreshing,
    refetch,
    setSelectedEvent,
  };
};

export const useEvent = (id: string) => {
  const {
    data: event,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsService.getEventById(id),
    enabled: !!id,
  });

  return { event, isLoading, error, refetch };
};

export const useEventDetail = useEvent;
