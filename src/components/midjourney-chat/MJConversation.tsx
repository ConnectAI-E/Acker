import React, { useCallback, useEffect, useState } from 'react';
import classNames from 'classnames';
import { IconUser } from '@douyinfe/semi-icons';
import { Button, Progress } from '@douyinfe/semi-ui';
import { PhotoView } from 'react-photo-view';
import type { Component, MJConversationProps } from './MidJourneyChatProps';
import styles from '@/components/conversation/Conversation.module.less';

const defaultClass = 'md:px-5 w-full border-b border-black/10 text-[var(--color-fg-default)';
const defaultAvatarUrl = 'https://sp-key.aios.chat/storage/v1/object/public/static/web/default.png';

const MJConversation: React.FC<MJConversationProps> = function MJConversation(props) {
  const {
    data, botAvatar, userAvatar, index, question, isLoading, onFetch, afterOptionsFinish
  } = props;

  const {
    character, value, type, url, error, stop, progress, midjourneyData, files,
  } = data;

  const { message_id: messageId, components } = midjourneyData || {};

  const [customId, setCustomId] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    const getImageUrls = async () => {
      if (files) {
        const urls = await Promise.all(files.map(async (file) => new Promise((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result);
          };
          if (file.originFile instanceof File) {
            reader.readAsDataURL(file.originFile);
          } else {
            resolve(file.url);
          }
        })));
        setImageUrls(urls as string[]);
      }
    };

    getImageUrls().catch(() => {});
  }, [files]);

  const handleOptionClick = (component: Component) => {
    if (component.disabled) return;
    setCustomId(component.custom_id);
    onFetch(`${(question || messageId) as string}--${component.label}`, {
      promptFlag: false,
      message_id: messageId,
      request_type: component.label
    }).then(() => {
      afterOptionsFinish(data, component);
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error(err);
    }).finally(() => {
      setCustomId('');
    });
  };

  const renderAvator = useCallback((_character: 'user' | 'bot') => {
    if (_character === 'user' && !userAvatar) {
      return <IconUser className="w-full flex items-center justify-center dark:text-white" size="large" />;
    }
    const userUrl = userAvatar;
    const aiUrl = botAvatar || defaultAvatarUrl;
    return <img className="rounded-sm" alt="" src={_character === 'user' ? userUrl : aiUrl} />;
  }, [botAvatar, userAvatar]);

  const renderBotResponse = useCallback((_value: string) => {
    if (type === 'image') {
      return (
        <PhotoView src={url} key={index}>
          <img alt="404" src={url} className="cursor-pointer object-cover" />
        </PhotoView>
      );
    }
    return _value;
  }, [type, url, index]);

  const renderUserImage = (imageUrl: string) => {
    if (!imageUrl) return null;
    return (
      <PhotoView src={imageUrl} key={imageUrl}>
        <img alt="404" src={imageUrl} className="w-1/2 cursor-pointer object-cover" />
      </PhotoView>
    );
  };

  const renderProgress = (_progress: string) => {
    const [percent] = _progress.split('%');
    const parsePercent = Number(percent);
    return Number.isNaN(parsePercent) ? <div>{_progress}</div> : (
      <Progress className="w-full mt-5" showInfo percent={parsePercent} />
    );
  };

  return (
    <div
      className={classNames(defaultClass, {
        'bg-gray-50 dark:bg-[#1c1f24]': character !== 'user',
        'bg-white dark:bg-[#15171a]': character === 'user',
      })}
    >
      <div className="gap-6 m-auto md:max-w-2xl lg:max-w-2xl xl:max-w-3xl p-4 md:py-6 flex lg:px-0">
        <div className="w-[30px] flex flex-col items-end flex-shrink-0">
          {renderAvator(character)}
        </div>
        <div className="markdown-body w-0 flex-grow">
          <div
            className={classNames('flex flex-col items-start', {
              [styles.error]: error,
              [styles.loading]: !stop && character !== 'user',
              [styles.start]: character !== 'user' && type !== 'image' && !stop,
              'whitespace-pre-line': character === 'user'
            })}
          >
            {character === 'user' ? value : renderBotResponse(value)}
            {Array.isArray(imageUrls) && imageUrls.length > 0 && (
              <div className="w-full flex mt-2">
                {imageUrls.map(renderUserImage)}
              </div>
            )}
            {character !== 'user' && type === 'image' && progress && progress !== 'Done' && renderProgress(progress)}
            {character === 'bot' && type === 'image' && progress === 'Done' && Array.isArray(components) && (
              <div className="w-full flex flex-wrap">
                {components.map((component) => (
                  <Button
                    key={component.custom_id}
                    className="!bg-[var(--semi-color-tertiary)] basis-1/6 mt-2 mr-2"
                    type="tertiary"
                    theme="solid"
                    loading={customId === component.custom_id}
                    disabled={customId === component.custom_id ? false : (component.disabled || isLoading)}
                    onClick={() => handleOptionClick(component)}
                  >
                    {component.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MJConversation;
