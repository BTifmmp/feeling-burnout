import React from 'react';
import { View, Text } from 'react-native';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay
} from 'date-fns';
import { Card } from '@/components/base/Card';
import { IconButton } from '@/components/base/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Colors } from '@/constants/themes';

interface MoodData {
  [dateKey: string]: number; // Mood scale 0–5
}

interface Props {
  moodData?: MoodData;
  className?: string;
}

export default function MoodGrid({ moodData = {}, className }: Props) {
  const { colorScheme = 'light' } = useColorScheme();

  const today = new Date();
  const monthString = format(today, 'MMMM');
  const monthStart = startOfMonth(today);
  const monthEnd = endOfMonth(today);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 }); // Monday
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const allDates = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const rows: Date[][] = [];
  for (let i = 0; i < allDates.length; i += 7) {
    rows.push(allDates.slice(i, i + 7));
  }

  return (
    <Card className={className}>
      <View className={`flex-row items-center justify-between ${className}`}>
        <IconButton className='p-2' onClick={() => { }} icon={<ChevronLeft size={20} color={Colors[colorScheme].textPrimary} style={{ transform: [{ translateX: -0.5 }] }} />} />

        <Text className="text-lg text-text-primary font-semibold text-center flex-1 mx-2">
          {monthString}
        </Text>

        <IconButton className='p-2' onClick={() => { }} icon={<ChevronRight size={20} color={Colors[colorScheme].textPrimary} style={{ transform: [{ translateX: 0.5 }] }} />} />
      </View>
      <View className="flex flex-col gap-2 mt-5">
        {rows.map((week, weekIndex) => (
          <View key={weekIndex} className="flex-row gap-2 justify-between">
            {week.map((date, dayIndex) => {
              const dateKey = format(date, 'yyyy-MM-dd');
              const mood = moodData[dateKey];
              const isCurrentMonth = isSameMonth(date, today);
              const isToday = isSameDay(date, today);

              const bgClass = mood != undefined
                ? `bg-mood-colors-${mood}`
                : (isCurrentMonth ? 'bg-gray-highlight-100' : 'bg-transparent');

              return (
                <View
                  key={dayIndex}
                  className={`flex-1 h-6 items-center justify-center rounded-full ${bgClass}`}
                >
                  <Text className={`text-xs text-white ${isToday ? 'font-bold' : ''}`}>
                    {isCurrentMonth ? format(date, 'd') : ''}
                  </Text>
                </View>
              );
            })}
          </View>
        ))}
      </View>
    </Card>
  );
}
