/**
 * 发现页
 */
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Avatar, Typography, List, Skeleton, Card 
} from '@douyinfe/semi-ui';
import { IconSend } from '@douyinfe/semi-icons';
import Cards from '@/components/aiInfoCard';
import useChatList from '@/hooks/useChatList';
import ResponsiveLayout from '@/global/responsive-layout';
import useHotTopics from '@/pages/index/api';
import { defaultAvatarUrl } from '@/utils/env';
import type { TopicItem } from '@/pages/index/TopicItem';
import type { Assistant } from '@/global';

const { Title } = Typography;

function Explore() {
  const navigate = useNavigate();

  const [t, i18n] = useTranslation();

  const { data: topicList, isLoading } = useHotTopics(8, i18n.language);

  const { handleNewChat } = useChatList();
  
  const handleFetchAnswer = (message: string, assistant?: Assistant) => {
    const newChatProps = { systemMessage: assistant?.prompt || [], assistantId: assistant?.id, assistant };
    handleNewChat(newChatProps, true);
    navigate({
      pathname: '/chat/chat-page',
      search: createSearchParams({ q: encodeURIComponent(message || '') }).toString(),
    });
  };

  const renderHotTopicsItem = ({ entry, assistant }: TopicItem) => (
    <List.Item style={{ paddingRight: '10px', marginBottom: '20px' }} onClick={() => handleFetchAnswer(entry, assistant)}>
      <Card
        className="w-full h-[120px] bg-white dark:bg-[#21242b]"
        title={<Card.Meta title={<div className="text-overflow-l2">{entry}</div>} />}
        headerExtraContent={<IconSend />}
        shadows="hover"
        headerLine={false}
        headerStyle={{ height: '60px', padding: '16px 16px 0 16px' }}
        footerStyle={{ padding: '16px 16px 0 16px' }}
        bodyStyle={{ padding: 0 }}
        footer={(
          <div className="flex items-center">
            <Avatar className="mr-[12px] flex-shrink-0" size="small" src={assistant?.avatar || defaultAvatarUrl} />
            <span className="w-0 flex-grow text-overflow-l1">{assistant?.model}</span>
          </div>
        )}
      />
    </List.Item>
  );

  const renderTopicSkeleton = () => (
    <List.Item style={{ paddingRight: '10px', marginBottom: '20px' }}>
      <Skeleton.Title className="w-full h-36 rounded-lg" />
    </List.Item>
  );

  return (
    <ResponsiveLayout hiddenHeader className="relative flex flex-col p-4 md:p-10 overflow-auto">
      <div className="pb-12">    
        <Title heading={2} style={{ marginBottom: '0.5rem' }}>
          {t('top rated')}
        </Title>
        <Cards className="mb-3 !justify-start !-mx-4 !p-0 !h-auto" />
      </div>
      <div className="pb-12">    
        <Title heading={2} style={{ marginBottom: '0.3rem' }}>
          {t('ai topics')}
        </Title>
        <List
          grid={{
            xs: 24, sm: 12, md: 12, lg: 8, xl: 6, xxl: 6, className: 'min-[2160px]:w-1/6'
          }}
          dataSource={isLoading ? [1, 2, 3, 4, 5, 6, 7, 8] : topicList}
          renderItem={isLoading ? renderTopicSkeleton : renderHotTopicsItem}
        />
      </div>
    </ResponsiveLayout>
  );
}

export default Explore;
