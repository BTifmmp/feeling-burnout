import { IconButton } from '@/components/base/Button';
import { Colors } from '@/constants/themes';
import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { View, Text } from 'react-native';

interface CustomHeaderProps {
  title: string;
  headerRight?: React.ReactNode;
  containerClassName?: string;
  titleClassName?: string;
}

export default function Header({ title, headerRight, containerClassName = '', titleClassName = '' }: CustomHeaderProps) {
  const { colorScheme = 'light' } = useColorScheme();

  return (
    <View className={`h-[65px] flex-row items-center justify-between px-sides ${containerClassName}`}>
      <IconButton
        variant='ghost'
        style={{ padding: 10, marginLeft: -10 }}
        icon={<X color={Colors[colorScheme].textPrimary} size={22} />}
        onPress={router.back}
      />
      <Text className={`ml-3 text-lg font-semibold text-text-full ${titleClassName}`}>{title}</Text>
      {headerRight ? <View className="ml-auto">{headerRight}</View> : <View className='ml-auto'></View>}
    </View>
  );
};
