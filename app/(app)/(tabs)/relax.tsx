import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import SafeAreaView from '@/components/base/MySafeArea';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import RelaxColorCard from '@/components/pages/relax/RelaxColorCard';
import { Button } from '@/components/base/Button';
import { router } from 'expo-router';
import { useColorScheme } from 'nativewind';
import { useDownloaded } from '@/hooks/useDownloaded';
import * as FileSystem from 'expo-file-system';
import { Download, LoaderCircle } from 'lucide-react-native';
import { useSnackbar } from '@/components/base/Snackbar';
import { meditationAudios } from '@/constants/relax';
import { useMeditationStore } from '@/store/meditationStore';
import { useBreathingStore } from '@/store/breathingStore';
import { breathings } from '@/constants/breathing';

export default function Relax() {
  const { colorScheme = 'light' } = useColorScheme();
  const { setSelectedBreathing } = useBreathingStore();

  return (
    <SafeAreaView className="flex-1 bg-background" edges={{ top: true }}>
      <Animated.ScrollView contentContainerClassName="p-sides">
        <Text className="text-3xl text-text-primary font-bold mt-1">Relax & Mindfulness</Text>
        <Text className="text-lg text-text-secondary mb-8">Explore techniques to calm your mind and body.</Text>

        <RelaxColorCard variant='meditation' />
        {meditationAudios.map(audio => (
          <DownloadButton key={audio.fileName} audio={audio} />
        ))}

        <View className='h-8' />

        <RelaxColorCard variant='breathing' />
        {breathings.map(btn => (
          <Button
            key={btn.id}
            onPress={() => { setSelectedBreathing({ id: btn.id, name: btn.name }); router.push(`/breathing`) }}
            variant='card'
            style={{ marginBottom: 12, borderRadius: 24, paddingVertical: 20, flexDirection: 'row', justifyContent: 'space-between' }}
          >
            <Text className='text-lg text-text-primary font-semibold'>{btn.name}</Text>
          </Button>
        ))}

      </Animated.ScrollView>
    </SafeAreaView>
  );
}

function DownloadButton({ audio }: { audio: { name: string; url: string; fileName: string } }) {
  const { setSelectedMeditation } = useMeditationStore();
  const { isDownloaded, localUri, refresh, isChecking } = useDownloaded(audio.fileName);
  const snackbar = useSnackbar();
  const [loading, setLoading] = useState(false);

  const onDownload = async () => {
    setLoading(true);
    snackbar({
      message: 'Downloading audio...',
      type: 'info',
      duration: 3000,
    });
    try {
      await FileSystem.downloadAsync(audio.url, localUri);
      refresh(); // update downloaded status after download
    } catch (e) {
      snackbar({
        message: 'Download failed, check your internet connection.',
        type: 'error',
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePress = () => {
    if (isDownloaded) {
      setSelectedMeditation({
        name: audio.name,
        fileName: audio.fileName,
      })
      router.push('/meditation'); // Navigate to meditation page if downloaded
    } else if (!loading) {
      onDownload(); // Start download if not already loading
    }
  }

  return (
    <Button
      variant="card"
      style={{
        marginBottom: 12,
        borderRadius: 24,
        paddingVertical: 20,
        flexDirection: 'row',
        gap: 12,
        justifyContent: 'space-between',
      }}
      onPress={handlePress} // or pass dynamic route if needed
    >
      <Text className="text-lg text-text-primary font-semibold">{audio.name}</Text>
      <View style={{ justifyContent: 'center' }}>
        {!isChecking ? <>
          {loading ? (
            <RotatingDownloadSpinner />
          ) : !isDownloaded ? (
            <Download size={24} color="gray" onPress={e => {
              e.stopPropagation(); // prevent triggering button onPress
              onDownload();
            }} />
          ) : null}
        </>
          :
          undefined
        }
      </View>
    </Button>
  );
}

const RotatingDownloadSpinner = ({ size = 24, color = 'gray' }) => {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 1000, easing: Easing.linear }),
      -1
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotateZ: `${rotation.value}deg` }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <LoaderCircle size={size} color={color} />
    </Animated.View>
  );
};

async function deleteDownloadedFile(localUri: string) {
  try {
    const fileInfo = await FileSystem.getInfoAsync(localUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(localUri);
      console.log('File deleted:', localUri);
    } else {
      console.log('File does not exist:', localUri);
    }
  } catch (error) {
    console.error('Error deleting file:', error);
  }
}

async function clearAllMeditationFiles() {
  for (const audio of meditationAudios) {
    const localUri = `${FileSystem.documentDirectory}${audio.fileName}`;
    await deleteDownloadedFile(localUri);
  }
}
