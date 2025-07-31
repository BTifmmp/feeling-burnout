import { JournalRow } from './../utils/types';
import { create } from 'zustand';

interface JournalStore {
  editingEntry: JournalRow | null;
  setEditingEntry: (entry: JournalRow) => void;
  clearEditingEntry: () => void;
}

export const useJournalEditStore = create<JournalStore>((set) => ({
  editingEntry: null,
  setEditingEntry: (entry) => set({ editingEntry: entry }),
  clearEditingEntry: () => set({ editingEntry: null }),
}));
