import React from 'react';

export interface ImageWithLoadingProps {
  src: string;
  className?: string;
  skeletonStyle?: React.CSSProperties;
  imageStyle?: React.CSSProperties;
}
