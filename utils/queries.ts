import { journals$, moods$, goals$, userId$ } from './SupaLegend'; // import your observable stores
import { v4 as uuidv4 } from 'uuid';
import { format, isValid, parseISO } from 'date-fns';
import { JournalRow } from '@/utils/types';
import { batch } from '@legendapp/state';


const generateId = (): string => uuidv4();

// ------------------ Journals ------------------

export function addJournal(entry: string, badge: 'positive' | 'neutral' | 'negative') {
  if (!userId$.get()) {
    console.warn('No user ID set, cannot add journal entry');
    return;
  }
  const id = generateId();
  entry = entry.slice(0, 5000); // Limit entry length to 5000 characters

  journals$[id].assign({
    user_id: userId$.get() || undefined, // Ensure userId is set
    id,
    entry,
    badge,
    at_local_time_added: new Date().toUTCString(),
  });
}

export function updateJournal(
  id : string,
  newEntry : string,
  newBadge : 'positive' | 'neutral' | 'negative'
) {
  newEntry = newEntry.slice(0, 5000); // Limit entry length to 5000 characters
  if (!journals$[id]) return;
  batch(() => {
    journals$[id].entry.set(newEntry);
    journals$[id].badge.set(newBadge);
});

}

export function deleteJournal(id: string) {
  if (!journals$[id]) return;
  journals$[id].delete();
}

// ------------------ Moods ------------------
export function saveMood(date: Date, moodValue: number) {
  const dayKey = format(date, 'yyyy-MM-dd');

  let existingId: string | null = null;

  for (const [id, mood] of Object.entries(moods$.get() || {})) {
    if (!isValid(new Date(mood.at_local_time_added))) continue; // Skip invalid dates
    const moodDateKey = format(new Date(mood.at_local_time_added), 'yyyy-MM-dd');
    if (moodDateKey === dayKey) {
      existingId = id;
      break;
    }
  }

  if (existingId) {
    moods$[existingId].mood_value.set( moodValue);

    return existingId;

  } else {
    if (!userId$.get()) {
      console.warn('No user ID set, cannot add mood');
      return;
    }
    const id = generateId();

    moods$[id].assign({
      user_id: userId$.get() || undefined, // Ensure userId is set
      id,
      mood_value: moodValue,
      at_local_time_added: date.toUTCString(),
    });

    return id;
  }
}

// ------------------ Goals ------------------

export function addGoal(text: string) {
  if (!userId$.get()) {
    console.warn('No user ID set, cannot add goal');
    return;
  }

  const id = uuidv4();
  text = text.slice(0, 5000); // Trim to 5000 characters

  goals$[id].assign({
    user_id: userId$.get() || undefined,
    id,
    text,
    at_local_time_added: new Date().toUTCString(),
  });
}

export function deleteGoal(id: string) {
  if (!goals$[id]) return;

  goals$[id].delete();
}