/* eslint-disable no-console */
import React, { useRef, useState, useMemo, useCallback } from 'react';
import { v4 as uuid } from 'uuid';
import { useTranslation } from 'react-i18next';
import { Toast } from '@douyinfe/semi-ui';
import { PhotoProvider } from 'react-photo-view';
import { IconPause } from '@douyinfe/semi-icons';
import AutoTextArea from '@/components/auto-textarea';
import ProjectSourceInfo from '@/components/project-source-info';
import { getCurrentDate } from '@/utils';
import type { Conversation } from '@/global';
import type { InputProps } from '@/components/auto-textarea/AutoTextArea';
import type { UploadedFile } from '@/components/auto-textarea/FilesProps';
import { useMidjourney, usePollingMidjourney } from './api';
import type { Component, MidJourneyData, MidJourneyResponse } from './MidJourneyChatProps';
import MJConversation from './MJConversation';
import renderToolbar from './Toolbar';
import useSupabase from '@/hooks/useSupabase';
import useCurrentChat from '@/hooks/useCurrentChat';
import useChatList from '@/hooks/useChatList';

const MidJourneyChat: React.FC = function MidJourneyChat() {
  const { chat, assistant, assistantLoading, chatId } = useCurrentChat();

  const { handleChange, handleChatValueChange } = useChatList();

  const { session, apiKeys } = useSupabase();

  const { data: chatData } = chat || {};

  const { trigger: imageTrigger, isMutating: imageLoading } = useMidjourney();

  const { trigger, isMutating } = usePollingMidjourney();

  const [t] = useTranslation();

  const [conversation, setConversation] = useState<Conversation[]>(chatData || []);
  const [loading, setLoading] = useState<boolean>(false);

  const conversationRef = useRef<Conversation[]>();
  const abortRef = useRef<boolean>(false);

  const apiKey = useMemo(() => (apiKeys && apiKeys.length > 0 ? apiKeys[0].api_key : ''), [apiKeys]);

  const isLoading = imageLoading || isMutating || loading;

  const handleChatChange = (_data: MidJourneyData | null, finish?: boolean) => {
    const { state, img_url: imgUrl } = _data || {};
    const pre = [...(conversationRef.current || [])];
    const [lastConversation] = pre.slice(-1);
    Object.assign(lastConversation, {
      error: false,
      stop: finish,
      url: imgUrl,
      progress: state,
      type: imgUrl ? 'image' : 'text',
      midjourneyData: _data,
    });
    setConversation(pre);
    handleChange(chatId, pre);
  };

  const handleError = useCallback((message: string) => {
    const pre = [...(conversationRef.current || [])];
    const [lastConversation] = pre.slice(-1);
    Object.assign(lastConversation, { error: true, stop: true, value: message, type: 'text' });
    setConversation(pre);
    setLoading(false);
    handleChange(chatId, pre);
  }, [chatId, handleChange]);

  const handlePollingImage = async ({ id, host, key }: Record<string, any>) => {
    if (abortRef.current) {
      return;
    }
    await trigger({ id, host, key }).then((res) => {
      const { data: responseData } = res || {};
      if (responseData) {
        const { msg, data } = responseData as MidJourneyResponse;
        if (msg && msg !== 'OK') {
          handleError(msg);
          return;
        }
        if (data?.state !== 'Done') {
          handleChatChange(data);
          setTimeout(() => {
            handlePollingImage({ id, host, key }).catch((err) => { throw err; });
          }, 2000);
        } else {
          handleChatChange(data, true);
          setLoading(false);
        }
      }
    }).catch((err) => {
      console.error(err);
    });
  };

  const handleFetch = async (value: string, params: Record<string, any> = {}) => {
    if (imageLoading || isMutating || loading || !assistant || !value) return;
    const { configuration: { host, apiKey: configApiKey } } = assistant || { configuration: {} };
    if (!host) {
      Toast.warning(t('host not fuound'));
      return;
    }
    const conversationId = uuid();
    conversationRef.current = [
      ...conversation,
      {
        character: 'user', value, key: uuid(), error: false, conversationId, files: params?.files || [],
      },
      {
        character: 'bot', value: t('The image is being generated, please wait.'), key: uuid(), error: false, conversationId
      }
    ];
    setConversation(conversationRef.current);
    handleChange(chatId, conversationRef.current);
    handleChatValueChange(chatId, 'lastUpdateTime', getCurrentDate(true));
    setLoading(true);
    abortRef.current = false;
    try {
      const { promptFlag = true, files = [], ...rest } = params;
      const imgs = files?.map((file: UploadedFile) => file.url);
      const res = await imageTrigger({
        host,
        key: configApiKey || apiKey,
        prompt: promptFlag ? value : '',
        imgs,
        ...rest
      }).catch((err) => { throw err; });
      if (res?.data.msg && res?.data.msg !== 'OK') {
        handleError(res.data.msg);
      } else {
        const { id } = res?.data.data || {};
        if (id === 0) {
          handleError(t('Something is wrong, please try again.'));
        } else {
          await handlePollingImage({ id, host, key: configApiKey || apiKey });
        }
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleTextArea = (value: InputProps) => {
    const { text, files } = value;
    handleFetch(text, { files }).catch(() => {});
  };

  const handleStop = useCallback(() => { 
    handleError(t('This request has been terminated.'));
    abortRef.current = true;
  }, [handleError, t]);

  const afterOptionsFinish = (data: Conversation, component: Component) => {
    const { character, key } = data;
    if (character === 'bot') {
      const cacheChatList = [...(conversationRef.current || [])];
      const [lastConversation] = cacheChatList.slice(-1);
      const curChat = cacheChatList.find((_chat) => _chat.key === key);
      if (curChat?.midjourneyData?.components && !lastConversation.error) {
        curChat.midjourneyData.components.forEach((_component) => {
          if (_component.custom_id === component.custom_id) {
            Object.assign(_component, { disabled: true });
          }
        });
        setConversation(cacheChatList);
        handleChange(chatId, cacheChatList);
      }
    }
  };

  return (
    <div className="h-0 flex-grow relative">
      <div className="h-full relative overflow-auto">
        {conversation.length > 0 ? (
          <PhotoProvider maskOpacity={0.5} toolbarRender={renderToolbar}>
            {conversation.map((data, index, arr) => (
              <MJConversation
                key={data.key}
                index={index}
                data={data}
                botAvatar={assistant?.avatar}
                userAvatar={session?.user?.user_metadata.avatar_url}
                question={data.character === 'bot' ? arr[index - 1].value : ''}
                isLoading={isLoading}
                onFetch={handleFetch}
                afterOptionsFinish={afterOptionsFinish}
              />
            ))}
          </PhotoProvider>
        ) : <ProjectSourceInfo />}
        <div className="w-full h-48 flex items-center py-4 px-12 md:py-6 flex-shrink-0 bg-white dark:bg-[#15171a]" />
      </div>
      <div className="absolute bottom-0 left-0 w-full bg-vert-light-gradient dark:bg-vert-dark-gradient">
        {loading && (
          <div className="w-full text-center">
            <button type="button" className="btn flex justify-center gap-2 btn-neutral" onClick={handleStop}>
              <IconPause />
              {t('stop generating')}
            </button>
          </div>
        )}
        <div className="mx-2 flex flex-row last:mb-2 md:last:mb-6 lg:mx-auto lg:max-w-3xl pt-3">
          <AutoTextArea
            loading={isLoading || assistantLoading}
            onFetchAnswer={handleTextArea}
            uploadProps={{ accept: 'image/*', multiple: true }}
            hiddenInspiration
          />
        </div>
      </div>
    </div>
  );
};

export default MidJourneyChat;
