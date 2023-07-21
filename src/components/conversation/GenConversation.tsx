import React, {
  useState, useEffect, useCallback, useRef, useMemo, useImperativeHandle, useTransition 
} from 'react';
import { v4 as uuid } from 'uuid';
import axios, { AxiosError } from 'axios';
import useCurrentChat from '@/hooks/useCurrentChat';
import useSupabase from '@/hooks/useSupabase';
import useChatList from '@/hooks/useChatList';
import { getCachePrompt, parseMarkdown, parseStreamText, getCurrentDate } from '@/utils';
import { calculateMessages } from '@/utils/tiktoken';
import { ONLY_TEXT } from '@/utils/env';
import type { Conversation } from '@/global';
import type { GenConversationProps } from './ConversationProps';
import ConversationItem from '.';

const GenConversation: React.ForwardRefRenderFunction<any, GenConversationProps> = function GenConversation(props, ref) {
  const {
    question,
    loading,
    retry,
    setRetry,
    setQuestion,
    setLoading,
    scrollToBottom
  } = props;

  const { chat, assistant, assistantLoading, chatId } = useCurrentChat();

  const { handleChatValueChange, handleChange } = useChatList();

  const { apiKeys } = useSupabase();

  const [isPending, starTranstion] = useTransition();

  const [generateList, setGenerateList] = useState<Conversation[]>([]);

  const abortControllerRef = useRef<AbortController>();

  const apiKey = useMemo(() => (apiKeys && apiKeys.length > 0 ? apiKeys[0].api_key : ''), [apiKeys]);

  const { systemMessage, data: originData } = chat || { systemMessage: [], data: [] };

  const abort = () => {
    abortControllerRef.current?.abort();
  };

  const handleFetchAnswer = useCallback((value: string) => {
    if (loading || !value) return;
    const conversationId = uuid();
    const data: Conversation[] = [
      {
        character: 'user', value, key: uuid(), error: false, conversationId
      },
      {
        character: 'bot', value: '', key: uuid(), error: false, conversationId
      }
    ];
    let cacheOriginData = JSON.parse(JSON.stringify(originData));
    if (retry) {
      cacheOriginData = cacheOriginData.slice(0, cacheOriginData.length - 2);
      starTranstion(() => {
        handleChange(chatId, cacheOriginData);
      });
    }
    handleChatValueChange(chatId, 'lastUpdateTime', getCurrentDate(true));
    setGenerateList(JSON.parse(JSON.stringify(data)));
    setLoading(true);
    scrollToBottom();
    abortControllerRef.current = new AbortController();
    const preMessages = (systemMessage || []).concat(getCachePrompt([...cacheOriginData, ...data], value)); // 获取上下文缓存的信息
    const { model, configuration } = assistant;
    const messages = calculateMessages(preMessages, model); // 计算上下文长度
    const { host, apiKey: configApiKey, ...rest } = configuration;
    const authorization: string = configApiKey || apiKey || '';
    const headers = authorization ? { Authorization: `Bearer ${authorization}` } : {};

    axios({
      url: host,
      timeout: 300000,
      method: 'POST',
      responseType: 'stream',
      headers: { ...headers },
      data: { messages, model, ...rest },
      signal: abortControllerRef.current.signal,
      onDownloadProgress({ event }) {
        const chunk: string = event.target?.responseText || '';
        const statusCode = event.target?.status;
        if (statusCode === 200) {
          try {
            const parseChunk = ONLY_TEXT === 'true' ? chunk : parseStreamText(chunk);
            const parseMarkdownValue = parseMarkdown(parseChunk);
            Object.assign(data[1], { value: parseMarkdownValue, error: false });
            setGenerateList((c) => {
              const pre = [...c];
              const [lastConversation] = pre.slice(-1);
              if (lastConversation) {
                Object.assign(lastConversation, { value: parseMarkdownValue, error: false });
              }
              return pre;
            });
            scrollToBottom();
          } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
          }
        }
      },
    }).catch((error: AxiosError) => {
      const res = error.response?.data;
      const errorObj = res && typeof res === 'string' ? JSON.parse(res) : res;
      const errorMsg = errorObj?.error?.message || errorObj?.message || errorObj?.error?.code || errorObj?.code || '';
      Object.assign(data[1], { value: data[1].value || errorMsg || 'something is wrong', error: true, stop: true });
      setGenerateList((c) => {
        const pre = [...c];
        const [lastConversation] = pre.slice(-1);
        if (lastConversation) {
          Object.assign(lastConversation, { value: lastConversation.value || errorMsg || 'something is wrong', error: true, stop: true });
        }
        return pre;
      });
    }).finally(() => {
      setLoading(false);
      setRetry(false);
      setQuestion('');
      setGenerateList([]);
      abortControllerRef.current = undefined;
      const pre = [...cacheOriginData, ...data];
      const [lastConversation] = pre.slice(-1);
      Object.assign(lastConversation, { stop: true });
      handleChange(chatId, pre);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, originData, chatId, apiKey, assistant, systemMessage, retry, handleChange, handleChatValueChange, scrollToBottom]);

  const renderGenItem = useCallback((item: Conversation, index: number, arr: Conversation[]) => (
    <ConversationItem
      key={item.key}
      data={item}
      pairData={item.character === 'user' ? arr[index + 1] : arr[index - 1]}
      generateLoading={loading}
      onEditorSave={() => {}}
    />
  ), [loading]);

  useImperativeHandle(ref, () => ({ abort }));

  useEffect(() => {
    if (question && !assistantLoading) {
      handleFetchAnswer(question.trim());
    }
  }, [question, assistantLoading, handleFetchAnswer]);

  useEffect(() => {
    if (loading) {
      return () => {
        abortControllerRef.current?.abort();
      };
    }
    return () => {};
  }, [loading]);

  return (
    <>
      {generateList.map(renderGenItem)}
      <div className="w-full h-48 flex-shrink-0 html2canvas-ignore" />
    </>
  );
};

export default React.forwardRef(GenConversation);
