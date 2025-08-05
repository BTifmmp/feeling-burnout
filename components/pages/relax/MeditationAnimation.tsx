import { View, Text } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import LottieView from 'lottie-react-native'
import { useColorScheme } from 'nativewind';

interface MeditationAnimationProps {
  speed?: number;
  stop?: boolean;
}

export default function MeditationAnimation({ speed = 2, stop = true }: MeditationAnimationProps) {
  const animationRef = useRef<LottieView>(null);
  const [isReversing, setIsReversing] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const { colorScheme = 'light' } = useColorScheme();

  useEffect(() => {
    if (stop) {
      animationRef.current?.pause();
    } else {
      if (isPlaying) {
        animationRef.current?.resume();
      } else {
        animationRef.current?.play(4300, 0);
        setIsPlaying(true);
      }
    }
  }, [stop]);

  const handleFinish = (isCancelled: boolean) => {
    if (isCancelled) return;

    if (isReversing) {
      animationRef.current?.play(0, 4300); // play forward
    } else {
      animationRef.current?.play(4300, 0); // play reverse
    }
    setIsReversing(!isReversing);
  };

  return (
    <LottieView
      ref={animationRef}
      style={{ width: '100%', height: '100%' }}
      source={require('@/assets/anim1.json')}
      onAnimationFinish={handleFinish}
      colorFilters={[
        {
          keypath: '*',
          color: colorScheme === 'light' ? '#333333' : '#ffffff', // change all elements to black
        },
      ]}
      progress={1}
      loop={false}
      speed={speed}
    />
  )
}