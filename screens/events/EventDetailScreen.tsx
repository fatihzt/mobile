/**
 * Event Detail Screen
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRoute, useNavigation } from '@react-navigation/native';
import EventsService from '../../services/events';
import { useAuth } from '../../context/AuthContext';

const EventDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const { eventId } = route.params as { eventId: string };

  // Event detayını çek
  const { data: event, isLoading } = useQuery({
    queryKey: ['event', eventId],
    queryFn: () => EventsService.getEventById(eventId),
  });

  // RSVP mutation
  const rsvpMutation = useMutation({
    mutationFn: () => EventsService.rsvpToEvent(eventId),
    onSuccess: () => {
      Alert.alert('Başarılı', 'Etkinliğe kaydoldunuz!');
      queryClient.invalidateQueries({ queryKey: ['event', eventId] });
    },
    onError: (error: any) => {
      Alert.alert('Hata', error.message || 'RSVP yapılamadı');
    },
  });

  const handleRSVP = () => {
    if (!isAuthenticated) {
      Alert.alert('Giriş Gerekli', 'RSVP yapmak için giriş yapmalısınız');
      return;
    }

    Alert.alert(
      'RSVP Onayı',
      'Bu etkinliğe katılmak istediğinizden emin misiniz?',
      [
        { text: 'İptal', style: 'cancel' },
        { text: 'Evet', onPress: () => rsvpMutation.mutate() },
      ]
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Etkinlik bulunamadı</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {event.image_url && (
        <Image source={{ uri: event.image_url }} style={styles.image} />
      )}

      <View style={styles.content}>
        <Text style={styles.title}>{event.title}</Text>

        {event.description && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Açıklama</Text>
            <Text style={styles.description}>{event.description}</Text>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Detaylar</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📍 Konum:</Text>
            <Text style={styles.detailValue}>{event.location || event.city}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>🏙️ Şehir:</Text>
            <Text style={styles.detailValue}>{event.city}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📂 Kategori:</Text>
            <Text style={styles.detailValue}>{event.category}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>📅 Başlangıç:</Text>
            <Text style={styles.detailValue}>
              {new Date(event.start_time).toLocaleString('tr-TR')}
            </Text>
          </View>
          {event.end_time && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>📅 Bitiş:</Text>
              <Text style={styles.detailValue}>
                {new Date(event.end_time).toLocaleString('tr-TR')}
              </Text>
            </View>
          )}
          {event.source && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>🔗 Kaynak:</Text>
              <Text style={styles.detailValue}>{event.source}</Text>
            </View>
          )}
        </View>

        <TouchableOpacity
          style={[styles.rsvpButton, !isAuthenticated && styles.rsvpButtonDisabled]}
          onPress={handleRSVP}
          disabled={!isAuthenticated || rsvpMutation.isPending}
        >
          {rsvpMutation.isPending ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.rsvpButtonText}>
              {isAuthenticated ? 'Etkinliğe Katıl' : 'Giriş Yaparak Katıl'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#ddd',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#333',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#666',
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    width: 100,
  },
  detailValue: {
    fontSize: 16,
    color: '#666',
    flex: 1,
  },
  rsvpButton: {
    backgroundColor: '#6200ee',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  rsvpButtonDisabled: {
    backgroundColor: '#999',
  },
  rsvpButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: '#999',
  },
});

export default EventDetailScreen;

