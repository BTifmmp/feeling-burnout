import React, { useState } from 'react';
import SafeAreaView from '@/components/base/MySafeArea';
import { useColorScheme } from 'nativewind';
import Header from '@/components/base/Header';
import BreathingAnimation from '@/components/pages/relax/BreathingAnimation';
import { View } from 'react-native';
import { IconButton } from '@/components/base/Button';
import { Play } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useBreathingStore } from '@/store/breathingStore';
import Animated, { FadeOut } from 'react-native-reanimated';
import { breathingSchemas } from '@/constants/breathing';
import { router } from 'expo-router';

const gradients = {
  dark: ['#353535', '#1a1a1a'],
  light: ['#f5f5f5', '#eaeaea'],
};

export default function Breathing() {
  const { colorScheme = 'light' } = useColorScheme();
  const { selectedBreathing } = useBreathingStore();

  if (!selectedBreathing.id) router.back(); // Handle case where no breathing is selected

  const [play, setPlay] = useState(false);

  const [isButtonVisible, setIsButtonVisible] = useState(true);

  return (
    <LinearGradient colors={gradients[colorScheme] as any} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 p-sides" edges={{ top: true, bottom: true }}>
        <Header title={selectedBreathing.name || ''} />
        <View className="px-8 justify-center flex-1 pb-20">
          <View className="w-full aspect-square mb-[30%]">
            <BreathingAnimation schema={breathingSchemas[selectedBreathing.id || 'box-breathing']} play={play} />
          </View>
          <View className="flex-row items-center justify-center">
            {isButtonVisible ? (
              <Animated.View exiting={FadeOut}>
                <IconButton
                  onPress={() => { setIsButtonVisible(false); !play && setPlay(true); }}
                  icon={<Play color={colorScheme === 'dark' ? '#fff' : '#000'} size={44} fill={colorScheme === 'dark' ? '#fff' : '#000'} />}
                  variant="highlight200"
                  style={{
                    paddingVertical: 18,
                    paddingHorizontal: 18,
                    borderRadius: 999,
                    opacity: isButtonVisible ? 1 : 0,
                  }}
                />
              </Animated.View>
            ) : (
              <View className="items-center opacity-0 p-[18px]">
                <Play size={44} />
              </View>
            )}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
