import React, { use, useEffect, useState } from 'react';
import { Redirect, Stack } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { Colors } from '@/constants/themes';
import { observer } from '@legendapp/state/react';
import { useAuthStore } from '@/store/authStore';
import { ActivityIndicator, View } from 'react-native';


export default function RootLayout() {
  const { userLoading, user } = useAuthStore();

  if (userLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator />
      </View>);
  }

  if (!user || !user.user_metadata?.email_verified) {
    return <Redirect href="/login" />;
  }

  return (
    <ObservedLayout />
  );
}

const ObservedLayout = observer(() => {
  const { colorScheme = 'light' } = useColorScheme(); // your custom theme state

  return (
    <Stack initialRouteName='(tabs)' screenOptions={{ headerShown: false, contentStyle: { backgroundColor: Colors[colorScheme].background } }}>
      <Stack.Screen name="journal-entry" />
      <Stack.Screen name="edit-journal-entry" />
      <Stack.Screen name="mood-calendar" />
      <Stack.Screen name="meditation" />
      <Stack.Screen name="breathing" />
      <Stack.Screen name="(tabs)" />
    </Stack>

  );
});