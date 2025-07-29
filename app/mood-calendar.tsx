import React, { useCallback, memo, useState, useRef, useEffect, useMemo } from 'react';
import { View, Text, FlatList, ListRenderItem } from 'react-native';
import {
  eachMonthOfInterval,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  addDays,
  getDate,
  isSameMonth,
  isSameDay,
  format,
  addMonths, // Import addMonths
  subMonths, // Import subMonths
} from 'date-fns';
import SafeAreaView from '@/components/base/MySafeArea';
import Header from '@/components/base/Header';
import { MoodRow } from '@/utils/types';
import { moods$ } from '@/utils/SupaLegend';

// --- Constants for Configuration ---
const MONTH_ITEM_HEIGHT = 378; // Height of the MonthItem component itself
const ITEM_SEPARATOR_HEIGHT = 20; // Height of the ItemSeparatorComponent
const TOTAL_ITEM_HEIGHT = MONTH_ITEM_HEIGHT + ITEM_SEPARATOR_HEIGHT; // Combined height for getItemLayout

const INITIAL_LOAD_MONTHS_COUNT = 4; // Number of months to load initially around 'today'
const LOAD_MORE_MONTHS_COUNT = 4; // Number of months to load when scrolling up/down

const SCROLL_THRESHOLD_TOP = 50; // Pixels from the top to trigger loadMoreBefore
const LOAD_BEFORE_DEBOUNCE_TIME = 1000; // Debounce time for loading previous months (in ms)

// --- Utility Functions ---

// Generates a 6x7 matrix of dates for a given month, ensuring consistent height.
function generateMonthMatrix(date: Date): Date[] {
  const start = startOfWeek(startOfMonth(date), { weekStartsOn: 1 }); // Week starts on Monday
  const days: Date[] = [];
  let current = start;

  // Always generate 42 days (6 weeks * 7 days) for a consistent calendar grid height.
  for (let i = 0; i < 42; i++) {
    days.push(current);
    current = addDays(current, 1);
  }
  return days;
}

// Merges new months into existing ones, ensuring no duplicates and correct order for prepending.
function mergeUniqueMonths(newMonths: Date[], existingMonths: Date[]): Date[] {
  const seen = new Set(existingMonths.map((d) => format(d, 'yyyy-MM')));
  const uniqueIncoming = newMonths.filter((d) => !seen.has(format(d, 'yyyy-MM')));
  return [...uniqueIncoming, ...existingMonths]; // Prepend new months
}

// --- Month Item Component ---
interface MonthItemProps {
  monthDate: Date;
  today: Date;
  moodsByDate: Map<string, MoodRow[]>;
}

const MonthItem = memo(({ monthDate, today, moodsByDate }: MonthItemProps) => {
  const days = generateMonthMatrix(monthDate);
  const label = format(monthDate, 'MMMM yyyy');

  return (
    <View className={`h-[${MONTH_ITEM_HEIGHT}px]`}>
      <Text className="text-2xl font-semibold mb-8 text-text-primary text-center">{label}</Text>

      {/* Weekday headers */}
      <View style={{ flexDirection: 'row', marginBottom: 4 }}>
        {['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'].map((day) => (
          <Text
            key={day}
            style={{ flex: 1, textAlign: 'center', color: '#888' }}
            numberOfLines={1}
          >
            {day}
          </Text>
        ))}
      </View>

      {/* Days grid */}
      <View>
        {Array.from({ length: 6 }).map((_, rowIndex) => { // Always render 6 rows
          const rowDays = days.slice(rowIndex * 7, rowIndex * 7 + 7);

          return (
            <View key={rowIndex} className="flex-row gap-1">
              {rowDays.map((day, i) => {
                const isInMonth = isSameMonth(day, monthDate);
                const isToday = isSameDay(day, today);
                const moodValue = moodsByDate.get(format(day, 'yyyy-MM-dd'));
                const bg = moodValue != undefined ? 'bg-mood-colors-' + moodValue[0].mood_value : ''


                if (!isInMonth)
                  return (
                    <View
                      key={i}
                      className="flex-1 h-[40px] my-1 bg-transparent"
                    >
                    </View>
                  );
                else
                  return (
                    <View
                      key={i}
                      className={`flex-1 rounded-full h-[40px] items-center justify-center my-1 ${isToday ? 'bg-gray-highlight-200' : 'bg-transparent'}`}
                    >
                      <Text className="text-text-secondary text-center">{getDate(day)}</Text>
                      <View className={`absolute top-2 right-2 h-[8px] w-[8px] rounded-full ${bg}`} />
                    </View>
                  );
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
});

// --- Main Calendar Component ---
export default function MoodCalendar() {
  const listRef = useRef<FlatList<Date>>(null);
  const scrollOffsetRef = useRef(0);
  const lastLoadBeforeTimeRef = useRef(0);

  const today = new Date();
  const todayKey = format(today, 'yyyy-MM');

  // Initial range of months to display based on constants
  const initialStart = startOfMonth(subMonths(today, INITIAL_LOAD_MONTHS_COUNT));
  const initialEnd = endOfMonth(addMonths(today, INITIAL_LOAD_MONTHS_COUNT));

  const [months, setMonths] = useState<Date[]>(() =>
    eachMonthOfInterval({ start: initialStart, end: initialEnd })
  );

  const [range, setRange] = useState(() => ({
    start: initialStart,
    end: initialEnd,
  }));


  // Memoized key extractor for list items
  const keyExtractor = useCallback((item: Date) => format(item, 'yyyy-MM'), []);

  const moodsByDate = useMemo(() => {
    const map = new Map<string, MoodRow[]>();

    Object.values(moods$.get()).forEach(mood => { // If allMoods is an object {id: MoodRow}, use Object.values
      const dateKey = format(mood.at_local_time_added, 'yyyy-MM-dd');
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)?.push(mood);
    });
    return map;
  }, []); // Dependency should be your raw moods data

  // Pass `moodsByDate` down to renderItem
  const renderItem: ListRenderItem<Date> = useCallback(
    ({ item }) => <MonthItem monthDate={item} today={today} moodsByDate={moodsByDate} />,
    [today, moodsByDate] // moodsByDate as a dependency here
  );

  const footerHeader = useMemo(() => (
    <View className='justify-start' style={{ height: 100 + ITEM_SEPARATOR_HEIGHT }}>
      <Text className='text-6xl text-text-secondary text-center'>...</Text>
    </View>
  ), []);

  // Function to load more months after the current range
  const loadMoreAfter = useCallback(() => {
    if (listRef.current && listRef.current.props.data?.length !== months.length) {
      return;
    }
    const newEnd = endOfMonth(addMonths(range.end, LOAD_MORE_MONTHS_COUNT));
    const newMonths = eachMonthOfInterval({
      start: addDays(range.end, 1),
      end: newEnd,
    });
    setMonths((prev) => {
      const seen = new Set(prev.map((d) => format(d, 'yyyy-MM')));
      const uniqueIncoming = newMonths.filter((d) => !seen.has(format(d, 'yyyy-MM')));
      return [...prev, ...uniqueIncoming]; // Append new months
    });
    setRange((prev) => ({ ...prev, end: newEnd }));
  }, [range, months.length]);

  // Handles scroll events to capture current offset
  const handleScroll = useCallback((e: any) => {
    scrollOffsetRef.current = e.nativeEvent.contentOffset.y;
  }, []);

  // Function to load more months before the current range
  const loadMoreBefore = useCallback(() => {
    const newStart = startOfMonth(subMonths(range.start, LOAD_MORE_MONTHS_COUNT));
    const newMonths = eachMonthOfInterval({
      start: newStart,
      end: addDays(range.start, -1),
    });


    setMonths((prevMonths) => {
      const merged = mergeUniqueMonths(newMonths, prevMonths);
      return merged;
    });
    setRange((prevRange) => ({ ...prevRange, start: newStart }));

    // Adjust scroll position after prepending items to prevent visual jump
    requestAnimationFrame(() => {
      if (listRef.current) {
        const currentOffset = scrollOffsetRef.current;
        listRef.current.scrollToOffset({
          offset: currentOffset + (newMonths.length * TOTAL_ITEM_HEIGHT),
          animated: false,
        });
      }
    });
  }, [range]);

  // Effect to continuously check if user is near the top to load more 'before'
  useEffect(() => {
    const checkAndLoad = () => {
      if (scrollOffsetRef.current < SCROLL_THRESHOLD_TOP) {
        const now = Date.now();
        if (now - lastLoadBeforeTimeRef.current > LOAD_BEFORE_DEBOUNCE_TIME) {
          lastLoadBeforeTimeRef.current = now;
          loadMoreBefore();
        }
      }
    };
    const intervalId = setInterval(checkAndLoad, 200);
    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [loadMoreBefore]);


  // getItemLayout is crucial for FlatList with fixed-height items, especially when prepending
  const getItemLayout = useCallback((data: ArrayLike<Date> | null | undefined, index: number) => {
    return {
      length: TOTAL_ITEM_HEIGHT,
      offset: TOTAL_ITEM_HEIGHT * index,
      index,
    };
  }, []);

  useEffect(() => {
    if (listRef.current && months.length > 0) {
      const todayIndex = months.findIndex((m) => format(m, 'yyyy-MM') === todayKey);

      if (todayIndex !== -1) {
        // Calculate the offset for the 'today' month
        let targetOffset = todayIndex * TOTAL_ITEM_HEIGHT;

        // ✨ Account for the ListHeaderComponent's height
        targetOffset += 100 + ITEM_SEPARATOR_HEIGHT;

        listRef.current.scrollToOffset({
          offset: Math.max(0, targetOffset), // Ensure offset isn't negative
          animated: false,
        });
      }
    }
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={{ top: true, bottom: true }}>
      <Header title="" />
      <FlatList
        ref={listRef}
        data={months}
        // initialScrollIndex={months.findIndex((m) => format(m, 'yyyy-MM') === todayKey)}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: ITEM_SEPARATOR_HEIGHT }} />}
        onEndReachedThreshold={0.3}
        decelerationRate={'fast'}
        ListFooterComponent={footerHeader}
        ListHeaderComponent={footerHeader}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        onEndReached={loadMoreAfter}
        getItemLayout={getItemLayout}
        windowSize={11} // Adjust based on your screen size and desired buffer
        maxToRenderPerBatch={6}
      />
    </SafeAreaView>
  );
}