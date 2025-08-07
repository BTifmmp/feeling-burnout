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
import { supabase } from '@/utils/supabaseClient';
import { useAuthStore } from '@/store/authStore';


export const userId$ = observable(useAuthStore.getState().user?.id || '');

useAuthStore.subscribe((state) => {
  if (state.user?.id) {
    userId$.set(state.user.id);
  } else {
    userId$.set('');
  }
}, (prev, next) => prev.user?.id !== next.user?.id);



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

const uid = '';

// ------------------ Moods Store ------------------
export const moods$ = observable(
  customSynced({
    supabase,
    collection: 'moods',
    select: (from) =>
      from.select('id, mood_value, at_local_time_added, deleted'),
    actions: ['read', 'create', 'update'],
    filter: (select) => select.eq('user_id', userId$.get()),
    realtime: { filter: `user_id=eq.${userId$.get()}` },
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
      from.select('id, entry, badge, at_local_time_added, deleted'),
    actions: ['read', 'create', 'update'],
    filter: (select) => select.eq('user_id', userId$.get()),
    realtime: { filter: `user_id=eq.${userId$.get()}` },
    persist: {
      name: 'journals',
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
  })
);

// ------------------ Goals Store ------------------
export const goals$ = observable(
  customSynced({
    supabase,
    collection: 'goals',
    select: (from) =>
      from.select('id, text, at_local_time_added, deleted'),
    actions: ['read', 'create', 'update'],
    filter: (select) => select.eq('user_id', userId$.get()),
    realtime: { filter: `user_id=eq.${userId$.get()}` },
    persist: {
      name: 'goals',
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
  })
);