import React, { useEffect, useRef, useState } from 'react';
import { Slot } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/components/ThemeProvider';
import { StatusBar } from 'expo-status-bar';
import "@/styles/global.css";
import { useColorScheme } from 'nativewind';
import { MenuProvider } from 'react-native-popup-menu';

export default function RootLayout() {
  const { colorScheme = 'light' } = useColorScheme(); // your custom theme state

  const invertedColorScheme = colorScheme === 'light' ? 'dark' : 'light';

  return (
    <ThemeProvider>
      <MenuProvider>
        <SafeAreaProvider >
          <StatusBar style={invertedColorScheme} />
          <Slot />
        </SafeAreaProvider>
      </MenuProvider>
    </ThemeProvider>
  );
}