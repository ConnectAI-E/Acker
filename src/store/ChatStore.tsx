/* eslint-disable react-hooks/exhaustive-deps */
import React, { useMemo, useCallback, createContext, useEffect } from 'react';
import { v4 as uuid } from 'uuid';
import { createSearchParams, useNavigate } from 'react-router-dom';
import type {
  ChatStoreProps, ChatList, ChatListKey, Conversation, NewChatProps 
} from '@/global';
import useLocalStorageState from '@/hooks/useLocalStorageState';
import usePreload from '@/hooks/usePreload';
import { getCurrentDate } from '@/utils';

interface ChatStoreReactProps {
  children: React.ReactElement;
}

export const Store = createContext<ChatStoreProps>({} as any);

function ChatStore({ children }: ChatStoreReactProps) {
  const navigate = useNavigate();

  // TODO 换成useReducer
  const [chatList, setChatList] = useLocalStorageState<ChatList[]>('chatList', { defaultValue: () => [] });

  usePreload();

  /**
   * @deprecated
   */
  useEffect(() => {
    setChatList((pre) => {
      const cacheChatList = [...(pre || [])];
      cacheChatList.forEach((chat) => {
        if (!chat.assistant) {
          Object.assign(chat, { assistant: { id: chat.assistantId } });
          // @ts-expect-error
          const { avatar, model } = chat || {};
          if (chat.assistant) {
            if (avatar) Object.assign(chat.assistant, { avatar });
            if (model) Object.assign(chat.assistant, { model });
          }
        }
      });
      return cacheChatList;
    });
  }, []);

  const handleChange = useCallback((chatId: string, data: Conversation[]) => {
    setChatList((pre) => {
      const cacheChatList = [...(pre || [])];
      const changeChat = cacheChatList.find((chat) => chat.chatId === chatId);
      if (changeChat && Array.isArray(data)) {
        changeChat.data = [...data];
      }
      return cacheChatList;
    });
  }, [setChatList]);

  const handleChatValueChange = useCallback((chatId: string, key: ChatListKey, value: any) => {
    if (!key) return;
    setChatList((pre) => {
      const cacheChatList: ChatList[] = [...(pre || [])];
      const changeChat: any = cacheChatList.find((chat) => chat.chatId === chatId);
      if (changeChat) {
        changeChat[key] = value;
      }
      return cacheChatList;
    });
  }, [setChatList]);

  const handleDelete = (chatId: string) => {
    setChatList((pre) => {
      const cacheChatList = [...(pre || [])];
      const delChatIndex = cacheChatList.findIndex((chat) => chat.chatId === chatId);
      cacheChatList.splice(delChatIndex, 1);
      return cacheChatList;
    });
  };

  const handleDeleteAll = () => {
    setChatList([]);
  };

  const handleNewChat = useCallback((chatProps?: NewChatProps, disableNavigate?: boolean) => {
    const { chatId = uuid(), assistantId = 'gpt-3.5-turbo-16k', data = [], ...rest } = chatProps || {};
    const newChat = {
      chatId, assistantId, lastUpdateTime: getCurrentDate(true), data, ...rest 
    };
    if (!disableNavigate) {
      const search = createSearchParams({ chatId });
      navigate({ pathname: '/chat/chat-page', search: search.toString() });
    }
    setChatList((pre) => {
      const cacheChatList = [...(pre || [])];
      cacheChatList.unshift(newChat);
      return cacheChatList;
    });
  }, [navigate, setChatList]);

  const value = useMemo(() => ({
    chatList,
    setChatList,
    handleChange,
    handleNewChat,
    handleDelete,
    handleDeleteAll,
    handleChatValueChange,
  }), [chatList, handleChange, handleChatValueChange, handleNewChat]);

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}

export default ChatStore;
