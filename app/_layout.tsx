import { Redirect, Slot } from 'expo-router';
import React, { useEffect } from 'react';
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
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/utils/supabaseClient';
import * as NavigationBar from 'expo-navigation-bar';


export default function Root() {
  const { colorScheme = 'light' } = useColorScheme(); // your custom theme state

  useEffect(() => {
    (async () => {
      await SystemUI.setBackgroundColorAsync(Colors[colorScheme].background);
      await NavigationBar.setPositionAsync("absolute");
      await NavigationBar.setBackgroundColorAsync('#ffffff01');
      await NavigationBar.setButtonStyleAsync(colorScheme === 'light' ? 'dark' : 'light');
    })();
  }, [colorScheme]);


  const invertedColorScheme = colorScheme === 'light' ? 'dark' : 'light';
  // Set up the auth context and render our layout inside of it.

  const { setUser, getSession, user, setSession } = useAuthStore();


  useEffect(() => {
    // Load initial user
    getSession();

    // Listen for changes (login/logout/refresh)
    const { data: subscription } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setSession(session);
    });


    return () => {
      subscription.subscription.unsubscribe();
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors[colorScheme].background }}>
      <SafeAreaProvider >
        <ThemeProvider>
          <MenuProvider>
            <SnackbarProvider>
              <StatusBar style={invertedColorScheme} />
              <Slot />
            </SnackbarProvider>
          </MenuProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}