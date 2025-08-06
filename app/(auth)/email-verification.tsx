import React from 'react';
import { View, Text } from 'react-native';
import SafeAreaView from '@/components/base/MySafeArea';
import { Button } from '@/components/base/Button';
import { router } from 'expo-router';
import { useAuthStore } from '@/store/authStore';

export default function VerifyEmail() {
  const { signOut } = useAuthStore();

  const handleResendEmail = () => {
    // Trigger Supabase resend here
    console.log('Resend verification email');
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={{ top: true, bottom: true }}>
      <View className="flex-1 px-8">
        <Text className="text-3xl font-semibold text-text-primary mb-2 mt-10">
          Verify Your Email
        </Text>
        <Text className="text-lg text-text-secondary mb-8">
          We've sent a confirmation link to your email. Click the link to verify your account.
        </Text>

        <Button
          variant="ghost"
          title="Back to Login"
          onPress={() => { signOut(); router.replace('/login'); }}
          style={{ marginTop: 20, paddingHorizontal: 24, paddingVertical: 10 }}
        />
      </View>
    </SafeAreaView >
  );
}
