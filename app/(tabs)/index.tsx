import { View, Text } from 'react-native'
import React from 'react'
import SafeAreaView from '@/components/base/MySafeArea'
import StatusBarColor from '@/components/base/StatusBarColor'
import BottomWaveCard from '@/components/pages/main/BottomWaveCard'
import { useColorScheme } from 'nativewind'
import { Colors } from '@/constants/themes'
import JournalEntryBox from '@/components/pages/main/JournalEntryBox'
import Animated from 'react-native-reanimated'
import { TopCardTitle } from '@/components/base/Card'
import InfoCard from '@/components/pages/main/ColorCardButton'
import MoodGrid from '@/components/pages/main/MoodGrid'
import GoalBoard from '@/components/pages/main/GoalBoard'
import { Button, IconButton } from '@/components/base/Button'
import { Calendar, ChevronRight } from 'lucide-react-native'
import { StyleSheet } from 'react-native';
import { router } from 'expo-router'
import { addJournal } from '@/utils/queries'
import EasyAccessMoods from '@/components/pages/main/EasyAccessMoods'

export default function HomeScreen() {
  const { colorScheme = "light" } = useColorScheme();

  return (
    <View className='flex-1'>
      <StatusBarColor color={Colors[colorScheme].cardReversed} />
      <SafeAreaView className="flex-1" edges={{ top: true }}>
        <Animated.ScrollView className='flex-1 bg-card-reversed'>
          <View className='bg-background-reversed'>
            <BottomWaveCard>
              <View className='flex-row justify-between items-start'>
                <Text className='text-4xl font-extrabold text-text-primary mt-1'>
                  Hi user
                </Text>
                <IconButton onPress={() => { router.push('mood-calendar') }} icon={<Calendar size={22} color={Colors[colorScheme].textPrimary} />} />

              </View>
              <Text className='text-xl text-text-secondary mt-2'>
                How are you feeling today?
              </Text>
              <EasyAccessMoods />
            </BottomWaveCard>

            <View className='px-sides mt-10 mb-8'>
              <View className='flex-row gap-4'>
                <InfoCard type='chat' containerClass='flex-1' />
                <InfoCard type='breathing' containerClass='flex-1' />
              </View>

              <TopCardTitle title='Goals & Bounderies' className='mt-10' />
              <GoalBoard className='bg-card-reversed' />

              <TopCardTitle title='Mood Overview' className='mt-10' />
              <MoodGrid className='bg-card-reversed' />
              <Button variant='cardReversed' style={styles.buttonRow} onPress={() => {
                // router.navigate('/mood-calendar');
                addJournal(
                  'Today was a good day, I felt productive and happy.', 'positive');
                // syncState(journals$).sync();
                // setMoodModalVisible(true);
              }} >
                <Text className='text-text-primary text-base font-semibold'>Mood Calendar</Text>
                <ChevronRight color={Colors[colorScheme].textPrimary} size={22} />
              </Button>

              <TopCardTitle title='Your Journal' className='mt-10' />
              <JournalEntryBox className='bg-card-reversed' />

              <Button variant='cardReversed' style={styles.buttonRow} onPress={() => { router.navigate('/journal') }} >
                <Text className='text-text-primary text-base font-semibold'>Open Journal</Text>
                <ChevronRight color={Colors[colorScheme].textPrimary} size={22} />
              </Button>
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