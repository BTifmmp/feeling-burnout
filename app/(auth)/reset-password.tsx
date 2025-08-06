import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import SafeAreaView from '@/components/base/MySafeArea';
import { Button } from '@/components/base/Button';
import { useColorScheme } from 'nativewind';
import { router } from 'expo-router';
import { supabase } from '@/utils/supabaseClient';
import { useSnackbar } from '@/components/base/Snackbar';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const snackbar = useSnackbar();

  const handlePasswordReset = async (email: string) => {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://your-app.com/reset-password', // set this in Supabase dashboard too
    });

    if (error) {
      alert("Failed to send reset email: " + error.message);
      snackbar({
        message: 'Password reset failed',
        type: 'error',
        duration: 5000,
      });
    } else {
      snackbar({
        message: 'Password reset email sent! Please check your inbox.',
        type: 'info',
        duration: 5000,
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background" edges={{ top: true, bottom: true }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View className="flex-1 px-8">
          <Text className="text-3xl font-semibold text-text-primary mb-2 mt-10">
            Forgot your password?
          </Text>

          <Text className="text-lg text-text-secondary mb-8">
            Enter your email and we’ll send you a link to reset your password.
          </Text>

          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            autoCapitalize="none"
            className="bg-gray-highlight-100 rounded-full px-5 py-3 mb-4 text-text-primary text-lg"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
          />

          <Button
            variant="blue"
            title="Send Reset Link"
            onPress={() => { handlePasswordReset(email) }}
            disabled={!email}
            style={{ paddingVertical: 10 }}
          />

          <Button
            variant="ghost"
            title="Back to Login"
            onPress={() => router.replace('/login')}
            style={{ marginTop: 20, paddingVertical: 10 }}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
