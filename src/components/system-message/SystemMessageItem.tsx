import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button, ButtonGroup, Descriptions, Select, TextArea, Toast 
} from '@douyinfe/semi-ui';
import { IconClose, IconDelete, IconEdit, IconTick } from '@douyinfe/semi-icons';
import { Role } from '@/global';
import { SystemMessageItemProps } from './SystemMessageProps';
import styles from './SystemMessage.module.less';

const SystemMessageItem: React.FC<SystemMessageItemProps> = function SystemMessageItem(props) {
  const { prompt, disabled, onChange, onDelete } = props;

  const [t] = useTranslation('assistantSetting');

  const { id, role: originRole, content: originContent } = prompt;

  const [role, setRole] = useState<Role>(originRole);
  const [content, setContent] = useState<string>(originContent);
  const [editFlag, setEditFlag] = useState<boolean>(!originContent);

  const handleConfirm = useCallback(() => {
    if (!content) {
      Toast.warning(t('assistant.prompt.no content error'));
      return;
    }
    if (!role) {
      Toast.warning(t('assistant.prompt.no role error'));
      return;
    }
    onChange(id, { role, content });
    setEditFlag(false);
  }, [id, role, content, t, onChange]);

  const handleCancel = useCallback(() => {
    if (!content) {
      onDelete(id);
      return;
    }
    setRole(originRole);
    setContent(originContent);
    setEditFlag(false);
  }, [content, id, onDelete, originContent, originRole]);

  return (
    <div className="min-h-[50px] border-[var(--semi-color-border)] border-b-[1px] p-2">
      {editFlag ? (
        <Descriptions align="left">
          <Descriptions.Item itemKey={t('assistant.prompt.role')}>
            <Select value={role} onChange={(v) => setRole(v as Role)}>
              <Select.Option value="system">system</Select.Option>
              <Select.Option value="user">user</Select.Option>
              <Select.Option value="assistant">assistant</Select.Option>
            </Select>
          </Descriptions.Item>
          <Descriptions.Item itemKey={t('assistant.prompt.content')} className={styles.promptContent}>
            <TextArea autoFocus value={content} onChange={setContent} />
          </Descriptions.Item>
        </Descriptions>
      ) : (
        <Descriptions align="left">
          <Descriptions.Item itemKey={t('assistant.prompt.role')}>{role}</Descriptions.Item>
          <Descriptions.Item itemKey={t('assistant.prompt.content')}>
            <div className="text-overflow-l3 dark:text-white">{content}</div>
          </Descriptions.Item>
        </Descriptions>
      )}
      <ButtonGroup className="mt-1 justify-end">
        {editFlag ? (
          <>
            <Button type="secondary" icon={<IconTick />} onClick={handleConfirm} />
            <Button type="danger" icon={<IconClose />} onClick={handleCancel} />
          </>
        ) : (
          <>
            <Button disabled={disabled} type="secondary" icon={<IconEdit />} onClick={() => setEditFlag(true)} />
            <Button disabled={disabled} type="danger" icon={<IconDelete />} onClick={() => onDelete(id)} />
          </>
        )}
      </ButtonGroup>
    </div>
    
  );
};

export default SystemMessageItem;
