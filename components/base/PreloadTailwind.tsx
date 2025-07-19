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
      <View className="text-mood-colors-0" />
      <View className="text-mood-colors-1" />
      <View className="text-mood-colors-2" />
      <View className="text-mood-colors-3" />
      <View className="text-mood-colors-4" />
      <View className="border-mood-colors-0" />
      <View className="border-mood-colors-1" />
      <View className="border-mood-colors-2" />
      <View className="border-mood-colors-3" />
      <View className="border-mood-colors-4" />
      <View className="border-gray-highlight-100" />
      <View className="border-gray-highlight-200" />
      <View className="border-gray-highlight-300" />
      <View className="bg-text-secondary" />
      <View className="bg-text-primary" />
    </View>
  );
}