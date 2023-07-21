import React from 'react';
import classNames from 'classnames';
import { SquareIconProps } from './SquareIcon';

const SquareIcon: React.FC<SquareIconProps> = function SquareIcon(props) {
  const {
    icon, text, checked, wrapperClass, iconClass, textClass, onClick,
  } = props;
  return (
    <div
      className={classNames(
        'w-[50px] h-[50px] p-[5px] cursor-pointer',
        'rounded-[6px]',
        'flex flex-col items-center justify-center',
        'text-gray-500 dark:text-gray-400',
        `${checked ? 'text-[#000000] dark:text-[#ffffff]' : ''}`,
        'transition-all duration-200',
        wrapperClass,
      )}
      onClick={onClick}
    >
      <div
        className={classNames(
          'w-[24px] h-[24px] flex justify-center items-center',
          iconClass,
          { 'w-[40px] h-[40px]': !text },
        )}
      >
        { icon }
      </div>
      { text && (
        <div
          className={classNames('w-full text-overflow-l1 text-center mt-[2px]', textClass)}
        >
          { text }
        </div>
      ) }
    </div>
  );
};

export default SquareIcon;
