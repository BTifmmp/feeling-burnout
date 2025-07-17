import { create } from 'zustand';

interface ChatState {
  currentChatId: string | null;
  setCurrentChatId: (id: string) => void;
}

export const useChatStore = create<ChatState>(set => ({
  currentChatId: null,
  setCurrentChatId: (id) => set({ currentChatId: id }),
}));