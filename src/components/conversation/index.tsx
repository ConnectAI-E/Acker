import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Checkbox, Toast } from '@douyinfe/semi-ui';
import { IconUser } from '@douyinfe/semi-icons';
import useCurrentChat from '@/hooks/useCurrentChat';
import useSupabase from '@/hooks/useSupabase';
import type { ConversationProps } from './ConversationProps';
import Markdown from './components/Markdown';
import Editor from './components/Editor';
import styles from './Conversation.module.less';

const defaultClass = 'md:px-5 w-full border-b border-black/10 text-gray-800';
const defaultAvatarUrl = 'https://sp-key.aios.chat/storage/v1/object/public/static/web/default.png';

const ConversationItem: React.FC<ConversationProps> = function ConversationItem(props) {
  const {
    data,
    pairData,
    generateLoading,
    onEditorSave,
  } = props;

  const [editorKey, setEditorKey] = useState<string>('');

  const { checkFlag, checkList, assistant, dispatch } = useCurrentChat();

  const { session } = useSupabase();

  const [t] = useTranslation();

  const {
    character,
    key,
    error,
    stop,
    value,
  } = data;

  const checked = checkList.some((_item) => _item.key === key);

  const userAvatarUrl = session?.user?.user_metadata.avatar_url;
  const botAvatarUrl = assistant?.avatar;

  const renderAvator = useCallback(() => {
    if (character === 'user' && !userAvatarUrl) {
      return <IconUser className="w-full flex items-center justify-center dark:text-white" size="large" />;
    }
    const userUrl = userAvatarUrl;
    const aiUrl = botAvatarUrl || defaultAvatarUrl;
    return <img className="rounded-sm" alt="" src={character === 'user' ? userUrl : aiUrl} />;
  }, [botAvatarUrl, character, userAvatarUrl]);

  const handleEditor = useCallback(() => {
    if (checkFlag) return;
    if (generateLoading) return;
    if (editorKey === key) return;
    setEditorKey(key);
  }, [editorKey, checkFlag, generateLoading, key]);

  const handleSave = useCallback((v: string) => {
    if (generateLoading) {
      Toast.warning(t('generate save error'));
      return;
    }
    onEditorSave(v, key);
    setEditorKey('');
  }, [generateLoading, key, t, onEditorSave]);

  const handleCheckChange = () => {
    if (!checkFlag) return;
    dispatch({ type: 'check', data: [data, pairData] });
  };

  const renderHeader = useMemo(() => (
    <div className="w-[30px] flex flex-col items-end flex-shrink-0">
      {checkFlag ? <Checkbox checked={checked} /> : renderAvator()}
    </div>
  ), [checkFlag, checked, renderAvator]);

  const renderContent = useMemo(() => (
    <div className="markdown-body w-0 flex-grow">
      <div
        className={classNames('min-h-[20px] flex flex-col items-start gap-4', {
          [styles.error]: error,
          [styles.loading]: !stop && character !== 'user',
          [styles.start]: character !== 'user' && !value,
          'whitespace-pre-line': character === 'user'
        })}
        onDoubleClick={handleEditor}
      >
        {editorKey === key ? (
          <Editor value={value} onSave={handleSave} onCancel={() => setEditorKey('')} />
        ) : (
          <Markdown hiddenButtons={checkFlag} data={data} onEdit={handleEditor} />
        ) }
      </div>
    </div>
  ), [character, key, stop, value, data, editorKey, checkFlag, error, handleEditor, handleSave]);

  return (
    <div
      onClick={handleCheckChange}
      className={classNames(defaultClass, {
        'bg-gray-50 dark:bg-[#1c1f24]': character !== 'user',
        'bg-white dark:bg-[#15171a]': character === 'user',
        'cursor-pointer': checkFlag,
        'user-select-none': key === editorKey
      })}
    >
      <div className="gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
        {renderHeader}
        {renderContent}
      </div>
    </div>
  );
};

export default ConversationItem;
