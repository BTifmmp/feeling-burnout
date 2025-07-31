import { journals$, moods$ } from './SupaLegend'; // import your observable stores
import { v4 as uuidv4 } from 'uuid';
import { format, isValid, parseISO } from 'date-fns';
import { JournalRow } from '@/utils/types';
import { batch } from '@legendapp/state';


const generateId = (): string => uuidv4();

// ------------------ Journals ------------------

export function addJournal(entry: string, badge: 'positive' | 'neutral' | 'negative') {
  const id = generateId();

  journals$[id].assign({
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

  for (const [id, mood] of Object.entries(moods$.get())) {
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
    const id = generateId();

    moods$[id].assign({
      id,
      mood_value: moodValue,
      at_local_time_added: date.toUTCString(),
    });

    return id;
  }
}
