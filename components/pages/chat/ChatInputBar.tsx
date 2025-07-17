import React, { useState } from 'react';
import { View, TextInput } from 'react-native';
import { useColorScheme } from 'nativewind';
import { IconButton } from '@/components/base/Button';
import { ArrowUp, Images } from 'lucide-react-native';
import { Colors } from '@/constants/themes';

interface ChatInputBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onSend: () => void;
}

export default function ChatInputBar({ value, onChangeText, onSend }: ChatInputBarProps) {
  const { colorScheme = 'light' } = useColorScheme();
  const [inputHeight, setInputHeight] = useState(40);

  return (
    <View className="px-4 py-3 flex-row gap-2 items-end">
      {/* Left Icon */}
      <IconButton
        icon={<Images color={Colors[colorScheme].textPrimary} size={20} />}
        onClick={() => { /* handle image picker here if needed */ }}
        className="h-[48px] w-[48px] !bg-card"
      />

      {/* Input Container */}
      <View className="flex-1 flex-row bg-card rounded-[24px] pl-4 py-1 gap-1 items-center">
        {/* Growing TextInput */}
        <TextInput
          onContentSizeChange={(event) => {
            setInputHeight(Math.max(40, event.nativeEvent.contentSize.height));
          }}
          style={{ height: Math.max(40, inputHeight), maxHeight: 200, textAlignVertical: 'center' }}
          placeholder="Type a message"
          multiline
          value={value}
          onChangeText={onChangeText}
          className="flex-1 text-lg text-text-primary py-2"
          placeholderTextColor={colorScheme === 'light' ? '#00000099' : '#ffffff99'}
        />

        {/* Send Button */}
        <View className="h-[40px] w-[40px] mr-1 justify-center items-center rounded-full bg-gray-highlight-100 self-end">
          <IconButton
            icon={<ArrowUp color={Colors[colorScheme].textPrimary} size={20} />}
            onClick={onSend}
            className="aspect-square"
          />
        </View>
      </View>
    </View>
  );
}
