import { create } from 'zustand';

interface SelectedBreathing {
  id: string | null; // Optional ID for future use
  name: string | null;
}

interface BreathingStore {
  selectedBreathing: SelectedBreathing;
  setSelectedBreathing: (Breathing: SelectedBreathing) => void;
}

export const useBreathingStore = create<BreathingStore>((set) => ({
  selectedBreathing: { name: null, id: null },
  setSelectedBreathing: (breathing) => set({ selectedBreathing: breathing }),
}));