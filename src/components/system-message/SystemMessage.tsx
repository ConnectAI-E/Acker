import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { v4 as uuid } from 'uuid';
import { Button } from '@douyinfe/semi-ui';
import { IconPlus } from '@douyinfe/semi-icons';
import SystemMessageItem from './SystemMessageItem';
import { SystemMessageProps, SmList } from './SystemMessageProps';
import { Message } from '@/global';

const SystemMessage: React.FC<SystemMessageProps> = function SystemMessage(props) {
  const { data, disabled, onChange } = props;

  const [t] = useTranslation('assistantSetting');

  const [smList, setSmList] = useState<SmList[]>(() => data.map((d) => ({ id: uuid(), ...d })));

  const handleChange = (id: string, message: Message) => {
    const cacheData = [...smList];
    const changeData = cacheData.find((d) => d.id === id);
    if (changeData) {
      Object.assign(changeData, { ...message });
    }
    setSmList(cacheData);
    onChange(cacheData.map((d) => ({ role: d.role, content: d.content })));
  };

  const handleDelete = (id: string) => {
    const cacheData = [...smList];
    const changeDataIndex = cacheData.findIndex((d) => d.id === id);
    if (changeDataIndex >= 0) {
      cacheData.splice(changeDataIndex, 1);
    }
    setSmList(cacheData);
    onChange(cacheData.map((d) => ({ role: d.role, content: d.content })));
  };

  const handleAddOne = () => {
    const newSystemMessage: SmList = { id: uuid(), role: 'system', content: '' };
    setSmList((pre) => {
      const cacheData = [...(pre || [])];
      cacheData.push(newSystemMessage);
      return cacheData;
    });
  };

  return (
    <div className="border-[var(--semi-color-border)] border-[1px] rounded-lg">
      {smList.map((d) => (
        <SystemMessageItem
          key={d.id}
          prompt={d}
          onChange={handleChange}
          onDelete={handleDelete}
          disabled={disabled}
        />
      ))}
      <Button disabled={disabled} className="w-full" type="tertiary" icon={<IconPlus />} onClick={handleAddOne}>
        {t('assistant.prompt.add')}
      </Button>
    </div>
  );
};

export default SystemMessage;
