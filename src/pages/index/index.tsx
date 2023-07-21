/**
 * 网站首页
 */
import classNames from 'classnames';
import { useTranslation } from 'react-i18next';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { List, Typography } from '@douyinfe/semi-ui';
import { IconSend, IconSync } from '@douyinfe/semi-icons';
import Cards from '@/components/aiInfoCard';
import AutoTextArea from '@/components/auto-textarea';
import useChatList from '@/hooks/useChatList';
import useResponsiveMobile from '@/hooks/useResponsiveMobile';
import ResponsiveLayout from '@/global/responsive-layout';
import type { InputProps } from '@/components/auto-textarea/AutoTextArea';
import useHotTopics from './api';
import HotTopicSkeleton from './components/HotTopicSkeleton';
import type { TopicItem } from './TopicItem';
import styles from './portal.module.less';

const { Text, Title } = Typography;

const lightBgCls = 'bg-[url(https://sp-key.aios.chat/storage/v1/object/public/static/web/home-bg.png)]';
const darkBgCls = 'dark:bg-[url(https://sp-key.aios.chat/storage/v1/object/public/static/web/home-bg-dark.png)]';

function Home () {
  const navigate = useNavigate();

  const [t, i18n] = useTranslation();

  const { data, isLoading, refresh } = useHotTopics(5, i18n.language);

  const { handleNewChat } = useChatList();

  const isMobile = useResponsiveMobile();

  const handleFetchAnswer = (value: InputProps) => {
    handleNewChat({}, true);
    navigate({
      pathname: '/chat/chat-page',
      search: createSearchParams({ q: encodeURIComponent(value.text || '') }).toString(),
    });
  };

  const renderReloadButton = () => (
    <div
      className={classNames('opacity-60 hover:opacity-90 cursor-pointer', { 'opacity-30': isLoading, 'mx-auto': !isMobile })}
      onClick={refresh}
    >
      <IconSync spin={isLoading} className="mr-2 align-text-bottom" />
      <Text>{t('Reload')}</Text>
    </div>
  );

  return (
    <ResponsiveLayout
      hiddenHeader
      wrapperClassName="relative"
      className={classNames(lightBgCls, darkBgCls, styles.home)}
      footerProps={{ input: true, onRequest: handleFetchAnswer }}
    >
      <div className="h-full flex flex-col md:items-center md:justify-center pb-20 overflow-auto bg-home-light dark:bg-home-dark">
        <div className="text-center w-full flex-shrink-0">
          <div className={classNames('h-24', styles.headerTitle)} />
          <div className="text-xl h-14 text-[#6C6C6C] mt-0">{t('home title')}</div>
        </div>
        <div className="flex justify-between items-center md:hidden px-4 mb-4">
          <Title heading={2}>{t('ai assistant')}</Title>
        </div>
        <Cards style={{ marginBottom: '40px' }} />
        <div className="flex justify-between items-center md:hidden px-4 mt-4">
          <Title heading={2}>{t('hot topics')}</Title>
          {renderReloadButton()}
        </div>
        {isLoading ? <HotTopicSkeleton /> : (
          <List
            className="mt-4 max-w-[50%] max-md:max-w-[100%] px-4"
            dataSource={data}
            renderItem={(item: TopicItem) => (
              <List.Item
                className="w-full h-[54px] relative !pr-[40px] rounded-lg bg-white dark:bg-[#21242b] mb-[16px] !border-b-[0px] cursor-pointer hover:opacity-90"
                onClick={() => handleFetchAnswer({ text: item?.entry, files: [] })}
              >
                <Text ellipsis className="text-[#15171c] dark:text-white font-medium">{item?.entry}</Text>
                <IconSend className="absolute right-[16px] top-1/2 -translate-y-1/2" />
              </List.Item>
            )}
          />
        )}
        {!isMobile && renderReloadButton()}
      </div>
      {!isMobile && (
        <div className="absolute bottom-0 left-0 w-full bg-vert-light-gradient dark:bg-vert-dark-gradient px-4">
          <div className="flex flex-row pt-2 mb-6 mx-auto max-w-6xl">
            <AutoTextArea hiddenUpload loading={false} onFetchAnswer={handleFetchAnswer} />
          </div>
        </div>
      )}
    </ResponsiveLayout>
  );
}

export default Home;
