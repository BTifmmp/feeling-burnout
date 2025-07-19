import { create } from 'zustand';

interface JournalEntry {
  id: number;
  date: Date;
  content: string;
  badge: 'positive' | 'neutral' | 'negative';
}

interface JournalStore {
  editingEntry: JournalEntry | null;
  setEditingEntry: (entry: JournalEntry) => void;
  clearEditingEntry: () => void;
}

export const useJournalEditStore = create<JournalStore>((set) => ({
  editingEntry: null,
  setEditingEntry: (entry) => set({ editingEntry: entry }),
  clearEditingEntry: () => set({ editingEntry: null }),
}));
