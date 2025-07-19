import { Text, View } from 'react-native';
import React from 'react';
import { useColorScheme } from 'nativewind';

export type MoodType = 'all' | 'positive' | 'negative' | 'neutral';

export const moodStyleMap: Record<Exclude<MoodType, 'all'>, string> = {
  positive: 'mood-colors-4',
  negative: 'mood-colors-0',
  neutral: 'mood-colors-2',
};

type MoodBadgeProps = {
  mood: MoodType;
  isSelected?: boolean;
  containerClassName?: string;
  textClassName?: string;
  inactiveColor?: string;
};

export default function MoodBadge({
  mood,
  isSelected = false,
  containerClassName = '',
  textClassName = '',
  inactiveColor = 'bg-card',
}: MoodBadgeProps) {
  const { colorScheme = 'light' } = useColorScheme();

  const flairClass = mood !== 'all' ? moodStyleMap[mood] : 'text-primary';

  const baseContainerClass = isSelected
    ? `bg-${flairClass}`
    : inactiveColor;

  const baseTextClass = isSelected
    ? (colorScheme === 'light' && mood === 'all' ? 'text-white' : 'text-black')
    : 'text-text-secondary';

  return (
    <View
      className={`${containerClassName} px-3 py-2 rounded-full ${baseContainerClass}`}
    >
      <Text className={`${textClassName} capitalize text-lg font-medium ${baseTextClass}`}>
        {mood}
      </Text>
    </View>
  );
}
