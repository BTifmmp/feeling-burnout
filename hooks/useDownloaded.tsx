import { useEffect, useState, useCallback } from "react";
import * as FileSystem from 'expo-file-system';

export function useDownloaded(fileName: string) {
  const [isDownloaded, setIsDownloaded] = useState(false);
  const [isChecking, setChecking] = useState(true);

  const localUri = `${FileSystem.documentDirectory}${fileName}`;

  const checkFile = useCallback(async () => {
    try {
      setChecking(true);
      const info = await FileSystem.getInfoAsync(localUri);
      setIsDownloaded(info.exists);
    } catch {
      setIsDownloaded(false);
    } finally {
      setChecking(false);
    }
  }, [localUri]);

  useEffect(() => {
    checkFile();
  }, [checkFile]);

  return { isDownloaded, localUri, refresh: checkFile, isChecking };
}