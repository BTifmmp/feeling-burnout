import { View, Text } from 'react-native'
import React from 'react'
import SafeAreaView from '@/components/base/MySafeArea';
import Animated from 'react-native-reanimated';
import RelaxColorCard from '@/components/pages/relax/RelaxColorCard';
import { Card } from '@/components/base/Card';
import { Button } from '@/components/base/Button';
import { router } from 'expo-router';

export default function Relax() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={{ top: true }}>
      <Animated.ScrollView contentContainerClassName="p-sides">
        <Text className="text-3xl text-text-primary font-bold mt-1">Relax & Mindfulness</Text>
        <Text className="text-lg text-text-secondary mb-8">Explore techniques to calm your mind and body.</Text>
        <RelaxColorCard variant='meditation' />
        <Card className='justify-center mb-3 py-6 px-6'>
          <View className='flex-row items-center'><Text className='text-lg text-text-primary font-semibold'>Relaxation Techniques</Text></View>
        </Card>
        <Card className='justify-center mb-3 py-6 px-6'>
          <Text className='text-lg text-text-primary font-semibold'>Relaxation Techniques</Text>
        </Card>
        <Card className='justify-center mb-10 py-6 px-6'>
          <Text className='text-lg text-text-primary font-semibold'>Relaxation Techniques</Text>
        </Card>

        <RelaxColorCard variant='breathing' />
        <Card className='justify-center mb-3 py-6 px-6'>
          <View className='flex-row items-center'><Text className='text-lg text-text-primary font-semibold'>Relaxation Techniques</Text></View>
        </Card>
        <Card className='justify-center mb-3 py-6 px-6 '>
          <Text className='text-lg text-text-primary font-semibold'>Relaxation Techniques</Text>
        </Card>
        <Card className='justify-center mb-10 py-6 px-6'>
          <Text className='text-lg text-text-primary font-semibold'>Relaxation Techniques</Text>
        </Card>

        <RelaxColorCard variant='break' />
        <Button onPress={() => { router.push('/meditation') }} variant='highlight100' style={{ marginBottom: 12, borderRadius: 24, paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-between' }}>
          <View className='flex-row items-center'><Text className='text-lg text-text-primary font-semibold'>Relaxation Techniques</Text></View>
        </Button>
        <Card className='justify-center mb-3 py-6 px-6'>
          <Text className='text-lg text-text-primary font-semibold'>Relaxation Techniques</Text>
        </Card>
        <Card className='justify-center mb-3 py-6 px-6'>
          <Text className='text-lg text-text-primary font-semibold'>Relaxation Techniques</Text>
        </Card>
        <Card className='justify-center mb-10 py-6 px-6'>
          <Text className='text-lg text-text-primary font-semibold'>Relaxation Techniques</Text>
        </Card>
      </Animated.ScrollView>
    </SafeAreaView>
  );
}