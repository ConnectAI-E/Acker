import { useEffect, Suspense, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { AxiosError } from 'axios';
import { Button } from '@douyinfe/semi-ui';
import ResponsiveLayout from '@/global/responsive-layout';
import Fallback from '@/components/fallback';
import useChatList from '@/hooks/useChatList';
import type { ChatList } from '@/global';
import useShareChatData from './api';

interface ShareOutletProps {
  chat: ChatList;
  isLoading: boolean;
  error: AxiosError<Record<'message' | 'error' | 'statusCode', string>>;
}

export function useShareOutlet() {
  return useOutletContext<ShareOutletProps>();
}

function SharePage() {
  const navigate = useNavigate();

  const [t] = useTranslation();

  const { userid, shareid } = useParams<Record<'userid' | 'shareid', string>>();

  const { handleNewChat } = useChatList();

  const { data, isLoading, error } = useShareChatData(userid, shareid);

  useEffect(() => {
    if (!userid || !shareid) {
      navigate('/', { replace: true });
    }
  }, [userid, shareid, navigate]);

  const handleContinueChat = useCallback(() => {
    const { lastUpdateTime, chatId, ...rest } = data || {};
    handleNewChat({ ...rest } as any);
  }, [data, handleNewChat]);

  return (
    <ResponsiveLayout className="relative bg-white dark:bg-[#15171a]">
      <Suspense fallback={<Fallback />}>
        <Outlet context={{ chat: data, isLoading, error }} />
      </Suspense>
      {data?.data && !isLoading && (
        <div className="w-full h-[100px] absolute left-0 bottom-0 py-[34px] bg-vert-light-gradient dark:bg-vert-dark-gradient">
          <div className="max-w-xl mx-auto">
            <Button
              className="w-full !bg-[var(--semi-color-tertiary)]"
              type="tertiary"
              theme="solid"
              onClick={handleContinueChat}
            >
              {t('continue chat')}
            </Button>
          </div>
        </div>
      )}
    </ResponsiveLayout>
  );
}

export default SharePage;
