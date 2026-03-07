import React, { useEffect } from 'react';
import { ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '@/shared/theme';

interface SkeletonCardProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({
  width = '100%',
  height = 100,
  borderRadius = 12,
  style,
}) => {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.7, { duration: 1000 }),
      -1,
      true
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const widthStyle = typeof width === 'string'
    ? { width: width as '100%' | `${number}%` }
    : { width };

  return (
    <Animated.View
      style={[
        {
          height,
          borderRadius,
          backgroundColor: colors.surface,
        },
        widthStyle,
        animatedStyle,
        style,
      ]}
    />
  );
};
