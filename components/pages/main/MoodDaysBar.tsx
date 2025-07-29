import React, { useRef } from 'react';
import { View, Text, FlatList } from 'react-native';
import {
  format,
  eachDayOfInterval,
  startOfMonth,
  endOfMonth,
  isToday,
} from 'date-fns';
import { MoodRow } from '@/utils/types';
import { Button } from '@/components/base/Button';
import { useMoodStore } from '@/store/moodStore';

interface Props {
  moodData?: MoodRow[];
}

const CELL_WIDTH = 54; // Keep this constant for the width of each DayCell

interface DayCellProps {
  mood?: MoodRow;
  date: Date;
}

export function DayCell({ mood, date }: DayCellProps) {
  const { selectedDate, setSelectedMood, setSelectedDate } = useMoodStore();

  // Check if this cell's mood is currently selected by comparing id
  const isSelected = date.toDateString() === selectedDate.toDateString();
  const today = isToday(date);

  const moodValue = mood?.mood_value ?? null; // Get mood value or null if not set
  const moodClass = moodValue !== undefined ? `bg-mood-colors-${moodValue}` : '';

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
        width: CELL_WIDTH, // Ensure the width is consistently applied for getItemLayout to work correctly
        height: 80,
        borderRadius: 12,
      }}
    >
      <View className="items-center w-[54px] relative">
        <Text
          className={`text-sm translate-x-0.5 ${isSelected ? 'font-semibold text-text-full' : 'text-text-secondary'}`}
        >
          {today ? 'Today' : format(date, 'EEE')[0]} {/* First letter of weekday */}
        </Text>
        <Text
          className={`text-xl ${isSelected ? 'font-semibold text-text-full' : 'text-text-secondary'}`}
        >
          {format(date, 'd')}
        </Text>
        {moodValue !== undefined && (
          <View className="mt-1 rounded-full overflow-hidden">
            <View className={moodClass} style={{ height: 8, width: 16 }} />
          </View>
        )}
      </View>
    </Button>
  );
}

export default function MoodDaysBar({ moodData }: Props) {
  const flatListRef = useRef<FlatList>(null);
  const today = new Date();

  const monthDays = eachDayOfInterval({
    start: startOfMonth(today),
    end: endOfMonth(today),
  });

  const moodMap: Record<string, MoodRow> = {};
  moodData?.forEach((entry) => {
    if (entry.at_local_time_added) {
      const dateKey = entry.at_local_time_added.toDateString();
      moodMap[dateKey] = entry;
    }
  });

  const daysArray = monthDays.map((date) => {
    const dayKey = date.toDateString();
    const mood = moodMap[dayKey];
    return { date, mood, dayKey }; // Ensure each item has a unique key for FlatList
  });

  const todayIndex = daysArray.findIndex((day) => isToday(day.date));

  const getItemLayout = (data: any, index: number) => ({
    length: CELL_WIDTH, // The width of each item
    offset: CELL_WIDTH * index - CELL_WIDTH, // The starting position of the item
    index,
  });

  const renderItem = ({ item }: { item: { date: Date; mood?: MoodRow } }) => (
    <DayCell date={item.date} mood={item.mood} />
  );

  return (
    <View className="-mx-card mt-4">
      <FlatList
        ref={flatListRef}
        data={daysArray}
        keyExtractor={(item) => item.date.toDateString()} // Use dayKey for unique keys
        initialScrollIndex={todayIndex}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        initialNumToRender={31}
        maxToRenderPerBatch={31}
        contentContainerStyle={{ paddingHorizontal: 4 }}
        getItemLayout={getItemLayout}
      />
    </View>
  );
}