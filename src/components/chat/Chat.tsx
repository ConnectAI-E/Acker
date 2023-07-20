import React, {
  useCallback, useEffect, useMemo, useRef, useState
} from 'react';
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'react-router-dom';
import { Toast } from '@douyinfe/semi-ui';
import { IconArrowDown, IconPause, IconRefresh } from '@douyinfe/semi-icons';
import ProjectSourceInfo from '@/components/project-source-info';
import ConversationItem from '@/components/conversation';
import AutoTextArea from '@/components/auto-textarea';
import GenConversation from '@/components/conversation/GenConversation';
import useScrollToBottom from '@/hooks/useScrollToBottom';
import useChatList from '@/hooks/useChatList';
import useCurrentChat from '@/hooks/useCurrentChat';
import { Conversation } from '@/global';
import CheckOptions from './CheckOptions';
import ShareGroup from './ShareGroup';
import styles from './Chat.module.less';

const Chat: React.FC = function Chat() {
  const {
    chatId,
    chat,
    assistant,
    assistantLoading,
    checkFlag,
  } = useCurrentChat();

  const { handleChange } = useChatList();

  const { data = [] } = chat || {};
  const [loading, setLoading] = useState<boolean>(false);
  const [retry, setRetry] = useState<boolean>(false);
  const [question, setQuestion] = useState<string>('');

  // 增加一个索引,用来匹配上一次的提问
  const [lastIndex, setLastIndex] = useState<number>(-1);

  // 筛选出user的提问
  const userQuestion = useMemo(() => data.filter((item) => item.character === 'user'), [data]);
  const userReverseQuestion = useMemo(() => userQuestion.reverse(), [userQuestion]);

  const getLastQuestion = useCallback(() => {
    const lastIndexTemp = lastIndex;
    if (lastIndexTemp + 1 >= userReverseQuestion.length) {
      return userReverseQuestion[lastIndexTemp]?.value;
    }
    setLastIndex(lastIndexTemp + 1);
    return userReverseQuestion[lastIndexTemp + 1]?.value;
  }, [userQuestion, lastIndex]);

  const getNextQuestion = useCallback(() => {
    const nextIndexTemp = lastIndex - 1;
    if (nextIndexTemp === -1) {
      setLastIndex(nextIndexTemp);
      return '';
    }
    if (nextIndexTemp < -1) {
      return '';
    }
    setLastIndex(nextIndexTemp);
    return userReverseQuestion[nextIndexTemp]?.value;
  }, [userQuestion, lastIndex]);

  const [query, setQuery] = useSearchParams();

  const [t] = useTranslation();

  const [scrollRef, scrollToBottom] = useScrollToBottom();

  const abortRef = useRef<any>();
  const arrowDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const content = scrollRef.current as HTMLDivElement;
    const arrowDownBtn = arrowDownRef.current;

    const handleScroll = () => {
      if (!content) return;
      if (content.scrollTop < content.scrollHeight - content.offsetHeight - 100) {
        arrowDownBtn?.style.setProperty('display', 'flex');
      } else {
        arrowDownBtn?.style.setProperty('display', 'none');
      }
    };

    handleScroll(); // 执行一遍设置初始状态

    content?.addEventListener('scroll', handleScroll);
    return () => {
      content?.removeEventListener('scroll', handleScroll);
    };
  }, [scrollRef]);

  useEffect(() => {
    const queryValue = decodeURIComponent(query.get('q') || '');
    if (queryValue) {
      setQuestion(queryValue);
      setQuery((pre) => {
        pre.delete('q');
        return new URLSearchParams(pre.toString());
      }, { replace: true });
    }
  }, [query, setQuery]);

  const handleEditorSave = useCallback((v: string, key: string) => {
    try {
      const cacheData = [...data];
      cacheData.forEach((_data) => {
        if (_data.key === key) {
          Object.assign(_data, { value: v });
        }
      });
      handleChange(chatId, cacheData);
      Toast.success(t('save.success'));
    } catch {
      Toast.error(t('unknown error'));
    }
  }, [chatId, data, handleChange, t]);

  const handleStopOrRetry = useCallback((e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    e.preventDefault();
    if (loading) {
      abortRef.current?.abort();
      return;
    }
    setRetry(true);
    setQuestion(data[data.length - 2]?.value);
  }, [data, loading]);

  const renderConversationItem = useCallback((item: Conversation, index: number, arr: Conversation[]) => (
    <ConversationItem
      key={item.key}
      data={item}
      pairData={item.character === 'user' ? arr[index + 1] : arr[index - 1]}
      generateLoading={loading}
      onEditorSave={handleEditorSave}
    />
  ), [handleEditorSave, loading]);

  const renderRetryButton = useMemo(() => ((loading || (data.length > 0 && !assistantLoading)) ? (
    <button
      type="button"
      className="btn flex justify-center gap-2 btn-neutral"
      onClick={handleStopOrRetry}
    >
      { loading ? <IconPause /> : <IconRefresh /> }
      { loading ? t('stop generating') : t('regenerate response') }
    </button>
  ) : null), [assistantLoading, data.length, handleStopOrRetry, t, loading]);

  const renderGenConversation = useMemo(() => (
    <GenConversation
      ref={abortRef}
      question={question}
      loading={loading}
      retry={retry}
      setRetry={setRetry}
      setQuestion={setQuestion}
      setLoading={setLoading}
      scrollToBottom={scrollToBottom}
    />
  ), [loading, question, retry, scrollToBottom]);

  return (
    <div className="flex-1 overflow-hidden relative">
      <div className="h-full relative">
        <div className="h-full w-full overflow-y-auto" ref={scrollRef}>
          {(data.length > 0 || question) ? (
            <div id="chat-content" className="flex flex-col items-center text-sm">
              {data.map(renderConversationItem)}
              <ShareGroup />
            </div>
          ) : <ProjectSourceInfo /> }
          { renderGenConversation }
        </div>
        <div
          ref={arrowDownRef}
          className={classNames(styles.arrowDown, 'bg-white dark:bg-[#2f2f35]')}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
            scrollToBottom();
          }}
        >
          <IconArrowDown />
        </div>
      </div>
      <div
        className={classNames('absolute bottom-0 left-0 w-full bg-vert-light-gradient dark:bg-vert-dark-gradient z-20', { 'md:px-4 max-md:pb-4': !checkFlag })}
      >
        { !checkFlag ? assistant && (
          <div className="flex flex-row pt-2 mx-auto max-w-4xl md:pb-6">
            <div className="relative flex h-full flex-1 flex-col max-md:px-2">
              <div className="w-full flex gap-2 justify-center mb-3">
                { renderRetryButton }
              </div>
              <AutoTextArea
                loading={loading || assistantLoading}
                onFetchAnswer={(value) => setQuestion(value.text)}
                getLastQuestion={getLastQuestion}
                getNextQuestion={getNextQuestion}
              />
            </div>
          </div>
        ) : (
          <CheckOptions data={data} />
        ) }
      </div>
    </div>
  );
};

export default Chat;
