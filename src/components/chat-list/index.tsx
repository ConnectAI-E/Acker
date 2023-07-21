import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Empty, Input } from '@douyinfe/semi-ui';
import { IconPlus, IconSearch } from '@douyinfe/semi-icons';
import classNames from 'classnames';
import useChatList from '@/hooks/useChatList';
import ChatItem from '@/components/chat-item';
import { sortChatList } from '@/utils/chatList';
import type { ChatList as ChatListProps } from '@/global';

const ChatList: React.FC = function ChatList() {
  const navigate = useNavigate();

  const [t] = useTranslation();

  const { chatList } = useChatList();

  const [searchValue, setSearchValue] = useState<string>('');

  const filterChatList = (chat: ChatListProps) => (chat.title || chat.data[0]?.value || 'New Chat').includes(searchValue);

  const filterList = chatList?.filter(filterChatList).sort(sortChatList);

  return (
    <div className="w-full h-full overflow-hidden flex flex-col px-2">
      <Input
        className="!h-[36px] flex-shrink-0 rounded-xl bg-white dark:bg-[#282c35]"
        prefix={<IconSearch />}
        value={searchValue}
        onChange={setSearchValue}
        placeholder={t('Search')}
        showClear
      />
      <div
        className={classNames('h-1 flex-grow bg-blend-overlay', 'overflow-y-auto')}
      >
        { filterList && filterList?.length > 0 ? filterList.map((chat) => <ChatItem key={chat.chatId} chat={chat} />) : (
          <Empty description={t('no data.title')} />
        ) }
      </div>
      <Button
        className="!h-[48px] flex-shrink-0 mt-[16px] rounded-xl !bg-white dark:!bg-[#282c35]"
        type="tertiary"
        icon={<IconPlus />}
        onClick={() => navigate('create-page')}
      >
        { t('new chat') }
      </Button>
    </div>
  );
};

export default ChatList;
