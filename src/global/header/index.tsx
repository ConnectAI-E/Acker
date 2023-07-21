import React, { useMemo } from 'react';
import classNames from 'classnames';
import { IconChevronLeft } from '@douyinfe/semi-icons';
import useResponsiveMobile from '@/hooks/useResponsiveMobile';
import { HeaderProps } from './HeaderProps';

const iconClass = 'min-w-[40px] h-full flex justify-center items-center flex-shrink-0 absolute t-0';

const Header: React.FC<HeaderProps> = function Header(props) {
  const {
    leftIcon,
    rightIcon,
    title,
    border = true,
    back = false,
    onLeftClick = () => {},
    onRightClick = () => {},
    onTitleClick = () => {},
  } = props;

  const left = useMemo(() => (back ? <IconChevronLeft /> : leftIcon || null), [back, leftIcon]);

  const isMobile = useResponsiveMobile();

  return isMobile ? (
    <div
      className={classNames(
        'w-full h-12 flex flex-shrink-0 items-center px-[40px] relative',
        'bg-[var(--semi-color-bg-0)] text-[var(--semi-color-text-0)]',
        { 'border-b-[1px] border-[var(--semi-color-border)]': border }
      )}
    >
      {left && <div className={classNames(iconClass, 'left-0')} onClick={onLeftClick}>{left}</div>}
      <div
        className="w-full flex justify-center font-medium text-[18px] text-overflow-l1"
        onClick={onTitleClick}
      >
        {title || 'AIOS.CHAT'}
      </div>
      {rightIcon && <div className={classNames(iconClass, 'right-0')} onClick={onRightClick}>{rightIcon}</div>}
    </div>
  ) : null;
};

export default Header;
