import React, { useMemo, useState } from 'react';
import { View, Text, Pressable } from 'react-native';
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
import { moods$ } from '@/utils/SupaLegend';
import MoodModal from '@/components/modals/MoodDetailsModal';
import MoodSelectModal from '@/components/modals/MoodSelectModal';
import { useMoodStore } from '@/store/moodStore';
import { MoodRow } from '@/utils/types';
import { observer } from '@legendapp/state/react';

const MoodGrid = observer(({ className }: { className?: string }) => {
  const { colorScheme = 'light' } = useColorScheme();

  const [isMoodSelectModalVisible, setMoodSelectModalVisible] = useState(false);
  const [isMoodModalVisible, setMoodModalVisible] = useState(false);

  const { setModalDate, setModalMood } = useMoodStore();

  // Load mood data from moods$ state
  const moodEntries = Object.values(moods$.get() || {});
  const moodData: Record<string, MoodRow> = {};
  for (const entry of moodEntries) {
    const dateKey = format(entry.at_local_time_added, 'yyyy-MM-dd');
    moodData[dateKey] = entry;
  }

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const isCurrentYear = currentMonth.getFullYear() === new Date().getFullYear();
  const monthString = format(currentMonth, isCurrentYear ? 'MMMM' : 'MMMM yyyy');
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const allDates = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const rows = useMemo(() => {
    const weeks: Date[][] = [];
    for (let i = 0; i < allDates.length; i += 7) {
      weeks.push(allDates.slice(i, i + 7));
    }
    return weeks;
  }, [allDates]);

  return (
    <Card className={className}>
      <MoodModal
        visible={isMoodModalVisible}
        onClose={() => setMoodModalVisible(false)}
        onChangeMood={() => {
          setMoodModalVisible(false);
          setMoodSelectModalVisible(true);
          setModalMood('');
        }}
      />
      <MoodSelectModal
        visible={isMoodSelectModalVisible}
        onClose={() => setMoodSelectModalVisible(false)}
      />

      <View className={`flex-row items-center justify-between ${className}`}>
        <IconButton
          variant='highlight100'
          style={{ padding: 8 }}
          onPress={() => {
            setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
          }}
          icon={
            <ChevronLeft
              size={22}
              color={Colors[colorScheme].textPrimary}
              style={{ transform: [{ translateX: -0.5 }] }}
            />
          }
        />

        <Text className="text-lg text-text-primary font-semibold text-center flex-1 mx-2">
          {monthString}
        </Text>

        <IconButton
          variant='highlight100'
          style={{ padding: 8 }}
          onPress={() => {
            setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
          }}
          icon={
            <ChevronRight
              size={22}
              color={Colors[colorScheme].textPrimary}
              style={{ transform: [{ translateX: 0.5 }] }}
            />
          }
        />
      </View>

      <View className="flex flex-col gap-2 mt-5">
        {rows.map((week, weekIndex) => (
          <View key={weekIndex} className="flex-row gap-2 justify-between">
            {week.map((date, dayIndex) => {
              const dateKey = format(date, 'yyyy-MM-dd');
              const mood = moodData[dateKey]?.mood_value;
              const isCurrentMonth = isSameMonth(date, currentMonth);
              const isToday = isSameDay(date, new Date());

              const bgClass =
                mood !== undefined
                  ? `bg-mood-colors-${mood}`
                  : 'bg-gray-highlight-100'

              const textColor =
                mood !== undefined
                  ? 'text-black'
                  : 'text-text-secondary';
              if (isCurrentMonth)
                return (
                  <Pressable
                    key={dayIndex}
                    className={`flex-1 h-6 items-center justify-center rounded-full ${bgClass}`}
                    onPress={() => {
                      setModalDate(date);
                      setModalMood(moodData[dateKey]?.id ?? '');
                      setMoodModalVisible(true);
                    }}
                  >
                    <Text className={`text-xs ${textColor} ${isToday ? 'font-bold' : ''}`}>
                      {isCurrentMonth ? format(date, 'd') : ''}
                    </Text>
                  </Pressable>
                );
              else
                return (
                  <View
                    key={dayIndex}
                    className="flex-1 h-6"
                  >
                  </View>
                );
            })}
          </View>
        ))}
      </View>
    </Card>
  );
})

export default MoodGrid;