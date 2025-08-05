import { useColorScheme } from 'nativewind';
import React, { useState } from 'react';
import { Pressable, Text, View, StyleSheet } from 'react-native';
import Svg, { Path } from 'react-native-svg';

// Google SVG icon component
function GoogleIcon() {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 48 48"
      fill="none"
    >
      <Path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <Path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <Path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <Path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </Svg>
  );
}

export default function GoogleSignButton({ onPress, disabled, text }: any) {
  const [pressed, setPressed] = useState(false);
  const { colorScheme = 'light' } = useColorScheme();

  return (
    <Pressable
      onPress={onPress}
      cssInterop={false}
      disabled={disabled}
      onPressIn={() => setPressed(true)}
      onPressOut={() => setPressed(false)}
      style={() => [
        styles.button,
        colorScheme === 'dark' && darkStyles.button,
        disabled && styles.buttonDisabled,
        disabled && colorScheme === 'dark' && darkStyles.buttonDisabled,
        pressed && !disabled && styles.buttonPressed,
        pressed && !disabled && colorScheme === 'dark' && darkStyles.buttonPressed,
      ]}
    >
      <View style={[styles.iconWrapper, disabled && styles.iconDisabled]}>
        <GoogleIcon />
      </View>
      <View style={styles.contentWrapper}>
        <Text style={[
          styles.text,
          colorScheme === 'dark' && darkStyles.text,
          disabled && styles.textDisabled,
        ]}>
          {text}
        </Text>
      </View>
      <View
        style={[
          styles.buttonState,
          pressed && !disabled ? styles.buttonStateVisible : null,
        ]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    userSelect: 'none', // not native RN but for clarity
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#747775',
    borderRadius: 999,
    boxSizing: 'border-box',
    color: '#1f1f1f',
    fontFamily: 'Roboto, Arial, sans-serif',
    height: 48,
    letterSpacing: 0.25,
    overflow: 'hidden',
    paddingHorizontal: 12,
    position: 'relative',
    textAlign: 'center',
    verticalAlign: 'middle',
    maxWidth: 400,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ffffff61',
    borderColor: '#1f1f1f1f',
  },
  buttonPressed: {
    backgroundColor: '#f0f0f0', // subtle pressed change
  },
  iconWrapper: {
    height: 20,
    width: 20,
    marginRight: 12,
  },
  iconDisabled: {
    opacity: 0.38,
  },
  contentWrapper: {
    flexGrow: 0,
    fontWeight: '500',
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1f1f1f',
  },
  textDisabled: {
    opacity: 0.38,
  },
  buttonState: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    opacity: 0,
    backgroundColor: '#303030',
  },
  buttonStateVisible: {
    opacity: 0.12,
  },
});

// Minimal dark mode overrides
const darkStyles = StyleSheet.create({
  button: {
    backgroundColor: '#131314',
    borderColor: '#8E918F',
  },
  buttonDisabled: {
    backgroundColor: '#13131461',
    borderColor: '#8E918F1F',
  },
  buttonPressed: {
    backgroundColor: '#222224',
  },
  text: {
    color: '#E3E3E3',
  },
});