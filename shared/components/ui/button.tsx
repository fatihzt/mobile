/**
 * Button Component - shadcn/ui style
 */

import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';
import { cn } from '../../lib/utils';

interface ButtonProps {
  children: React.ReactNode;
  onPress: () => void;
  variant?: 'default' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onPress,
  variant = 'default',
  size = 'md',
  disabled = false,
  loading = false,
  className,
}) => {
  const baseStyles = 'rounded-lg items-center justify-center';
  
  const variantStyles = {
    default: 'bg-primary',
    outline: 'bg-transparent border border-gray-300',
    ghost: 'bg-transparent',
    destructive: 'bg-red-600',
  };

  const sizeStyles = {
    sm: 'px-3 py-2',
    md: 'px-4 py-3',
    lg: 'px-6 py-4',
  };

  const textVariantStyles = {
    default: 'text-white',
    outline: 'text-gray-900',
    ghost: 'text-gray-900',
    destructive: 'text-white',
  };

  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <TouchableOpacity
      className={cn(
        baseStyles,
        variantStyles[variant],
        sizeStyles[size],
        (disabled || loading) && 'opacity-50',
        className
      )}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'default' || variant === 'destructive' ? '#fff' : '#000'} />
      ) : (
        <Text className={cn('font-semibold', textVariantStyles[variant], textSizeStyles[size])}>
          {children}
        </Text>
      )}
    </TouchableOpacity>
  );
};

