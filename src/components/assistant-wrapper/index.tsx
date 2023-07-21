import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Typography, List, Skeleton } from '@douyinfe/semi-ui';
import AssistantCard from '@/components/assistant-card';
import LoginTips from '@/components/login-tips';
import { useAssistant, usePersonCreatedAssistant } from '@/api/assistant';
import type { Assistant } from '@/global';
import { AssistantWrapperProps } from './AssistantWrapper';

const AssistantWrapper: React.FC<AssistantWrapperProps> = function AssistantWrapper(props) {
  const { onClickItem = () => {}, session } = props;

  const { data: personalAI, isLoading: personalLoading } = usePersonCreatedAssistant();
  const { data: presetAI, isLoading: presetLoading } = useAssistant('system');

  const [t] = useTranslation();

  const renderItem = useCallback((assistant: Assistant) => (
    <List.Item style={{ padding: '0 10px', margin: '10px 0' }}>
      <AssistantCard assistant={assistant} disabledBtn onChat={onClickItem} />
    </List.Item>
  ), [onClickItem]);

  const renderSkeleton = useCallback(() => (
    <List.Item style={{ padding: '0 10px', margin: '10px 0' }}>
      <Skeleton.Title className="w-full h-[148px]" />
    </List.Item>
  ), []);

  return session ? (
    <>
      <List
        header={(presetLoading || presetAI.length > 0) && <Typography.Title heading={2}>{t('system ai')}</Typography.Title>}
        dataSource={presetLoading ? [1, 2] as any[] : presetAI}
        renderItem={presetLoading ? renderSkeleton : renderItem}
        emptyContent={<div>{}</div>}
        grid={{
          xs: 24, sm: 12, md: 24, lg: 12, xl: 8, xxl: 6, className: 'min-[2160px]:w-1/6'
        }}
      />
      <List
        header={(personalLoading || personalAI.length > 0) && <Typography.Title heading={2}>{t('my ai')}</Typography.Title>}
        dataSource={personalLoading ? [1, 2, 3, 4, 5, 6, 7, 8] as any[] : personalAI}
        renderItem={personalLoading ? renderSkeleton : renderItem}
        emptyContent={<div>{}</div>}
        grid={{
          xs: 24, sm: 12, md: 24, lg: 12, xl: 8, xxl: 6, className: 'min-[2160px]:w-1/6'
        }}
      />
    </>
  ) : (
    <LoginTips
      wrapperClassName="w-full h-full flex justify-center items-center"
      afterPagePath="/chat/create-page"
    />
  );
};

export default AssistantWrapper;
