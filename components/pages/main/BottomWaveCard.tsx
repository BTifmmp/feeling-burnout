import React, { PropsWithChildren } from 'react';
import { View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useColorScheme } from 'nativewind';
import { Colors } from '@/constants/themes';

interface BottomWaveCardProps extends PropsWithChildren {
  className?: string;
}

export default function BottomWaveCard({ children, className = '' }: BottomWaveCardProps) {
  const { colorScheme = "light" } = useColorScheme();

  return (
    <View className={className}>
      <View className='p-sides bg-card-reversed'>
        {children}
      </View>
      <View className='h-8'>
        <Svg
          viewBox="0 0 1440 200"
          width="100%"
          height="100%"
          preserveAspectRatio="none"
        >
          <Path
            fill={Colors[colorScheme].cardReversed}
            fillOpacity="1"
            d="M0,160L120,170.7C240,181,480,203,720,197.3C960,192,1200,160,1320,144L1440,128L1440,0L1320,0C1200,0,960,0,720,0C480,0,240,0,120,0L0,0Z"
          />
        </Svg>
      </View>
    </View>
  );
}
