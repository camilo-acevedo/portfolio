import { useEffect, useState } from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export interface ThemeColors {
  bg: string;
  fg: string;
  accent: string;
  accentAlt: string;
  border: string;
}

function read(name: string): string {
  if (typeof window === 'undefined') return '0 0 0';
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}

export function useThemeColors(): ThemeColors {
  const { theme } = useTheme();
  const [colors, setColors] = useState<ThemeColors>(() => ({
    bg: '10 10 15',
    fg: '237 237 242',
    accent: '0 255 209',
    accentAlt: '167 139 250',
    border: '38 38 50',
  }));

  useEffect(() => {
    const next: ThemeColors = {
      bg: read('--bg'),
      fg: read('--fg'),
      accent: read('--accent'),
      accentAlt: read('--accent-alt'),
      border: read('--border'),
    };
    setColors(next);
  }, [theme]);

  return colors;
}
