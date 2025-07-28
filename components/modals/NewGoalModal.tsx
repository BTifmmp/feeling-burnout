
import React, { useState } from 'react';
import { View, Text, TextInput } from 'react-native';
import Modal from '@/components/base/Modal';
import { Button } from '@/components/base/Button';
import { useColorScheme } from 'nativewind';

type GoalModalProps = {
  visible: boolean;
  onClose: () => void;
};

export default function NewGoalModal({ visible, onClose }: GoalModalProps) {
  const [goal, setGoal] = useState('');
  const { colorScheme = 'light' } = useColorScheme();

  const handleSave = () => {
    setGoal('');
    onClose();
  };

  return (
    <Modal isVisible={visible} onClose={onClose}>
      <View className='rounded-2xl'>
        {/* Title */}
        <Text className='text-xl font-semibold text-text-primary text-center'>
          New Goal or Boundary
        </Text>

        {/* Input */}
        <TextInput
          className='bg-gray-highlight-100 h-32 rounded-2xl p-4 text-base text-text-primary mt-6'
          multiline
          numberOfLines={4}
          placeholder="Describe your goal or boundary..."
          placeholderTextColor={colorScheme === 'light' ? '#00000099' : '#ffffff99'}
          style={{ textAlignVertical: 'top' }}
          value={goal}
          onChangeText={setGoal}
        />

        {/* Action */}
        <View className='flex-row justify-end mt-4'>
          <Button
            title='Save'
            variant='blue'
            disabled={!goal.trim().length}
            onPress={handleSave}
            style={{ paddingVertical: 6, paddingHorizontal: 16 }}
            textStyle={{ fontSize: 14 }}
          />
        </View>
      </View>
    </Modal>
  );
}
