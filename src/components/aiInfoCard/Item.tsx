import React from 'react';
import { useTranslation } from 'react-i18next';
import { Avatar, Card as SemiCard, Toast } from '@douyinfe/semi-ui';
import { IconStarStroked } from '@douyinfe/semi-icons';
import { defaultAvatarUrl } from '@/utils/env';
import type { CardProps } from './Card';

const Card: React.FC<CardProps> = function Card ({ data }) {
  const { avatar, model, name, prompt } = data || {};

  const [t] = useTranslation();

  const handleStar = (event: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
    event.stopPropagation();
    Toast.info(t('feature upcoming'));
  };

  return (
    <SemiCard
      className="w-full h-full py-4 rounded-xl bg-white dark:bg-[#21242b]"
      shadows="hover"
      headerStyle={{ padding: '0px 16px' }}
      bodyStyle={{ padding: '8px 16px' }}
      headerLine={false}
      headerExtraContent={<IconStarStroked onClick={handleStar} />}
      title={(
        <SemiCard.Meta
          title={name}
          description={model}
          avatar={<Avatar src={avatar || defaultAvatarUrl} />}
        />
      )}
    >
      <div className="w-full h-[60px] whitespace-normal text-overflow-l3">
        {Array.isArray(prompt) && prompt.length > 0 ? prompt.map((p) => p?.content).join(';') : '[empty prompt]'}
      </div>
    </SemiCard>
  );
};

export default Card;
