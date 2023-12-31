import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { createSearchParams, useNavigate, useSearchParams } from 'react-router-dom';
import { IconDeleteStroked } from '@douyinfe/semi-icons';
import { Popconfirm } from '@douyinfe/semi-ui';
import useChatList from '@/hooks/useChatList';
import type { ChatList } from '@/global';
import styles from './ChatItem.module.less';

interface ChatItemProps {
  chat: ChatList;
}

const tileChatCls = 'cursor-pointer flex items-center rounded-xl hover:bg-white dark:hover:bg-[#2e333d]';
const defaultAvatarUrl = 'https://sp-key.aios.chat/storage/v1/object/public/static/web/default.png';

const ChatItem: React.FC<ChatItemProps> = function ChatItem({ chat }) {
  const navigate = useNavigate();

  const [t] = useTranslation();

  const [query] = useSearchParams();

  const checked: boolean = chat.chatId === query.get('chatId');
  const tileChatDynamicCls: Record<string, boolean> = { '!bg-white dark:!bg-[#2e333d]': checked };

  const { handleDelete: onDelete } = useChatList();

  const { assistant } = chat;

  const handleClick = () => {
    navigate({
      pathname: '/chat/chat-page',
      search: createSearchParams({ chatId: chat.chatId }).toString(),
    });
  };

  const handleDelete = (event: React.MouseEvent<Element, MouseEvent>) => {
    event.stopPropagation();
    onDelete(chat.chatId);
  };

  return (
    <div
      key={chat.chatId}
      className={classNames('w-[98%] h-[80px] px-[14px] py-[16px] mt-[8px]', tileChatCls, tileChatDynamicCls, styles.chatItem)}
      onClick={handleClick}
    >
      <div
        className="flex-shrink-0 h-[48px] w-[48px] flex items-center justify-center rounded mr-[8px]"
      >
        <img
          className="w-full h-full rounded-full"
          src={assistant?.avatar || defaultAvatarUrl}
          alt="404"
        />
      </div>
      <div className="w-0 flex-grow text-[#15171c] dark:text-[#fff]">
        <div className="w-full flex mb-[7px] items-center">
          <span className="w-0 flex-grow text-overflow-l1 font-semibold text-[16px]">
            { chat.title || chat.assistant?.name || chat.data[0]?.value || 'New Chat' }
          </span>
          <Popconfirm
            style={{ width: '280px' }}
            title={t('sure confirm')}
            okText={t('delete')}
            okButtonProps={{
              type: 'danger',
              className: '!bg-[var(--semi-color-danger)]',
            }}
            cancelText={t('cancel')}
            onConfirm={handleDelete}
          >
            <IconDeleteStroked
              className={classNames('flex-shrink-0 opacity-0', styles.deleteIcon, { 'opacity-80': checked })}
              onClick={(e) => e.stopPropagation()}
            />
          </Popconfirm>
        </div>
        <div className="w-full text-overflow-l1 text-[12px] opacity-50">
          { chat.data[chat.data.length - (assistant?.model === 'midjourney' ? 2 : 1)]?.value || `[${t('empty chat')}]` }
        </div>
      </div>
    </div>
  );
};

export default ChatItem;
