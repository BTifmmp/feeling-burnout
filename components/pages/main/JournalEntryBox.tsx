import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Button } from '@/components/base/Button';
import { Card } from '@/components/base/Card';
import { useColorScheme } from 'nativewind';

interface JournalEntryBoxProps {
  className?: string;
}

export default function JournalEntryBox({ className }: JournalEntryBoxProps) {
  const [entry, setEntry] = useState('');

  const { colorScheme = 'light' } = useColorScheme();

  return (
    <Card className={className}>
      {/* Bold Encouraging Text */}
      <Text className="text-lg text-text-secondary mb-3">
        Journaling is a powerful tool to process emotions, reflect on your experiences, and recognize the victories, big or small, that shape your journey.
      </Text>

      <Text className="text-lg text-text-primary font-medium mb-3 mt-4">
        How was your day?
      </Text>

      <TextInput
        className="bg-gray-highlight-100 h-36 rounded-xl p-4 text-base text-text-primary"
        multiline
        numberOfLines={4}
        placeholder="Achievements, challenges, or anything on your mind..."
        placeholderTextColor={colorScheme === 'light' ? '#00000099' : '#ffffff99'}
        style={{ textAlignVertical: 'top' }}
        value={entry}
        onChangeText={setEntry}
      />

      {/* Done Button */}
      <View className="flex-row justify-end mt-4">
        <Button onClick={() => { }} label='Add' />
      </View>
    </Card>
  );
}

