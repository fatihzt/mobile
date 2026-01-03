/**
 * Event Detail Screen - Expo Router
 */

import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useEvent } from '../../features/events';
import { useAuth } from '../../features/auth';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();

  const { event, isLoading } = useEvent(id!);

  if (!id) {
    return null;
  }

  const rsvpMutation = useMutation({
    mutationFn: () => eventsService.rsvpToEvent(id!),
    onSuccess: () => {
      Alert.alert(t('common.success'), t('events.rsvpSuccess'));
      queryClient.invalidateQueries({ queryKey: ['event', id] });
    },
    onError: (error: any) => {
      Alert.alert(t('common.error'), error.message || t('events.rsvpError'));
    },
  });

  const handleRSVP = () => {
    if (!isAuthenticated) {
      Alert.alert(t('events.loginRequired'), t('events.loginRequiredMessage'));
      return;
    }

    Alert.alert(t('common.confirm'), t('events.rsvpConfirm'), [
      { text: t('common.cancel'), style: 'cancel' },
      { text: t('common.confirm'), onPress: () => rsvpMutation.mutate() },
    ]);
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!event) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-base text-gray-500">{t('events.noEvents')}</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white">
      {event.image_url && (
        <Image source={{ uri: event.image_url }} className="w-full h-72 bg-gray-200" />
      )}

      <View className="p-4">
        <Text className="text-2xl font-bold mb-4 text-gray-900">{event.title}</Text>

        {event.description && (
          <View className="mb-6">
            <Text className="text-lg font-semibold mb-3 text-gray-900">{t('events.details')}</Text>
            <Text className="text-base leading-6 text-gray-600">{event.description}</Text>
          </View>
        )}

        <View className="mb-6">
          <Text className="text-lg font-semibold mb-3 text-gray-900">{t('events.details')}</Text>
          <View className="mb-2">
            <Text className="text-base font-semibold text-gray-900">{t('events.location')}: </Text>
            <Text className="text-base text-gray-600">{event.location || event.city}</Text>
          </View>
          <View className="mb-2">
            <Text className="text-base font-semibold text-gray-900">{t('events.city')}: </Text>
            <Text className="text-base text-gray-600">{event.city}</Text>
          </View>
          <View className="mb-2">
            <Text className="text-base font-semibold text-gray-900">{t('events.category')}: </Text>
            <Text className="text-base text-gray-600">{event.category}</Text>
          </View>
          <View className="mb-2">
            <Text className="text-base font-semibold text-gray-900">{t('events.startDate')}: </Text>
            <Text className="text-base text-gray-600">
              {new Date(event.start_time).toLocaleString('tr-TR')}
            </Text>
          </View>
          {event.end_time && (
            <View className="mb-2">
              <Text className="text-base font-semibold text-gray-900">{t('events.endDate')}: </Text>
              <Text className="text-base text-gray-600">
                {new Date(event.end_time).toLocaleString('tr-TR')}
              </Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          className={`rounded-lg p-4 items-center mt-4 ${!isAuthenticated ? 'bg-gray-400' : 'bg-primary'}`}
          onPress={handleRSVP}
          disabled={!isAuthenticated || rsvpMutation.isPending}
        >
          {rsvpMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-white text-base font-semibold">
              {isAuthenticated ? t('events.rsvp') : t('events.loginRequiredMessage')}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

