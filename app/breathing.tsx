import React, { useState } from 'react';
import SafeAreaView from '@/components/base/MySafeArea';
import { useColorScheme } from 'nativewind';
import Header from '@/components/base/Header';
import BreathingAnimation from '@/components/pages/relax/BreathingAnimation';
import { View } from 'react-native';
import { IconButton } from '@/components/base/Button';
import { Play } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

export default function Meditation() {
  const { colorScheme = 'light' } = useColorScheme();
  const [isButtonVisible, setIsButtonVisible] = useState(true);

  return (
    <LinearGradient
      colors={['#353535', '#1a1a1a']}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1 p-sides color-[#1a1a1a]" edges={{ top: true, bottom: true }}>
        <Header title='' />
        <View className='px-12 justify-center flex-1 pb-20'>
          <View className='w-full aspect-square mb-[30%]'>
            <BreathingAnimation />
          </View>
          <View className='flex-row items-center justify-center'>
            {isButtonVisible ? (
              <IconButton
                onPress={() => setIsButtonVisible(false)}
                icon={<Play color={'#fff'} size={44} fill={'#fff'} />}
                variant='highlight100'
                style={{
                  paddingVertical: 18,
                  paddingHorizontal: 18,
                  borderRadius: 999,
                  opacity: isButtonVisible ? 1 : 0,
                }}
              />
            ) : <View className='items-center opacity-0 p-[18px]'><Play color={'#fff'} size={44} fill={'#fff'} /></View>}
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
