import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from 'nativewind'
import { Button, IconButton } from '@/components/base/Button'
import { ArrowUp, EllipsisVertical, Images, Menu, Plus, SidebarOpenIcon } from 'lucide-react-native'
import Animated from 'react-native-reanimated'
import { Colors } from '@/constants/themes'

export default function ChatScreen() {
  const { colorScheme = 'light' } = useColorScheme()

  return (
    <View className='flex-1'>
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

          <View className="px-4 py-3 flex-row gap-2">
            <IconButton icon={<Images color={Colors[colorScheme].textPrimary} size={20} />} onClick={() => { }} className='aspect-square !bg-card' />
            <View className="flex-1 flex-row items-center px-4 py-0.5 bg-card rounded-full">
              <TextInput
                placeholder="Type a message"
                className="flex-1 text-lg text-text-primary"
                placeholderTextColor={colorScheme === 'light' ? '#00000099' : '#ffffff99'}
              />
              <View className='p-1.5 -mx-3 '>
                <IconButton icon={<ArrowUp color={Colors[colorScheme].textPrimary} size={20} />} onClick={() => { }} className='aspect-square flex-1 bg-gray-highlight-100' />
              </View>
            </View>
          </View>
        </SafeAreaView>
        {/* </TouchableWithoutFeedback> */}
      </KeyboardAvoidingView>
    </View>

  )
}