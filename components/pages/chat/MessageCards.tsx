import React from 'react';
import { View, Text } from 'react-native';

interface MessageProps {
  text: string;
}

// User message with background (aligned right)
export function UserMessage({ text }: MessageProps) {
  return (
    <View className="mb-4 max-w-[85%] self-end items-end">
      <View className="bg-card px-4 py-3 rounded-3xl">
        <Text className="text-text-primary text-lg leading-relaxed text-left">{text}</Text>
      </View>
    </View>
  );
}

// Chat response without background (aligned left)
export function ChatMessage({ text }: MessageProps) {
  return (
    <View className="mb-4 max-w-[85%] self-start">
      <View className="bg-primary px-2 py-3 rounded-3xl">
        <Text className="text-text-primary text-lg leading-relaxed">{text}</Text>
      </View>
    </View>
  );
}
