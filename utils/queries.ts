import { journals$, moods$ } from './SupaLegend'; // import your observable stores
import { v4 as uuidv4 } from 'uuid';
import { format, parseISO } from 'date-fns';


const generateId = (): string => uuidv4();

// ------------------ Journals ------------------

export function addJournal(entry: string, badge: 'positive' | 'neutral' | 'negative') {
  const id = generateId();

  journals$[id].assign({
    id,
    entry,
    badge,
    at_local_time_added: new Date(),
  });
}

export function updateJournal(
  id: string,
  updates: Partial<{ entry: string; badge: 'positive' | 'neutral' | 'negative' }>
) {
  if (!journals$[id]) return;
  journals$[id].assign(updates);
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
    const moodDateKey = format(mood.at_local_time_added, 'yyyy-MM-dd');
    if (moodDateKey === dayKey) {
      existingId = id;
      break;
    }
  }

  if (existingId) {
    // Update existing mood
    moods$[existingId].mood_value.set( moodValue);

    return existingId;

  } else {
    // Add new mood
    const id = generateId();

    moods$[id].assign({
      id,
      mood_value: moodValue,
      at_local_time_added: date,
    });

    return id;
  }
}
