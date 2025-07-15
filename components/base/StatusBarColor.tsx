import React from 'react';
import { View } from 'react-native';

interface StatusBarColorProps {
  color: string;
}

export default function StatusBarColor({ color }: StatusBarColorProps) {
  return (
    <View style={{ backgroundColor: color, height: 80, position: 'absolute', top: 0, left: 0, right: 0 }} />
  );
}
