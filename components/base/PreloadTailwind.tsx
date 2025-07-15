import React from 'react';
import { View } from 'react-native';

export default function PreloadTailwind() {
  return (
    <View>
      <View className="bg-mood-colors-0" />
      <View className="bg-mood-colors-1" />
      <View className="bg-mood-colors-2" />
      <View className="bg-mood-colors-3" />
      <View className="bg-mood-colors-4" />
    </View>
  );
}