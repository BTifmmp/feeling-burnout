export const Colors = {
  light: {
    background: '#ffffff',
    backgroundSecondary: '#f0f0f0',
    backgroundReversed: '#f0f0f0',

    card: '#f0f0f0',
    cardSecondary: '#ffffff',
    cardReversed: '#ffffff',

    textFull: '#000000',
    textPrimary: '#333333',
    textSecondary: '#555555',

    blueButton: '#339CFF',

    grayHighlight100: '#f0f0f0',
    grayHighlight200: '#e0e0e0',
    grayHighlight300: '#c0c0c0',

    moodColors: {
      0: '#FF6B6B', // vibrant red – low mood
      1: '#FFA94D', // bright orange – slightly low
      2: '#FFD93D', // sunny yellow – neutral
      3: '#A7F3D0', // fresh mint green – improving
      4: '#6EE7B7', // lively green – good
    },
  },

  dark: {
    background: '#151515',
    backgroundReversed: '#151515',
    backgroundSecondary: '#262626',

    card: '#2a2a2a',
    cardSecondary: '#3e3e3e',
    cardReversed: '#2a2a2a',

    textFull: '#ffffff',
    textPrimary: '#f0f0f0',
    textSecondary: '#bababa',

    blueButton: '#339CFF',

    grayHighlight100: '#383838',
    grayHighlight200: '#404040',
    grayHighlight300: '#484848',

    moodColors: {
      0: '#FF6B6B',  // red
      1: '#FFA94D',  // orange
      2: '#FFD93D',  // yellow
      3: '#34D399',  // mint green
      4: '#10B981',  // stronger green for contrast
    },
  }
}

export function getMotiColors(colorScheme: 'light' | 'dark'): string[] {
  return colorScheme === 'dark'
    ? ['#2c2c2c', '#3a3a3a', '#2c2c2c'] // lighter grays for dark mode
    : ['#eaeaea', '#f5f5f5', '#eaeaea']; // very light for light mode
}