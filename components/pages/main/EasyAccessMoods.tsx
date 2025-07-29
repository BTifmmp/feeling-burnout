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

const EasyAccessMoods = observer(() => {
  const [isMoodSelectModalVisible, setMoodSelectModalVisible] = useState(false);

  const { selectedDate, selectedMood, setModalDate, setModalMood } = useMoodStore();

  const moodData = Object.values(moods$.get() || {});
  const selectedMoodData = selectedMood ? moods$[selectedMood]?.get() : null;

  const isSelectedToday = isToday(new Date(selectedDate));
  const displayDate = isSelectedToday
    ? 'Today'
    : format(new Date(selectedDate), 'd MMMM');

  useEffect(() => {
    const moodValues = Object.values(moods$.get());
    for (const mood of moodValues) {
      if (isSameDay(mood.at_local_time_added, new Date())) {
        useMoodStore.setState({
          selectedDate: new Date(),
          selectedMood: mood.id ?? null,
          modalDate: new Date(),
          modalMood: mood.id ?? null,
        });
        break; // Stop after finding the first match
      }
    }
  }, [])

  return (
    <View style={{ opacity: Number(selectedDate.getTime() != 0) }}>
      <MoodModalCombined isVisible={isMoodSelectModalVisible} content='moodSelect' onClose={() => { setMoodSelectModalVisible(false) }} />

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
    </View >
  );
})

export default EasyAccessMoods;