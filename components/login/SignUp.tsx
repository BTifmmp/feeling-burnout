import { Text, TextInput } from 'react-native';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/base/Button';
import { Pressable } from 'react-native-gesture-handler';
import Animated, { SlideInRight, SlideOutRight } from 'react-native-reanimated';
import GoogleSignButton from '@/components/login/GoogleButton';
import { useAuthStore } from '@/store/authStore';


export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const { signUp, errorMsg, clearError, userLoading } = useAuthStore();

  useEffect(() => { clearError() }, []);

  return (
    <Animated.View entering={SlideInRight} exiting={SlideOutRight}>
      <Text className="text-2xl mb-8 font-medium text-text-primary">Sign Up</Text>

      <TextInput
        placeholder="Username"
        autoCapitalize="sentences"
        className="bg-gray-highlight-100 rounded-full px-5 py-3 mb-4 text-text-primary text-lg"
        placeholderTextColor="#999"
        value={username}
        onChangeText={setUsername}
      />

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

      <Text className="text-red-500 mb-2">
        {errorMsg ? errorMsg.charAt(0).toUpperCase() + errorMsg.slice(1) : ''}
      </Text>

      <Button
        variant="blue"
        onPress={() => { signUp(email, password, username) }}
        style={{ marginBottom: 16, height: 44, maxWidth: 400, width: '100%', paddingVertical: 0 }}
        textStyle={{ fontSize: 14, fontWeight: '500' }}
        disabled={userLoading}
        title="Sign Up"
      />
      <GoogleSignButton text='Sign up with Google' />
    </Animated.View>
  );
}


export function SignUpFooter({ onActionPress }: { onActionPress: () => void }) {
  return (
    <>
      <Text className="text-text-secondary text-base">Already have an account?'{' '}</Text>
      <Pressable onPress={onActionPress}>
        <Text className="text-blue-button text-base font-semibold">Sign In</Text>
      </Pressable>
    </>
  );
}