import React from 'react';

export interface HeaderProps {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  title?: React.ReactNode;
  border?: boolean;
  back?: boolean; // 左侧按钮是否为默认返回按钮
  onLeftClick?: () => void;
  onRightClick?: () => void;
  onTitleClick?: () => void;
}
