import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, { useAnimatedRef, scrollTo, runOnUI } from 'react-native-reanimated';
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isToday
} from 'date-fns';
import { MoodRow } from '@/utils/types';
import { Button } from '@/components/base/Button';
import { useMoodStore } from '@/store/moodStore';

interface Props {
  moodData?: MoodRow[];
}

const CELL_WIDTH = 54;


interface DayCellProps {
  mood?: MoodRow;
  date: Date;
}

export function DayCell({ mood, date }: DayCellProps) {
  const { selectedDate, setSelectedMood, setSelectedDate } = useMoodStore();

  // Check if this cell's mood is currently selected by comparing id
  const isSelected = date.toDateString() == selectedDate.toDateString();
  const today = isToday(date);

  const moodValue = mood?.mood_value ?? null; // Get mood value or null if not set
  const moodClass = moodValue != undefined ? `bg-mood-colors-${moodValue}` : '';

  const handlePress = () => {
    setSelectedDate(date);
    setSelectedMood(mood?.id || '');
  };


  return (
    <Button
      onPress={handlePress}
      variant={isSelected ? 'highlight200' : 'ghost'} // highlight selected mood cell
      style={{
        paddingVertical: 0,
        paddingHorizontal: 0,
        width: 54,
        height: 80,
        borderRadius: 12,
      }}
    >
      <View className="items-center w-[54px] relative">
        <Text className={`text-sm translate-x-0.5 ${isSelected ? 'font-semibold text-text-full' : 'text-text-secondary'}`}>
          {today ? 'Today' : format(date, 'EEE')[0]} {/* First letter of weekday */}
        </Text>
        <Text className={`text-xl ${isSelected ? 'font-semibold text-text-full' : 'text-text-secondary'}`}>
          {format(date, 'd')}
        </Text>
        {moodValue != undefined && (
          <View className="mt-1">
            <View className={`w-4 h-2 rounded-full ${moodClass}`} />
          </View>
        )}
      </View>
    </Button>
  );
}

export default function MoodDaysBar({ moodData }: Props) {
  const animatedRef = useAnimatedRef<Animated.ScrollView>();
  const today = new Date()

  const monthDays = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today),
  });

  const moodMap: Record<string, MoodRow> = {};
  moodData?.forEach((entry) => {
    if (entry.at_local_time_added) {
      const dateKey = entry.at_local_time_added.toDateString()
      moodMap[dateKey] = entry;
    }
  });

  const todayIndex = today.getDate() - 1;

  const daysArray = monthDays.map((date) => {
    const dayKey = date.toDateString();
    const mood = moodMap[dayKey];

    return (
      <DayCell
        key={dayKey}
        date={date}
        mood={mood}
      />
    );
  });

  useEffect(() => {
    runOnUI(() => {
      const offset = todayIndex * CELL_WIDTH - 8;
      scrollTo(animatedRef, offset, 0, false);
    })();
  }, []);

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
