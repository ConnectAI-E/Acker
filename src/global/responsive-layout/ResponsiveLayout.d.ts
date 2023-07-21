import React from 'react';
import type { HeaderProps } from '../header/HeaderProps';
import type { FooterProps } from '../footer/FooterProps';

export interface ResponsiveLayoutProps {
  wrapperClassName?: string;
  style?: React.CSSProperties;
  className?: string;
  children: React.ReactNode;
  hiddenHeader?: boolean;
  hiddenFooter?: boolean;
  headerProps?: HeaderProps;
  footerProps?: FooterProps;
}
