import React, { ReactNode } from 'react';
import { View } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Themes, ThemeName } from '@/constants/themeVars';

type ThemeProps = {
  children: ReactNode;
  name?: ThemeName
}


export function ThemeProvider({ children, name = 'default' }: ThemeProps) {
  const { colorScheme = 'light' } = useColorScheme(); // 'light' | 'dark'
  return (
    <View className='flex-1' style={Themes[name][colorScheme]}>
      {children}
    </View>
  );
}