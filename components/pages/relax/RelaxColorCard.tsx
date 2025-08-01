import { View, Text, Image } from 'react-native';
import React from 'react';
import { LinearGradient } from 'expo-linear-gradient';
import { useColorScheme } from 'nativewind';
import Svg, { Path } from 'react-native-svg';

interface RelaxColorCardProps {
  variant: 'meditation' | 'breathing';
}

const variants = {
  meditation: {
    title: 'Meditation',
    description: 'Calm your mind and find inner peace through guided meditation.',
    gradientLight: ['#8fc4f9', '#b1d6fb'], // gentle, pastel blues
    gradientDark: ['#4766b5', '#4766b5'],  // soft dark blues
  },
  breathing: {
    title: 'Breathing',
    description: 'Practice deep breathing exercises to reduce stress and improve focus.',
    gradientLight: ['#f8a75e', '#f8a75e'], // soft peachy pastel
    gradientDark: ['#d97e0f', '#d97e0f'],  // warm, softer dark orange
  },
};

export default function RelaxColorCard({ variant }: RelaxColorCardProps) {
  const { title, description, gradientLight, gradientDark } = variants[variant];
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
        <View className="flex-row items-center h-full z-10">
          <View className="flex-1 h-full p-5">
            <Text className="text-2xl font-bold mb-1 text-text-full">{title}</Text>
            <Text className="text-lg text-text-full">{description}</Text>
          </View>
          {/* <Image source={image} className="w-2/5 h-full" resizeMode="cover" /> */}
        </View>
      </LinearGradient>
      <View className='absolute bottom-0 left-0 right-0'>
        <Svg
          viewBox="0 0 1440 320"
          preserveAspectRatio='none'
          style={{
            width: '100%',
            height: 100,
          }}
        >
          <Path
            fill="#fff"
            fillOpacity="0.15"
            d="M0,128L60,112C120,96,240,64,360,48C480,32,600,32,720,53.3C840,75,960,117,1080,117.3C1200,117,1320,75,1380,53.3L1440,32L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          />
        </Svg>
      </View>
      <View className="absolute bottom-0 left-0 right-0 -mx-sides">
        <Svg
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          style={{
            width: '100%',
            height: 70,
          }}
        >
          <Path
            fill="#fff"
            fillOpacity="0.1"
            d="M0,32L30,37.3C60,43,120,53,180,74.7C240,96,300,128,360,149.3C420,171,480,181,540,165.3C600,149,660,107,720,74.7C780,43,840,21,900,48C960,75,1020,149,1080,186.7C1140,224,1200,224,1260,208C1320,192,1380,160,1410,144L1440,128L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
          />
        </Svg>
      </View>
    </View>
  );
}
