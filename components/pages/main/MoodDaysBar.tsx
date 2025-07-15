import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useAnimatedRef, scrollTo, useDerivedValue } from 'react-native-reanimated';
import {
  isSameDay,
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth
} from 'date-fns';

interface MoodData {
  [dateKey: string]: number; // Mood scale 0–5
}

interface Props {
  moodData?: MoodData;
}

const CELL_WIDTH = 54;

interface DayCellProps {
  date: Date;
  isToday: boolean;
  moodValue?: number;
}

function DayCell({ date, isToday, moodValue }: DayCellProps) {
  const moodClass = moodValue != null ? `bg-mood-colors-${moodValue}` : '';

  return (
    <View className="items-center w-[54px] relative">
      {isToday && (
        <View className="h-20 w-[48px] absolute inset-0 rounded-xl bg-gray-highlight-100 -z-10 top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2" />
      )}
      <Text className={`text-sm translate-x-0.5 ${isToday ? 'font-semibold text-text-full' : 'text-text-secondary'}`}>
        {isToday ? 'Today' : format(date, 'EEE')[0]} {/* First letter of weekday */}
      </Text>
      <Text className={`text-xl ${isToday ? 'font-semibold text-text-full' : 'text-text-secondary'}`}>
        {format(date, 'd')}
      </Text>
      {moodValue != null && (
        <View className="mt-1">
          <View className={`w-4 h-2 rounded-full ${moodClass}`} />
        </View>
      )}
    </View>
  );
}

export default function MoodDaysBar({ moodData = {} }: Props) {
  const animatedRef = useAnimatedRef<Animated.ScrollView>();
  const today = new Date();

  const monthDays = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today),
  });

  const todayIndex = today.getDate() - 1;

  const daysArray = monthDays.map((date, index) => {
    const isToday = isSameDay(date, today);
    const dayKey = format(date, 'yyyy-MM-dd');
    const moodValue = moodData[dayKey];

    return (
      <DayCell
        key={dayKey}
        date={date}
        isToday={isToday}
        moodValue={moodValue}
      />
    );
  });

  useDerivedValue(() => {
    const offset = todayIndex * CELL_WIDTH - 8;
    scrollTo(animatedRef, offset, 0, false);
  }, [todayIndex]);

  return (
    <View className="-mx-card mt-4">
      <Animated.ScrollView
        ref={animatedRef}
        className="py-4"
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        <View className="flex-row">{daysArray}</View>
      </Animated.ScrollView>
    </View>
  );
}
