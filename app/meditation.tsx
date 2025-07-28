import React, { useEffect, useRef, useState } from 'react';
import SafeAreaView from '@/components/base/MySafeArea';
import { useColorScheme } from 'nativewind';
import Header from '@/components/base/Header';
import PulsatingCircles from '@/components/pages/relax/BreathingAnimation';
import { View, Text } from 'react-native';
import AudioSlider from '@/components/pages/relax/AudioSlider';
import { Button, IconButton } from '@/components/base/Button';
import { ChevronsLeft, CornerUpRight, CornerUpLeft, Forward, Play } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';
import MeditationAnimation from '@/components/pages/relax/MeditationAnimation';

export default function Meditation() {
  const { colorScheme = 'light' } = useColorScheme();


  return (
    <LinearGradient
      colors={['#353535', '#1a1a1a']}
      // colors={['#ffffff', '#f8f8f8']}

      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 p-sides color-[#272e3f]" edges={{ top: true, bottom: true }}>
        <Header title='' />
        <View className='px-8 justify-center flex-1 pb-20'>
          <View className='w-full aspect-square p-4'>
            <MeditationAnimation speed={0.5} />
          </View>
          <View>
            <Text className='text-2xl text-text-primary font-bold mb-4 mt-16'>Guided Meditation</Text>
            <AudioSlider />
            <View className='items-center'>
              <Button variant='white' style={{ paddingVertical: 18, paddingHorizontal: 18, borderRadius: 999 }}>
                <Play color={'#000'} size={34} fill={'#000'} />
              </Button>
            </View>
          </View>
        </View>
      </SafeAreaView >
    </LinearGradient>
  );
}
