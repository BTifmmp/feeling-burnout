import { View, Text, TextInput } from 'react-native';
import { useState } from 'react';
import { Button } from '@/components/base/Button';
import { Card } from '@/components/base/Card';
import { useColorScheme } from 'nativewind';
import MoodBadge, { MoodType } from '@/components/pages/journal/MoodBadge';
import { Pressable } from 'react-native-gesture-handler';

interface JournalEntryBoxProps {
  className?: string;
}

export default function JournalEntryBox({ className }: JournalEntryBoxProps) {
  const [entry, setEntry] = useState('');
  const [moodBadge, setMoodBadge] = useState<'neutral' | 'positive' | 'negative'>('neutral');

  const { colorScheme = 'light' } = useColorScheme();
  const flairs: MoodType[] = ['positive', 'neutral', 'negative'];

  return (
    <Card className={className}>
      {/* Bold Encouraging Text */}
      <Text className="text-lg text-text-secondary mb-3">
        Journaling is a powerful tool to process emotions, reflect on your experiences, and recognize the victories, big or small, that shape your journey.
      </Text>

      <Text className="text-lg text-text-primary font-medium mb-3 mt-4">
        How was your day?
      </Text>

      {/* Flair Selector */}
      <View className="flex-row gap-2 mb-3">
        {flairs.map((badge) => {
          const isSelected = moodBadge === badge;
          return (
            <Pressable
              key={badge}
              onPress={() => setMoodBadge(badge as any)}>
              <MoodBadge mood={badge} isSelected={isSelected} containerClassName='!py-1' textClassName='!text-base font-normal' inactiveColor='bg-gray-highlight-100' />
            </Pressable>
          );
        })}
      </View>

      <TextInput
        className="bg-gray-highlight-100 h-36 rounded-2xl p-4 text-base text-text-primary"
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
        <Button disabled={!(entry.length > 0)} style={{ paddingVertical: 6, paddingHorizontal: 16 }} textStyle={{ fontSize: 14 }} variant='blue' title='Add' onPress={() => { }} />
      </View>
    </Card>
  );
}

