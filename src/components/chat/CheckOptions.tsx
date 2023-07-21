import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  IconClose, IconDelete, IconList, IconPlus, IconShareStroked 
} from '@douyinfe/semi-icons';
import {
  Button, Checkbox, Dropdown, Modal, Toast 
} from '@douyinfe/semi-ui';
import { CheckboxEvent } from '@douyinfe/semi-ui/lib/es/checkbox';
import AssistantWrapper from '@/components/assistant-wrapper';
import useCurrentChat from '@/hooks/useCurrentChat';
import useSupabase from '@/hooks/useSupabase';
import useChatList from '@/hooks/useChatList';
import useTheme from '@/hooks/useTheme';
import type { Assistant, Conversation } from '@/global';
import type { OptionButtonProps, CheckOptionsProps } from './ChatProps';
import styles from './Chat.module.less';

const OptionButton: React.FC<OptionButtonProps> = function OptionButton(props) {
  const { text, onClick, icon, type } = props;
  return (
    <div className="flex flex-col items-center mx-6 cursor-pointer" onClick={onClick}>
      <Button className="w-[40px] h-[40px] max-md:w-[30px] max-md:h-[30px]" type={type || 'secondary'} icon={icon} />
      <span className="break-keep whitespace-nowrap">{text}</span>
    </div>
  );
};

const CheckOptions: React.FC<CheckOptionsProps> = function CheckOptions(props) {
  const { data } = props;

  const [t] = useTranslation();

  const { session } = useSupabase();

  const { handleNewChat, handleChange } = useChatList();

  const { checkList, chatId, dispatch, setCheckFlag } = useCurrentChat();

  const [mode] = useTheme();

  const indeterminate = checkList.length > 0 && checkList.length !== data.length;
  const checked = checkList.length === data.length;

  const handleShare = (event: React.MouseEvent<HTMLDivElement | HTMLLIElement, MouseEvent>) => {
    event.stopPropagation();
    Toast.info(t('feature upcoming'));
  };

  const handleChangeAll = (e: CheckboxEvent) => {
    e.stopPropagation();
    const check = e.target.checked;
    dispatch({ type: 'change', data: check ? [...data] : [] });
  };

  const handleClose = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation();
    dispatch({ type: 'change', data: [] });
    setCheckFlag(false);
  };

  const handleCreateChat = (_assistant: Assistant, event?: React.MouseEvent<HTMLDivElement | HTMLLIElement, MouseEvent>) => {
    const { id, prompt } = _assistant;
    event?.stopPropagation();
    if (checkList.length === 0) {
      Toast.warning(t('select tips'));
    } else {
      const cacheCheckList = [...checkList].sort((conversation1, conversation2) => {
        const index1 = data.findIndex((cn) => cn.key === conversation1.key);
        const index2 = data.findIndex((cn) => cn.key === conversation2.key);
        return index1 - index2;
      });
      handleNewChat({
        data: cacheCheckList,
        systemMessage: prompt,
        parentId: chatId,
        assistantId: id,
        assistant: _assistant,
      });
      dispatch({ type: 'change', data: [] });
      setCheckFlag(false);
      Modal.destroyAll();
    }
  };

  const handleDeleteRecord = (event: React.MouseEvent<HTMLDivElement | HTMLLIElement, MouseEvent>) => {
    event.stopPropagation();
    if (checkList.length === 0) {
      Toast.warning(t('select tips'));
    } else {
      const cacheData: Conversation[] = JSON.parse(JSON.stringify(data));
      checkList.forEach((item) => {
        const index = cacheData.findIndex((d) => d.key === item.key);
        if (index >= 0) cacheData.splice(index, 1);
      });
      handleChange(chatId, cacheData);
      Toast.success(t('deletion.success'));
      dispatch({ type: 'change', data: [] });
      setCheckFlag(false);
    }
  };

  const handleOpenAssistant = () => {
    if (checkList.length === 0) {
      Toast.warning(t('select tips'));
      return;
    }
    Modal.info({
      title: t('ai assistant'),
      fullScreen: true,
      bodyStyle: { overflow: 'auto' },
      className: mode === 'dark' ? styles.fullModalDark : styles.fullModalLight,
      content: <AssistantWrapper session={session} onClickItem={handleCreateChat} />,
      icon: null,
      footer: null
    });
  };

  return (
    <div
      className="w-full min-h-[80px] p-3 bg-[#f0f1f3] dark:bg-[#191919] flex justify-evenly items-center"
      style={{ borderTop: '1px solid var(--semi-color-border)' }}
    >
      <Checkbox checked={checked} indeterminate={indeterminate} onChange={handleChangeAll}>
        {t('select all')}
      </Checkbox>
      <div className="flex max-[408px]:hidden">
        <OptionButton type="secondary" text={t('new chat')} icon={<IconPlus />} onClick={handleOpenAssistant} />
        <OptionButton type="danger" text={t('Delete')} icon={<IconDelete />} onClick={handleDeleteRecord} />
        <OptionButton type="tertiary" text={t('Share')} icon={<IconShareStroked />} onClick={handleShare} />
      </div>
      <Dropdown
        clickToHide
        stopPropagation
        trigger="click"
        content={(
          <Dropdown.Menu>
            <Dropdown.Item onClick={handleOpenAssistant} style={{ color: 'var(--semi-color-secondary)' }} icon={<IconPlus />}>
              {t('new chat')}
            </Dropdown.Item>
            <Dropdown.Item onClick={handleDeleteRecord} style={{ color: 'var(--semi-color-danger)' }} icon={<IconDelete />}>
              {t('Delete')}
            </Dropdown.Item>
            <Dropdown.Item onClick={handleShare} style={{ color: 'var(--semi-color-tertiary)' }} icon={<IconShareStroked />}>
              {t('Share')}
            </Dropdown.Item>
          </Dropdown.Menu>
        )}
      >
        <div className="hidden max-[408px]:block">
          <Button type="tertiary" icon={<IconList />}>{t('Options')}</Button>
        </div>
      </Dropdown>
      <Button type="tertiary" icon={<IconClose />} onClick={handleClose} />
    </div>
  );
};

export default CheckOptions;
