import React from 'react';
import classNames from 'classnames';
import type { FooterItemProps } from './FooterProps';

const FooterItem: React.FC<FooterItemProps> = function FooterItem(props) {
  const { icon, text, checked, onClick } = props;

  return (
    <div
      className={classNames('h-full basis-1/4 flex flex-col justify-center items-center px-4', { 'text-[#14c786]': checked })}
      onClick={onClick}
    >
      <div className="w-[36px] h-[36px] flex justify-center items-center">
        {icon}
      </div>
      <p className="w-full text-overflow-l1 text-center">{text}</p>
    </div>
  );
};

export default React.memo(FooterItem);
