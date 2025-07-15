import React from 'react';
import { View, Text, Image } from 'react-native';

export default function ArticleCard() {
  const choices = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  return (
    <View className="rounded-lg w-52">
      <Image
        source={{
          uri: `https://picsum.photos/seed/${choices[(Math.floor(Math.random() * 1000)) % 10]}/400/200`, // Free API for random images with seed
        }}
        className="w-52 h-36 rounded-2xl"
        resizeMode="cover"
      />
      <View className="flex-1 mt-3">
        <Text
          className="text-lg font-bold text-text-primary text-ellipsis"
          numberOfLines={1}
        >
          Article Title too wgewgw
        </Text>
        <Text
          className="text-md text-text-secondary mt-1 text-ellipsis"
          numberOfLines={1}
        >
          5 min read
        </Text>
      </View>
    </View>
  );
}