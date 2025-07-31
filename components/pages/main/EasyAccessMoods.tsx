import { View, Text } from 'react-native';
import React, { use, useEffect, useLayoutEffect, useState } from 'react';
import MoodDaysBar from './MoodDaysBar';
import { moods$ } from '@/utils/SupaLegend';
import { format, isSameDay, isToday, set } from 'date-fns';
import { useMoodStore } from '@/store/moodStore';
import { MoodsMap } from '@/constants/maps';
import { Button } from '@/components/base/Button';
import { observer } from '@legendapp/state/react';
import MoodModalCombined from '@/components/modals/MoodModalCombined';
import { Skeleton } from 'moti/skeleton'
import { MotiView } from 'moti';
import { useColorScheme } from 'nativewind';
import { getMotiColors } from '@/constants/themes';

const EasyAccessMoods = observer(() => {
  const [isMoodSelectModalVisible, setMoodSelectModalVisible] = useState(false);

  const { selectedDate, selectedMood, setModalDate, setModalMood, setSelectedDate, setSelectedMood } = useMoodStore();

  const [moodsLoaded, setMoodsLoaded] = useState(false);

  const { colorScheme = 'light' } = useColorScheme();

  const moodData = Object.values(moods$.get() || {});
  const selectedMoodData = selectedMood ? moods$[selectedMood]?.get() : null;

  const isSelectedToday = isToday(new Date(selectedDate));
  const displayDate = isSelectedToday
    ? 'Today'
    : format(new Date(selectedDate), 'd MMMM');

  useEffect(() => {
    if (moods$.get() != undefined) {
      const moods = Object.values(moods$.get());
      for (const mood of moods) {
        if (isSameDay(new Date(mood.at_local_time_added), new Date())) {
          setSelectedMood(mood.id);
          setModalMood(mood.id);
          break;
        }
      }
      setModalDate(new Date());
      setSelectedDate(new Date());

      setTimeout(() => {
        setMoodsLoaded(true);
      }, 400);

    }
  }, [moods$.get()]);


  return (
    <View style={{ height: 260, width: '100%' }} >
      {!moodsLoaded && <MotiView
        transition={{
          type: 'timing',
        }}
        style={{ position: 'absolute', top: 24, left: 0, right: 0, bottom: 0, zIndex: 100 }}
      >
        <Skeleton colors={getMotiColors(colorScheme)} colorMode={colorScheme} radius={12} height={80} width={'100%'} />
        <View className='h-4' />
        <Skeleton colors={getMotiColors(colorScheme)} colorMode={colorScheme} width={'100%'} />
        <View className='h-2' />
        <Skeleton colors={getMotiColors(colorScheme)} colorMode={colorScheme} width={'100%'} />
      </MotiView>}


      <MoodModalCombined isVisible={isMoodSelectModalVisible} content='moodSelect' onClose={() => { setMoodSelectModalVisible(false) }} />

      <View style={{ opacity: moodsLoaded ? 1 : 0 }} >
        <MoodDaysBar moodData={moodData} />

        {selectedMoodData ? (
          <View>
            <Text className="text-3xl text-text-primary mt-6">
              {isSelectedToday ? 'Today' : `On ${displayDate}`}, you logged your mood as{' '}
              <Text className="font-extrabold">
                {MoodsMap[selectedMoodData.mood_value]?.label || selectedMoodData.mood_value}
              </Text>.
            </Text>
            <View className='flex-row mt-10 justify-center'>
              <Button
                variant='ghost'
                onPress={() => { setMoodSelectModalVisible(true); setModalDate(selectedDate); setModalMood(selectedMood ?? ''); }}
                style={{ paddingVertical: 8 }}
              >
                <Text className="text-text-secondary text-base">Change</Text>
              </Button>
            </View>
          </View>
        ) : (
          <View className="mt-6">
            <Text className="text-3xl text-text-primary">
              You haven’t logged your mood for {displayDate}.
            </Text>
            <View className='flex-row mt-10 justify-center'>
              <Button
                variant='blue'
                onPress={() => { setMoodSelectModalVisible(true); setModalDate(selectedDate); setModalMood(selectedMood ?? ''); }}
                style={{ paddingVertical: 8, paddingHorizontal: 24 }}
              >
                <Text className="text-white font-semibold text-base">Log</Text>
              </Button>
            </View>
          </View>
        )}
      </View>
    </View >
  );
})

export default EasyAccessMoods;