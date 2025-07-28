import CustomTabBar from '@/components/base/BottomBar';
import { Colors } from '@/constants/themes';
import { Tabs } from 'expo-router';
import { colorScheme, useColorScheme } from 'nativewind';

export default function TabsLayout() {

  const { colorScheme = 'light' } = useColorScheme();
  return (
    <Tabs
      initialRouteName='index'
      screenOptions={{
        headerShown: false,
        animation: 'shift',
        sceneStyle: { backgroundColor: Colors[colorScheme].background },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="journal" options={{ title: 'Home' }} />
      <Tabs.Screen name="relax" options={{ title: 'Home' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}