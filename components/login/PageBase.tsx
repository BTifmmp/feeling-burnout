import { View, Text, KeyboardAvoidingView, ScrollView, Platform, Keyboard } from 'react-native';
import React from 'react';
import SafeAreaView from '@/components/base/MySafeArea';
import { useColorScheme } from 'nativewind';
import Svg, { Path } from 'react-native-svg';
import { PropsWithChildren } from 'react';
import { Colors } from '@/constants/themes';
import Animated, { FadeInLeft, FadeInRight, FadeOutLeft, FadeOutRight } from 'react-native-reanimated';
import { Pressable } from 'react-native-gesture-handler';

const colorsLogin = {
  dark: {
    background: '#222222', // Dark gray
    wave: '#222222',       // Almost black
  },
  light: {
    background: '#e0e0e0', // Light gray
    wave: '#b3b3b3',       // Medium gray
  }
};

interface PageBaseProps extends PropsWithChildren {
  footer?: React.ReactNode; // optional custom footer
  mode?: 'sign-in' | 'sign-up'; // optional mode to determine styles or behavior
}

export default function PageBase({
  children,
  footer,
  mode
}: PageBaseProps) {
  const { colorScheme = 'light' } = useColorScheme();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={{ top: true, bottom: true }}>
      <Pressable onPress={Keyboard.dismiss} style={{ flex: 1 }} accessible={false}>
        <View className="flex-1">
          <View
            className="overflow-hidden h-48"
            style={{ backgroundColor: colorsLogin[colorScheme].background }}
          >
            <View className='mt-8 ml-6'>
              <Text
                className='text-4xl font-medium text-text-full'>
                Welcome
              </Text>
              {
                mode === 'sign-in' ?
                  <Animated.Text
                    key={'sign-in-text'}
                    entering={FadeInLeft}
                    exiting={FadeOutLeft}
                    className='text-lg text-text-full'>
                    Sign in to continue your journey
                  </Animated.Text>
                  :
                  <Animated.Text
                    key={'sign-up-text'}
                    entering={FadeInRight}
                    exiting={FadeOutRight}
                    className='text-lg text-text-full'>
                    Sign up to start your journey
                  </Animated.Text>
              }
            </View>
          </View>

          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
          >
            <View style={{ flex: 1 }}>
              <View>
                <View className="absolute -top-[65px] left-0 right-0">
                  <View className="">
                    <Svg
                      viewBox="0 0 1440 320"
                      preserveAspectRatio="none"
                      style={{ width: '140%', height: 65, transform: [{ translateX: 0 }] }}
                    >
                      <Path
                        fill={colorsLogin[colorScheme].wave}
                        fillOpacity="1"
                        d="M0,32L30,37.3C60,43,120,53,180,74.7C240,96,300,128,360,149.3C420,171,480,181,540,165.3C600,149,660,107,720,74.7C780,43,840,21,900,48C960,75,1020,149,1080,186.7C1140,224,1200,224,1260,208C1320,192,1380,160,1410,144L1440,128L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
                      />
                    </Svg>
                  </View>
                  <View className="absolute bottom-0 left-0 right-0">
                    <Svg
                      viewBox="0 0 1440 320"
                      preserveAspectRatio="none"
                      style={{ width: '140%', height: 50, transform: [{ translateX: -30 }, { translateY: 1 }] }}
                    >
                      <Path
                        fill={Colors[colorScheme].background}
                        fillOpacity="1"
                        d="M0,32L30,37.3C60,43,120,53,180,74.7C240,96,300,128,360,149.3C420,171,480,181,540,165.3C600,149,660,107,720,74.7C780,43,840,21,900,48C960,75,1020,149,1080,186.7C1140,224,1200,224,1260,208C1320,192,1380,160,1410,144L1440,128L1440,320L1410,320C1380,320,1320,320,1260,320C1200,320,1140,320,1080,320C1020,320,960,320,900,320C840,320,780,320,720,320C660,320,600,320,540,320C480,320,420,320,360,320C300,320,240,320,180,320C120,320,60,320,30,320L0,320Z"
                      />
                    </Svg>
                  </View>
                </View>
              </View>
              <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="never">
                <View className="p-8 pt-0">{children}</View>
              </ScrollView>
            </View>
          </KeyboardAvoidingView>


          <View className="border-t border-gray-highlight-200 pt-6 pb-10 mt-6 flex-row justify-center">
            {footer}
          </View>
        </View>
      </Pressable>
    </SafeAreaView>
  );
}
