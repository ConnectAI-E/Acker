import React from 'react';
import type { Assistant } from '@/global';

export interface CardProps {
  data: Assistant;
}

export interface CardsProps {
  className?: string;
  style?: React.CSSProperties;
}
