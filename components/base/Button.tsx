import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { Text } from 'react-native';
import { useColorScheme } from 'nativewind';
import { Colors } from '@/constants/themes';

interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

interface IconButtonProps {
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  className?: string;
}

export function IconButton({ icon, onClick, disabled = false, className = '' }: IconButtonProps) {
  return (
    <TouchableOpacity
      className={`justify-center items-center rounded-full bg-gray-highlight-100 ${className}`}
      onPress={onClick}
      disabled={disabled}
    >
      {icon}
    </TouchableOpacity>
  );
}
export function SubCardOpenButton({ label, onClick, disabled = false, className = '' }: ButtonProps) {
  const { colorScheme = 'light' } = useColorScheme();

  return (
    <TouchableOpacity
      className={`flex-row justify-between items-center px-6 py-4 rounded-full bg-background ${className}`}
      onPress={onClick}
      disabled={disabled}
    >
      <Text className="text-text-primary font-medium">{label}</Text>
      <Text className="text-text-primary"><ChevronRight size={20} color={Colors[colorScheme].textPrimary} /></Text>
    </TouchableOpacity>
  );
}

export function Button({ label, onClick, disabled = false, className = '' }: ButtonProps) {
  return (
    <TouchableOpacity
      className={`px-4 py-2 rounded-full bg-blue-button ${className}`}
      onPress={onClick}
      disabled={disabled}
    >
      <Text className="text-blue-button-text font-semibold text-center">{label}</Text>
    </TouchableOpacity>
  );
}