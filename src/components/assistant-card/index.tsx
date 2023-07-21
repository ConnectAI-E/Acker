import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button, ButtonGroup, Card, Popconfirm, Avatar 
} from '@douyinfe/semi-ui';
import { IconDelete, IconPlus, IconWrench } from '@douyinfe/semi-icons';
import classNames from 'classnames';
import { defaultAvatarUrl } from '@/utils/env';
import type { AssistantCardProps } from './AssistantCard';
import styles from './AssistantCard.module.less';

const nullFn = () => {};

const AssistantCard: React.FC<AssistantCardProps> = function AiCard(props) {
  const {
    assistant, hiddenFooter = false, className = '', disabledBtn = false,
    onChat = nullFn, onDelete = nullFn, onEdit = nullFn
  } = props;

  const {
    model, name, avatar, prompt, source 
  } = assistant;

  const disabled = source === 'system';

  const [t] = useTranslation();

  const renderTitle = useMemo(() => (
    <Card.Meta
      className={styles.cardHeader}
      title={<div className="text-overflow-l1">{name}</div>}
      avatar={<Avatar src={avatar || defaultAvatarUrl} />}
      description={(
        <div className="w-full block text-overflow-l1">
          {model}
        </div>
      )}
    />
  ), [name, model, avatar]);

  return (
    <Card
      className={classNames('w-full rounded-lg bg-white dark:bg-[#21242b]', className, { 'h-[201px]': !disabled, })}
      shadows="hover"
      bordered={false}
      headerStyle={{ padding: '12px 20px' }}
      title={renderTitle}
      headerLine={false}
      footerLine
      bodyStyle={{ padding: '0 16px 16px 16px' }}
      footerStyle={{ padding: 0, margin: hiddenFooter ? 0 : '0 20px' }}
      footer={hiddenFooter ? null : (
        <ButtonGroup className="h-[48px] items-center !flex-nowrap">
          <Button className="flex-grow" onClick={() => onChat(assistant)} type="tertiary" icon={<IconPlus />}>
            {t('chat')}
          </Button>
          <Button
            disabled={disabled || disabledBtn}
            className="flex-grow"
            type="tertiary"
            onClick={() => onEdit(assistant)}
            icon={<IconWrench />}
          >
            {t('edit')}
          </Button>
          <Popconfirm
            trigger="click"
            okText="ok"
            cancelText="cancel"
            title="Are you sure?"
            onConfirm={async () => await onDelete(assistant)}
            disabled={disabled || disabledBtn}
          >
            <Button disabled={disabled || disabledBtn} className="flex-grow" type="danger" theme="borderless" icon={<IconDelete />}>
              {t('delete')}
            </Button>
          </Popconfirm>
        </ButtonGroup>
      )}
    >
      {disabled ? null : (
        <div className="text-overflow-l3 h-[60px] w-full">
          {Array.isArray(prompt) && prompt.length > 0 ? prompt.map((p) => p?.content).join(';') : '[empty prompt]'}
        </div>
      )}
    </Card>
  );
};

export default AssistantCard;
