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
import { supabase } from '@/utils/SupaLegend';
import { useAuthStore } from '@/store/authStore';

export default function Profile() {
  const { colorScheme = 'light' } = useColorScheme();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const { signOut } = useAuthStore();

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
                <Text className="text-xl font-semibold text-text-primary">Jane Doe</Text>
                <Text className="text-sm text-text-secondary">jane.doe@example.com</Text>
              </View>
            </View>
            <Button
              variant="ghost"
              onPress={signOut}
              style={{ marginBottom: -10, paddingVertical: 8, borderRadius: 0, marginTop: 10 }}
            >
              <Text className="text-lg text-text-primary font-semibold">Log Out</Text>
            </Button>
          </Card>

          {/* Subscription */}
          <TopCardTitle title="Subscription" className="mt-4" />
          <Card className="bg-card-reversed justify-center mb-3 py-6 px-6">
            <View>
              <Text className="text-lg font-semibold text-text-primary mb-2">Current Plan</Text>
              <Text className="text-text-secondary mb-4">Premium Monthly</Text>
              <Button variant="ghost" onPress={() => alert('Manage subscription')}>
                <Text className="text-lg text-text-primary font-semibold">Theme</Text>
              </Button>
            </View>
          </Card>

          {/* Settings */}
          <TopCardTitle title="Settings" className="mt-4" />
          <Card className="bg-card-reversed justify-center mb-3 py-4 px-0 space-y-4">
            <Button variant="ghost" style={{ borderRadius: 0, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text className="text-lg text-text-primary font-semibold">Theme</Text>
            </Button>
            <Button variant="ghost" style={{ borderRadius: 0, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text className="text-lg text-text-primary font-semibold">Account</Text>
            </Button>
          </Card>


          {/* Privacy & Terms */}
          <TopCardTitle title="Privacy & Terms" className="mt-4" />
          <Card className="bg-card-reversed justify-center mb-3 py-4 px-0">
            <Button variant="ghost" style={{ borderRadius: 0, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text className="text-lg text-text-primary font-semibold">Change Password</Text>
            </Button>
            <Button variant="ghost" style={{ borderRadius: 0, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text className="text-lg text-text-primary font-semibold">Change Password</Text>
            </Button>
            <Button variant="ghost" style={{ borderRadius: 0, paddingVertical: 14, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text className="text-lg text-text-primary font-semibold">Change Password</Text>
            </Button>
          </Card>

          <View className="mt-4 px-10">
            <View className="flex-row items-center justify-between">
              <Text className="text-text-secondary mb-1">App version</Text>
              <Text className="text-text-secondary">1.0.0</Text>
            </View>
            <View className="flex-row items-center justify-between">
              <Text className="text-text-secondary mb-1">Build</Text>
              <Text className="text-text-secondary">45</Text>
            </View>
          </View>
        </Animated.ScrollView>
      </SafeAreaView>
    </View>
  );
}
