import { create } from 'zustand';

interface MoodState {
  selectedDate: Date;
  selectedMood: string | null; // mood for the selectedDate

  modalDate: Date;
  modalMood: string | null; // mood for the selectedDate

  setSelectedDate: (date: Date) => void;
  setSelectedMood: (id: string) => void;
  setModalDate: (date: Date) => void;
  setModalMood: (id: string) => void;
}

export const useMoodStore = create<MoodState>((set) => ({
  selectedDate: new Date(), // default to today
  selectedMood: null,

  setSelectedDate: (date) => set({ selectedDate: date }),
  setSelectedMood: (mood) => set({ selectedMood: mood }),

  modalDate: new Date(), // default to today
  modalMood: null,

  setModalDate: (date) => set({ modalDate: date }),
  setModalMood: (mood) => set({ modalMood: mood }),
}));
