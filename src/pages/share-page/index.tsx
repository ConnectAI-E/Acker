import { useEffect, Suspense } from 'react';
import { Outlet, useNavigate, useParams, useOutletContext } from 'react-router-dom';
import { AxiosError } from 'axios';
import ResponsiveLayout from '@/global/responsive-layout';
import Fallback from '@/components/fallback';
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

  const { userid, shareid } = useParams<Record<'userid' | 'shareid', string>>();

  const { data, isLoading, error } = useShareChatData(userid, shareid);

  useEffect(() => {
    if (!userid || !shareid) {
      navigate('/', { replace: true });
    }
  }, [userid, shareid, navigate]);

  return (
    <ResponsiveLayout>
      <Suspense fallback={<Fallback />}>
        <Outlet context={{ chat: data, isLoading, error }} />
      </Suspense>
    </ResponsiveLayout>
  );
}

export default SharePage;
