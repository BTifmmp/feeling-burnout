import React from 'react';
import Modal from '@/components/base/Modal';
import { Pressable, View, Text, Image } from 'react-native';
import { format } from 'date-fns';

import { useMoodStore } from '@/store/moodStore';
import { moods$ } from '@/utils/SupaLegend';
import { MoodsMap } from '@/constants/maps';
import { Button } from '@/components/base/Button';

type MoodModalProps = {
  visible: boolean;
  onClose: () => void;
  onChangeMood: () => void; // <- callback to open selector modal
};

export default function MoodModal({ visible, onClose, onChangeMood }: MoodModalProps) {
  const {
    modalDate,
    modalMood,
  } = useMoodStore();

  const formattedDate = format(modalDate, 'd MMMM yyyy');

  const moodEntry = modalMood ? moods$[modalMood]?.get() : null;
  const moodConfig = moodEntry ? MoodsMap[moodEntry.mood_value] : null;

  return (
    <Modal isVisible={visible} onClose={onClose}>
      <View className='rounded-2xl items-center'>
        <Text className='text-lg text-text-primary font-semibold text-center'>
          {formattedDate}
        </Text>

        {moodEntry && moodConfig ? (
          <View className='mt-6 items-center'>
            <Text className='text-xl text-text-primary text-center'>
              On this day, you were feeling{' '}
              <Text className='font-bold'>{moodConfig.label.toLowerCase()}</Text>.
            </Text>

            <View
              className={`mt-6 rounded-full w-24 aspect-square ${moodConfig.color} items-center justify-center`}
            >
              <Image
                source={moodConfig.src}
                resizeMode='contain'
                className='w-16 h-16'
                style={{ tintColor: '#333333' }}
              />
            </View>

            <Pressable onPress={onChangeMood} className='self-center'>
              <Text className='text-text-secondary mt-6'>Change mood</Text>
            </Pressable>
          </View>
        ) : (
          <View>
            <Text className='text-lg text-text-primary mt-6'>No mood logged for this day.</Text>
            <View className='flex-row mt-10 justify-center'>
              <Pressable
                className='bg-blue-button rounded-full px-6 py-2'
                onPress={onChangeMood}
                style={{ paddingVertical: 8, paddingHorizontal: 24 }}
              >
                <Text className="text-white font-semibold text-base">Log</Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
}
