import { View, Text, Alert } from 'react-native';
import React, { useState } from 'react';
import SafeAreaView from '@/components/base/MySafeArea';
import { format, parseISO } from 'date-fns';
import { useColorScheme } from 'nativewind';
import Animated from 'react-native-reanimated';
import { Edit, Plus, Trash } from 'lucide-react-native';
import { Colors } from '@/constants/themes';
import { router } from 'expo-router';
import MoodBadge, { moodStyleMap, MoodType } from '@/components/pages/journal/MoodBadge';
import { Pressable } from 'react-native-gesture-handler';
import { Button } from '@/components/base/Button';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useMenuStyles } from '@/styles/menuStyles';
import { useJournalEditStore } from '@/store/journalEditStore';

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


export default function Journal() {
  const { colorScheme = 'light' } = useColorScheme();
  const [selectedBadge, setSelectedBadge] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

  const filteredEntries = selectedBadge === 'all'
    ? dummyEntries
    : dummyEntries.filter((entry) => entry.flair === selectedBadge);

  const groupedEntries = groupByMonth(filteredEntries);

  const badgeOptions: MoodType[] = ['all', 'positive', 'neutral', 'negative'];

  return (
    <SafeAreaView className="flex-1 bg-background" edges={{ top: true }}>
      <Animated.ScrollView contentContainerClassName="p-sides">
        <Text className="text-4xl text-text-primary font-bold mb-2 mt-1">Journal</Text>

        <Button variant='highlight100'
          style={{ marginTop: 12, paddingVertical: 12, flexDirection: 'row', justifyContent: 'space-between' }}
          onPress={() => router.push('/journal-entry')}>
          <Text className="ml-2 text-lg text-text-primary font-medium">Add Entry</Text>
          <Plus color={Colors[colorScheme].textPrimary} />
        </Button>

        <Animated.ScrollView horizontal showsHorizontalScrollIndicator={false} className="mt-6">
          <View className='flex-row gap-2.5'>
            {badgeOptions.map((badge) => {
              const isSelected = badge === selectedBadge;
              return (
                <Pressable
                  key={badge}
                  onPress={() => setSelectedBadge(badge as any)}>
                  <MoodBadge mood={badge} isSelected={isSelected} containerClassName='px-4 py-2' />
                </Pressable>
              );
            })}
          </View>
        </Animated.ScrollView>

        {Object.entries(groupedEntries).map(([month, entries]) => (
          <View key={month}>
            <Text className="text-xl text-text-primary font-medium mt-8 mb-2">{month}</Text>
            {entries.map((entry, index) => {
              const date = parseISO(entry.date);

              return (
                <View key={entry.id}>
                  <JournalEntry
                    key={entry.id}
                    date={date}
                    id={entry.id}
                    content={entry.content}
                    badge={entry.flair as Exclude<MoodType, 'all'>}
                    colorScheme={colorScheme}
                  />
                  {index !== entries.length - 1 && <View className='border-b-hairline border-gray-highlight-300' />}
                </View>
              );
            })}
          </View>
        ))}

      </Animated.ScrollView>
    </SafeAreaView>
  );
}

/////////////////////////////////////
// JournalEntry component
/////////////////////////////////////
interface JournalEntryProps {
  id: number;
  date: Date;
  content: string;
  badge: Exclude<MoodType, 'all'>;
  colorScheme: 'light' | 'dark';
}


function JournalEntry({ date, id, content, badge, colorScheme }: JournalEntryProps) {
  const flairClass = moodStyleMap[badge as Exclude<MoodType, 'all'>] || 'text-primary';
  const { editingEntry, setEditingEntry } = useJournalEditStore();
  const menuRef = React.useRef<Menu>(null);
  const menuStyles = useMenuStyles();

  return (
    <View>
      <View className='absolute left-1/4 top-3 z-10'>
        <Menu ref={menuRef}>
          <MenuTrigger style={{ marginLeft: 10 }} />
          <MenuOptions customStyles={{ optionsContainer: menuStyles.optionsContainer }}>
            <MenuOption onSelect={() => Alert.alert('Delete Chat')}>
              <View style={menuStyles.optionContainer}>
                <Trash size={18} color={Colors[colorScheme].textPrimary} />
                <Text style={menuStyles.optionText}>Delete Entry</Text>
              </View>
            </MenuOption>
            <MenuOption onSelect={() => { setEditingEntry({ id, content, badge, date }); router.push('/edit-journal-entry'); }}>
              <View style={menuStyles.optionContainer}>
                <Edit size={18} color={Colors[colorScheme].textPrimary} />
                <Text style={menuStyles.optionText}>Edit</Text>
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
      <Pressable onLongPress={() => { menuRef.current?.open() }}>
        <View className="py-3">
          <Text className="text-base font-medium text-text-primary">
            {format(date, 'EEE d')}
          </Text>
          {
            colorScheme === 'dark'
              ?
              <View className={`px-2 py-0.5 rounded-full self-start mt-2 border border-${flairClass} opacity-80`}>
                <Text className={`text-xs text-${flairClass} font-medium capitalize`}>{badge}</Text>
              </View>
              :
              <View className={`px-2 py-0.5 rounded-full self-start mt-2 bg-${flairClass}`}>
                <Text className={`text-xs text-text-full font-medium capitalize`}>{badge}</Text>
              </View>
          }
          <Text className="text-lg text-text-secondary leading-relaxed mt-2">
            {content}
          </Text>
        </View>
      </Pressable>
    </View >
  )
}