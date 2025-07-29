import React from 'react'
import Modal from '@/components/base/Modal';
import MoodSelectModal from '@/components/modals/MoodSelectModal';
import MoodDetailsModal from '@/components/modals/MoodDetailsModal';

interface MoodModalCombinedProps {
  content: 'moodSelect' | 'moodDetails';
  isVisible: boolean;
  onClose: () => void;
  onSelectMood?: (mood: string) => void;
  onChangeMood?: () => void; // Function to change mood
}

export default function MoodModalCombined({ content, onClose, isVisible, onSelectMood, onChangeMood }: MoodModalCombinedProps) {
  return (
    <Modal isVisible={isVisible} onClose={onClose}>
      {
        content === 'moodSelect' ?
          <MoodSelectModal onClose={onClose} onSelectMood={onSelectMood} />
          :
          <MoodDetailsModal onClose={onClose} onChangeMood={onChangeMood} />
      }
    </Modal>
  )
}