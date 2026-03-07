import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/shared/theme';

interface IconProps {
  name: keyof typeof Ionicons.glyphMap;
  size?: number;
  color?: string;
}

export const Icon: React.FC<IconProps> = ({ name, size = 24, color = colors.platinum }) => (
  <Ionicons name={name} size={size} color={color} />
);
