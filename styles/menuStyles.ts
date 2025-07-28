// components/menuStyles.ts
import { StyleSheet } from 'react-native';
import { Colors } from '@/constants/themes';
import { useColorScheme } from 'nativewind';

export const useMenuStyles = () => {
  const { colorScheme = 'light' } = useColorScheme();

  return StyleSheet.create({
    optionsContainer: {
      paddingVertical: 6,
      borderRadius: 12,
      backgroundColor: Colors[colorScheme].backgroundSecondary,
      elevation: 4,
      width: 160,
    },
    optionContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
    },
    optionText: {
      fontSize: 16,
      marginLeft: 12,
      color: Colors[colorScheme].textPrimary,
    },
  });
};
