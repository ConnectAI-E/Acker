import { useCallback } from 'react';
import { Empty, Spin } from '@douyinfe/semi-ui';
import PreviewConversation from '@/components/conversation/PreviewConversation';
import type { Conversation } from '@/global';
import { useShareOutlet } from '../index';

function Share() {
  const { chat, isLoading, error } = useShareOutlet();

  const { data, assistant, user } = chat || {};

  const renderConversationItem = useCallback((item: Conversation) => (
    <PreviewConversation
      key={item.key}
      data={item}
      botAvatar={assistant?.avatar}
      userAvatar={user?.avatar}
    />
  ), [assistant, user]);

  return (
    <div className="w-full h-full overflow-auto">
      <Spin spinning={isLoading} wrapperClassName="!h-full" size="large">
        <div className="flex flex-col items-center text-sm">
          {data?.length > 0 && (
            <>
              {data.map(renderConversationItem)}
              <div className="h-[100px] bg-white dark:bg-[#15171a]" />
            </>
          )}
          {error && <Empty title={error.response?.data.error} description={error.response?.data?.message} />}
        </div>
      </Spin>
    </div>
  );
}

export default Share;
