import { View, Text, Alert, Animated } from 'react-native';
import React, { useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { Card } from '@/components/base/Card';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Trash, Edit } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Colors } from '@/constants/themes';
import { useMenuStyles } from '@/styles/menuStyles';
import { Button, IconButton } from '@/components/base/Button';
import NewGoalModal from '@/components/modals/NewGoalModal';
import { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';

export function RightAction(onPressDelete: () => void) {
  return (progress: SharedValue<number>, dragX: SharedValue<number>) => {
    const { colorScheme = 'light' } = useColorScheme();
    const myColors = Colors[colorScheme];

    const styleAnimation = useAnimatedStyle(() => {
      return {
        transform: [{ translateX: dragX.value + 60 }],
      };
    });

    return (
      <Animated.View style={styleAnimation}>
        <View style={{ width: 60 }} className='rounded-2xl flex-row items-center justify-center h-full gap-2'>
          <IconButton onPress={onPressDelete} variant='highlight200' icon={<Trash color={myColors.textPrimary} size={20} />} />
        </View>
      </Animated.View>
    );
  };
}

interface GoalBoardProps {
  className?: string;
}

export default function GoalBoard({ className }: GoalBoardProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [items, setItems] = useState<string[]>([
    'Sleep 8 hours every night',
  ]);
  const { colorScheme = 'light' } = useColorScheme();
  const menuStyles = useMenuStyles();
  const menuRefs = useRef<Menu>(null);

  const handleDelete = (index: number) => {
    Alert.alert('Delete Goal', 'Are you sure you want to delete this goal?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          const updated = [...items];
          updated.splice(index, 1);
          setItems(updated);
        },
      },
    ]);
  };

  return (
    <Card className={className}>
      <View><NewGoalModal visible={isModalVisible} onClose={() => { setIsModalVisible(false) }} /></View>
      <Text className="text-lg text-text-secondary mb-3">
        Setting goals and boundaries helps you stay grounded, focused, and in control of your time and energy — especially when life feels overwhelming.
      </Text>

      <View className="gap-2">
        {items.map((item, index) => {
          const menuRef = useRef<Menu>(null);

          return (
            <View key={index} className="relative">
              {/* Menu (centered absolute position over the Pressable) */}
              <View className="absolute inset-0 left-2 top-2 z-10 pointer-events-none">
                <Menu ref={menuRef}>
                  <MenuTrigger />
                  <MenuOptions customStyles={{ optionsContainer: menuStyles.optionsContainer }}>
                    <MenuOption onSelect={() => handleDelete(index)}>
                      <View style={menuStyles.optionContainer}>
                        <Trash size={18} color={Colors[colorScheme].textPrimary} />
                        <Text style={menuStyles.optionText}>Delete</Text>
                      </View>
                    </MenuOption>
                  </MenuOptions>
                </Menu>
              </View>

              <Swipeable
                dragOffsetFromRightEdge={40}
                rightThreshold={60}
                friction={2}
                renderRightActions={RightAction(() => { handleDelete(index) })}
              >
                <Pressable
                  onLongPress={() => menuRef.current?.open()}
                  className="bg-gray-highlight-100 px-4 py-4 rounded-2xl"
                >
                  <Text className="text-lg font-medium text-text-primary">
                    {item}
                  </Text>
                </Pressable>
              </Swipeable>
            </View>
          )
        })}
      </View>
      <View className="flex-row justify-end mt-4">
        <Button style={{ paddingVertical: 6, paddingHorizontal: 16 }} textStyle={{ fontSize: 14 }} variant='blue' title='Add' onPress={() => { setIsModalVisible(true) }} />
      </View>
    </Card>
  );
}
