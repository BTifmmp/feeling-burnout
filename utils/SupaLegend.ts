// @ts-nocheck

import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types'; // This must include journals + moods tables
import { observable } from '@legendapp/state';
import { syncedSupabase } from '@legendapp/state/sync-plugins/supabase';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { configureSynced } from '@legendapp/state/sync';
import { observablePersistAsyncStorage } from '@legendapp/state/persist-plugins/async-storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

const supabase = createClient<Database>(
  process.env.EXPO_PUBLIC_SUPABASE_URL as string,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY as string,
  {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
}
);

export { supabase };

const generateId = () => uuidv4();

const customSynced = configureSynced(syncedSupabase, {
  persist: {
    plugin: observablePersistAsyncStorage({ AsyncStorage }),
  },
  generateId,
  supabase,
  changesSince: 'last-sync',
  fieldCreatedAt: 'inserted_at',
  fieldUpdatedAt: 'updated_at',
  fieldDeleted: 'deleted',
});

// ------------------ Moods Store ------------------
export const moods$ = observable(
  customSynced({
    supabase,
    collection: 'moods',
    select: (from) =>
      from.select('id, mood_value, inserted_at, updated_at, deleted, at_local_time_added'),
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    persist: {
      name: 'moods',
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
  })
);

// ------------------ Journals Store ------------------
export const journals$ = observable(
  customSynced({
    supabase,
    collection: 'journals',
    select: (from) =>
      from.select('id, entry, badge, inserted_at, updated_at, deleted, at_local_time_added'),
    actions: ['read', 'create', 'update', 'delete'],
    realtime: true,
    persist: {
      name: 'journals',
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
  })
);