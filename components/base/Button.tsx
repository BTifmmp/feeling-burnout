import { Colors } from '@/constants/themes';
import { useColorScheme } from 'nativewind';
import React from 'react';
import {
  Text,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {
  RectButton,
  RectButtonProps,
  BorderlessButtonProps,
} from 'react-native-gesture-handler';

type Variant = 'cardReversed' | 'highlight100' | 'highlight200' | 'highlight300' | 'blue' | 'ghost' | 'white';

interface VariantConfig {
  backgroundColor: string;
  textColor: string;
  rippleColor: string;
  activeOpacity: number;
  underlayColor: string;
  disabledBackgroundColor: string;
  disabledTextColor: string;
}

export function useVariantConfig(variant: Variant): VariantConfig {
  const { colorScheme = 'light' } = useColorScheme(); // 'light' or 'dark'

  const isDark = colorScheme === 'dark';

  const configs: Record<Variant, VariantConfig> = {
    white: {
      backgroundColor: '#ffffff',
      textColor: '#000000',
      rippleColor: '#0000001f',
      activeOpacity: 0.1,
      underlayColor: '#000000',
      disabledBackgroundColor: '#555',
      disabledTextColor: '#aaa',
    },
    cardReversed: {
      backgroundColor: Colors[colorScheme].cardReversed,
      textColor: Colors[colorScheme].textPrimary,
      rippleColor: isDark ? '#ffffff1f' : '#0000001a',
      activeOpacity: 0.1,
      underlayColor: '#000000',
      disabledBackgroundColor: '#555',
      disabledTextColor: '#aaa',
    },
    highlight100: {
      backgroundColor: Colors[colorScheme].grayHighlight100,
      textColor: Colors[colorScheme].textPrimary,
      rippleColor: isDark ? '#ffffff1f' : '#0000001a',
      activeOpacity: 0.2,
      underlayColor: Colors[colorScheme].textFull,
      disabledBackgroundColor: 'transparent',
      disabledTextColor: '#777',
    },
    highlight200: {
      backgroundColor: Colors[colorScheme].grayHighlight200,
      textColor: Colors[colorScheme].textPrimary,
      rippleColor: isDark ? '#ffffff1f' : '#0000001a',
      activeOpacity: 0.2,
      underlayColor: Colors[colorScheme].textFull,
      disabledBackgroundColor: 'transparent',
      disabledTextColor: '#777',
    },
    highlight300: {
      backgroundColor: Colors[colorScheme].background,
      textColor: Colors[colorScheme].textPrimary,
      rippleColor: Colors[colorScheme].grayHighlight100,
      activeOpacity: 0.1,
      underlayColor: '#000000',
      disabledBackgroundColor: '#555',
      disabledTextColor: '#aaa',
    },
    blue: {
      backgroundColor: Colors[colorScheme].blueButton,
      textColor: '#ffffff',
      rippleColor: isDark ? '#ffffff33' : '#00000033',
      activeOpacity: 0.2,
      underlayColor: Colors[colorScheme].textFull,
      disabledBackgroundColor: isDark ? '#ffffff1f' : '#0000001a',
      disabledTextColor: isDark ? '#ffffff44' : '#00000044',
    },
    ghost: {
      backgroundColor: '#00000000',
      textColor: Colors[colorScheme].textPrimary,
      rippleColor: isDark ? '#ffffff1f' : '#0000001a',
      activeOpacity: 0.2,
      underlayColor: Colors[colorScheme].textFull,
      disabledBackgroundColor: 'transparent',
      disabledTextColor: '#777',
    },
  };

  return configs[variant];
}



interface BaseButtonProps {
  variant?: Variant;
  title?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress?: () => void;
  disabled?: boolean;
}

interface IconButtonProps {
  variant?: Variant;
  icon: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  disabled?: boolean;
}

type ButtonProps = BaseButtonProps & (RectButtonProps | BorderlessButtonProps);
type IconButtonPropsCombined = IconButtonProps & (RectButtonProps | BorderlessButtonProps);


export function Button({
  variant = 'cardReversed',
  title,
  children,
  style,
  textStyle,
  onPress,
  disabled,
  ...rest
}: ButtonProps) {
  const config = useVariantConfig(variant);

  return (
    <RectButton
      style={[
        styles.base,
        {
          backgroundColor: disabled
            ? config.disabledBackgroundColor
            : config.backgroundColor,
        },
        style,
      ]}
      onPress={onPress}
      enabled={!disabled}
      rippleColor={config.rippleColor}
      activeOpacity={config.activeOpacity}
      underlayColor={config.underlayColor}
      {...rest}
    >
      {children ? (
        children
      ) : title ? (
        <Text
          style={[
            styles.text,
            {
              color: disabled ? config.disabledTextColor : config.textColor,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      ) : null}
    </RectButton>
  );
}

export function IconButton({
  variant = 'cardReversed',
  icon,
  style,
  onPress,
  disabled,
}: IconButtonPropsCombined) {
  const config = useVariantConfig(variant);

  return (
    <RectButton
      style={[
        styles.iconButton,
        {
          backgroundColor: disabled
            ? config.disabledBackgroundColor
            : config.backgroundColor,
        },
        style,
      ]}
      borderless={false}
      onPress={onPress}
      enabled={!disabled}
      rippleColor={config.rippleColor}
      activeOpacity={config.activeOpacity}
      underlayColor={config.underlayColor}
    >
      {icon}
    </RectButton>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconButton: {
    padding: 10,
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});