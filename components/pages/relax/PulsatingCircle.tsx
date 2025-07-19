import { useEffect } from "react";
import { View } from "react-native";
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
    backgroundColor: '#4A90E2',
    position: 'absolute',
    opacity,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={animatedStyle} />;
}

export default function PulsatingCircles() {
  const baseScale = useSharedValue(0.7);

  useEffect(() => {
    baseScale.value = withRepeat(
      withTiming(1, {
        duration: 4000,
        easing: Easing.out(Easing.ease),
      }),
      -1,
      true
    );
  }, []);

  // lagged scale that "follows" baseScale with smoothing
  function useLaggedScale(targetScale: any, lagFactor = 0.05) {
    const follower = useSharedValue(targetScale.value);

    useDerivedValue(() => {
      follower.value = follower.value + (targetScale.value - follower.value) * lagFactor;
    });

    return follower;
  }

  // smaller lagFactor for more lag (slower catch-up)
  const scaleMid = useLaggedScale(baseScale, 0.10);
  const scaleOuter = useLaggedScale(baseScale, 0.07);


  function useScaledValue(value: any, multiplier: number) {
    return useDerivedValue(() => value.value * multiplier);
  }

  const scaledBase = useScaledValue(baseScale, 0.64);
  const scaledMid = useScaledValue(scaleMid, 0.8);
  const scaledOuter = useScaledValue(scaleOuter, 1);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <PulsatingCircle scale={scaledOuter} opacity={0.7} />
      <PulsatingCircle scale={scaledMid} opacity={0.7} />
      <PulsatingCircle scale={scaledBase} opacity={0.7} />
    </View>
  );
}
