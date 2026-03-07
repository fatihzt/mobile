import React, { useState } from 'react';
import { Image, View, StyleSheet, ImageStyle, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/theme';
import { SkeletonCard } from './SkeletonCard';

interface EventImageProps {
  uri: string;
  style?: ImageStyle;
  borderRadius?: number;
  containerStyle?: ViewStyle;
}

export const EventImage: React.FC<EventImageProps> = ({
  uri,
  style,
  borderRadius = 12,
  containerStyle,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <View
        style={[
          styles.errorContainer,
          { borderRadius },
          style,
          containerStyle,
        ]}
      >
        <Ionicons name="image-outline" size={48} color={colors.muted} />
      </View>
    );
  }

  const imageWidth = typeof style?.width === 'number' ? style.width :
                     typeof style?.width === 'string' ? style.width : '100%';
  const imageHeight = typeof style?.height === 'number' ? style.height : 200;

  return (
    <View style={[{ borderRadius }, containerStyle]}>
      {isLoading && (
        <SkeletonCard
          width={imageWidth}
          height={imageHeight}
          borderRadius={borderRadius}
          style={styles.skeleton}
        />
      )}
      <Image
        source={{ uri }}
        style={[{ borderRadius }, style]}
        onLoadStart={() => setIsLoading(true)}
        onLoadEnd={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  errorContainer: {
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  skeleton: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
