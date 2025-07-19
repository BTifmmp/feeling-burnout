import React, { useState } from "react";
import { View, Text } from "react-native";
import Slider from "@react-native-community/slider";

function formatTime(seconds: number) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

export default function AudioSlider() {
  const totalDuration = 210;
  const [currentTime, setCurrentTime] = useState(0);

  return (
    <View>
      <Slider
        style={{ height: 30, left: 0, right: 0, marginHorizontal: -14 }}
        minimumValue={0}
        maximumValue={totalDuration}
        value={currentTime}
        minimumTrackTintColor="#fff"
        maximumTrackTintColor="#D1D5DB" // Tailwind gray-300
        thumbTintColor="#fff"
        onValueChange={setCurrentTime}
      />
      <View className="flex-row justify-between mt-2">
        <Text className="text-text-secondary text-xs">{formatTime(currentTime)}</Text>
        <Text className="text-text-secondary text-xs">{formatTime(totalDuration)}</Text>
      </View>
    </View>
  );
}
