import { create } from 'zustand';

interface SelectedMeditation {
  name: string | null;
  fileName: string | null;
}

interface MeditationStore {
  selectedMeditation: SelectedMeditation;
  setSelectedMeditation: (meditation: SelectedMeditation) => void;
}

export const useMeditationStore = create<MeditationStore>((set) => ({
  selectedMeditation: { name: null, fileName: null },
  setSelectedMeditation: (meditation) => set({ selectedMeditation: meditation }),
}));