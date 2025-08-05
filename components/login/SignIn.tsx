import { View, Text, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/base/Button';
import { router } from 'expo-router';
import GoogleSignButton from '@/components/login/GoogleButton';
import { Pressable } from 'react-native-gesture-handler';
import Animated, { SlideInLeft, SlideOutLeft } from 'react-native-reanimated';
import { useAuthStore } from '@/store/authStore';


export default function SignIn() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { signIn, errorMsg, clearError, userLoading } = useAuthStore();

  useEffect(() => { clearError() }, []);


  return (
    <Animated.View entering={SlideInLeft} exiting={SlideOutLeft}>
      <Text className="text-2xl mb-8 font-medium text-text-primary">Sign In</Text>

      <TextInput
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        className="bg-gray-highlight-100 rounded-full px-5 py-3 mb-4 text-text-primary text-lg"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        className="bg-gray-highlight-100 rounded-full px-5 py-3 mb-2 text-text-primary text-lg"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
      />
      <View>
        <Pressable onPress={() => { router.push('/reset-password'); }}>
          <Text className="text-text-secondary text-sm mb-4 opacity-60">
            Forgot password?
          </Text>
        </Pressable>
      </View>


      <Text className="text-red-500 mb-2">
        {errorMsg ? errorMsg.charAt(0).toUpperCase() + errorMsg.slice(1) : ''}
      </Text>

      <Button
        variant="blue"
        onPress={() => { signIn(email, password) }}
        style={{ marginBottom: 16, height: 44, maxWidth: 400, width: '100%', paddingVertical: 0 }}
        textStyle={{ fontSize: 14, fontWeight: '500' }}
        disabled={userLoading}
        title="Sign In"
      />
      <GoogleSignButton text='Sign in with Google' />
    </Animated.View>
  );
}


export function SignInFooter({ onActionPress }: { onActionPress: () => void }) {
  return (
    <>
      <Text className="text-text-secondary text-base">Don’t have an account yet?{' '}</Text>
      <Pressable onPress={onActionPress}>
        <Text className="text-blue-button text-base font-semibold">Sign Up</Text>
      </Pressable>
    </>
  );
}