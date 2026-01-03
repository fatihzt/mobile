/**
 * Events Hook - Events state management
 */

import React from 'react';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { eventsAtom, selectedEventAtom, filtersAtom, filteredEventsAtom } from '../store/eventsAtoms';
import eventsService from '../services/eventsService';
import { EventFilters } from '../types';

export const useEvents = (filters?: EventFilters) => {
  const [selectedEvent, setSelectedEvent] = useAtom(selectedEventAtom);
  const setFilters = useSetAtom(filtersAtom);
  const queryClient = useQueryClient();

  const {
    data: events = [],
    isLoading,
    isRefreshing,
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
  }, [JSON.stringify(filters), setFilters]);

  const rsvpMutation = useMutation({
    mutationFn: (eventId: string) => eventsService.rsvpToEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });

  return {
    events,
    selectedEvent,
    isLoading,
    isRefreshing,
    refetch,
    setSelectedEvent,
    rsvpToEvent: rsvpMutation.mutate,
    isRsvping: rsvpMutation.isPending,
  };
};

export const useEvent = (id: string) => {
  const {
    data: event,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['event', id],
    queryFn: () => eventsService.getEventById(id),
    enabled: !!id,
  });

  return { event, isLoading, error };
};
