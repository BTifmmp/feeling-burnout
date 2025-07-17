import React from 'react';
import { View, TouchableOpacity, Image, Text } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColorScheme } from 'nativewind';
import { Colors } from '@/constants/themes';

const icons = {
  home: {
    filled: require('@/assets/bottom-bar/home-filled.png'),
    outline: require('@/assets/bottom-bar/home-blank.png'),
  },
  hournal: {
    filled: require('@/assets/bottom-bar/journal-filled.png'),
    outline: require('@/assets/bottom-bar/journal-blank.png'),
  },
  relax: {
    filled: require('@/assets/bottom-bar/relax-filled.png'),
    outline: require('@/assets/bottom-bar/relax-blank.png'),
  },
  chat: {
    filled: require('@/assets/bottom-bar/chat-filled.png'),
    outline: require('@/assets/bottom-bar/chat-blank.png'),
  },
  profile: {
    filled: require('@/assets/bottom-bar/user-filled.png'),
    outline: require('@/assets/bottom-bar/user-blank.png'),
  },
};
export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { colorScheme = 'light' } = useColorScheme();

  const focusedColor = Colors[colorScheme].textPrimary;
  const unfocusedColor = Colors[colorScheme].textSecondary;

  const insets = useSafeAreaInsets();
  const routes = state.routes;

  return (
    <View className="flex-row bg-background justify-around items-center px-2 pt-1" style={{ paddingBottom: insets.bottom, height: 65 + insets.bottom }}>
      {Object.entries(icons).map(([key, icon], index) => {
        const route = routes[index];
        const isFocused = state.index === index;
        const label = key.charAt(0).toUpperCase() + key.slice(1);

        return (
          <TouchableOpacity
            key={key}
            onPress={() => navigation.navigate(route.name)}
            className="items-center justify-center relative"
            style={{ position: 'relative' }}
          >
            {isFocused && (
              <View
                className="absolute w-[5rem] h-[4.0rem] rounded-3xl bg-gray-highlight-100"
              />
            )}
            <Image
              source={isFocused ? icon.filled : icon.outline}
              className="w-[1.5rem] h-[1.55rem]"
              style={{
                tintColor: isFocused ? focusedColor : unfocusedColor,
              }}
              resizeMode="contain"
            />
            <Text
              className="text-xs mt-1"
              style={{ color: isFocused ? focusedColor : unfocusedColor, }}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
