import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { View, Text, StyleSheet, useColorScheme, InteractionManager } from 'react-native';
import { CalendarList, LocaleConfig } from 'react-native-calendars';
import { format, isValid } from 'date-fns';
import SafeAreaView from '@/components/base/MySafeArea';
import Header from '@/components/base/Header';
import { moods$ } from '@/utils/SupaLegend';
import { Colors } from '@/constants/themes';
import MoodModalCombined from '@/components/modals/MoodModalCombined';
import { useMoodStore } from '@/store/moodStore';
import { observer, use$, useComputed, useObservable } from '@legendapp/state/react';
import MoodGrid from '@/components/pages/main/MoodGrid';

// --- Configure locale for react-native-calendars ---
LocaleConfig.locales['en'] = {
  monthNames: [
    'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December',
  ],
  monthNamesShort: ['Jan.', 'Feb.', 'Mar', 'Apr', 'May', 'Jun', 'Jul.', 'Aug', 'Sep.', 'Oct.', 'Nov.', 'Dec.'],
  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
  dayNamesShort: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
  today: 'Today',
};
LocaleConfig.defaultLocale = 'en';

const MemoizedCalendarList = React.memo(({
  colorScheme,
  markedDates,
  onDayPress,
  calendarTheme
}: any) => {
  const today = new Date();
  return (
    <CalendarList
      key={colorScheme}
      pastScrollRange={60}
      futureScrollRange={60}
      showSixWeeks={true}
      scrollEnabled={true}
      onDayPress={onDayPress}
      decelerationRate={'fast'}
      markedDates={markedDates}
      markingType={'multi-dot'}
      current={format(today, 'yyyy-MM-dd')}
      hideExtraDays={true}
      monthFormat={'MMMM yyyy'}
      theme={calendarTheme}
    />
  )
});

export default function MoodCalendar() {
  const colorScheme = useColorScheme() ?? 'light';
  const myColors = Colors[colorScheme];
  const today = new Date();
  const [isReady, setIsReady] = useState(false);

  const getMoodColor = useCallback((moodValue: number) => {
    // @ts-ignore
    return myColors.moodColors[moodValue] || myColors.textSecondary;
  }, [myColors]);

  const markedDates = useComputed(() => {
    const moodsData = moods$.get();
    const mappedDates: Record<string, any> = {};

    Object.values(moodsData).forEach(mood => {
      if (!isValid(new Date(mood.at_local_time_added))) return; // Skip if no date is set
      const dateKey = format(new Date(mood.at_local_time_added), 'yyyy-MM-dd');
      mappedDates[dateKey] = { selected: true, selectedColor: getMoodColor(mood.mood_value), textColor: 'black', moodId: mood.id };
    });
    return mappedDates;
  }, [colorScheme]);

  // Use useMemo to generate the calendar theme based on the current color scheme
  const calendarTheme = useMemo(() => ({
    backgroundColor: myColors.background,
    calendarBackground: myColors.background,
    textSectionTitleColor: myColors.textSecondary,
    textSectionTitleDisabledColor: myColors.grayHighlight300,
    dayTextColor: myColors.textPrimary,
    selectedDayTextColor: 'black',
    textDisabledColor: myColors.grayHighlight300,
    dotColor: myColors.blueButton,
    arrowColor: myColors.textPrimary,

    todayBackgroundColor: myColors.backgroundSecondary,
    monthTextColor: myColors.textPrimary,
    indicatorColor: myColors.blueButton,
    textDayFontFamily: 'System', // Adjust with your custom fonts
    textMonthFontFamily: 'System',
    textDayHeaderFontFamily: 'System',
    textDayFontSize: 16,
    textMonthFontSize: 22,
    textDayHeaderFontSize: 14,
    textMonthFontWeight: 'bold' as any,
  }), [colorScheme]);

  const [modalContent, setModalContent] = useState<"moodDetails" | "moodSelect">("moodDetails");
  const [isMoodModalVisible, setMoodModalVisible] = useState(false);
  const { setModalDate, setModalMood } = useMoodStore();

  const onDayPress = useCallback((day: any) => {
    setModalDate(new Date(day.dateString));
    setModalMood(markedDates.get()[day.dateString]?.moodId ?? '');
    setModalContent('moodDetails');
    setMoodModalVisible(true);
  }, []);

  useEffect(() => {
    const task = InteractionManager.runAfterInteractions(() => {
      setIsReady(true);
    });

    return () => task.cancel();
  }, []);

  return (
    <SafeAreaView className='flex-1 bg-background' edges={{ top: true, bottom: true }}>
      <MoodModalCombined
        onClose={() => setMoodModalVisible(false)}
        isVisible={isMoodModalVisible}
        content={modalContent}
        onChangeMood={() => {
          setModalContent('moodSelect');
        }}
      />
      <Header title="Mood Calendar" />
      {isReady && <MemoizedCalendarList
        colorScheme={colorScheme}
        markedDates={markedDates.get()}
        onDayPress={onDayPress}
        calendarTheme={calendarTheme}
      />}
    </SafeAreaView>
  );
}