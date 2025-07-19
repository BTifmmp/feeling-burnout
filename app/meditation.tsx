import React from 'react';
import SafeAreaView from '@/components/base/MySafeArea';
import { useColorScheme } from 'nativewind';
import Header from '@/components/base/Header';
import PulsatingCircles from '@/components/pages/relax/PulsatingCircle';
import { View, Text } from 'react-native';
import AudioSlider from '@/components/pages/relax/AudioSlider';
import { Button, IconButton } from '@/components/base/Button';
import { ChevronsLeft, CornerUpRight, CornerUpLeft, Forward, Play } from 'lucide-react-native';

export default function Meditation() {
  const { colorScheme = 'light' } = useColorScheme();

  return (
    <SafeAreaView className="flex-1 bg-background p-sides" edges={{ top: true, bottom: true }}>
      <Header title='' />
      <View className='px-8 justify-center flex-1 pb-20'>
        <View className='w-full aspect-square'>
          {/* <Text className="text-3xl text-text-primary font-bold mt-1 px-sides">Meditation</Text> */}
          <PulsatingCircles />
        </View>
        <View>
          <Text className='text-2xl text-text-primary font-bold mb-4 mt-16'>Guided Meditation</Text>
          <AudioSlider />
          <View className='items-center'>
            <Button variant='white' style={{ paddingVertical: 18, paddingHorizontal: 18, borderRadius: 24 }}>
              <Play color={'#000'} size={34} fill={'#000'} />
            </Button>
          </View>
        </View>
      </View>
    </SafeAreaView >
  );
}
