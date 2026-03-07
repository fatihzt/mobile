import { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Share,
  Linking,
  Platform,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEventDetail } from '../../features/events';
import { useFavorites } from '../../features/favorites';

/* ────────────────────────────────────────── */
/* COLORS                                      */
/* ────────────────────────────────────────── */
const colors = {
  background: '#171612',
  surface: '#201d18',
  gold: '#d4af35',
  champagne: '#f2f0e9',
  platinum: '#b6b1a0',
  white: '#ffffff',
  black: '#000000',
  borderGold: 'rgba(212, 175, 53, 0.3)',
  borderSubtle: 'rgba(255, 255, 255, 0.05)',
};

/* ────────────────────────────────────────── */
/* COMPONENTS                                  */
/* ────────────────────────────────────────── */

const DecoDivider = () => (
  <View style={styles.divider}>
    <View style={styles.dividerLine} />
    <View style={styles.dividerDiamond} />
    <View style={styles.dividerLine} />
  </View>
);

const InfoRow = ({ iconName, label, value }: { iconName: keyof typeof Ionicons.glyphMap; label: string; value: string }) => (
  <View style={styles.infoRow}>
    <View style={styles.infoIcon}>
      <Ionicons name={iconName} size={20} color={colors.gold} />
    </View>
    <View style={styles.infoContent}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

/* ────────────────────────────────────────── */
/* SCREEN                                     */
/* ────────────────────────────────────────── */

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const { event, isLoading, refetch } = useEventDetail(id as string);
  const { isFavorite, toggleFavorite } = useFavorites();
  const eventIsFavorite = isFavorite(id as string);

  useEffect(() => {
    if (id) {
      refetch();
    }
  }, [id]);

  const handleShare = async () => {
    if (!event) return;
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      await Share.share({
        message: `${event.title} - ${event.location || ''}\n${event.start_time ? new Date(event.start_time).toLocaleDateString() : ''}`,
        title: event.title,
      });
    } catch (error) {
      if (__DEV__) console.error('Share failed:', error);
    }
  };

  const handleOpenMap = () => {
    if (!event || !event.lat || !event.lng) return;
    const url = Platform.select({
      ios: `maps:?q=${event.title}&ll=${event.lat},${event.lng}`,
      android: `geo:${event.lat},${event.lng}?q=${event.lat},${event.lng}(${event.title})`,
    });
    if (url) Linking.openURL(url);
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingIcon}>◆</Text>
        <ActivityIndicator size="small" color={colors.gold} />
        <Text style={styles.loadingText} accessibilityLabel="Loading event">
          {t('common.loading') || 'Loading...'}
        </Text>
      </View>
    );
  }

  if (!event) {
    return (
      <View style={styles.notFoundContainer}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.notFoundBackButton}
          accessibilityLabel="Go back"
          accessibilityRole="button"
        >
          <View style={styles.backButtonInner}>
            <Ionicons name="chevron-back" size={24} color={colors.gold} />
          </View>
        </TouchableOpacity>
        <Ionicons name="alert-circle-outline" size={48} color="rgba(212, 175, 53, 0.4)" style={styles.notFoundIcon} />
        <Text style={styles.notFoundText}>{t('events.notFound') || 'Event not found'}</Text>
      </View>
    );
  }

  const locale = i18n.language === 'tr' ? 'tr-TR' : 'en-US';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString(locale, {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image Section */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: event.image_url }} style={styles.heroImage} resizeMode="cover" />

          {/* Top Navigation */}
          <View style={styles.topNav}>
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.navButton}
              accessibilityLabel={t('common.close') || 'Close'}
              accessibilityRole="button"
            >
              <Ionicons name="chevron-back" size={24} color={colors.white} />
            </TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <TouchableOpacity
                style={styles.navButton}
                onPress={() => {
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  toggleFavorite(id as string);
                }}
                accessibilityLabel={eventIsFavorite ? 'Remove from favorites' : 'Add to favorites'}
                accessibilityRole="button"
              >
                <Ionicons
                  name={eventIsFavorite ? 'heart' : 'heart-outline'}
                  size={22}
                  color={eventIsFavorite ? '#d15e5e' : colors.white}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.navButton}
                onPress={handleShare}
                accessibilityLabel="Share event"
                accessibilityRole="button"
              >
                <Ionicons name="share-outline" size={22} color={colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Title Overlay */}
          <View style={styles.heroOverlay}>
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryText}>{event.category}</Text>
            </View>
            <Text style={styles.eventTitle}>{event.title}</Text>
          </View>

          {/* Decorative Border */}
          <View style={styles.decorativeBorder} />
        </View>

        {/* Content Section */}
        <View style={styles.content}>
          <View style={styles.infoSection}>
            <InfoRow iconName="calendar-outline" label={t('events.date') || 'Date'} value={formatDate(event.start_time)} />
          </View>

          <View style={styles.infoSection}>
            <InfoRow
              iconName="time-outline"
              label={t('events.time') || 'Time'}
              value={event.end_time ? `${formatTime(event.start_time)} - ${formatTime(event.end_time)}` : formatTime(event.start_time)}
            />
          </View>

          <InfoRow iconName="location-outline" label={t('events.location') || 'Location'} value={event.location || event.city} />

          <DecoDivider />

          {/* About Section */}
          {event.description && (
            <View style={styles.aboutSection}>
              <Text style={styles.sectionTitle}>{t('events.aboutTheEvening') || 'About the Evening'}</Text>
              <Text style={styles.descriptionText}>{event.description}</Text>
            </View>
          )}

          {/* Map Section - Only show if coordinates exist */}
          {event.lat && event.lng && (
            <TouchableOpacity
              style={styles.mapPlaceholder}
              onPress={handleOpenMap}
              accessibilityLabel="Open map"
              accessibilityRole="button"
            >
              <Ionicons name="map-outline" size={32} color="rgba(212, 175, 53, 0.4)" />
              <Text style={styles.mapText}>{t('events.viewMap') || 'Tap to view map'}</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
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
  loadingText: { color: colors.platinum, fontSize: 12, textTransform: 'uppercase', letterSpacing: 3, marginTop: 16 },

  notFoundContainer: { flex: 1, backgroundColor: colors.background, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  notFoundBackButton: { position: 'absolute', top: 48, left: 16 },
  backButtonInner: { width: 44, height: 44, backgroundColor: colors.surface, borderRadius: 10, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.borderGold },
  notFoundIcon: { marginBottom: 16 },
  notFoundText: { color: colors.champagne, fontSize: 18, textAlign: 'center' },

  heroContainer: { position: 'relative', height: 384 },
  heroImage: { width: '100%', height: '100%' },

  topNav: { position: 'absolute', top: 48, left: 0, right: 0, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16 },
  navButton: { width: 44, height: 44, backgroundColor: 'rgba(23, 22, 18, 0.3)', borderRadius: 22, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },

  heroOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, paddingHorizontal: 16, paddingBottom: 16 },
  categoryBadge: { backgroundColor: 'rgba(212, 175, 53, 0.1)', borderWidth: 1, borderColor: colors.borderGold, borderRadius: 16, paddingHorizontal: 12, paddingVertical: 4, alignSelf: 'flex-start', marginBottom: 8 },
  categoryText: { color: colors.gold, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 2 },
  eventTitle: { color: colors.gold, fontSize: 28, fontWeight: '700', lineHeight: 34 },

  decorativeBorder: { position: 'absolute', bottom: 0, left: 16, right: 16, height: 64, borderLeftWidth: 1, borderRightWidth: 1, borderTopWidth: 1, borderColor: colors.borderGold, borderTopLeftRadius: 12, borderTopRightRadius: 12 },

  content: { paddingHorizontal: 16, paddingVertical: 24 },
  infoSection: { marginBottom: 12 },

  infoRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 16, backgroundColor: 'rgba(32, 29, 24, 0.5)', borderRadius: 12, borderWidth: 1, borderColor: colors.borderSubtle, marginBottom: 12 },
  infoIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(212, 175, 53, 0.2)', alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  infoContent: { flex: 1 },
  infoLabel: { color: 'rgba(182, 177, 160, 0.7)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 2, marginBottom: 4 },
  infoValue: { color: colors.champagne, fontSize: 16, fontWeight: '500' },

  divider: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 32, opacity: 0.6 },
  dividerLine: { height: 1, flex: 1, backgroundColor: colors.gold },
  dividerDiamond: { width: 12, height: 12, transform: [{ rotate: '45deg' }], borderWidth: 1, borderColor: colors.gold, backgroundColor: colors.background, marginHorizontal: 8 },

  aboutSection: { marginBottom: 24 },
  sectionTitle: { color: colors.champagne, fontSize: 20, fontWeight: '700', marginBottom: 16 },
  descriptionText: { color: colors.platinum, fontSize: 16, lineHeight: 26 },

  mapPlaceholder: { width: '100%', height: 128, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)', marginBottom: 32, opacity: 0.8, backgroundColor: colors.surface, alignItems: 'center', justifyContent: 'center', minHeight: 128 },
  mapText: { color: 'rgba(182, 177, 160, 0.4)', fontSize: 12, marginTop: 8 },
});
