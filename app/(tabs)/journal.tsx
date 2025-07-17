import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { format, parseISO } from 'date-fns';
import { useColorScheme } from 'nativewind';
import Animated from 'react-native-reanimated';
import { CalendarDaysIcon, Plus } from 'lucide-react-native';
import { Colors } from '@/constants/themes';

const dummyEntries = [
  { id: 1, date: '2025-07-15', content: 'Went on a long walk and cleared my head.', flair: 'positive' },
  { id: 2, date: '2025-07-12', content: 'Started reading a new book about design thinking.', flair: 'positive' },
  { id: 3, date: '2025-07-03', content: 'Felt a bit overwhelmed, so I took a day off screens.', flair: 'negative' },
  { id: 4, date: '2025-06-28', content: 'Brainstormed ideas for the new project. Excited!', flair: 'positive' },
  { id: 5, date: '2025-06-21', content: 'Watched the sunset and felt really calm.', flair: 'neutral' },
  { id: 6, date: '2025-06-17', content: 'Had a tough conversation, but it went well.', flair: 'positive' },
  { id: 7, date: '2025-06-05', content: 'Sprinted through work. Felt productive.', flair: 'positive' },
  { id: 8, date: '2025-05-29', content: 'Visited my favorite café after weeks.', flair: 'neutral' },
  { id: 9, date: '2025-05-14', content: 'Practiced gratitude. Listened to birds in the morning.', flair: 'positive' },
  { id: 10, date: '2025-05-01', content: 'New month, new intentions. Writing goals down.', flair: 'neutral' },
];

// Flair badge style map
const flairStyleMap = {
  positive: 'mood-colors-4',
  negative: 'mood-colors-0',
  neutral: 'mood-colors-2',
};

const groupByMonth = (entries: typeof dummyEntries) => {
  const grouped: { [key: string]: typeof dummyEntries } = {};
  entries.forEach((entry) => {
    const date = parseISO(entry.date);
    const month = format(date, 'MMMM yyyy');
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(entry);
  });
  return grouped;
};

const flairOptions = ['all', 'positive', 'negative', 'neutral'];

export default function Journal() {
  const { colorScheme = 'light' } = useColorScheme();
  const [selectedFlair, setSelectedFlair] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

  const filteredEntries = selectedFlair === 'all'
    ? dummyEntries
    : dummyEntries.filter((entry) => entry.flair === selectedFlair);

  const groupedEntries = groupByMonth(filteredEntries);


  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView contentContainerClassName="p-sides">

        <Text className="text-4xl text-text-primary font-bold mb-2 mt-4">Journal</Text>

        <TouchableOpacity className="bg-gray-highlight-100 rounded-full py-3 mt-2" onPress={() => console.log('Add new entry')}>
          <View className="flex-row items-center bg-primary px-5 rounded-full justify-between">
            <Text className="ml-2 text-lg text-text-primary font-medium">Add Entry</Text>
            <Plus color={Colors[colorScheme].textPrimary} />
          </View>
        </TouchableOpacity>

        <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row mt-6">
          {flairOptions.map((option) => {
            const isSelected = selectedFlair === option;
            const flairClass = option !== 'all' ? flairStyleMap[option as keyof typeof flairStyleMap] : 'text-primary';
            return (
              <TouchableOpacity
                key={option}
                onPress={() => setSelectedFlair(option as any)}
                className={`mr-3 px-4 py-2 rounded-full ${isSelected
                  ? `bg-${flairClass}`
                  : 'bg-gray-highlight-100'
                  }`}
              >
                <Text className={`capitalize text-lg font-medium ${isSelected
                  ? (colorScheme === 'light' && option === 'all' ? 'text-white' : 'text-black')
                  : 'text-text-secondary'
                  }`}>
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </Animated.ScrollView>

        {Object.entries(groupedEntries).map(([month, entries]) => (
          <View key={month}>
            <Text className="text-xl text-text-primary font-medium mt-8 mb-2">{month}</Text>
            {entries.map((entry, index) => {
              const date = parseISO(entry.date);
              const flairClass = flairStyleMap[entry.flair as keyof typeof flairStyleMap];

              return (
                <View key={entry.id}>
                  <View className="py-3">
                    <Text className="text-base font-medium text-text-primary">
                      {format(date, 'EEE d')}
                    </Text>
                    {
                      colorScheme === 'dark'
                        ?
                        <View className={`px-2 py-0.5 rounded-full self-start mt-2 border border-${flairClass} opacity-80`}>
                          <Text className={`text-xs text-${flairClass} font-medium capitalize`}>{entry.flair}</Text>
                        </View>
                        :
                        <View className={`px-2 py-0.5 rounded-full self-start mt-2 bg-${flairClass}`}>
                          <Text className={`text-xs text-text-full font-medium capitalize`}>{entry.flair}</Text>
                        </View>
                    }
                    <Text className="text-lg text-text-secondary leading-relaxed mt-2">
                      {entry.content}
                    </Text>
                  </View>
                  {index !== entries.length - 1 && (
                    <View className="border-b-hairline border-gray-highlight-300" />
                  )}
                </View>
              );
            })}
          </View>
        ))}

      </ScrollView>
    </SafeAreaView>
  );
}
