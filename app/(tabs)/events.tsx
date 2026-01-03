/**
 * Events List Screen - Expo Router
 */

import { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, RefreshControl, TextInput, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useEvents } from '../../features/events';
import { Event } from '../../shared/types';

export default function EventsScreen() {
  const router = useRouter();
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string | undefined>();

  const {
    events,
    isLoading,
    isRefreshing,
    refetch,
  } = useEvents({
    city: selectedCity,
    search: searchQuery || undefined,
  });

  const handleEventPress = (event: Event) => {
    router.push(`/event/${event.id}` as any);
  };

  const renderEventItem = ({ item }: { item: Event }) => (
    <TouchableOpacity
      className="bg-white rounded-xl mb-4 overflow-hidden shadow-sm"
      onPress={() => handleEventPress(item)}
      activeOpacity={0.7}
    >
      {item.image_url && (
        <Image source={{ uri: item.image_url }} className="w-full h-48 bg-gray-200" />
      )}
      <View className="p-4">
        <Text className="text-lg font-bold mb-2 text-gray-900">{item.title}</Text>
        {item.description && (
          <Text className="text-sm text-gray-600 mb-3" numberOfLines={2}>
            {item.description}
          </Text>
        )}
        <View className="flex-row justify-between mb-2">
          <Text className="text-sm text-gray-600">📍 {item.location || item.city}</Text>
          <Text className="text-xs text-primary bg-purple-100 px-2 py-1 rounded">
            {item.category}
          </Text>
        </View>
        <Text className="text-sm text-gray-600">
          📅 {new Date(item.start_time).toLocaleDateString('tr-TR')}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && events.length === 0) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#6200ee" />
        <Text className="mt-4 text-gray-600">{t('events.loading')}</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <View className="p-4 bg-white">
        <TextInput
          className="border border-gray-300 rounded-lg p-3 text-base bg-gray-50"
          placeholder={t('events.searchPlaceholder')}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View className="flex-row px-4 py-2 bg-white border-b border-gray-200">
        <TouchableOpacity
          className={`px-4 py-2 rounded-full mr-2 ${!selectedCity ? 'bg-primary' : 'bg-gray-100'}`}
          onPress={() => setSelectedCity(undefined)}
        >
          <Text className={`text-sm ${!selectedCity ? 'text-white' : 'text-gray-900'}`}>
            {t('events.all')}
          </Text>
        </TouchableOpacity>
        {['Istanbul', 'Ankara', 'Izmir'].map((city) => (
          <TouchableOpacity
            key={city}
            className={`px-4 py-2 rounded-full mr-2 ${selectedCity === city ? 'bg-primary' : 'bg-gray-100'}`}
            onPress={() => setSelectedCity(city)}
          >
            <Text className={`text-sm ${selectedCity === city ? 'text-white' : 'text-gray-900'}`}>
              {city}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        contentContainerClassName="p-4"
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => refetch()} />
        }
        ListEmptyComponent={
          <View className="py-8 items-center">
            <Text className="text-base text-gray-500">{t('events.noEvents')}</Text>
          </View>
        }
      />
    </View>
  );
}

