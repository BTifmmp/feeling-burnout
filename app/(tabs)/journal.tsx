import { View, Text } from 'react-native';
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
import { Database } from '@/utils/database.types';
import { journals$ } from '@/utils/SupaLegend';
import { deleteJournal } from '@/utils/queries';
import { observer } from '@legendapp/state/react';
import { FlashList } from '@shopify/flash-list';

type JournalRow = Database['public']['Tables']['journals']['Row'];

const groupByMonth = (entries: JournalRow[]) => {
  const grouped: { [key: string]: JournalRow[] } = {};
  entries.forEach((entry) => {
    const month = format(entry.at_local_time_added, 'MMMM yyyy');
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(entry);
  });
  return grouped;
};


const badgeOptions: MoodType[] = ['all', 'positive', 'neutral', 'negative'];


const Journal = observer(() => {
  const { colorScheme = 'light' } = useColorScheme();
  const [selectedBadge, setSelectedBadge] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

  const entries = Object.values(journals$.get() || {});

  const sortedEntries = entries.sort((a, b) => {
    return b.at_local_time_added.getTime() - a.at_local_time_added.getTime()
  });


  const filteredEntries = selectedBadge === 'all'
    ? sortedEntries
    : sortedEntries.filter((entry) => entry.badge === selectedBadge);

  const groupedEntries = groupByMonth(filteredEntries);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={{ top: true }}>
      <FlashList
        data={Object.entries(groupedEntries)}
        keyExtractor={([month]) => month}
        estimatedItemSize={200}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}
        renderItem={({ item: [month, entries] }) => (
          <View key={month}>
            <Text className="text-xl text-text-primary font-medium mt-8 mb-2">{month}</Text>
            {entries.map((entry, index) => (
              <View key={entry.id}>
                <JournalEntry
                  date={entry.at_local_time_added}
                  id={entry.id}
                  content={entry.entry}
                  badge={entry.badge as Exclude<MoodType, 'all'>}
                  colorScheme={colorScheme}
                />
                {index !== entries.length - 1 && (
                  <View className="border-b-hairline border-gray-highlight-300" />
                )}
              </View>
            ))}
          </View>
        )}
        ListEmptyComponent={<View><Text className="text-2xl  text-text-primary mt-8">No journal entries</Text></View>}
        ListHeaderComponent={
          <>
            <Text className="text-4xl text-text-primary font-bold mb-2 mt-1 pt-sides">Journal</Text>
            <Button
              variant="highlight100"
              style={{
                marginTop: 12,
                paddingVertical: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              onPress={() => router.push('/journal-entry')}
            >
              <Text className="ml-2 text-lg text-text-primary font-medium">Add Entry</Text>
              <Plus color={Colors[colorScheme].textPrimary} />
            </Button>

            <Animated.ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              className="mt-5"
            >
              <View className="flex-row gap-2.5">
                {badgeOptions.map((badge) => {
                  const isSelected = badge === selectedBadge;
                  return (
                    <Pressable key={badge} onPress={() => setSelectedBadge(badge as any)}>
                      <MoodBadge mood={badge} isSelected={isSelected} containerClassName="px-4 py-2" />
                    </Pressable>
                  );
                })}
              </View>
            </Animated.ScrollView>
          </>
        }
      />
    </SafeAreaView>
  );
})

export default Journal;


/////////////////////////////////////
// JournalEntry component
/////////////////////////////////////
interface JournalEntryProps {
  id: string;
  date: Date;
  content: string;
  badge: Exclude<MoodType, 'all'>;
  colorScheme: 'light' | 'dark';
}


function JournalEntry({ date, id, content, badge, colorScheme }: JournalEntryProps) {
  const flairClass = moodStyleMap[badge as Exclude<MoodType, 'all'>] || 'text-primary';
  const { setEditingEntry } = useJournalEditStore();
  const menuRef = React.useRef<Menu>(null);
  const menuStyles = useMenuStyles();

  return (
    <View>
      <View className='absolute left-3 top-3 z-10'>
        <Menu ref={menuRef}>
          <MenuTrigger style={{ marginLeft: 10 }} />
          <MenuOptions customStyles={{ optionsContainer: menuStyles.optionsContainer }}>
            <MenuOption onSelect={() => deleteJournal(id)}>
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
            {format(date.toDateString(), 'EEE d')}
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