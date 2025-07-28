import React from 'react';
import Modal from '@/components/base/Modal';
import { Pressable, View, Text, Image } from 'react-native';
import { format } from 'date-fns';

import { useMoodStore } from '@/store/moodStore';
import { saveMood } from '@/utils/queries';
import { MoodsMap } from '@/constants/maps';

type MoodSelectorModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect?: (moodId: string) => void; // Callback when a mood is selected
};

export default function MoodSelectModal({ visible, onClose, onSelect }: MoodSelectorModalProps) {
  const {
    modalDate,
    setModalMood,
  } = useMoodStore();

  const formattedDate = format(modalDate, 'd MMMM yyyy');

  const handleSelectMood = (moodValue: number) => {
    const moodId = saveMood(modalDate, moodValue);
    setModalMood(moodId);
    onSelect?.(moodId); // Call the onSelect callback if provided
    onClose(); // Close after selection
  };

  return (
    <Modal isVisible={visible} onClose={onClose}>
      <View className='rounded-2xl items-center w-full'>
        <Text className='text-lg text-text-primary font-semibold text-center'>
          {formattedDate}
        </Text>

        <Text className='text-xl text-text-primary mt-6'>How are you feeling?</Text>

        <View className='flex-row justify-between gap-4 px-4 mt-4 bg-gray-highlight-100 rounded-3xl py-4'>
          {MoodsMap.map((mood) => (
            <Pressable
              key={mood.value}
              onPress={() => handleSelectMood(mood.value)}
              className='items-center flex-1 h-full'
            >
              <View className={`rounded-full aspect-square w-full ${mood.color} items-center justify-center`}>
                <Image
                  source={mood.src}
                  resizeMode='cover'
                  className='w-full h-full'
                  style={{ tintColor: '#333333' }}
                />
              </View>
              <Text className='text-xs text-text-primary mt-2 text-center'>
                {mood.label}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>
    </Modal>
  );
}
