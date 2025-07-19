import { Drawer } from 'expo-router/drawer';
import { useColorScheme } from 'nativewind';
import { ScrollView, Text, Pressable, View, Alert } from 'react-native';
import { Colors } from '@/constants/themes';
import { BorderlessButton, GestureHandlerRootView, RectButton } from 'react-native-gesture-handler';
import { useChatStore } from '@/store/chatStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { useRef } from 'react';
import { MessageCircle, Square, Trash } from 'lucide-react-native';
import { useMenuStyles } from '@/styles/menuStyles';
import { DrawerNavigationProp } from '@react-navigation/drawer';

interface Chat {
  id: string;
  title: string;
}

const chats = [
  { id: '1', title: 'Chat with John' },
  { id: '2', title: 'Team Standup Notes' },
  { id: '3', title: 'Project Alpha Discussion' },
  { id: '4', title: 'AI Assistant' },
  { id: '5', title: 'Weekend Plans' },
  { id: '6', title: 'Design Feedback' },
  { id: '7', title: 'Marketing Ideas' },
  { id: '8', title: 'Client Onboarding' },
  { id: '9', title: 'Code Review with Sarah' },
  { id: '10', title: 'Random Thoughts' },
  { id: '11', title: 'Meeting Summary' },
  { id: '12', title: 'Product Roadmap' },
  { id: '13', title: 'Support Chat' },
  { id: '14', title: 'Lunch Poll' },
  { id: '16', title: 'Sprint Planning' },
  { id: '17', title: 'Sprint Planning' },
  { id: '18', title: 'Sprint Planning' },
  { id: '19', title: 'Sprint Planning' },
];

export default function CustomDrawer() {
  const { colorScheme = 'light' } = useColorScheme();
  const { currentChatId, setCurrentChatId } = useChatStore();

  if (!currentChatId) {
    setCurrentChatId('1'); // Default to the first chat if none is selected
  }

  return (
    <Drawer
      drawerContent={({ navigation, state }) => (
        <CustomDrawerContent
          navigation={navigation}
          state={state}
          colorScheme={colorScheme}
        />
      )}
      screenOptions={{
        swipeEdgeWidth: 200,
        drawerStyle: {
          backgroundColor: Colors[colorScheme].background,
          width: '70%',
          borderTopRightRadius: 0,
          borderBottomRightRadius: 0,
        },
        headerShown: false,
      }}
    >
      <Drawer.Screen
        name="index"
        options={{ title: 'Chat' }}
      />
    </Drawer>
  );
}

//////////////////////////////////////////
// Custom Drawer Component
/////////////////////////////////////////

interface CustomDrawerContentProps {
  navigation: any;
  state: any;
  colorScheme: 'light' | 'dark';
}

function CustomDrawerContent({ navigation, state, colorScheme }: CustomDrawerContentProps) {
  const { currentChatId, setCurrentChatId } = useChatStore();
  const menuStyles = useMenuStyles();

  if (!currentChatId) {
    setCurrentChatId('1'); // Default if none selected
  }

  return (
    <View className='flex-1 bg-background'>
      <SafeAreaView className='flex-1' edges={['top']}>
        <ScrollView className='flex-1 pt-4' showsVerticalScrollIndicator={false}>
          <Text className='px-4 mb-2 font-medium text-xl text-text-primary'>Feeling Burnout</Text>

          <View className='flex-row items-center justify-between rounded-full mb-4'>
            <Text className='px-4 text-base text-text-secondary'>Tokens</Text>
            <Text className='px-4 text-base text-text-secondary'>200K</Text>
          </View>
          <Pressable className='flex-row items-center px-4 py-3 gap-4' onPress={() => Alert.alert('Create New Chat')}>
            <Square size={20} strokeWidth={3} color={Colors[colorScheme].textPrimary} />
            <Text className='text-lg font-medium text-text-primary'>New Chat</Text>
          </Pressable>
          <View className='flex-row items-center px-4 py-3 gap-4'>
            <MessageCircle size={20} strokeWidth={3} color={Colors[colorScheme].textPrimary} />
            <Text className='font-medium text-lg text-text-primary'>Your Chats</Text>
          </View>

          <View className='pb-12'>
            {chats.map((chat) => {
              const isFocused =
                state.routeNames[state.index] === 'index' && currentChatId === chat.id;

              return (
                <ChatDrawerItem
                  key={chat.id}
                  chat={chat}
                  isFocused={isFocused}
                  setCurrentChatId={setCurrentChatId}
                  navigation={navigation}
                  menuStyles={menuStyles}
                  colorScheme={colorScheme}
                />
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}


//////////////////////////////////////////
// DrawerItem component
/////////////////////////////////////////

interface ChatDrawerItemProps {
  chat: Chat;
  isFocused: boolean;
  setCurrentChatId: (id: string) => void;
  navigation: any; // or a more specific route param type if you have it
  menuStyles: any;
  colorScheme: 'light' | 'dark';
}

function ChatDrawerItem({ chat, isFocused, setCurrentChatId, navigation, menuStyles, colorScheme }: ChatDrawerItemProps) {
  const menuRef = useRef<any>(undefined);

  return (
    <View key={chat.id}>
      <View className='absolute -right-2 bottom-6 z-10'>
        <Menu ref={menuRef}>
          <MenuTrigger style={{ marginLeft: 10 }} />
          <MenuOptions customStyles={{ optionsContainer: menuStyles.optionsContainer }}>
            <MenuOption onSelect={() => Alert.alert('Delete Chat')}>
              <View style={menuStyles.optionContainer}>
                <Trash size={18} color={Colors[colorScheme].textPrimary} />
                <Text style={menuStyles.optionText}>Delete</Text>
              </View>
            </MenuOption>
          </MenuOptions>
        </Menu>
      </View>
      <View className='overflow-hidden rounded-full mx-2'>
        <RectButton
          activeOpacity={0.7}
          underlayColor='white'
          onPress={() => {
            setCurrentChatId(chat.id);
            navigation.closeDrawer();
          }}
          onLongPress={menuRef.current?.open}
        >
          <Text className={`${isFocused ? 'text-text-primary' : 'text-text-secondary'} text-lg`}>
            {chat.title}
          </Text>
        </RectButton>
      </View>
    </View>
  );
}