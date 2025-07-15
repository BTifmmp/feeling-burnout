import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import StatusBarColor from '@/components/base/StatusBarColor'
import BottomWaveCard from '@/components/pages/main/BottomWaveCard'
import { useColorScheme } from 'nativewind'
import { Colors } from '@/constants/themes'
import JournalEntryBox from '@/components/pages/main/JournalEntryBox'
import Animated from 'react-native-reanimated'
import MoodDaysBar from '@/components/pages/main/MoodDaysBar'
import { TopCardTitle } from '@/components/base/Card'
import InfoCard from '@/components/pages/main/ColorCardButton'
import MoodGrid from '@/components/pages/main/MoodGrid'
import { SubCardOpenButton } from '@/components/base/Button'
import ArticlesCard from '@/components/pages/main/ArticlesCard'

export default function HomeScreen() {
  const { colorScheme = "light" } = useColorScheme();

  const exampleMoodData = {
    '2025-07-01': 3,
    '2025-07-02': 1,
    '2025-07-03': 4,
    '2025-07-04': 2,
    '2025-07-05': 3,
    '2025-07-06': 1,
    '2025-07-07': 4,
    '2025-07-08': 0,
    '2025-07-09': 2,
    '2025-07-10': 3,
    '2025-07-11': 1,
    '2025-07-13': 2,
    '2025-07-15': 3,
    '2025-07-16': 4,
    '2025-07-18': 0,
    '2025-07-19': 2,
    '2025-07-20': 3,
    '2025-07-21': 1,
    '2025-07-23': 4,
    '2025-07-24': 3,
    '2025-07-25': 2,
    '2025-07-26': 1,
    '2025-07-27': 3,
    '2025-07-28': 0,
    '2025-07-29': 2,
    '2025-07-30': 4,
    '2025-07-31': 3,
  };


  return (
    <View className='flex-1'>
      <StatusBarColor color={Colors[colorScheme].cardReversed} />
      <SafeAreaView edges={['top']} className='flex-1'>
        <Animated.ScrollView className='flex-1 bg-card-reversed'>
          <View className='bg-background-reversed'>
            <BottomWaveCard>
              <Text className='text-4xl font-extrabold text-text-primary mt-4'>
                Hi user
              </Text>
              <Text className='text-xl text-text-secondary mt-2'>
                How are you feeling today?
              </Text>
              <MoodDaysBar moodData={exampleMoodData} />
              <Text className='text-3xl text-text-primary mt-6'>
                You logged your mood as <Text className='mt font-extrabold'>Happy</Text>.
              </Text>
              <View className='mt-10 justify-center items-center'>
                <TouchableOpacity className='border border-text-secondary rounded-full py-2 px-4'>
                  <Text className='text-text-primary text-center'>Change Log</Text>
                </TouchableOpacity>
              </View>
            </BottomWaveCard>

            <View className='px-sides mt-8 mb-8'>
              <View className='flex-row gap-4'>
                <InfoCard type='chat' containerClass='flex-1' />
                <InfoCard type='breathing' containerClass='flex-1' />
              </View>

              <TopCardTitle title='Mood Overview' className='mt-10' />
              <MoodGrid moodData={exampleMoodData} className='bg-card-reversed' />
              <SubCardOpenButton onClick={() => { }} label='Mood Calendar' className='mt-2 bg-card-reversed' />

              <TopCardTitle title='Your Journal' className='mt-10' />
              <JournalEntryBox className='bg-card-reversed' />
              <SubCardOpenButton onClick={() => { }} label='Open Journal' className='mt-2 bg-card-reversed' />

              <TopCardTitle title='Discover More' className='mt-10' />
              <ArticlesCard className='bg-card-reversed' />
            </View>

          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </View >
  )
}