import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Empty, Input } from '@douyinfe/semi-ui';
import { IconPlusCircleStroked, IconSearchStroked } from '@douyinfe/semi-icons';
import ResponsiveLayout from '@/global/responsive-layout';
import useChatList from '@/hooks/useChatList';
import useWindowResize from '@/hooks/useWindowResize';
import ChatItem from '@/components/chat-item';
import { sortChatList } from '@/utils/chatList';
import type { ChatList } from '@/global';

function ChatMobile() {
  const { chatList } = useChatList();

  const navigate = useNavigate();

  const [t] = useTranslation();

  const [searchValue, setSearchValue] = useState<string>('');

  const filterChatList = (chat: ChatList) => (chat.title || chat.data[0]?.value || 'New Chat').includes(searchValue);

  const filterList = chatList?.filter(filterChatList).sort(sortChatList);

  useWindowResize((width) => width > 768 && navigate('/chat'));

  return (
    <ResponsiveLayout
      className="flex flex-col p-2 bg-white dark:bg-transparent"
      headerProps={{
        title: t('conversation list'),
        rightIcon: <IconPlusCircleStroked size="large" />,
        onRightClick: () => navigate('/chat/create-page')
      }}
    >
      <div className="flex-shrink-0 pb-2 border-b-[1px] border-[var(--semi-color-border)]">
        <Input
          value={searchValue}
          onChange={setSearchValue}
          placeholder={t('Search')}
          suffix={<IconSearchStroked size="large" />}
        />
      </div>
      <div className="h-0 flex-grow overflow-auto">
        {filterList && filterList.length > 0 
          ? filterList.map((chat) => <ChatItem key={chat.chatId} chat={chat} />)
          : <Empty title="No data" />}
      </div>
    </ResponsiveLayout>
  );
}

export default ChatMobile;
