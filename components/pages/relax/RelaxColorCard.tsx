import { View, Text, Image } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';

interface RelaxColorCardProps {
  variant: 'meditation' | 'breathing' | 'break';
}

const variants = {
  meditation: {
    image: require('@/assets/relax/meditation.png'),
    title: 'Meditation',
    description: 'Calm your mind and find inner peace through guided meditation.',
    gradientLight: ['#8fc4f9', '#b1d6fb'], // gentle, pastel blues
    gradientDark: ['#3B73C6', '#2B5BA3'],  // soft dark blues
  },
  breathing: {
    image: require('@/assets/relax/breathing.png'),
    title: 'Breathing',
    description: 'Practice deep breathing exercises to reduce stress and improve focus.',
    gradientLight: ['#f8a75e', '#fdd0a1'], // soft peachy pastel
    gradientDark: ['#E07A00', '#B56300'],  // warm, softer dark orange
  },
  break: {
    image: require('@/assets/relax/break.png'),
    title: 'Short Reset',
    description: 'Step away and recharge with a short, mindful break.',
    // green gradient for light mode
    gradientLight: ['#A8E6CF', '#56C596'], // soft light green
    gradientDark: ['#3B8E48', '#2B6532'],
  },
};

export default function RelaxColorCard({ variant }: RelaxColorCardProps) {
  const { image, title, description, gradientLight, gradientDark } = variants[variant];
  const { colorScheme = 'light' } = useColorScheme();
  const gradientColors = colorScheme === 'dark' ? gradientDark : gradientLight;

  return (
    <View className='rounded-3xl overflow-hidden mb-3 h-48'>
      <LinearGradient
        colors={gradientColors as any}
        start={{ x: 0, y: 0 }} // gradient start top-left
        end={{ x: 1, y: 0 }}   // gradient end top-right (horizontal)
        style={{ flex: 1, height: '100%' }}
      >
        <View className="flex-row items-center h-full">
          <View className="flex-1 h-full p-5">
            <Text className="text-2xl font-bold mb-1 text-text-primary">{title}</Text>
            <Text className="text-base text-text-secondary">{description}</Text>
          </View>
          <Image source={image} className="w-2/5 h-full" resizeMode="cover" />
        </View>
      </LinearGradient>
    </View>
  );
}
