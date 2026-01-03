/**
 * Card Component - shadcn/ui style
 */

import React from 'react';
import { View, ViewProps } from 'react-native';
import { cn } from '../../lib/utils';

interface CardProps extends ViewProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <View
      className={cn(
        'bg-white rounded-xl overflow-hidden shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </View>
  );
};

export const CardHeader: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <View className={cn('p-4', className)}>{children}</View>;
};

export const CardContent: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <View className={cn('p-4', className)}>{children}</View>;
};

export const CardFooter: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className,
}) => {
  return <View className={cn('p-4 pt-0', className)}>{children}</View>;
};

