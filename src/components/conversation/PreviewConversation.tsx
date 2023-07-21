import React, { useCallback, useMemo } from 'react';
import classNames from 'classnames';
import { IconUser } from '@douyinfe/semi-icons';
import { PreviewConversationProps } from './ConversationProps';
import Markdown from './components/Markdown';
import styles from './Conversation.module.less';

const defaultClass = 'md:px-5 w-full border-b border-black/10 text-gray-800';
const defaultAvatarUrl = 'https://sp-key.aios.chat/storage/v1/object/public/static/web/default.png';

const PreviewConversation: React.FC<PreviewConversationProps> = function PreviewConversation(props) {
  const { data, botAvatar, userAvatar } = props;

  const { character, error } = data;

  const renderAvator = useCallback(() => {
    if (character === 'user' && !userAvatar) {
      return <IconUser className="w-full flex items-center justify-center dark:text-white" size="large" />;
    }
    const userUrl = userAvatar;
    const aiUrl = botAvatar || defaultAvatarUrl;
    return <img className="rounded-sm" alt="" src={character === 'user' ? userUrl : aiUrl} />;
  }, [botAvatar, character, userAvatar]);

  const renderContent = useMemo(() => (
    <div className="markdown-body w-0 flex-grow">
      <div
        className={classNames('min-h-[20px] flex flex-col items-start gap-4', {
          [styles.error]: error,
          'whitespace-pre-line': character === 'user'
        })}
      >
        <Markdown hiddenButtons data={data} onEdit={() => {}} />
      </div>
    </div>
  ), [character, data, error]);

  return (
    <div
      className={classNames(defaultClass, {
        'bg-gray-50 dark:bg-[#1c1f24]': character !== 'user',
        'bg-white dark:bg-[#15171a]': character === 'user',
      })}
    >
      <div className="gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
        <div className="w-[30px] flex flex-col items-end flex-shrink-0">
          {renderAvator()}
        </div>
        {renderContent}
      </div>
    </div>
  );
};

export default PreviewConversation;
