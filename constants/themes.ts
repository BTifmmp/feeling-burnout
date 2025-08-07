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
      0: '#fF6C7B', // Softer lively red
      1: '#fFb056', // Mellowed warm orange
      2: '#FFE87A', // Lighter pastel yellow
      3: '#84d190', // Gentle fresh green
      4: '#5eb55b', // Rich but softened green
    }
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
       0: '#fF6C7B', // Softer lively red
      1: '#fFb056', // Mellowed warm orange
      2: '#FFE87A', // Lighter pastel yellow
      3: '#84d190', // Gentle fresh green
      4: '#5eb55b', // Rich but softened green
    }
  }
}

export function getMotiColors(colorScheme: 'light' | 'dark'): string[] {
  return colorScheme === 'dark'
    ? ['#4d4d4d', '#5c5c5c', '#4d4d4d'] // darker grays for dark mode
    : ['#cccccc', '#bcbcbc', '#cccccc']; // darker whites for light mode
}