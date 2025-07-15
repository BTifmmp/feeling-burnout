import fs from 'fs';
import path from 'path';
import { Colors } from '@/constants/themes'; // adjust this import as needed

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/([a-zA-Z])(\d)/g, '$1-$2').toLowerCase();
}

function flattenTheme(theme: any, prefix = '--color-'): Record<string, string> {
  const output: Record<string, string> = {};

  function walk(obj: any, currentKey = '') {
    for (const key in obj) {
      const value = obj[key];
      const kebabKey = toKebabCase(key);
      const fullKey = currentKey ? `${currentKey}-${kebabKey}` : kebabKey;

      if (typeof value === 'string') {
        output[`${prefix}${fullKey}`] = value;
      } else if (typeof value === 'object') {
        walk(value, fullKey);
      }
    }
  }

  walk(theme);
  return output;
}

function generateTailwindColors(flatVars: Record<string, string>) {
  const colors: Record<string, string> = {};

  for (const fullKey in flatVars) {
    const key = fullKey.replace(/^--color-/, '');
    colors[key] = `var(${fullKey})`;
  }

  return colors;
}

const lightVars = flattenTheme(Colors.light);
const darkVars = flattenTheme(Colors.dark);

const themeFile = `
import { vars } from 'nativewind';
export type ThemeName = 'default';
export const Themes = {
  default: {
    light: vars(${JSON.stringify(lightVars, null, 2)}),
    dark: vars(${JSON.stringify(darkVars, null, 2)})
  }
};
`.trim();

const tailwindColorsLight = generateTailwindColors(lightVars);
const tailwindColorsDark = generateTailwindColors(darkVars);

const tailwindColorsFile = `export const tailwindColorsLight = ${JSON.stringify(tailwindColorsLight, null, 2)};\n
export const tailwindColorsDark = ${JSON.stringify(tailwindColorsDark, null, 2)};\n`;

const outputDir = path.join(__dirname, '..', 'constants');

// Ensure the directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir);
}

fs.writeFileSync(path.join(outputDir, 'themeVars.ts'), themeFile);
console.log('✅ themeVars.ts generated.');

fs.writeFileSync(path.join(outputDir, 'tailwindColors.ts'), tailwindColorsFile);
console.log('✅ tailwindColors.ts generated.');
