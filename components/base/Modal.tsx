import React from 'react';
import { Modal as RNModal, View, Pressable } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

type Props = {
  isVisible: boolean;
  onClose: () => void;
  children?: React.ReactNode;
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

      {/* Modal content */}
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* Backdrop */}
        <Pressable
          className="absolute inset-0 bg-black"
          style={{ opacity: backdropOpacity }}
          onPress={onClose}
        />
        <View className='p-sides justify-center items-center flex-1'>
          <View className="rounded-3xl p-card bg-card-reversed w-full">
            {children}
          </View>
        </View>
      </GestureHandlerRootView>
    </RNModal>
  );
}
