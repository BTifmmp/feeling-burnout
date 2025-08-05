export interface BreathingStep {
  action: 'breath-in' | 'breath-out' | 'hold';
  name: string;
  duration: number; // in seconds
}

export type BreathingSchema = BreathingStep[];


export const breathings = [
  { id: 'box-breathing', name: 'Box Breathing' },
  { id: '4-7-8', name: '4-7-8 Breathing' },
  { id: 'pursed-lips', name: 'Pursed Lips' },
  { id: 'alternate-nostril', name: 'Alternate Nostrils' },
];

export const breathingSchemas: Record<string, BreathingSchema> = {
  'box-breathing': [
    { action: 'breath-in', name: 'Inhale', duration: 4 },
    { action: 'hold', name: 'Hold', duration: 4 },
    { action: 'breath-out', name: 'Exhale', duration: 4 },
    { action: 'hold', name: 'Hold', duration: 4 },
  ],
  '4-7-8': [
    { action: 'breath-in', name: 'Inhale', duration: 4 },
    { action: 'hold', name: 'Hold', duration: 7 },
    { action: 'breath-out', name: 'Exhale', duration: 8 },
  ],
  'pursed-lips': [
    { action: 'breath-in', name: 'Inhale\n(nose)', duration: 2.5 },
    { action: 'breath-out', name: 'Exhale\n(pursed lips)', duration: 4.5 },
  ],
  'alternate-nostril': [
    { action: 'breath-in', name: 'Inhale\n(left nostril)', duration: 4 },
    { action: 'hold', name: 'Hold', duration: 4 },
    { action: 'breath-out', name: 'Exhale\n(right nostril)', duration: 8 },
    { action: 'breath-in', name: 'Inhale\n(right nostril)', duration: 4 },
    { action: 'hold', name: 'Hold', duration: 4 },
    { action: 'breath-out', name: 'Exhale\n(left nostril)', duration: 8 },
  ],
};