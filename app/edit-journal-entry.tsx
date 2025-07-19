import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import SafeAreaView from '@/components/base/MySafeArea';
import { Button } from '@/components/base/Button';
import { useColorScheme } from 'nativewind';
import { router } from 'expo-router';
import Animated from 'react-native-reanimated';
import MoodBadge, { MoodType } from '@/components/pages/journal/MoodBadge';
import { Pressable } from 'react-native-gesture-handler';
import Header from '@/components/base/Header';
import { useJournalEditStore } from '@/store/journalEditStore';

export default function EditJournalEntry() {
  const { colorScheme = 'light' } = useColorScheme();
  const { editingEntry } = useJournalEditStore();

  const [entry, setEntry] = useState('');
  const [selectedBadge, setSelectedBadge] = useState<MoodType>('positive');

  const badgeOptions: MoodType[] = ['positive', 'neutral', 'negative'];

  // ⏬ Load entry into state on mount
  useEffect(() => {
    if (editingEntry) {
      setEntry(editingEntry.content || '');
      setSelectedBadge(editingEntry.badge as MoodType);
    }
  }, [editingEntry]);

  const handleSave = () => {
    console.log('Saved entry:', {
      ...editingEntry,
      content: entry,
      flair: selectedBadge,
    });
    router.back(); // You can replace this with actual update logic
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={{ top: true, bottom: true }}>
      {/* ───── Header ───── */}
      <Header
        title="Edit Entry"
        headerRight={
          <Button
            variant="blue"
            style={{ paddingHorizontal: 12, paddingVertical: 6 }}
            textStyle={{ fontSize: 14, fontWeight: '500' }}
            title="Save"
            onPress={handleSave}
          />
        }
      />

      <View className="px-sides mb-2">
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2.5 flex-row mt-2"
        >
          {badgeOptions.map((badge) => {
            const isSelected = badge === selectedBadge;
            return (
              <Pressable key={badge} onPress={() => setSelectedBadge(badge)}>
                <MoodBadge
                  mood={badge}
                  isSelected={isSelected}
                  containerClassName="px-4 !py-2"
                  textClassName="!text-base"
                />
              </Pressable>
            );
          })}
        </Animated.ScrollView>
      </View>

      {/* ───── Content ───── */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 px-sides pb-5">
          <TextInput
            className="text-xl text-text-primary"
            multiline
            placeholder="What’s on your mind today?"
            placeholderTextColor={colorScheme === 'light' ? '#00000099' : '#ffffff99'}
            value={entry}
            onChangeText={setEntry}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
