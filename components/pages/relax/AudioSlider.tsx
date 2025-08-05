import React, { useState } from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";
import { useColorScheme } from "nativewind";
import { Colors } from "@/constants/themes";

function formatTime(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

interface AudioSliderProps {
  position: number;
  duration: number;
  onSeek: (value: number) => void;
  onSlidingStart?: () => void;
  onSlidingComplete?: () => void;
}

export default function AudioSlider({
  position,
  duration,
  onSeek,
  onSlidingStart,
  onSlidingComplete,
}: AudioSliderProps) {
  const [internalPosition, setInternalPosition] = useState(position);
  const [isSliding, setIsSliding] = useState(false);

  const { colorScheme = 'light' } = useColorScheme();

  return (
    <View>
      <Slider
        style={{ height: 30, left: 0, right: 0, marginHorizontal: -14 }}
        minimumValue={0}
        step={1}
        maximumValue={duration}
        value={isSliding ? internalPosition : position}
        minimumTrackTintColor={colorScheme === 'dark' ? Colors[colorScheme].textFull : Colors[colorScheme].textPrimary}
        maximumTrackTintColor={Colors[colorScheme].textSecondary}
        thumbTintColor={colorScheme === 'dark' ? Colors[colorScheme].textFull : Colors[colorScheme].textPrimary}
        onValueChange={(val) => {
          setInternalPosition(val);
        }}
        onSlidingStart={() => {
          setIsSliding(true);
          onSlidingStart?.();
        }}
        onSlidingComplete={(val) => {
          setIsSliding(false);
          onSeek(val);
          onSlidingComplete?.();
        }}
      />
      <View className="flex-row justify-between mt-2">
        <Text className="text-text-secondary text-xs">{formatTime(isSliding ? internalPosition : position)}</Text>
        <Text className="text-text-secondary text-xs">{formatTime(duration)}</Text>
      </View>
    </View>
  );
}
