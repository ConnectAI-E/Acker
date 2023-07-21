import React, { useCallback } from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { IconUserStroked } from '@douyinfe/semi-icons';
import AutoTextArea from '@/components/auto-textarea';
import useResponsiveMobile from '@/hooks/useResponsiveMobile';
import Hot from '@/assets/svg/Hot.svg';
import FooterItem from './FooterItem';
import { FooterProps } from './FooterProps';

const Footer: React.FC<FooterProps> = function Footer(props) {
  const {
    input,
    className = '',
    onRequest = () => {},
  } = props;

  const navigate = useNavigate();

  const isMobile = useResponsiveMobile();

  const [t] = useTranslation();

  const handleNavigate = useCallback((path: string) => {
    if (window.location.pathname === path) return;
    navigate(path);
  }, [navigate]);

  return isMobile ? (
    <div
      className={classNames(
        className,
        'w-full min-h-[5rem] flex-shrink-0 bg-[var(--semi-color-bg-0)] text-[var(--semi-color-text-0)]',
        'border-t-[1px] border-[var(--semi-color-border)]',
      )}
    >
      {input && (
        <div className="mx-2 flex flex-row gap-3 pt-2 last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl lg:pt-6">
          <AutoTextArea hiddenUpload loading={false} onFetchAnswer={onRequest} />
        </div>
      )}
      <div className="w-full h-[5rem] flex items-center">
        <FooterItem
          icon={<Hot />}
          text={t('Chat')}
          onClick={() => handleNavigate('/chat-mobile')}
          checked={window.location.pathname.includes('chat')}
        />
        <FooterItem
          icon={<Hot />}
          text={t('Explore')}
          onClick={() => handleNavigate('/explore')}
          checked={window.location.pathname.includes('explore')}
        />
        <FooterItem
          icon={<Hot />}
          text={t('My AI')}
          onClick={() => handleNavigate('/user')}
          checked={window.location.pathname.includes('user')}
        />
        <FooterItem
          icon={<IconUserStroked className="!text-[24px]" />}
          text={t('My')}
          onClick={() => handleNavigate('/setting')}
          checked={window.location.pathname.includes('setting')}
        />
      </div>
    </div>
  ) : null;
};

export default Footer;
