import { View, Text } from 'react-native';
import React, { useState } from 'react';
import SafeAreaView from '@/components/base/MySafeArea';
import { format, isValid } from 'date-fns';
import { useColorScheme } from 'nativewind';
import Animated, { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Edit, Plus, Trash } from 'lucide-react-native';
import { Colors } from '@/constants/themes';
import { router } from 'expo-router';
import MoodBadge, { moodStyleMap, MoodType } from '@/components/pages/journal/MoodBadge';
import { Pressable } from 'react-native-gesture-handler';
import { Button, IconButton } from '@/components/base/Button';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useMenuStyles } from '@/styles/menuStyles';
import { useJournalEditStore } from '@/store/journalEditStore';
import { Database } from '@/utils/database.types';
import { journals$ } from '@/utils/SupaLegend';
import { deleteJournal } from '@/utils/queries';
import { observer, useComputed } from '@legendapp/state/react';
import { FlashList } from '@shopify/flash-list';
import { useSnackbar } from '@/components/base/Snackbar';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { ScrollView } from 'react-native-gesture-handler';


type JournalRow = Database['public']['Tables']['journals']['Row'];

const groupByMonth = (entries: JournalRow[]) => {
  const grouped: { [key: string]: JournalRow[] } = {};
  entries.forEach((entry) => {
    if (!isValid(new Date(entry.at_local_time_added))) return;
    const month = format(new Date(entry.at_local_time_added), 'MMMM yyyy');
    if (!grouped[month]) grouped[month] = [];
    grouped[month].push(entry);
  });
  return grouped;
};


const badgeOptions: MoodType[] = ['all', 'positive', 'neutral', 'negative'];


const Journal = observer(() => {
  const { colorScheme = 'light' } = useColorScheme();
  const [selectedBadge, setSelectedBadge] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');

  const flatData = useComputed(() => {
    const allEntries = Object.values(journals$.get() || {});
    const sorted = allEntries.sort((a, b) => {
      const aTime = new Date(a.at_local_time_added).getTime();
      const bTime = new Date(b.at_local_time_added).getTime();
      return bTime - aTime;
    });

    const filtered = selectedBadge === 'all'
      ? sorted
      : sorted.filter((e) => e.badge === selectedBadge);

    const grouped = groupByMonth(filtered);

    const flat: (string | typeof filtered[0])[] = [];
    Object.entries(grouped).forEach(([month, entries]) => {
      flat.push(month); // header
      flat.push(...entries); // items
    });

    return flat;
  }, [selectedBadge]);

  return (
    <SafeAreaView className="flex-1 bg-background" edges={{ top: true }}>
      <FlashList
        renderScrollComponent={ScrollView}
        data={flatData.get()}
        keyExtractor={(item) => (typeof item === 'string' ? item : item.id)}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80 }}
        estimatedItemSize={100}
        renderItem={({ item }) => {
          if (typeof item === 'string') {
            return (
              <Text className="text-xl text-text-primary font-medium mt-8 mb-2">
                {item}
              </Text>
            );
          } else {
            return (
              <View key={item.id}>
                <JournalEntry entry={item} />
              </View>
            );
          }
        }}
        ItemSeparatorComponent={({ leadingItem, trailingItem }) => (
          typeof trailingItem === 'string' || typeof leadingItem === 'string' ? null :
            <View className='py-2 mb-2 border-b-hairline border-gray-highlight-300' />
        )
        }
        ListEmptyComponent={
          <Text className="text-2xl text-text-primary mt-8">No journal entries</Text>
        }
        ListHeaderComponent={
          <>
            <Text className="text-4xl text-text-primary font-bold mb-2 mt-1 pt-sides">
              Journal
            </Text>
            <Button
              variant='highlight100'
              style={{
                marginTop: 12,
                paddingVertical: 10,
                paddingHorizontal: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
              onPress={() => router.push('/journal-entry')}
            >
              <Text className="ml-2 text-lg text-text-primary font-medium">
                Add Entry
              </Text>
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
                    <Pressable
                      key={badge}
                      onPress={() => setSelectedBadge(badge)}
                    >
                      <MoodBadge
                        mood={badge}
                        isSelected={isSelected}
                        containerClassName="px-4 py-2"
                      />
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
});

export default Journal;


/////////////////////////////////////
// JournalEntry component
/////////////////////////////////////
interface JournalEntryProps {
  entry: JournalRow;
}

export function RightAction(onPressDelete: () => void, onPressEdit: () => void) {
  return (progress: SharedValue<number>, dragX: SharedValue<number>) => {
    const { colorScheme = 'light' } = useColorScheme();
    const myColors = Colors[colorScheme];

    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: dragX.value + 100 }],
      };
    });

    return (
      <Animated.View style={styleAnimation}>
        <View style={{ width: 100 }} className='rounded-2xl flex-row items-center justify-center h-full gap-2'>
          <IconButton onPress={onPressDelete} variant='highlight200' icon={<Trash color={myColors.textPrimary} size={20} />} />
          <IconButton onPress={onPressEdit} variant='highlight200' icon={<Edit color={myColors.textPrimary} size={20} />} />
        </View>
      </Animated.View>
    );
  };
}


function JournalEntry({ entry }: JournalEntryProps) {
  const flairClass = moodStyleMap[entry.badge as Exclude<MoodType, 'all'>] || 'text-primary';
  const { colorScheme = 'light' } = useColorScheme();
  const swipeRef = React.useRef<any>(null);
  const { setEditingEntry } = useJournalEditStore();
  const menuRef = React.useRef<Menu>(null);
  const menuStyles = useMenuStyles();
  const snackbar = useSnackbar();

  const handleDelete = () => {
    deleteJournal(entry.id);
    snackbar({
      message: 'Journal entry deleted!',
      type: 'info',
      duration: 3000,
    });
    swipeRef.current?.close();
  }
  const handleEdit = () => {
    setEditingEntry(entry);
    router.push('/edit-journal-entry');
    swipeRef.current?.close();
  }


  return (
    <View>
      <Swipeable
        // enabled={false}
        ref={swipeRef}
        dragOffsetFromRightEdge={40}
        rightThreshold={60}
        friction={2}
        renderRightActions={RightAction(handleDelete, handleEdit)}
      >
        <View className='absolute left-3 top-3 z-10'>
          <Menu ref={menuRef}>
            <MenuTrigger style={{ marginLeft: 10 }} />
            <MenuOptions customStyles={{ optionsContainer: menuStyles.optionsContainer }}>
              <MenuOption onSelect={handleDelete}>
                <View style={menuStyles.optionContainer}>
                  <Trash size={18} color={Colors[colorScheme].textPrimary} />
                  <Text style={menuStyles.optionText}>Delete Entry</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={handleEdit}>
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
              {isValid(new Date(entry.at_local_time_added)) ? format(new Date(entry.at_local_time_added).toDateString(), 'EEE d') : 'Invalid Date'}
            </Text>
            {
              colorScheme === 'dark'
                ?
                <View className={`px-2 py-0.5 rounded-full self-start mt-2 border border-${flairClass} opacity-80`}>
                  <Text className={`text-xs text-${flairClass} font-medium capitalize`}>{entry.badge}</Text>
                </View>
                :
                <View className={`px-2 py-0.5 rounded-full self-start mt-2 bg-${flairClass}`}>
                  <Text className={`text-xs text-text-full font-medium capitalize`}>{entry.badge}</Text>
                </View>
            }
            <Text className="text-lg text-text-secondary leading-relaxed mt-2">
              {entry.entry}
            </Text>
          </View>
        </Pressable>
      </Swipeable >
    </View >
  )
}