import { View, Text, Alert, Animated } from 'react-native';
import React, { useEffect, useRef, useState } from 'react';
import { Pressable } from 'react-native';
import { Card } from '@/components/base/Card';
import { Menu, MenuOptions, MenuOption, MenuTrigger } from 'react-native-popup-menu';
import { Trash, Edit } from 'lucide-react-native';
import { useColorScheme } from 'nativewind';
import { Colors, getMotiColors } from '@/constants/themes';
import { useMenuStyles } from '@/styles/menuStyles';
import { Button, IconButton } from '@/components/base/Button';
import NewGoalModal from '@/components/modals/NewGoalModal';
import { SharedValue, useAnimatedStyle } from 'react-native-reanimated';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import { goals$ } from '@/utils/SupaLegend';
import { GoalRow } from '@/utils/types';
import { MotiView } from 'moti';
import { Skeleton } from 'moti/skeleton';
import { observer } from '@legendapp/state/react';
import { deleteGoal } from '@/utils/queries';

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

const GoalBoard = observer(function GoalBoard({ className }: GoalBoardProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { colorScheme = 'light' } = useColorScheme();


  const [goalsLoaded, setGoalsLoaded] = useState(false);

  const items = Object.values(goals$.get() || {});

  useEffect(() => {
    if (goals$.get() != undefined) {
      setTimeout(() => {
        setGoalsLoaded(true);
      }, 400);

    }
  }, [goals$.get()]);

  return (
    <Card className={className}>
      <View><NewGoalModal visible={isModalVisible} onClose={() => { setIsModalVisible(false) }} /></View>
      <Text className="text-lg text-text-secondary mb-3">
        Setting goals and boundaries helps you stay grounded, focused, and in control of your time and energy — especially when life feels overwhelming.
      </Text>

      {!goalsLoaded ? (
        <MotiView>
          <Skeleton
            colors={getMotiColors(colorScheme)}
            colorMode={colorScheme}
            radius={16}
            height={60}
            width={'100%'}
          />
          <View className="h-2" />
        </MotiView>
      ) : items.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-text-secondary text-lg mt-4">No goals set yet</Text>
        </View>
      ) : (
        <View className="gap-2">
          {items.map((item) => (
            <GoalItem key={item.id} goal={item} />
          ))}
        </View>
      )}
      <View className="flex-row justify-end mt-4">
        <Button style={{ paddingVertical: 6, paddingHorizontal: 16 }} textStyle={{ fontSize: 14 }} variant='blue' title='Add' onPress={() => { setIsModalVisible(true) }} />
      </View>
    </Card>
  );
});

export default GoalBoard;


type GoalItemProps = {
  goal: GoalRow;
};

export const GoalItem: React.FC<GoalItemProps> = ({ goal }) => {
  const menuRef = useRef<Menu>(null);
  const { colorScheme = 'light' } = useColorScheme();
  const menuStyles = useMenuStyles();

  const handleDelete = () => {
    deleteGoal(goal.id);
    menuRef.current?.close();
  };


  return (
    <View className="relative">
      {/* Menu - positioned absolutely over the item */}
      <View className="absolute inset-0 left-2 top-2 z-10 pointer-events-none">
        <Menu ref={menuRef}>
          <MenuTrigger />
          <MenuOptions customStyles={{ optionsContainer: menuStyles.optionsContainer }}>
            <MenuOption onSelect={handleDelete}>
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
        renderRightActions={RightAction(handleDelete)}
      >
        <Pressable
          onLongPress={() => menuRef.current?.open()}
          className="bg-gray-highlight-100 px-4 py-4 rounded-2xl"
        >
          <Text className="text-lg font-medium text-text-primary">{goal.text}</Text>
        </Pressable>
      </Swipeable>
    </View>
  );
};