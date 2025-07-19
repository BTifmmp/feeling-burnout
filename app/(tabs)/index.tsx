import { View, Text } from 'react-native'
import React from 'react'
import SafeAreaView from '@/components/base/MySafeArea'
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
import ArticlesCard from '@/components/pages/main/ArticlesCard'
import { Button } from '@/components/base/Button'
import { ChevronRight } from 'lucide-react-native'
import { StyleSheet } from 'react-native';
import { router } from 'expo-router'

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
      <SafeAreaView className="flex-1" edges={{ top: true }}>
        <Animated.ScrollView className='flex-1 bg-card-reversed'>
          <View className='bg-background-reversed'>
            <BottomWaveCard>
              <Text className='text-4xl font-extrabold text-text-primary mt-1'>
                Hi user
              </Text>
              <Text className='text-xl text-text-secondary mt-2'>
                How are you feeling today?
              </Text>
              <MoodDaysBar moodData={exampleMoodData} />
              <Text className='text-3xl text-text-primary mt-6'>
                You logged your mood as <Text className='mt font-extrabold'>Happy</Text>.
              </Text>
              {/* <View className='mt-10 justify-center items-center'>
                <TouchableOpacity className='bg-gray-highlight-100 rounded-full py-2 px-4'>
                  <Text className='text-text-primary text-center'>Change Log</Text>
                </TouchableOpacity>
              </View> */}
            </BottomWaveCard>

            <View className='px-sides mt-10 mb-8'>
              <View className='flex-row gap-4'>
                <InfoCard type='chat' containerClass='flex-1' />
                <InfoCard type='breathing' containerClass='flex-1' />
              </View>

              <TopCardTitle title='Mood Overview' className='mt-10' />
              <MoodGrid moodData={exampleMoodData} className='bg-card-reversed' />
              <Button variant='cardReversed' style={styles.buttonRow} onPress={() => { router.navigate('/mood-calendar') }} >
                <Text className='text-text-primary text-base font-semibold'>Mood Calendar</Text>
                <ChevronRight color={Colors[colorScheme].textPrimary} size={22} />
              </Button>

              <TopCardTitle title='Your Journal' className='mt-10' />
              <JournalEntryBox className='bg-card-reversed' />

              <Button variant='cardReversed' style={styles.buttonRow} onPress={() => { router.navigate('/journal') }} >
                <Text className='text-text-primary text-base font-semibold'>Open Journal</Text>
                <ChevronRight color={Colors[colorScheme].textPrimary} size={22} />
              </Button>

              <TopCardTitle title='Discover More' className='mt-10' />
              <ArticlesCard className='bg-card-reversed' />
            </View>

          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </View >
  )
}

const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 999,
    marginTop: 10,
    paddingVertical: 14,
  },
});