import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useCallback, useMemo, useState } from 'react';
import SafeAreaView from '@/components/base/MySafeArea';
import { format, isValid } from 'date-fns';
import { useColorScheme } from 'nativewind';
import Animated, { FadeIn, SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { Calendar, Edit, Plus, Trash, X } from 'lucide-react-native';
import { Colors } from '@/constants/themes';
import { router } from 'expo-router';
import MoodBadge, { moodStyleMap, MoodType } from '@/components/pages/journal/MoodBadge';
import { Button, IconButton } from '@/components/base/Button';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from 'react-native-popup-menu';
import { useMenuStyles } from '@/styles/menuStyles';
import { useJournalEditStore } from '@/store/journalEditStore';
import { journals$ } from '@/utils/SupaLegend';
import { deleteJournal } from '@/utils/queries';
import { observer, useComputed } from '@legendapp/state/react';
import { FlashList } from '@shopify/flash-list';
import { useSnackbar } from '@/components/base/Snackbar';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { Pressable } from 'react-native';
import MonthYearModal from '@/components/modals/MonthYearModal';
import { JournalRow } from '@/utils/types';

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

function filterByDate(entries: JournalRow[], dateString: string): JournalRow[] {
  return entries.filter((entry) => {
    const date = new Date(entry.at_local_time_added);
    if (!isValid(date)) return false;

    const [year, month] = dateString.split(' '); // e.g. ['2025', 'Any'] or ['2025', 'July']
    const entryYear = format(date, 'yyyy');
    const entryMonth = format(date, 'MMMM');

    if (month === 'Any') {
      return entryYear === year;
    } else {
      return entryYear === year && entryMonth === month;
    }
  });
}


const badgeOptions: MoodType[] = ['all', 'positive', 'neutral', 'negative'];


const Journal = observer(() => {
  const { colorScheme = 'light' } = useColorScheme();
  const [selectedBadge, setSelectedBadge] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');
  const [selectedBadgeDelay, setSelectedBadgeDelay] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all');


  const [version, setVersion] = useState(0);
  const [isDateModalVisible, setIsDateModalVisible] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedDateDelay, setSelectedDateDelay] = useState<string>('');

  const [hasJournalLoaded, setHasJournalLoaded] = useState(false);

  const flatData = useComputed(() => {
    if (!hasJournalLoaded && journals$.get() != undefined) {
      setHasJournalLoaded(true);
    }

    const allEntries = Object.values(journals$.get() || {});

    const filteredEntries = selectedDate === '' ? allEntries : filterByDate(allEntries, selectedDate);

    const sorted = filteredEntries.sort((a, b) => {
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

    setVersion((v) => v + 1); // trigger re-render on data change

    return flat;
  }, [selectedBadgeDelay, selectedDateDelay]);

  const onBadgeChange = (badge: MoodType) => {
    setSelectedBadge(badge);
    flatData.set([]);
    requestAnimationFrame(() => setSelectedBadgeDelay(badge));
  };

  const onDateChange = (date: string) => {
    setSelectedDate(date);
    flatData.set([]);
    requestAnimationFrame(() => setSelectedDateDelay(date));
  }

  const showModal = useCallback(() => {
    setIsDateModalVisible(true);
  }, []);

  const itemSeparator = useMemo(() => {
    return function Separator({ leadingItem, trailingItem }: { leadingItem: any; trailingItem: any }) {
      if (typeof trailingItem === 'string' || typeof leadingItem === 'string') return null;

      return (
        <View className='py-2 mb-2 border-b-hairline border-gray-highlight-300' />
      );
    };
  }, []);

  const listEmptyComponent = useMemo(() => {
    if (!hasJournalLoaded) {
      return (<View className="flex-1 mt-10 items-center justify-center">
        <ActivityIndicator />
      </View>)
    }
    return (
      <Text className="text-2xl text-text-primary mt-8">
        {selectedBadge === selectedBadgeDelay && selectedDate === selectedDateDelay && hasJournalLoaded ? 'No journal entries' : ''}
      </Text>
    );
  }, [selectedBadge, selectedBadgeDelay, selectedDate, selectedDateDelay, hasJournalLoaded]);

  const clearSelectedDate = useCallback(() => {
    onDateChange(''); // clear selected date
  }, [hasJournalLoaded]);

  const listHeaderComponent = useMemo(() => {
    return (
      <>
        <View className='flex-row justify-between mt-1'>
          <Text className="text-4xl text-text-primary font-bold mb-2 pt-sides">
            Journal
          </Text>
          <View className='justify-center'>
            <IconButton
              variant='ghost'
              onPress={showModal}
              icon={<Calendar size={22} color={Colors[colorScheme].textPrimary} />}
            />
          </View>
        </View>

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
                  onPress={() => onBadgeChange(badge as MoodType)}
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
        {selectedDate !== '' &&
          <View className='flex-row'>
            <View className="mt-4 flex-row items-center bg-gray-highlight-100 rounded-full overflow-hidden">
              <View className='bg-card px-4 py-2'>
                <Text className="text-base text-text-secondary">
                  {`${selectedDate}`}
                </Text>
              </View>
              <Pressable onPress={clearSelectedDate} className="bg-gray-highlight-100 px-3 pr-4">
                <X size={18} color={Colors[colorScheme].textPrimary} />
              </Pressable>
            </View>
          </View>}
      </>
    );
  }, [selectedBadge, colorScheme, selectedDate]);

  const renderItem = useCallback(({ item }: { item: string | JournalRow }) => {
    if (typeof item === 'string') {
      return (
        <Text className="text-2xl text-text-primary font-bold mt-8 mb-2">
          {item}
        </Text>
      );
    } else {
      return <JournalEntry entry={item} />;
    }
  }, []);

  const keyExtractor = useCallback((item: string | JournalRow) => {
    return typeof item === 'string' ? item : item.id;
  }, []);


  return (
    <View className='flex-1'>
      <View>
        <MonthYearModal
          isVisible={isDateModalVisible}
          onClose={() => { setIsDateModalVisible(false) }}
          onSelect={(date) => { onDateChange(date), setIsDateModalVisible(false) }} />
      </View>
      <SafeAreaView className="flex-1 bg-background" edges={{ top: true }}>
        <FlashList
          data={flatData.get()}
          extraData={version} // trigger re-render on data change
          keyExtractor={keyExtractor}
          contentContainerStyle={styles.container}
          estimatedItemSize={300}
          renderItem={renderItem}
          ItemSeparatorComponent={itemSeparator}
          ListEmptyComponent={listEmptyComponent}
          ListHeaderComponent={listHeaderComponent}
        />
      </SafeAreaView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: { paddingHorizontal: 20, paddingBottom: 80 }
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
    <Animated.View entering={FadeIn}>
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
    </Animated.View >
  )
}