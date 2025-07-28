import React from 'react';
import { Modal as RNModal, View, Pressable } from 'react-native';
import { X } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Colors } from '@/constants/themes';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  backdropOpacity?: number;
};

export default function Modal({
  isVisible,
  onClose,
  children,
  backdropOpacity = 0.7,
}: Props) {
  if (!isVisible) return null;

  return (
    <RNModal
      transparent
      visible={isVisible}
      animationType="fade"
      statusBarTranslucent={true}
      onRequestClose={onClose}

    >
      {/* Backdrop */}
      <Pressable
        className="absolute inset-0 bg-black"
        style={{ opacity: backdropOpacity }}
        onPress={onClose}
      />

      {/* Modal content */}
      <View className='p-sides justify-center items-center flex-1'>
        <View className="rounded-3xl relative p-card bg-card-reversed w-full">
          {children}
        </View>
      </View>
    </RNModal>
  );
}
