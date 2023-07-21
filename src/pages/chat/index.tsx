import { useState, useEffect, Suspense } from 'react';
import { useNavigate, Outlet, useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Layout } from '@douyinfe/semi-ui';
import ChatList from '@/components/chat-list';
import Fallback from '@/components/fallback';
import ResponsiveLayout from '@/global/responsive-layout';
import type { ChatOutletProps } from './Chat';

export function useChatOutlet() {
  return useOutletContext<ChatOutletProps>();
}

function App () {
  const navigate = useNavigate();

  const [t] = useTranslation();

  const [hiddenHeader, setHiddenHeader] = useState<boolean>(false);

  useEffect(() => {
    if (window.location.pathname === '/chat') {
      navigate('/chat/create-page', { replace: true });
    }
  }, [navigate]);

  return (
    <ResponsiveLayout
      hiddenFooter
      hiddenHeader={hiddenHeader}
      className="flex bg-white dark:bg-[#17191f]"
      headerProps={{ title: t('create page'), back: true, onLeftClick: () => navigate('/chat-mobile') }}
    >
      <Layout.Sider
        className="w-[290px] max-md:hidden flex-shrink-0 bg-gray-100 px-[0px] py-[16px] dark:bg-[#181d24]"
        style={{ borderRight: '1px solid var(--semi-color-border)' }}
      >
        <ChatList />
      </Layout.Sider>
      <Layout.Content className="h-full">
        <Suspense fallback={<Fallback />}>
          <Outlet context={{ setHiddenHeader }} />
        </Suspense>
      </Layout.Content>
    </ResponsiveLayout>
  );
}

export default App;
