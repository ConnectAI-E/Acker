import React from 'react';

export interface SquareIconProps {
  icon: React.ReactElement;
  text?: string | React.ReactElement;
  wrapperClass?: string;
  iconClass?: string;
  textClass?: string;
  checked?: boolean;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
}
