import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from 'nativewind'
import { Button, IconButton } from '@/components/base/Button'
import { ArrowUp, EllipsisVertical, Images, Menu, Plus, SidebarOpenIcon } from 'lucide-react-native'
import Animated from 'react-native-reanimated'
import { Colors } from '@/constants/themes'
import { useState } from 'react'
import { transform } from '@babel/core'

export default function ChatScreen() {
  const { colorScheme = 'light' } = useColorScheme()

  const [inputHeight, setInputHeight] = useState(45) // Default height for the input

  return (
    <View className='flex-1 bg-background'>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: 'black' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss} className='flex-1'> */}
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
          <View className='px-sides py-2 flex-row justify-between items-center'>
            <SidebarOpenIcon color={Colors[colorScheme].textPrimary} />
            <EllipsisVertical color={Colors[colorScheme].textPrimary} />
          </View>

          <Animated.ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={'on-drag'}
            className="flex-1 px-4 py-2"
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
            showsVerticalScrollIndicator={false}
          >

            <View className="mb-4 max-w-[85%] self-end items-end">
              <View className="bg-card px-4 py-3 rounded-3xl">
                <Text className="text-text-primary text-lg leading-relaxed text-left">
                  Thanks! I’m building a mobile app and could use some help styling components.
                </Text>
              </View>
            </View>

            <View className="mb-4 max-w-[85%] self-start">
              <View className="bg-primary px-2 py-3 rounded-3xl">
                <Text className="text-text-primary text-lg leading-relaxed">
                  Hey! I'm here to help. Feel free to ask me anything — whether it's code, ideas, or troubleshooting.
                </Text>
              </View>
            </View>

            <View className="mb-4 max-w-[85%] self-end items-end">
              <View className="bg-card px-4 py-3 rounded-3xl">
                <Text className="text-text-primary text-lg leading-relaxed text-left">
                  Thanks! I’m building a mobile app and could use some help styling components.
                </Text>
              </View>
            </View>

            <View className="mb-4 max-w-[85%] self-start">
              <View className="bg-primary px-2 py-3 rounded-3xl">
                <Text className="text-text-primary text-lg leading-relaxed">
                  Hey! I'm here to help. Feel free to ask me anything — whether it's code, ideas, or troubleshooting.
                </Text>
              </View>
            </View>
          </Animated.ScrollView>

          <View className="px-4 py-3 flex-row gap-2 items-end">
            {/* Left Icon */}
            <IconButton
              icon={<Images color={Colors[colorScheme].textPrimary} size={20} />}
              onClick={() => { }}
              className="h-[48px] w-[48px] !bg-card"
            />

            {/* Input Container */}
            <View className="flex-1 flex-row bg-card rounded-[24px] pl-4 py-1 gap-1 items-center">
              {/* Growing TextInput */}
              <TextInput
                onContentSizeChange={(event) => {
                  setInputHeight(Math.max(40, event.nativeEvent.contentSize.height));
                }}
                style={{ height: Math.max(40, inputHeight), maxHeight: 200, textAlignVertical: 'center' }} // Set min and max height
                placeholder="Type a message"
                multiline
                className="flex-1 text-lg text-text-primary py-2"
                placeholderTextColor={colorScheme === 'light' ? '#00000099' : '#ffffff99'}
              />

              {/* Send Button */}
              <View className="h-[36px] w-[36px] mr-1.5 mb-0.5 justify-center items-center rounded-full bg-gray-highlight-100 self-end">
                <IconButton
                  icon={<ArrowUp color={Colors[colorScheme].textPrimary} size={20} />}
                  onClick={() => { }}
                  className="aspect-square"
                />
              </View>
            </View>
          </View>
        </SafeAreaView>
        {/* </TouchableWithoutFeedback> */}
      </KeyboardAvoidingView>
    </View>

  )
}