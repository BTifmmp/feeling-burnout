import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, Modal } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, interpolate, useAnimatedScrollHandler, Extrapolation, useAnimatedRef, scrollTo, SharedValue, runOnJS } from 'react-native-reanimated';
import { AnimatedScrollView } from 'react-native-reanimated/lib/typescript/component/ScrollView';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';

const ITEM_HEIGHT = 50;
const ITEMS_VISIBLE = 3;

type ScrollPickerProps = {
  options?: string[];
  initialSelectedOption?: string; // optional initial selected option
  onChange?: (index: number) => void; // callback when option changes
};

export default function ScrollPicker({ options = ["Option1", "Option2", "Option3"], initialSelectedOption, onChange }: ScrollPickerProps) {
  const scrollOffset = useSharedValue(0);  // This shared value will control the scroll position
  const scrollViewRef = useAnimatedRef<AnimatedScrollView>()  // Ref for the ScrollView

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollOffset.value = event.contentOffset.y;
      const index = Math.min(Math.max(0, Math.round(event.contentOffset.y / ITEM_HEIGHT)), options.length - 1);
      onChange && runOnJS(onChange)(index);
    },
  });

  const setScroll = () => {
    setTimeout(() => {
      const initialIndex = options.indexOf(initialSelectedOption || options[0]) !== -1 ? options.indexOf(initialSelectedOption || options[0]) : 0;
      if (scrollViewRef) {
        scrollOffset.value = initialIndex * ITEM_HEIGHT;
        scrollViewRef.current?.scrollTo({ x: 0, y: initialIndex * ITEM_HEIGHT, animated: false });
      }
    }, 1)
  }

  useEffect(() => {
    setScroll();
  }, []);

  const lastTapTimeRef = useRef(0);

  const tap = Gesture.Tap()
    .maxDuration(150)
    .onEnd((e) => {
      const now = Date.now();
      if (now - lastTapTimeRef.current < 200) return; // ignore taps within 300ms

      lastTapTimeRef.current = now;

      let move = -1;
      move = e.y < ITEM_HEIGHT ? scrollOffset.value - ITEM_HEIGHT : move;
      move = e.y > ITEM_HEIGHT * 2 ? scrollOffset.value + ITEM_HEIGHT : move;
      move = move === -1 ? scrollOffset.value : move;

      scrollTo(scrollViewRef, 0, move, true);
    });

  return (
    <GestureDetector gesture={tap}>
      <Animated.View style={{ height: ITEM_HEIGHT * 3 }}>
        <View className="absolute w-full border-t-hairline border-b-hairline border-gray-highlight-300" style={{ height: ITEM_HEIGHT, top: ITEM_HEIGHT }}></View>
        <Animated.ScrollView
          onLayout={setScroll}
          ref={scrollViewRef}  // Attach the ref to the ScrollView
          showsVerticalScrollIndicator={false}
          style={{ height: ITEM_HEIGHT * ITEMS_VISIBLE }}
          onScroll={scrollHandler}
          snapToOffsets={Array.from({ length: options.length }, (_, i) => i * ITEM_HEIGHT)}
          decelerationRate={'fast'}
          scrollEventThrottle={16}
        >
          <View style={{ height: ITEM_HEIGHT }} />
          {options.map((item, index) => (
            <AnimatedPickerItem
              key={item} label={item} index={index} scrollOffset={scrollOffset} />
          ))}
          <View style={{ height: ITEM_HEIGHT }} />
        </Animated.ScrollView>
      </Animated.View>
    </GestureDetector >
  );
}

type PickerItemProps = {
  label: string;
  index: number;
  scrollOffset: SharedValue<number>;
};

function AnimatedPickerItem({ label, index, scrollOffset }: PickerItemProps) {
  const offset = index * ITEM_HEIGHT;

  const animatedStyle = useAnimatedStyle(() => {
    const distance = Math.abs(scrollOffset.value - offset);
    // console.log(scrollOffset.value)

    if (distance > ITEM_HEIGHT * 2) return {};

    const scale = interpolate(
      distance,
      [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
      [1, 0.7, 0.6],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      distance,
      [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
      [1, 0.5, 0.2],
      Extrapolation.CLAMP
    );

    return {
      transform: [{ scale }],
      opacity,
    };
  });

  return (
    <Animated.View style={[styles.itemContainer, animatedStyle]}>
      <Text style={styles.itemText} className='text-text-primary'>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    height: ITEM_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemText: {
    transform: [{ translateY: -3 }],
    fontSize: 27,
  },
});