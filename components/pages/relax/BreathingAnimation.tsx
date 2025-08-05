import { useEffect, useLayoutEffect, useState } from "react";
import { View, Text, Pressable, InteractionManager } from "react-native";
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
  FadeOutDown,
  FadeOutUp,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ZoomIn,
  ZoomOut,
} from "react-native-reanimated";
import { useColorScheme } from "nativewind";
import { breathingSchemas } from "@/constants/breathing";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { set } from "date-fns";

export interface BreathingStep {
  action: 'breath-in' | 'breath-out' | 'hold';
  name: string;
  duration: number; // in seconds
}
export type BreathingSchema = BreathingStep[];

function PulsatingCircle({ scale, opacity }: { scale: any; opacity: number }) {
  const { colorScheme = 'light' } = useColorScheme();

  const animatedStyle = useAnimatedStyle(() => ({
    borderRadius: 999,
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    backgroundColor: colorScheme === 'dark' ? '#ffffff' : '#000000',
    position: 'absolute',
    opacity,
    transform: [{ scale: scale.value }],
  }));

  return <Animated.View style={animatedStyle} />;
}

export default function BreathingAnimation({
  schema = breathingSchemas['box-breathing'],
  play = false,
}: {
  schema: BreathingSchema;
  play?: boolean;
}) {
  const baseScale = useSharedValue(0.7);
  const [stepIndex, setStepIndex] = useState(0);
  const { colorScheme = 'light' } = useColorScheme();

  const step = schema[stepIndex];

  const getScaleForAction = (action: BreathingStep['action']) => {
    switch (action) {
      case 'breath-in': return 1.0;
      case 'breath-out': return 0.6;
      case 'hold': return baseScale.value + 0.001; // keep previous
    }
  };

  useEffect(() => {
    if (!play || schema.length === 0) return;

    const current = schema[stepIndex];
    const nextScale = getScaleForAction(current.action);

    baseScale.value = withTiming(nextScale, {
      duration: current.duration * 1000,
      easing: Easing.inOut(Easing.ease),
    }, () => {
      runOnJS(setStepIndex)((stepIndex + 1) % schema.length);
    });
  }, [stepIndex, play]);

  return (
    <View className="w-full h-full items-center justify-center">
      <View
        className="rounded-full w-full h-full border-neutral-600"
        style={{
          backgroundColor: colorScheme === 'dark' ? '#444444' : '#dedede',
        }}
      />
      <View className="rounded-full w-full h-full absolute">
        <PulsatingCircle scale={baseScale} opacity={0.1} />
      </View>
      <View className="absolute items-center">
        <TwoTextsSwap index={stepIndex} options={schema.map((item) => item.name)} />
      </View>
    </View>

  );
}


interface TextProps {
  text: string;
  isActive: boolean;
  color: string;
}

const TEXT_HEIGHT = 80;

const AnimatedTextItem = ({
  label,
  active,
  disableAnimations = false,
}: {
  label: string;
  active: boolean;
  disableAnimations?: boolean;
}) => {
  const scale = useSharedValue(0.5);
  const opacity = useSharedValue(0.5);
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (active) {
      scale.value = withTiming(1, { duration: disableAnimations ? 0 : 400, easing: Easing.inOut(Easing.ease) });
      opacity.value = withTiming(1, { duration: disableAnimations ? 0 : 400, easing: Easing.inOut(Easing.ease) });
      translateY.value = withTiming(-TEXT_HEIGHT, {
        duration: disableAnimations ? 0 : 400,
        easing: Easing.inOut(Easing.ease)
      });
    }
  }, [active]);


  const style = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }), []);

  return (
    <Animated.View entering={disableAnimations ? undefined : FadeInDown.duration(400)} exiting={FadeOutUp.duration(400)} style={{ position: 'absolute', width: '100%', alignItems: 'center' }}>
      <Animated.View
        style={{
          position: 'absolute',
          height: TEXT_HEIGHT,
          width: '100%',
          justifyContent: 'center',
          alignItems: 'center',
          ...style,
        }}
      >
        <Text className="text-text-primary leading-tight" style={{ fontSize: 30, fontWeight: 'bold', textAlign: 'center' }}>{label}</Text>
      </Animated.View>
    </Animated.View>
  );
};

interface TwoTextsSwapProps {
  options: string[];
  index: number;
}

export function TwoTextsSwap({ options = [], index }: TwoTextsSwapProps) {
  const [activeFirst, setActiveFirst] = useState(true);
  const [firstLabel, setFirstLabel] = useState(options[0]);
  const [secondLabel, setSecondLabel] = useState(options[1]);
  const [firstKey, setFirstKey] = useState(options[0] + index.toString());
  const [secondKey, setSecondKey] = useState(options[1] + index.toString());
  const [isFirstRender, setIsFirstRender] = useState(true);


  useEffect(() => {
    if (isFirstRender) return;

    const next = (index + 1) % options.length;

    if (activeFirst) {
      setSecondLabel(options[index]);
      setFirstLabel(options[next]);
      setFirstKey(options[next] + new Date().getTime().toString());
    } else {
      setFirstLabel(options[index]);
      setSecondLabel(options[next]);
      setSecondKey(options[next] + new Date().getTime().toString());;
    }

    setActiveFirst((prev) => !prev);
  }, [index]);

  useEffect(() => {
    InteractionManager.runAfterInteractions(() => {
      setIsFirstRender(false);
    })
  }, [])


  return (
    <View
      style={{
        flex: 1,
        width: 300,
        position: 'relative',
        backgroundColor: 'white',
        transform: [{ translateY: -TEXT_HEIGHT / 4 }],
      }}
    >
      <View style={{
        transform: [{ translateY: TEXT_HEIGHT }],
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        <AnimatedTextItem key={firstKey} label={firstLabel} active={activeFirst} disableAnimations={isFirstRender} />
        <AnimatedTextItem key={secondKey} label={secondLabel} active={!activeFirst} disableAnimations={isFirstRender} />
      </View>
    </View>
  );
}