import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  RefreshControl,
  Modal,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEvents } from '../../features/events';
import { useFavorites } from '../../features/favorites';

/* ────────────────────────────────────────── */
/* COLORS                                      */
/* ────────────────────────────────────────── */
const colors = {
  background: '#171612',
  surface: '#201d18',
  card: '#25231d',
  gold: '#d4af35',
  goldLight: '#ead07a',
  champagne: '#f2f0e9',
  platinum: '#b6b1a0',
  muted: '#9e9888',
  white: '#ffffff',
  black: '#000000',
  borderGold: 'rgba(212, 175, 53, 0.3)',
  borderSubtle: 'rgba(212, 175, 53, 0.1)',
};

type DateFilter = 'all' | 'upcoming' | 'thisWeek' | 'thisMonth' | 'past';

interface FilterState {
  cities: string[];
  categories: string[];
  dateFilter: DateFilter;
}

const isToday = (dateString: string | null): boolean => {
  if (!dateString) return false;
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

/* ────────────────────────────────────────── */
/* COMPONENTS                                  */
/* ────────────────────────────────────────── */

const FeaturedEventCard = ({ item, onPress }: { item: any; onPress: () => void }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'tr' ? 'tr-TR' : 'en-US';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={styles.featuredCard}
      accessibilityLabel={`Featured event: ${item.title}`}
      accessibilityRole="button"
    >
      <View style={styles.featuredImageContainer}>
        <Image source={{ uri: item.image_url }} style={styles.featuredImage} resizeMode="cover" />
        <View style={styles.featuredBadge}>
          <Text style={styles.featuredBadgeText}>{t('events.featured') || 'Featured'}</Text>
        </View>
      </View>
      <View style={styles.featuredContent}>
        <Text style={styles.featuredTitle}>{item.title}</Text>
        <Text style={styles.featuredLocation}>
          {item.location || item.city} • {item.category}
        </Text>
        <View style={styles.featuredMeta}>
          <View style={styles.featuredDate}>
            <Ionicons name="calendar-outline" size={16} color="rgba(212, 175, 53, 0.7)" style={styles.dateIcon} />
            <Text style={styles.dateText}>
              {item.start_time
                ? new Date(item.start_time).toLocaleDateString(locale, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </Text>
          </View>
          <TouchableOpacity
            onPress={onPress}
            style={styles.viewButton}
            accessibilityLabel={t('events.viewDetails') || 'View Details'}
          >
            <Text style={styles.viewButtonText}>{t('events.viewDetails') || 'View →'}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const EventCard = ({ item, onPress, isPast, isFavorite, onToggleFavorite }: { item: any; onPress: () => void; isPast: boolean; isFavorite: boolean; onToggleFavorite: () => void }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'tr' ? 'tr-TR' : 'en-US';

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={[styles.eventCard, isPast && styles.eventCardPast]}
      accessibilityLabel={`${item.title}, ${item.location || item.city}`}
      accessibilityRole="button"
    >
      <View style={styles.eventRow}>
        <View style={styles.eventImageContainer}>
          <Image source={{ uri: item.image_url }} style={styles.eventImage} resizeMode="cover" />
          {!isPast && isToday(item.start_time) && (
            <View style={styles.tonightBadge}>
              <Text style={styles.tonightText}>{t('events.tonight') || 'Tonight'}</Text>
            </View>
          )}
        </View>
        <View style={styles.eventContent}>
          <View style={styles.eventHeader}>
            <Text style={styles.eventTitle} numberOfLines={2}>{item.title}</Text>
            <TouchableOpacity
              onPress={(e) => {
                e.stopPropagation?.();
                onToggleFavorite();
              }}
              style={styles.favoriteButton}
              accessibilityLabel={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              accessibilityRole="button"
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            >
              <Ionicons
                name={isFavorite ? 'heart' : 'heart-outline'}
                size={22}
                color={isFavorite ? '#d15e5e' : colors.muted}
              />
            </TouchableOpacity>
          </View>
          <Text style={styles.eventLocation} numberOfLines={1}>{item.location || item.city}</Text>
          <View style={styles.eventMeta}>
            <Text style={styles.eventDate}>
              {item.start_time
                ? new Date(item.start_time).toLocaleDateString(locale, {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : ''}
            </Text>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{item.category}</Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const FilterChip = ({ label, isActive, onPress }: { label: string; isActive: boolean; onPress: () => void }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.8}
    style={styles.filterChipContainer}
    accessibilityLabel={`Filter by ${label}`}
    accessibilityRole="button"
    accessibilityState={{ selected: isActive }}
  >
    <View style={[styles.filterChip, isActive && styles.filterChipActive]}>
      <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>{label}</Text>
    </View>
  </TouchableOpacity>
);

const FilterOption = ({ label, isSelected, onToggle }: { label: string; isSelected: boolean; onToggle: () => void }) => (
  <TouchableOpacity onPress={onToggle} activeOpacity={0.7} style={styles.filterOption}>
    <View style={[styles.checkbox, isSelected && styles.checkboxSelected]}>
      {isSelected && <Text style={styles.checkmark}>✓</Text>}
    </View>
    <Text style={[styles.filterOptionText, isSelected && styles.filterOptionTextSelected]}>{label}</Text>
  </TouchableOpacity>
);

/* ────────────────────────────────────────── */
/* SCREEN                                     */
/* ────────────────────────────────────────── */

export default function EventsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { events, isLoading, refetch, cities, categories } = useEvents();
  const { isFavorite, toggleFavorite } = useFavorites();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCityModal, setShowCityModal] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const [filters, setFilters] = useState<FilterState>({
    cities: [],
    categories: [],
    dateFilter: 'all',
  });

  const [tempFilters, setTempFilters] = useState<FilterState>(filters);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    count += filters.cities.length;
    count += filters.categories.length;
    if (filters.dateFilter !== 'all') count += 1;
    return count;
  }, [filters]);

  const displayLocation = useMemo(() => {
    // Eğer tek bir şehir seçiliyse onu göster
    if (filters.cities.length === 1) {
      return filters.cities[0];
    }
    // Eğer birden fazla şehir seçiliyse
    if (filters.cities.length > 1) {
      return t('events.multipleCities') || 'Multiple Cities';
    }
    // Eğer hiç şehir seçili değilse, events'lerden en çok event olan şehri göster
    if (Array.isArray(events) && events.length > 0) {
      const cityCounts: { [key: string]: number } = {};
      events.forEach((event: any) => {
        if (event.city) {
          cityCounts[event.city] = (cityCounts[event.city] || 0) + 1;
        }
      });
      const mostCommonCity = Object.entries(cityCounts).sort((a, b) => b[1] - a[1])[0]?.[0];
      return mostCommonCity || t('events.allLocations') || 'All Locations';
    }
    // Eğer hiç event yoksa
    return t('events.allLocations') || 'All Locations';
  }, [filters.cities, events, t]);

  const processedEvents = useMemo(() => {
    if (!Array.isArray(events)) return [];
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const endOfWeek = new Date(startOfToday);
    endOfWeek.setDate(endOfWeek.getDate() + 7);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    let filtered = events.filter((event: any) => {
      const matchesSearch =
        !debouncedSearch ||
        event.title?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        event.description?.toLowerCase().includes(debouncedSearch.toLowerCase());
      const matchesCity = filters.cities.length === 0 || filters.cities.includes(event.city);
      const matchesCategory = filters.categories.length === 0 || filters.categories.includes(event.category);
      const eventDate = event.start_time ? new Date(event.start_time) : null;
      let matchesDate = true;

      if (eventDate && filters.dateFilter !== 'all') {
        switch (filters.dateFilter) {
          case 'upcoming':
            matchesDate = eventDate >= startOfToday;
            break;
          case 'thisWeek':
            matchesDate = eventDate >= startOfToday && eventDate <= endOfWeek;
            break;
          case 'thisMonth':
            matchesDate = eventDate >= startOfToday && eventDate <= endOfMonth;
            break;
          case 'past':
            matchesDate = eventDate < startOfToday;
            break;
        }
      }
      return matchesSearch && matchesCity && matchesCategory && matchesDate;
    });

    filtered.sort((a: any, b: any) => {
      const dateA = a.start_time ? new Date(a.start_time) : new Date(0);
      const dateB = b.start_time ? new Date(b.start_time) : new Date(0);
      const isPastA = dateA < startOfToday;
      const isPastB = dateB < startOfToday;
      if (isPastA && !isPastB) return 1;
      if (!isPastA && isPastB) return -1;
      if (!isPastA && !isPastB) return dateA.getTime() - dateB.getTime();
      if (isPastA && isPastB) return dateB.getTime() - dateA.getTime();
      return 0;
    });

    return filtered;
  }, [events, debouncedSearch, filters]);

  const featuredEvent = useMemo(() => {
    return processedEvents.find((event: any) => {
      if (!event.start_time) return false;
      return new Date(event.start_time) >= new Date();
    });
  }, [processedEvents]);

  const remainingEvents = useMemo(() => {
    if (!featuredEvent) return processedEvents;
    return processedEvents.filter((e: any) => e.id !== featuredEvent.id);
  }, [processedEvents, featuredEvent]);

  const isEventPast = (event: any) => {
    if (!event.start_time) return false;
    const eventDate = new Date(event.start_time);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return eventDate < startOfToday;
  };

  const openFilterModal = () => {
    setTempFilters(filters);
    setShowFilterModal(true);
  };

  const openCityModal = () => {
    setShowCityModal(true);
  };

  const selectCity = (city: string) => {
    setFilters((prev) => ({
      ...prev,
      cities: prev.cities.includes(city) ? prev.cities.filter((c) => c !== city) : [city],
    }));
    setShowCityModal(false);
  };

  const clearCityFilter = () => {
    setFilters((prev) => ({
      ...prev,
      cities: [],
    }));
    setShowCityModal(false);
  };

  const applyFilters = () => {
    setFilters(tempFilters);
    setShowFilterModal(false);
  };

  const clearFilters = () => {
    setTempFilters({ cities: [], categories: [], dateFilter: 'all' });
  };

  const toggleCity = (city: string) => {
    setTempFilters((prev) => ({
      ...prev,
      cities: prev.cities.includes(city) ? prev.cities.filter((c) => c !== city) : [...prev.cities, city],
    }));
  };

  const toggleCategory = (category: string) => {
    setTempFilters((prev) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const setDateFilter = (dateFilter: DateFilter) => {
    setTempFilters((prev) => ({ ...prev, dateFilter }));
  };

  const handleViewAll = () => {
    setFilters({ cities: [], categories: [], dateFilter: 'all' });
    setSearchQuery('');
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  };

  const dateFilterOptions: { key: DateFilter; label: string }[] = [
    { key: 'all', label: t('events.allDates') || 'All Dates' },
    { key: 'upcoming', label: t('events.upcoming') || 'Upcoming' },
    { key: 'thisWeek', label: t('events.thisWeek') || 'This Week' },
    { key: 'thisMonth', label: t('events.thisMonth') || 'This Month' },
    { key: 'past', label: t('events.pastEvents') || 'Past Events' },
  ];

  if (isLoading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingIcon}>◆</Text>
        <ActivityIndicator size="small" color={colors.gold} />
        <Text style={styles.loadingText}>{t('events.loading') || 'Curating experiences...'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={[styles.customHeader, { paddingTop: insets.top }]}>
        {/* Top Bar - Location */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.locationButton}
            activeOpacity={0.7}
            onPress={openCityModal}
            accessibilityLabel={`Location: ${displayLocation}`}
            accessibilityRole="button"
          >
            <Ionicons name="location-outline" size={16} color={colors.gold} style={styles.locationIcon} />
            <Text style={styles.locationText} numberOfLines={1}>
              {displayLocation}
            </Text>
            <Ionicons name="chevron-down" size={12} color={colors.platinum} style={styles.locationArrow} />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={18} color="rgba(212, 175, 53, 0.6)" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder={t('events.findASoiree') || 'Find a soirée...'}
            placeholderTextColor={colors.muted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            accessibilityLabel="Search events"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              activeOpacity={0.7}
              style={styles.clearSearchButton}
              accessibilityLabel="Clear search"
            >
              <Ionicons name="close-circle" size={20} color={colors.platinum} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterScrollContent}>
          <FilterChip
            label={t('events.allEvents') || 'All Events'}
            isActive={activeFilterCount === 0}
            onPress={() => setFilters({ cities: [], categories: [], dateFilter: 'all' })}
          />
          {categories?.slice(0, 4).map((category: string) => (
            <FilterChip
              key={category}
              label={category}
              isActive={filters.categories.includes(category)}
              onPress={() => {
                setFilters((prev) => ({
                  ...prev,
                  categories: prev.categories.includes(category)
                    ? prev.categories.filter((c) => c !== category)
                    : [...prev.categories, category],
                }));
              }}
            />
          ))}
          <TouchableOpacity
            onPress={openFilterModal}
            activeOpacity={0.8}
            accessibilityLabel={`Filters${activeFilterCount > 0 ? `, ${activeFilterCount} active` : ''}`}
            accessibilityRole="button"
          >
            <View style={styles.moreFiltersButton}>
              <Ionicons name="options-outline" size={16} color={colors.champagne} style={styles.moreFiltersIcon} />
              <Text style={styles.moreFiltersText}>{t('events.filters') || 'Filters'}</Text>
              {activeFilterCount > 0 && (
                <View style={styles.filterBadge}>
                  <Text style={styles.filterBadgeText}>{activeFilterCount}</Text>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Events List */}
      <FlatList
        ref={flatListRef}
        data={remainingEvents}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold} />}
        ListHeaderComponent={
          <>
            {featuredEvent && !searchQuery && activeFilterCount === 0 && (
              <View style={styles.premierSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{t('events.premierSelection') || 'Premier Selection'}</Text>
                  <TouchableOpacity onPress={handleViewAll} accessibilityLabel="View all events">
                    <Text style={styles.viewAllText}>{t('events.viewAll') || 'View All'}</Text>
                  </TouchableOpacity>
                </View>
                <FeaturedEventCard item={featuredEvent} onPress={() => router.push(`/event/${featuredEvent.id}`)} />
              </View>
            )}
            <View style={styles.upcomingHeader}>
              <Text style={styles.sectionTitle}>
                {filters.dateFilter === 'past' ? t('events.pastEvents') || 'Past Events' : t('events.upcomingSoirees') || 'Upcoming Soirées'}
              </Text>
              <Text style={styles.eventCount}>
                {remainingEvents?.length || 0} {t('events.eventsFound') || 'events found'}
              </Text>
            </View>
          </>
        }
        renderItem={({ item }) => (
          <EventCard
            item={item}
            isPast={isEventPast(item)}
            onPress={() => router.push(`/event/${item.id}`)}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              toggleFavorite(item.id);
            }}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyIcon}>◇</Text>
            <Text style={styles.emptyText}>{t('events.noEvents') || 'No events found'}</Text>
            <Text style={styles.emptySubtext}>{t('events.tryAdjusting') || 'Try adjusting your filters'}</Text>
            {activeFilterCount > 0 && (
              <TouchableOpacity onPress={() => setFilters({ cities: [], categories: [], dateFilter: 'all' })} style={styles.clearFiltersButton}>
                <Text style={styles.clearFiltersText}>{t('events.clearFilters') || 'Clear Filters'}</Text>
              </TouchableOpacity>
            )}
          </View>
        }
        ListFooterComponent={<View style={{ height: 80 }} />}
      />

      {/* Filter Modal */}
      <Modal visible={showFilterModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowFilterModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowFilterModal(false)}>
              <Text style={styles.modalCancel}>{t('common.cancel') || 'Cancel'}</Text>
            </TouchableOpacity>
            <View style={styles.modalTitleContainer}>
              <Ionicons name="options" size={20} color={colors.gold} style={styles.modalIcon} />
              <Text style={styles.modalTitle}>{t('events.filters') || 'Filters'}</Text>
            </View>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.modalClear}>{t('events.clearAll') || 'Clear All'}</Text>
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.modalContent}>
            <View style={styles.filterSection}>
              <Text style={styles.filterSectionTitle}>{t('events.dateFilter') || 'Date'}</Text>
              {dateFilterOptions.map((option) => (
                <TouchableOpacity key={option.key} onPress={() => setDateFilter(option.key)} activeOpacity={0.7} style={styles.radioOption}>
                  <View style={[styles.radio, tempFilters.dateFilter === option.key && styles.radioSelected]}>
                    {tempFilters.dateFilter === option.key && <View style={styles.radioInner} />}
                  </View>
                  <Text style={[styles.radioLabel, tempFilters.dateFilter === option.key && styles.radioLabelSelected]}>{option.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={[styles.filterSection, styles.filterSectionBorder]}>
              <Text style={styles.filterSectionTitle}>
                {t('events.category') || 'Category'} ({tempFilters.categories.length})
              </Text>
              {categories?.map((category: string) => (
                <FilterOption key={category} label={category} isSelected={tempFilters.categories.includes(category)} onToggle={() => toggleCategory(category)} />
              ))}
            </View>

            <View style={[styles.filterSection, styles.filterSectionBorder]}>
              <Text style={styles.filterSectionTitle}>
                {t('events.city') || 'City'} ({tempFilters.cities.length})
              </Text>
              {cities?.map((city: string) => (
                <FilterOption key={city} label={city} isSelected={tempFilters.cities.includes(city)} onToggle={() => toggleCity(city)} />
              ))}
            </View>
            <View style={{ height: 96 }} />
          </ScrollView>

          <View style={styles.modalFooter}>
            <TouchableOpacity onPress={applyFilters} activeOpacity={0.8} style={styles.applyButton}>
              <Text style={styles.applyButtonText}>{t('events.applyFilters') || 'Apply Filters'}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* City Selection Modal */}
      <Modal visible={showCityModal} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setShowCityModal(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowCityModal(false)}>
              <Text style={styles.modalCancel}>{t('common.cancel') || 'Cancel'}</Text>
            </TouchableOpacity>
            <View style={styles.modalTitleContainer}>
              <Ionicons name="location" size={20} color={colors.gold} style={styles.modalIcon} />
              <Text style={styles.modalTitle}>{t('events.selectCity') || 'Select City'}</Text>
            </View>
            {filters.cities.length > 0 && (
              <TouchableOpacity onPress={clearCityFilter}>
                <Text style={styles.modalClear}>{t('common.clear') || 'Clear'}</Text>
              </TouchableOpacity>
            )}
          </View>

          <ScrollView style={styles.modalContent}>
            <TouchableOpacity
              onPress={clearCityFilter}
              activeOpacity={0.7}
              style={[styles.cityOption, filters.cities.length === 0 && styles.cityOptionSelected]}
            >
              <View style={[styles.cityRadio, filters.cities.length === 0 && styles.cityRadioSelected]}>
                {filters.cities.length === 0 && <View style={styles.cityRadioInner} />}
              </View>
              <Text style={[styles.cityLabel, filters.cities.length === 0 && styles.cityLabelSelected]}>
                {t('events.allLocations') || 'All Locations'}
              </Text>
            </TouchableOpacity>

            {cities?.map((city: string) => (
              <TouchableOpacity
                key={city}
                onPress={() => selectCity(city)}
                activeOpacity={0.7}
                style={[styles.cityOption, filters.cities.includes(city) && styles.cityOptionSelected]}
              >
                <View style={[styles.cityRadio, filters.cities.includes(city) && styles.cityRadioSelected]}>
                  {filters.cities.includes(city) && <View style={styles.cityRadioInner} />}
                </View>
                <Text style={[styles.cityLabel, filters.cities.includes(city) && styles.cityLabelSelected]}>
                  {city}
                </Text>
              </TouchableOpacity>
            ))}
            <View style={{ height: 40 }} />
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

/* ────────────────────────────────────────── */
/* STYLES                                     */
/* ────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  loadingContainer: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center' },
  loadingIcon: { color: colors.gold, fontSize: 40, marginBottom: 16 },
  loadingText: { color: colors.platinum, fontSize: 12, textTransform: 'uppercase', letterSpacing: 2, marginTop: 16 },

  customHeader: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.borderSubtle,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingTop: 8,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    minHeight: 44,
  },
  locationIcon: {
    marginRight: 6,
  },
  locationText: {
    color: colors.champagne,
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  locationArrow: {
    marginLeft: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderGold,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 12,
    minHeight: 48,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    color: colors.champagne,
    fontSize: 15,
  },
  clearSearchButton: {
    paddingLeft: 8,
    minWidth: 44,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterScroll: {
    marginTop: 0,
  },
  filterScrollContent: {
    paddingRight: 16,
  },

  filterChipContainer: { marginRight: 12 },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.borderGold,
    minHeight: 44,
    justifyContent: 'center',
  },
  filterChipActive: {
    backgroundColor: colors.gold,
    borderColor: colors.gold,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.champagne,
  },
  filterChipTextActive: {
    color: colors.background,
  },

  moreFiltersButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.borderGold,
    backgroundColor: colors.surface,
    minHeight: 44,
  },
  moreFiltersIcon: { marginRight: 6 },
  moreFiltersText: { color: colors.champagne, fontSize: 14 },
  filterBadge: { marginLeft: 8, width: 20, height: 20, backgroundColor: colors.gold, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  filterBadgeText: { color: colors.background, fontSize: 10, fontWeight: '700' },

  listContent: { padding: 16 },
  premierSection: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionTitle: { color: colors.gold, fontSize: 20, fontWeight: '700' },
  viewAllText: { color: colors.platinum, fontSize: 12 },
  upcomingHeader: { marginBottom: 16 },
  eventCount: { color: colors.platinum, fontSize: 14, marginTop: 4 },

  featuredCard: { backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderGold },
  featuredImageContainer: { position: 'relative', height: 192 },
  featuredImage: { width: '100%', height: '100%' },
  featuredBadge: { position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(212, 175, 53, 0.9)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  featuredBadgeText: { color: colors.background, fontSize: 11, fontWeight: '700' },
  featuredContent: { padding: 16, marginTop: -48 },
  featuredTitle: { color: colors.white, fontSize: 24, fontWeight: '700' },
  featuredLocation: { color: colors.gold, fontSize: 14, fontWeight: '500', marginTop: 4 },
  featuredMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 16, paddingTop: 16, borderTopWidth: 1, borderTopColor: colors.borderSubtle },
  featuredDate: { flexDirection: 'row', alignItems: 'center' },
  dateIcon: { marginRight: 4 },
  dateText: { color: colors.platinum, fontSize: 14 },
  viewButton: { paddingHorizontal: 16, paddingVertical: 8, minHeight: 44, justifyContent: 'center' },
  viewButtonText: { color: colors.gold, fontSize: 14, fontWeight: '700' },

  eventCard: { backgroundColor: colors.surface, borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.borderSubtle, marginBottom: 16 },
  eventCardPast: { opacity: 0.6 },
  eventRow: { flexDirection: 'row' },
  eventImageContainer: { position: 'relative', width: 160, height: 160 },
  eventImage: { width: '100%', height: '100%' },
  tonightBadge: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  tonightText: { color: colors.white, fontSize: 10, fontWeight: '700' },
  eventContent: { flex: 1, padding: 16, justifyContent: 'space-between' },
  eventHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  eventTitle: { color: colors.white, fontSize: 18, fontWeight: '700', flex: 1 },
  favoriteButton: { padding: 4, minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' },
  eventLocation: { color: colors.platinum, fontSize: 12, marginTop: 4 },
  eventMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, marginTop: 12, borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.05)' },
  eventDate: { color: colors.gold, fontSize: 12, fontWeight: '500' },
  categoryBadge: { backgroundColor: 'rgba(212, 175, 53, 0.2)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 4 },
  categoryText: { color: colors.gold, fontSize: 12, fontWeight: '500' },

  emptyContainer: { paddingVertical: 64, alignItems: 'center' },
  emptyIcon: { color: 'rgba(212, 175, 53, 0.4)', fontSize: 40, marginBottom: 16 },
  emptyText: { color: 'rgba(242, 240, 233, 0.6)', fontSize: 16, textAlign: 'center' },
  emptySubtext: { color: colors.platinum, fontSize: 14, textAlign: 'center', marginTop: 4 },
  clearFiltersButton: { marginTop: 16, paddingHorizontal: 24, paddingVertical: 10, borderWidth: 1, borderColor: 'rgba(212, 175, 53, 0.4)', borderRadius: 10 },
  clearFiltersText: { color: colors.gold, fontSize: 14 },

  modalContainer: { flex: 1, backgroundColor: colors.background },
  modalHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.borderGold },
  modalCancel: { color: colors.platinum, fontSize: 16 },
  modalTitleContainer: { flexDirection: 'row', alignItems: 'center' },
  modalIcon: { marginRight: 8 },
  modalTitle: { color: colors.champagne, fontSize: 18, fontWeight: '600' },
  modalClear: { color: colors.gold, fontSize: 16 },
  modalContent: { flex: 1, paddingHorizontal: 20 },
  modalFooter: { paddingHorizontal: 20, paddingVertical: 16, borderTopWidth: 1, borderTopColor: colors.borderGold },
  applyButton: { backgroundColor: colors.gold, paddingVertical: 16, borderRadius: 12, alignItems: 'center' },
  applyButtonText: { color: colors.background, fontSize: 16, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2 },

  filterSection: { paddingVertical: 16 },
  filterSectionBorder: { borderTopWidth: 1, borderTopColor: colors.borderSubtle },
  filterSectionTitle: { color: colors.gold, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2, marginBottom: 12 },
  radioOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(212, 175, 53, 0.4)', marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  radioSelected: { backgroundColor: colors.gold, borderColor: colors.gold },
  radioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.background },
  radioLabel: { fontSize: 16, color: colors.champagne },
  radioLabelSelected: { color: colors.gold },

  filterOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  checkbox: { width: 20, height: 20, borderRadius: 4, borderWidth: 2, borderColor: 'rgba(212, 175, 53, 0.4)', marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  checkboxSelected: { backgroundColor: colors.gold, borderColor: colors.gold },
  checkmark: { color: colors.background, fontSize: 12 },
  filterOptionText: { fontSize: 16, color: colors.champagne, flex: 1 },
  filterOptionTextSelected: { color: colors.gold },

  cityOption: { flexDirection: 'row', alignItems: 'center', paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: colors.borderSubtle },
  cityOptionSelected: { backgroundColor: 'rgba(212, 175, 53, 0.05)' },
  cityRadio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: 'rgba(212, 175, 53, 0.4)', marginRight: 12, alignItems: 'center', justifyContent: 'center' },
  cityRadioSelected: { backgroundColor: colors.gold, borderColor: colors.gold },
  cityRadioInner: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.background },
  cityLabel: { fontSize: 16, color: colors.champagne },
  cityLabelSelected: { color: colors.gold, fontWeight: '600' },
});
