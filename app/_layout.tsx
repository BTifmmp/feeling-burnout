import React, { useEffect, useRef, useState } from 'react';
import { Slot, Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from '@/components/ThemeProvider';
import { StatusBar } from 'expo-status-bar';
import "@/styles/global.css";
import { useColorScheme } from 'nativewind';
import { MenuProvider } from 'react-native-popup-menu';
import { Colors } from '@/constants/themes';
import * as SystemUI from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SnackbarProvider } from '@/components/base/Snackbar';
import { observer } from '@legendapp/state/react';


export default function RootLayout() {
  return (<ObservedLayout />);
}

const ObservedLayout = observer(() => {
  const { colorScheme = 'light' } = useColorScheme(); // your custom theme state
  SystemUI.setBackgroundColorAsync(Colors[colorScheme].background);

  const invertedColorScheme = colorScheme === 'light' ? 'dark' : 'light';

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
      <SafeAreaProvider >
        <ThemeProvider>
          <MenuProvider>
            <SnackbarProvider>
              <StatusBar style={invertedColorScheme} />
              <Stack initialRouteName='(tabs)' screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors[colorScheme].background } }}>
                <Stack.Screen name="journal-entry" />
                <Stack.Screen name="edit-journal-entry" />
                <Stack.Screen name="mood-calendar" />
                <Stack.Screen name="meditation" />
                <Stack.Screen name="breathing" />
                <Stack.Screen name="(tabs)" />
              </Stack>
            </SnackbarProvider>
          </MenuProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
});