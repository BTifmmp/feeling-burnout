// components/base/SnackbarProvider.tsx
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { Text, Pressable, View, Dimensions } from 'react-native';
import SafeAreaView from '@/components/base/MySafeArea';
import Animated, { FadeInLeft, FadeOutRight } from 'react-native-reanimated';
import { useColorScheme } from 'nativewind';
import { Colors } from '@/constants/themes';
import { AlertCircle, CheckCircle2, Info } from 'lucide-react-native';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SnackbarOptions {
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
  actionText?: string;
  onActionPress?: () => void;
  hideSnackbarOnActionPress?: boolean;
}

const SnackbarContext = createContext<(options: SnackbarOptions) => void>(() => { });

export const useSnackbar = () => useContext(SnackbarContext);

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [snackbar, setSnackbar] = useState<SnackbarOptions | null>(null);
  const [visible, setVisible] = useState(false);

  const { colorScheme = 'light' } = useColorScheme();

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const clearExistingTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const showSnackbar = useCallback((options: SnackbarOptions) => {
    clearExistingTimeout();
    setSnackbar(options);
    setVisible(true);

    timeoutRef.current = setTimeout(() => {
      setVisible(false);
      timeoutRef.current = setTimeout(() => setSnackbar(null), 300);
    }, options.duration ?? 5000);
  }, []);

  const hideSnackbar = () => {
    setVisible(false);
    timeoutRef.current = setTimeout(() => setSnackbar(null), 300);
  };

  const iconColor = Colors[colorScheme === 'dark' ? 'light' : 'dark'].textPrimary;

  const renderIcon = () => {
    if (!snackbar?.type) return null;  // <--- Don't show icon if no type

    switch (snackbar.type) {
      case 'error':
        return <AlertCircle size={20} color={iconColor} />;
      case 'success':
        return <CheckCircle2 size={20} color={iconColor} />;
      case 'info':
        return <Info size={20} color={iconColor} />;
      default:
        return null;
    }
  };
  const renderRightActions = () => (
    <View style={{ width: '120%', backgroundColor: 'transparent' }} />
  )

  return (
    <SnackbarContext.Provider value={showSnackbar}>
      {children}

      {visible && snackbar && (
        <SafeAreaView
          edges={{ top: true, bottom: true }}
          pointerEvents="box-none"
          className="absolute top-0 bottom-0 left-0 right-0 justify-start items-center z-[9999]"
        >
          <Swipeable
            containerStyle={{ width: '100%' }}
            rightThreshold={SCREEN_WIDTH * 0.25}
            renderRightActions={renderRightActions}
            friction={3}
            renderLeftActions={renderRightActions}
            onSwipeableOpen={() => {
              clearExistingTimeout();
              hideSnackbar();
            }}
            leftThreshold={SCREEN_WIDTH * 0.25}>
            <Animated.View
              entering={FadeInLeft.duration(300)}
              exiting={FadeOutRight.duration(300)}
              className="px-8 py-4 rounded-0 mt-0 shadow-xl w-full"
              style={{
                backgroundColor:
                  Colors[colorScheme === 'dark' ? 'light' : 'dark'].grayHighlight100,
              }}
            >
              <View className="flex-row items-center justify-between w-full">
                <View className="flex-row items-center flex-1 gap-2">
                  {renderIcon()}
                  <Text
                    style={{
                      color:
                        Colors[colorScheme === 'dark' ? 'light' : 'dark'].textPrimary,
                    }}
                    className="text-text-primary flex-shrink"
                  >
                    {snackbar.message}
                  </Text>
                </View>

                {snackbar.actionText && snackbar.onActionPress && (
                  <Pressable onPress={() => {
                    snackbar.onActionPress?.();
                    if (snackbar.hideSnackbarOnActionPress) {
                      clearExistingTimeout();
                      hideSnackbar();
                    }
                  }}>
                    <Text
                      style={{
                        color:
                          Colors[colorScheme === 'dark' ? 'light' : 'dark'].blueButton,
                      }}
                      className="ml-4 font-semibold"
                    >
                      {snackbar.actionText}
                    </Text>
                  </Pressable>
                )}
              </View>
            </Animated.View>
          </Swipeable>

        </SafeAreaView>
      )}
    </SnackbarContext.Provider>
  );
}
