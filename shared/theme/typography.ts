import { TextStyle } from 'react-native';

export const typography: Record<string, TextStyle> = {
  largeTitle: { fontSize: 34, fontWeight: '700' },
  title: { fontSize: 28, fontWeight: '700' },
  title2: { fontSize: 22, fontWeight: '600' },
  title3: { fontSize: 20, fontWeight: '600' },
  headline: { fontSize: 17, fontWeight: '600' },
  body: { fontSize: 17, fontWeight: '400' },
  callout: { fontSize: 16, fontWeight: '400' },
  subheadline: { fontSize: 15, fontWeight: '400' },
  footnote: { fontSize: 13, fontWeight: '400' },
  caption: { fontSize: 12, fontWeight: '400' },
  caption2: { fontSize: 11, fontWeight: '400' },
  brandTitle: { fontSize: 32, fontWeight: '700', letterSpacing: 8 },
  sectionLabel: { fontSize: 11, fontWeight: '600', letterSpacing: 2, textTransform: 'uppercase' },
  button: { fontSize: 16, fontWeight: '600' },
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  pill: 24,
  circle: 9999,
};

export const shadows = {
  sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2 },
  md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.15, shadowRadius: 8 },
};

export const animation = {
  fast: 150,
  normal: 300,
  slow: 500,
  spring: { damping: 15, stiffness: 150 },
};
