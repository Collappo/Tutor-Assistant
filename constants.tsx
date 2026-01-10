
import React from 'react';
import { ThemeColor } from './types';

export const THEMES: { id: ThemeColor; label: string; colorClass: string; bgClass: string; borderClass: string }[] = [
  { id: 'blue', label: 'Niebieski', colorClass: 'text-blue-500', bgClass: 'bg-blue-600', borderClass: 'border-blue-500/30' },
  { id: 'emerald', label: 'Zielony', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-600', borderClass: 'border-emerald-500/30' },
  { id: 'amber', label: 'Żółty', colorClass: 'text-amber-500', bgClass: 'bg-amber-600', borderClass: 'border-amber-500/30' },
  { id: 'violet', label: 'Fioletowy', colorClass: 'text-violet-500', bgClass: 'bg-violet-600', borderClass: 'border-violet-500/30' },
];

export const APP_STORAGE_KEY = 'asystent_korepetycji_v1';
