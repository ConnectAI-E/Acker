import {
  useEffect, useState, createContext, useMemo, useReducer
} from 'react';
import { useNavigate, useSearchParams, createSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SideSheet } from '@douyinfe/semi-ui';
import Chat from '@/components/chat';
import ChatHeader from '@/components/chat/ChatHeader';
import MidJourneyChat from '@/components/midjourney-chat';
import ChatConfig from '@/components/chat-config';
import LoginTips from '@/components/login-tips';
import useChatList from '@/hooks/useChatList';
import useSupabase from '@/hooks/useSupabase';
import useWindowResize from '@/hooks/useWindowResize';
import { useAssistantById } from '@/api/assistant';
import { ChatList, Conversation, CurrentChatProps } from '@/global';
import { ChatAction, ChatReducer } from '../Chat';
import { useChatOutlet } from '../index';
import 'react-photo-view/dist/react-photo-view.css';

export const Store = createContext<CurrentChatProps>({} as any);

function checkListReducer(state: Conversation[], action: ChatAction) {
  const cacheCheckList = [...state];
  const { type, data } = action;
  if (type === 'check') {
    const { conversationId } = data[0];
    if (conversationId) {
      const checkedFlag = cacheCheckList.some((item) => item.conversationId === conversationId);
      if (checkedFlag) {
        const curConversation = cacheCheckList.findIndex((item) => item.conversationId === conversationId);
        cacheCheckList.splice(curConversation, 2);
      } else {
        cacheCheckList.push(...data);
      }
    }
    return cacheCheckList;
  }
  if (type === 'change') {
    return [...data];
  }
  return cacheCheckList;
}

function ChatPage() {
  const { setHiddenHeader } = useChatOutlet();

  const navigate = useNavigate();

  const [t] = useTranslation('assistantSetting');

  const [query] = useSearchParams();

  const { chatList, handleChatValueChange } = useChatList();

  const { session } = useSupabase();

  const [checkFlag, setCheckFlag] = useState<boolean>(false);
  const [visible, setVisible] = useState<boolean>(false);

  const [checkList, dispatch] = useReducer<ChatReducer>(checkListReducer, []);

  const chatId = query.get('chatId') || '';
  const queryValue = query.get('q');
  const currentChat = chatList?.find((chat) => chat.chatId === chatId);
  const parentChat = chatList?.find((chat) => chat.chatId === currentChat?.parentId);
  const midjourneyFlag = currentChat?.assistant?.model === 'midjourney';

  const { data: assistant, isLoading } = useAssistantById(currentChat?.assistantId, currentChat?.assistant);

  useEffect(() => {
    const firstChatId = chatList?.[0]?.chatId;
    // TODO 没有会话的时候，路由带有query参数应该是新建一个会话
    if (!chatId && firstChatId) {
      const search = createSearchParams({ chatId: firstChatId });
      if (queryValue) search.append('q', queryValue);
      navigate({ search: search.toString() }, { replace: true });
    } else if (!currentChat) {
      navigate('/chat/create-page');
    }
  }, [chatList, currentChat, chatId, queryValue, navigate]);

  useEffect(() => {
    if (chatId) {
      setCheckFlag(false);
    }
  }, [chatId]);

  useWindowResize((width) => setHiddenHeader(width < 768));

  const handleSelectList = () => {
    setCheckFlag((pre) => !pre);
    dispatch({ type: 'change', data: [] });
  };

  const chatValue = useMemo(() => ({
    chatId,
    chat: currentChat as ChatList,
    assistant,
    assistantLoading: isLoading,
    checkFlag,
    checkList,
    dispatch,
    setCheckFlag,
  }), [assistant, chatId, checkFlag, checkList, currentChat, isLoading]);

  return session ? currentChat && (
    <div className="h-full flex flex-col overflow-hidden dark:text-white">
      <ChatHeader
        model={assistant?.model}
        updateTime={currentChat.lastUpdateTime}
        showSelectButton={currentChat?.data.length > 0}
        title={currentChat?.title || assistant?.name}
        brief={currentChat?.data[0]?.value}
        onOpenConfig={() => setVisible(true)}
        onSelectList={handleSelectList}
      />
      <Store.Provider value={chatValue}>
        {midjourneyFlag ? <MidJourneyChat key={currentChat.chatId} /> : <Chat key={currentChat.chatId} />}
      </Store.Provider>
      {currentChat && (
        <SideSheet
          closable
          style={{ maxWidth: '80%' }}
          bodyStyle={{ marginBottom: '20px' }}
          title={t('chat setting')}
          visible={visible}
          onCancel={() => setVisible(false)}
          getPopupContainer={() => document.querySelector('.layout-root') as HTMLElement}
        >
          <ChatConfig
            key={currentChat.chatId}
            loading={isLoading}
            chat={currentChat}
            assistant={assistant}
            parentChat={parentChat}
            onConfirm={handleChatValueChange}
            onClose={() => setVisible(false)}
          />
        </SideSheet>
      )}
    </div>
  ) : (
    <LoginTips
      wrapperClassName="w-full h-full flex justify-center items-center"
      afterPagePath={`/chat/chat-page?${query.toString()}`}
    />
  );
}

export default ChatPage;
