import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import SafeAreaView from '@/components/base/MySafeArea';
import Header from '@/components/base/Header';
import { useColorScheme } from 'nativewind';
import { LinearGradient } from 'expo-linear-gradient';
import MeditationAnimation from '@/components/pages/relax/MeditationAnimation';
import AudioSlider from '@/components/pages/relax/AudioSlider';
import { IconButton } from '@/components/base/Button';
import { Play, Pause } from 'lucide-react-native';
import * as FileSystem from 'expo-file-system';
import { useAudioPlayer, AudioStatus } from 'expo-audio';
import { useMeditationStore } from '@/store/meditationStore';
import { router } from 'expo-router';
import { Colors } from '@/constants/themes';


const gradients = {
  dark: ['#353535', '#1a1a1a'],
  light: ['#f5f5f5', '#eaeaea'],
}

export default function Meditation() {
  const { selectedMeditation } = useMeditationStore();
  const { colorScheme = 'light' } = useColorScheme();
  const colorSchemeInverted = colorScheme === 'dark' ? 'light' : 'dark';
  const [accuratePlay, setAccuratePlay] = useState(true);

  if (!selectedMeditation) router.back();

  const uri = selectedMeditation.fileName
    ? `${FileSystem.documentDirectory}${selectedMeditation.fileName}`
    : null;


  const player = useAudioPlayer(uri || undefined);

  const [audioStatus, setAudioStatus] = useState<AudioStatus>(player.currentStatus);

  useEffect(() => {
    player.play();

    const onStatusUpdate = (status: AudioStatus) => {
      setAudioStatus(status);
      if (!status.isBuffering) {
        setAccuratePlay(status.playing);
      }
    };

    player.addListener('playbackStatusUpdate', onStatusUpdate);

    return () => {
      player.removeListener('playbackStatusUpdate', onStatusUpdate);
    };
  }, [player]);


  return (
    <LinearGradient colors={gradients[colorScheme] as any} style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 p-sides color-[#272e3f]" edges={{ top: true, bottom: true }}>
        <Header title="" />
        <View className="px-8 justify-center flex-1 pb-20">
          <View className="w-full aspect-square p-4">
            <MeditationAnimation speed={0.5} stop={audioStatus !== undefined ? !audioStatus?.playing : true} />
          </View>

          <Text className="text-2xl text-text-primary font-bold mb-4 mt-16">
            {selectedMeditation.name || 'Guided Meditation'}
          </Text>

          <AudioSlider position={audioStatus?.currentTime || 0} duration={audioStatus?.duration || 999} onSeek={(val) => {
            player?.seekTo(val);
            setAudioStatus((prev) => ({
              ...prev,
              currentTime: val,
            }));
          }} />

          <View className="items-center mt-6 space-x-4 flex-row justify-center">
            <IconButton
              variant="full"
              style={{ padding: 18, borderRadius: 999 }}
              onPress={() => {
                if (!accuratePlay) {
                  player.play();
                } else {
                  player.pause();
                }
              }}
              disabled={!player}
              icon={!accuratePlay ? (
                <Play fill={Colors[colorSchemeInverted].textFull} color={Colors[colorSchemeInverted].textFull} size={34} />
              ) : (
                <Pause fill={Colors[colorSchemeInverted].textFull} color={Colors[colorSchemeInverted].textFull} size={34} />
              )}
            >
            </IconButton>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
