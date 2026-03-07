import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../features/auth';
import { View, Text, Animated, StyleSheet, ActivityIndicator } from 'react-native';

/* ────────────────────────────────────────── */
/* COLORS                                      */
/* ────────────────────────────────────────── */
const colors = {
  background: '#171612',
  gold: '#d4af35',
  champagne: '#f2f0e9',
  muted: '#9e9888',
};

/* ────────────────────────────────────────── */
/* LOADING SCREEN                              */
/* ────────────────────────────────────────── */

const LoadingScreen = () => {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>
        <Text style={styles.logo} accessibilityLabel="HAPN Logo">◆</Text>
        <Text style={styles.appName}>HAPN</Text>
        <ActivityIndicator color={colors.gold} style={styles.loader} accessibilityLabel="Loading" />
      </Animated.View>
    </View>
  );
};

/* ────────────────────────────────────────── */
/* MAIN COMPONENT                              */
/* ────────────────────────────────────────── */

export default function Index() {
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Redirect href="/(auth)/login" />;
  }

  return <Redirect href="/(tabs)/events" />;
}

/* ────────────────────────────────────────── */
/* STYLES                                     */
/* ────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
  },
  logo: {
    color: colors.gold,
    fontSize: 48,
    marginBottom: 16,
  },
  appName: {
    color: colors.champagne,
    fontSize: 32,
    fontWeight: '300',
    letterSpacing: 12,
  },
  loader: {
    marginTop: 48,
  },
});
