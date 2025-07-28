import { View, Text } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import LottieView from 'lottie-react-native'

interface MeditationAnimationProps {
  speed?: number;
  stop?: boolean;
}

export default function MeditationAnimation({ speed = 2, stop = false }: MeditationAnimationProps) {
  const animationRef = useRef<LottieView>(null);
  const [isReversing, setIsReversing] = useState(true);

  useEffect(() => {
    if (stop) {
      animationRef.current?.pause();
    } else {
      animationRef.current?.play();
    }
  }, [stop]);

  useEffect(() => {
    animationRef.current?.play(4300, 0);
  }, []);

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
      autoPlay
      loop={false}
      speed={speed}
    />
  )
}