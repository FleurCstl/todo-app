import { List, Star, Briefcase, Heart, Book } from 'lucide-react';
import React from 'react';

/**
 * Available icons for lists.
 */
export const ICONS = [
  { name: 'List', component: List },
  { name: 'Star', component: Star },
  { name: 'Briefcase', component: Briefcase },
  { name: 'Heart', component: Heart },
  { name: 'Book', component: Book },
];

/**
 * Map of icon names to their respective Lucide component.
 */
export const ICON_MAP: Record<string, React.ElementType> = {
  List: List,
  Star: Star,
  Briefcase: Briefcase,
  Heart: Heart,
  Book: Book,
};

/**
 * Predefined color palette for lists.
 */
export const COLORS = [
  '#E27D60', // Terracotta
  '#85D2B0', // Seafoam
  '#E8A87C', // Peach
  '#C38D9E', // Mauve
  '#41B3A3', // Teal
  '#7FB3D5', // Sky Blue
  '#A569BD', // Amethyst
  '#F7DC6F', // Mustard
];
