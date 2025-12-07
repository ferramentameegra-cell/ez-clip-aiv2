/**
 * Design Tokens - Cores que Vendem
 * Inspirado em Opus.pro e outras ferramentas premium
 */

export const colors = {
  // Primary Colors - Indigo (Confiança + Tech)
  indigo: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1', // Primary
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b',
  },

  // Secondary Colors - Roxo (Criatividade)
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7', // Secondary
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },

  // Accent Colors - Pink (Energia + Viral)
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899', // Accent
    600: '#db2777',
    700: '#be185d',
    800: '#9f1239',
    900: '#831843',
    950: '#500724',
  },

  // Grays (Neutros)
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },

  // Semantic Colors
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
  },

  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },

  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
  },

  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
} as const;

// Dark Mode Colors
export const darkColors = {
  background: {
    primary: '#0f172a', // slate-900
    secondary: '#1e293b', // slate-800
    tertiary: '#334155', // slate-700
  },
  foreground: {
    primary: '#f1f5f9', // slate-100
    secondary: '#cbd5e1', // slate-300
    tertiary: '#94a3b8', // slate-400
  },
} as const;

// Light Mode Colors
export const lightColors = {
  background: {
    primary: '#ffffff',
    secondary: '#f9fafb', // gray-50
    tertiary: '#f3f4f6', // gray-100
  },
  foreground: {
    primary: '#111827', // gray-900
    secondary: '#374151', // gray-700
    tertiary: '#6b7280', // gray-500
  },
} as const;

export type ColorPalette = typeof colors;
export type DarkColors = typeof darkColors;
export type LightColors = typeof lightColors;

