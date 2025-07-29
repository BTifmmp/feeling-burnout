import React, { useEffect } from 'react';
import { View, Animated, Easing } from 'react-native';
import { useColorScheme } from 'nativewind'; // Import useColorScheme
import { Colors } from '@/constants/themes';

interface SkeletonViewProps {
  width: number | string;
  height: number | string;
  borderRadius?: number;
  className?: string; // For additional nativewind classes
  // New prop for color variant: 'default' will use grayHighlight200
  // 'highlight1' will use grayHighlight100, 'highlight2' uses 200, 'highlight3' uses 300
  variant?: 'default' | 'highlight1' | 'highlight2' | 'highlight3';
}

// Helper function to convert hex to RGBA with a specified alpha
const hexToRgba = (hex: string, alpha: number): string => {
  if (!hex || hex.length < 7) { // Basic validation for hex string
    console.warn(`Invalid hex color: ${hex}. Using default.`);
    return `rgba(0, 0, 0, ${alpha})`; // Fallback
  }
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export function SkeletonView({ width, height, borderRadius = 4, className, variant = 'default' }: SkeletonViewProps) {
  const shimmerAnimation = new Animated.Value(0);
  const { colorScheme } = useColorScheme(); // Get current theme (light/dark)

  useEffect(() => {
    // Start the shimmer animation loop
    const startAnimation = () => {
      shimmerAnimation.setValue(0); // Reset animation value
      Animated.loop(
        Animated.timing(shimmerAnimation, {
          toValue: 1,
          duration: 1500, // Duration of one shimmer cycle
          easing: Easing.linear,
          useNativeDriver: true, // Use native driver for better performance
        })
      ).start();
    };

    startAnimation();
  }, []);

  // Determine the base color based on the variant and current theme
  let baseColorHex: string;
  let shimmerColorHex: string;

  if (colorScheme === 'dark') {
    switch (variant) {
      case 'highlight1':
        baseColorHex = Colors.dark.grayHighlight100;
        shimmerColorHex = Colors.dark.grayHighlight200; // Slightly lighter for shimmer
        break;
      case 'highlight2':
        baseColorHex = Colors.dark.grayHighlight200;
        shimmerColorHex = Colors.dark.grayHighlight300; // Slightly lighter for shimmer
        break;
      case 'highlight3':
        baseColorHex = Colors.dark.grayHighlight300;
        shimmerColorHex = Colors.dark.grayHighlight200; // Use a slightly lighter gray for shimmer
        break;
      case 'default':
      default:
        baseColorHex = Colors.dark.grayHighlight200;
        shimmerColorHex = Colors.dark.grayHighlight300;
        break;
    }
  } else { // light theme
    switch (variant) {
      case 'highlight1':
        baseColorHex = Colors.light.grayHighlight100;
        shimmerColorHex = Colors.light.grayHighlight200; // Slightly lighter for shimmer
        break;
      case 'highlight2':
        baseColorHex = Colors.light.grayHighlight200;
        shimmerColorHex = Colors.light.grayHighlight300; // Slightly lighter for shimmer
        break;
      case 'highlight3':
        baseColorHex = Colors.light.grayHighlight300;
        shimmerColorHex = Colors.light.grayHighlight200; // Use a slightly lighter gray for shimmer
        break;
      case 'default':
      default:
        baseColorHex = Colors.light.grayHighlight200;
        shimmerColorHex = Colors.light.grayHighlight300;
        break;
    }
  }

  // Interpolate the background color for the shimmer effect
  const backgroundColor = shimmerAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [
      hexToRgba(baseColorHex, 0.3), // Base color with lower opacity
      hexToRgba(shimmerColorHex, 0.5), // Shimmer color with higher opacity
      hexToRgba(baseColorHex, 0.3), // Back to base color with lower opacity
    ],
  });

  return (
    <Animated.View
      className={`overflow-hidden ${className}`} // Remove direct bg-gray-300 as it's now dynamic
      style={{
        width: width as any,
        height: height as any,
        borderRadius: borderRadius,
        backgroundColor: backgroundColor, // Apply the animated background color
      }}
    />
  );
}
