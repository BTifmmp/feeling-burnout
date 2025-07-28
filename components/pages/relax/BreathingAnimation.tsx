import { View, Text } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

function PulsatingCircle({
  scale,
  opacity,
}: {
  scale: any;
  opacity: number;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    borderRadius: 999,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: '#ffffff', // Light blue color

    position: 'absolute',
    opacity,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={animatedStyle} />;
}

export default function BreathingAnimation() {
  const baseScale = useSharedValue(0.6);


  baseScale.value = withRepeat(
    withTiming(1, {
      duration: 4000,
    }),
    -1,
    true
  );

  // lagged scale that "follows" baseScale with smoothing
  function useLaggedScale(targetScale: any, lagFactor = 0.05) {
    const follower = useSharedValue(targetScale.value);

    useDerivedValue(() => {
      follower.value = follower.value + (targetScale.value - follower.value) * lagFactor;
    });

    return follower;
  }

  const scaleOuter = useLaggedScale(baseScale, 0.2);

  function useScaledValue(value: any, multiplier: number) {
    return useDerivedValue(() => value.value * multiplier);
  }

  const scaled1 = useScaledValue(baseScale, 0.4);
  const scaled2 = useScaledValue(baseScale, 0.6);
  const scaled3 = useScaledValue(baseScale, 0.8);
  const scaled4 = useScaledValue(baseScale, 1);




  return (
    <View className="w-full h-full items-center justify-center">
      <View className="rounded-full w-full h-full border-neutral-600" style={{ backgroundColor: '#666666' }} />
      <View className="rounded-full w-full h-full absolute">
        <PulsatingCircle scale={scaled4} opacity={0.3} />
      </View>
      <View className="absolute">
        <Text className="text-3xl text-text-primary font-medium">Breath In</Text>
      </View>
    </View>
  );
}