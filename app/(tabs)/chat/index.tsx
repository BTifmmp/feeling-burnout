import { View, TextInput, TouchableOpacity, Text, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColorScheme } from 'nativewind'
import { IconButton } from '@/components/base/Button'
import { ArrowUp, EllipsisVertical, Images, SidebarOpenIcon, Trash, Trash2 } from 'lucide-react-native'
import Animated from 'react-native-reanimated'
import { Colors } from '@/constants/themes'
import { useEffect, useRef, useState } from 'react'
import { useNavigation } from 'expo-router'
import { DrawerActions } from '@react-navigation/native'
import { useChatStore } from '@/store/chatStore'
import { MenuOption, MenuOptions, MenuTrigger, Menu } from 'react-native-popup-menu'
import { useMenuStyles } from '@/styles/menuStyles'
import ChatInputBar from '@/components/pages/chat/ChatInputBar'
import { ChatMessage, UserMessage } from '@/components/pages/chat/MessageCards'

export default function ChatScreen() {
  const [inputValue, setInputValue] = useState('');
  const { currentChatId } = useChatStore();

  useEffect(() => {
    if (currentChatId) {
      console.log(`Current chat ID: ${currentChatId}`);
      setInputValue('');
    }
  }, [currentChatId]);

  return (
    <View className='flex-1 bg-background'>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: 'black' }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <SafeAreaView className="flex-1 bg-background" edges={['top']}>
          <ChatScreenHeader />

          <Animated.ScrollView
            keyboardShouldPersistTaps="handled"
            keyboardDismissMode={'on-drag'}
            className="flex-1 px-4 py-2"
            contentContainerStyle={{ flexGrow: 1, justifyContent: 'flex-end' }}
            showsVerticalScrollIndicator={false}
          >
            <UserMessage text="hi" />
            <ChatMessage text="Hello! How can I assist you today?" />
            <UserMessage text="I need help with my React Native project." />
            <ChatMessage text="Sure! What specific issues are you facing?" />
          </Animated.ScrollView>

          <ChatInputBar value={inputValue} onChangeText={(text: string) => { setInputValue(text) }} onSend={() => { }} />
        </SafeAreaView>
      </KeyboardAvoidingView>
    </View >

  )
}

//////////////////////////////////////////
// Custom Header Component
/////////////////////////////////////////

export function ChatScreenHeader() {
  const { colorScheme = 'light' } = useColorScheme();
  const navigation = useNavigation();
  const menuStyles = useMenuStyles();
  const menuRef = useRef<Menu>(null);

  return (
    <View className='flex-row items-center justify-between px-sides py-2'>
      <TouchableOpacity onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
        <SidebarOpenIcon color={Colors[colorScheme].textPrimary} />
      </TouchableOpacity>

      <View>
        <TouchableOpacity onPress={() => { menuRef.current?.open() }}>
          <EllipsisVertical color={Colors[colorScheme].textPrimary} />
        </TouchableOpacity>
        <View className='absolute right-0 -bottom-1 z-10'>
          <Menu ref={menuRef}>
            <MenuTrigger />
            <MenuOptions customStyles={{ optionsContainer: [menuStyles.optionsContainer, { width: 200 }] }}>
              <MenuOption onSelect={() => console.log('Delete Chat')}>
                <View style={menuStyles.optionContainer}>
                  <Trash size={18} color={Colors[colorScheme].textPrimary} />
                  <Text style={menuStyles.optionText}>Delete Chat</Text>
                </View>
              </MenuOption>
              <MenuOption onSelect={() => console.log('Delete All Chats')}>
                <View style={menuStyles.optionContainer}>
                  <Trash2 size={18} color={Colors[colorScheme].textPrimary} />
                  <Text style={menuStyles.optionText}>Delete All Chats</Text>
                </View>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
      </View>
    </View>
  );
}