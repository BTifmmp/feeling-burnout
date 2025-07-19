import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import SafeAreaView from '@/components/base/MySafeArea';
import { Button, IconButton } from '@/components/base/Button';
import { X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Colors } from '@/constants/themes';
import { router } from 'expo-router';
import Animated from 'react-native-reanimated';
import MoodBadge, { MoodType } from '@/components/pages/journal/MoodBadge';
import { BorderlessButton, Pressable } from 'react-native-gesture-handler';
import Header from '@/components/base/Header';

export default function JournalEntry() {
  const { colorScheme = 'light' } = useColorScheme();
  const [entry, setEntry] = useState('');
  const badgeOptions: MoodType[] = ['positive', 'neutral', 'negative'];
  const [selectedBadge, setSelectedBadge] =
    useState<'positive' | 'negative' | 'neutral'>('positive');

  return (
    <SafeAreaView className="flex-1 bg-background" edges={{ top: true, bottom: true }}>
      {/* ───── Header ───── */}

      <Header title='New Entry' headerRight={
        <Button
          disabled={entry.length === 0}
          variant='blue'
          style={{ paddingHorizontal: 12, paddingVertical: 6 }}
          textStyle={{ fontSize: 14, fontWeight: '500' }}
          title='Add'
          onPress={router.back}
        />
      } />

      <View className='px-sides mb-2'>
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2.5 flex-row mt-2"
        >
          {badgeOptions.map((badge) => {
            const isSelected = badge === selectedBadge;
            return (
              <Pressable
                key={badge}
                onPress={() => setSelectedBadge(badge as any)}
              >
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
      {/* KeyboardAvoidingView should wrap what needs to move, NOT the fixed header */}
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Use a ScrollView so the growing TextInput can scroll when tall */}
        {/* Card‑like container */}
        <View className='flex-1 px-sides pb-5'>
          {/* Mood selector row */}

          {/* Growing TextInput */}
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
    </SafeAreaView >
  );
}
