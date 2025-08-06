import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <View className={`bg-card rounded-3xl p-4 ${className || ''}`}>
      {children}
    </View>
  );
}

interface TopCardTitleProps {
  title: string;
  className?: string;
}

export function TopCardTitle({ title, className }: TopCardTitleProps) {
  return (
    <Text className={`text-xl text-text-primary font-semibold mb-4 ${className || ''}`}>
      {title}
    </Text>
  );
}