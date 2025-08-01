import React from 'react';
import { View, Text, Image, ImageSourcePropType, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
import { Colors } from '@/constants/themes';

type CardType = 'chat' | 'breathing';

interface InfoCardProps {
  type: CardType;
  containerClass?: string; // Add containerClass prop
}

interface CardConfig {
  title: string;
  image: ImageSourcePropType;
  gradientLight: [string, string];
  gradientDark: [string, string];
  circlePosition: ViewStyle;
}

const cardConfig: Record<CardType, CardConfig> = {
  chat: {
    title: 'Guided Meditation',
    image: require('@/assets/chat.png'),
    gradientDark: ['#4766b5', '#4766b5'], // balanced soft dark blues
    gradientLight: ['#8fc4f9', '#b1d6fb'], // gentle, slightly pastel blues
    circlePosition: {
      right: -20,
      top: '-20%',
      marginTop: -32,
    },
  },
  breathing: {
    title: 'Breathing exercise',
    image: require('@/assets/breathing.png'),
    gradientDark: ['#d97e0f', '#d97e0f'], // less saturated warm oranges
    gradientLight: ['#f8a75e', '#fdd0a1'], // soft peachy pastel
    circlePosition: {
      right: -24,
      top: '50%',
      marginTop: -32,
    },
  },
};


export default function InfoCard({ type, containerClass }: InfoCardProps) {
  const { title, image, gradientLight, gradientDark, circlePosition } = cardConfig[type];
  const { colorScheme = 'light' } = useColorScheme();

  return (
    <View className={containerClass}>
      <View className='rounded-3xl relative overflow-hidden'>

        {/* Gradient background */}
        <LinearGradient
          colors={colorScheme === 'light' ? gradientLight : gradientDark}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className="absolute inset-0 rounded-3xl"
        />

        {/* Image section */}
        <View className="items-start justify-center p-5 pb-3">
          <View className={`w-14 h-14 ${colorScheme === 'light' ? 'bg-black/10' : 'bg-white/15'} rounded-full items-center justify-center`}>
            <Image
              source={image}
              className="w-[2.25rem] h-[2.25rem]"
              style={{
                resizeMode: 'contain',
                tintColor: Colors[colorScheme].textPrimary,
                opacity: 0.8,
              }}
            />
          </View>
        </View>

        {/* Text section */}
        <View className="items-start justify-center p-5 pt-0">
          <Text className="text-text-full text-lg font-semibold">
            {title.split(' ').join('\n')}
          </Text>
        </View>
      </View>
    </View >
  );
}
