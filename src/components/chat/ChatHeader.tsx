import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import calendar from 'dayjs/plugin/calendar';
import { IconChevronLeft, IconCheckList, IconMore } from '@douyinfe/semi-icons';
import { Button, Typography } from '@douyinfe/semi-ui';
import useResponsiveMobile from '@/hooks/useResponsiveMobile';
import type { ChatHeaderProps } from './ChatProps';

dayjs.extend(calendar);

const ChatHeader: React.FC<ChatHeaderProps> = function ChatHeader(props) {
  const {
    title, showSelectButton, model, updateTime, brief, onSelectList, onOpenConfig
  } = props;

  const midjourneyFlag: boolean = model === 'midjourney';

  const isMobile = useResponsiveMobile();

  const navigate = useNavigate();

  const [t, i18next] = useTranslation();

  const [locale, setLocale] = useState<ILocale>();

  const timeFormat = useMemo(() => ({
    sameDay: 'HH:mm', // The same day ( Today at 2:30 AM )
    nextDay: `[${t('tomorrow')}]`, // The next day ( Tomorrow at 2:30 AM )
    nextWeek: 'dddd', // The next week ( Sunday at 2:30 AM )
    lastDay: `[${t('yesterday')}] HH:mm`, // The day before ( Yesterday at 2:30 AM )
    lastWeek: 'dddd', // Last week ( Last Monday at 2:30 AM )
    sameElse: 'YYYY/MM/DD' // Everything else ( 7/10/2011 )
  }), [t]);

  useEffect(() => {
    if (i18next.language === 'zh') {
      import('dayjs/locale/zh-cn').then((res) => {
        setLocale(res);
      }).catch(() => {});
    } if (i18next.language === 'jp') {
      import('dayjs/locale/ja').then((res) => {
        setLocale(res);
      }).catch(() => {});
    }
  }, [i18next]);

  return (
    <div
      className="h-[72px] max-md:h-12 pl-[24px] max-md:pl-0 flex items-center bg-white dark:bg-[#161616]"
      style={{ borderBottom: '1px solid var(--semi-color-border)' }}
    >
      {isMobile && (
        <div className="w-[40px] h-full flex-shrink-0 flex items-center justify-center" onClick={() => navigate('/chat-mobile')}>
          <IconChevronLeft />
        </div>
      )}
      <div className="w-0 flex-grow flex flex-col text-[#15171c] dark:text-white">
        {title && <span className="text-overflow-l1 font-semibold text-[16px]">{title}</span>}
        {!isMobile && <span className="text-overflow-l1 opacity-50">{brief || t('new chat')}</span>}
      </div>
      {updateTime && !isMobile && (
        <Typography.Text type="secondary" className="!mx-4 flex-shrink-0">
          {dayjs(updateTime?.replaceAll('-', '/')).locale(locale || 'en').calendar(null, timeFormat)}
        </Typography.Text>
      )}
      {showSelectButton && !midjourneyFlag && (
        <Button className="w-[48px] max-md:w-10 !h-full flex-shrink-0" type="tertiary" icon={<IconCheckList />} onClick={onSelectList} />
      )}
      <Button className="w-[48px] max-md:w-10 !h-full flex-shrink-0" type="tertiary" icon={<IconMore />} onClick={onOpenConfig} />
    </div>
  );
};

export default ChatHeader;
