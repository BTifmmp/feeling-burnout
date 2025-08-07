import { View, Text, Switch, TextInput, TouchableOpacity } from 'react-native';
import React, { use, useState } from 'react';
import SafeAreaView from '@/components/base/MySafeArea';
import Animated from 'react-native-reanimated';
import { Card, TopCardTitle } from '@/components/base/Card';
import { Button } from '@/components/base/Button';
import { User2 } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Colors } from '@/constants/themes';
import StatusBarColor from '@/components/base/StatusBarColor';
import { useAuthStore } from '@/store/authStore';
import * as Application from 'expo-application';

export default function Profile() {
  const { colorScheme = 'light' } = useColorScheme();
  const { signOut, user } = useAuthStore();
  const appVersion = Application.nativeApplicationVersion;
  const buildNumber = Application.nativeBuildVersion || '—'; // fallback

  return (
    <View className='flex-1'>
      <StatusBarColor color={Colors[colorScheme].cardReversed} />
      <SafeAreaView className="flex-1" edges={{ top: true }}>
        <Animated.ScrollView contentContainerClassName="p-sides bg-background-reversed">
          {/* User Info Card */}
          <Card className="bg-card-reversed justify-center mb-3 py-6 px-6">
            <View className="flex-row items-center gap-4 border-b border-gray-highlight-200 pb-4">
              <View className="w-16 h-16 rounded-full bg-gray-highlight-100 flex items-center justify-center">
                <User2 size={32} color={Colors[colorScheme].textPrimary} />
              </View>
              <View>
                <Text className="text-xl font-semibold text-text-primary">{user?.user_metadata.full_name || 'Unknown user'}</Text>
                <Text className="text-sm text-text-secondary">{user?.email || 'Unknown email'}</Text>
              </View>
            </View>
            <Button
              variant="ghost"
              onPress={signOut}
              style={{ marginBottom: -10, paddingVertical: 8, borderRadius: 12, marginTop: 10 }}
            >
              <Text className="text-lg text-text-primary font-semibold">Log Out</Text>
            </Button>
          </Card>

          {/* Privacy & Terms */}
          <TopCardTitle title="Privacy & Terms" className="mt-4" />
          <Card className="bg-card-reversed justify-center mb-3 py-4 px-0">
            <Button variant="ghost" style={{ borderRadius: 0, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text className="text-lg text-text-primary font-semibold">Tems of use</Text>
            </Button>
            <Button variant="ghost" style={{ borderRadius: 0, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text className="text-lg text-text-primary font-semibold">Privacy policy</Text>
            </Button>
          </Card>

          <View className="mt-4 px-10">
            <View className="flex-row items-center justify-between">
              <Text className="text-text-secondary mb-1">App version</Text>
              <Text className="text-text-secondary">{appVersion}</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-text-secondary mb-1">Build</Text>
              <Text className="text-text-secondary">{buildNumber}</Text>
            </View>
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
}
