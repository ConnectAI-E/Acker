import React from 'react';
import { IconUserStroked } from '@douyinfe/semi-icons';
import { Icon } from '@douyinfe/semi-ui';
import { useNavigate } from 'react-router-dom';
import SquareIcon from '@/components/square-icon';
import Action from '@/assets/svg/action.svg';
import Logo from '@/assets/svg/logo.svg';
import All from '@/assets/svg/all.svg';
import Hot from '@/assets/svg/hot.svg';

const SiderConfig: React.FC = function SiderConfig() {
  const navigate = useNavigate();

  return (
    <div
      className="w-full h-full flex flex-col items-center py-[20px] bg-[#f8f8fa] text-[#292d36] dark:bg-[#333] dark:text-white"
      style={{ borderRight: '1px solid var(--semi-color-border)' }}
    >
      <Icon
        className="w-[40px] flex-shrink-0 cursor-pointer"
        onClick={() => navigate('/')}
        svg={<Logo />}
      />
      <div className="h-0 flex-grow flex flex-col items-center justify-center">
        <SquareIcon
          icon={<Action />}
          onClick={() => navigate('/chat')}
          wrapperClass="my-[6px]"
          checked={window.location.pathname.includes('chat')}
        />
        <SquareIcon
          icon={<Hot />}
          onClick={() => navigate('/explore')}
          wrapperClass="my-[6px]"
          checked={window.location.pathname.includes('explore')}
        />
        <SquareIcon
          icon={<All />}
          onClick={() => navigate('/user')}
          wrapperClass="my-[6px]"
          checked={window.location.pathname.includes('user')}
        />
      </div>
      <SquareIcon
        icon={<IconUserStroked className="!text-[24px]" />}
        onClick={() => navigate('/setting')}
        wrapperClass="my-[6px]"
        checked={window.location.pathname.includes('setting')}
      />
    </div>
  );
};

export default SiderConfig;
