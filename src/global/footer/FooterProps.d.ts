import React from 'react';
import type { InputProps } from '@/components/auto-textarea/AutoTextArea';

export interface FooterProps {
  input?: boolean;
  className?: string;
  onRequest?: (value: InputProps) => void;
}

export interface FooterItemProps {
  icon: React.ReactNode;
  text: string;
  onClick: () => void;
  checked?: boolean;
}
