import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import {
  Avatar, Button, Form, Typography, Toast, Spin 
} from '@douyinfe/semi-ui';
import { IconExternalOpen, IconUser } from '@douyinfe/semi-icons';
import GeneralConfig from '@/components/general-config';
import LoginTips from '@/components/login-tips';
import ApiKey from '@/components/api-key';
import useSupabase from '@/hooks/useSupabase';
import ResponsiveLayout from '@/global/responsive-layout';

const sectionPcClass = 'w-0 flex-grow h-min rounded-xl p-[24px] bg-[rgba(255,255,255,0.5)] dark:bg-[#21242b] mr-5';
const sectionMobileClass = 'max-md:w-full max-md:flex-grow-0 max-md:mr-0 max-md:mb-3 max-md:rounded-none';

const sectionClass = classNames(sectionPcClass, sectionMobileClass);

function Setting() {
  const { apiKeys, session, supabase } = useSupabase();

  const [t] = useTranslation(['setting', 'login']);

  const [signOutLoading, setSignOutLoading] = useState<boolean>(false);

  const { user } = session || {};

  const userName = user?.user_metadata.name || user?.user_metadata.user_name || user?.id;
  const email = user?.new_email || user?.email;
  const phone = user?.new_phone || user?.phone;
  
  const handleSignOut = async () => {
    if (signOutLoading) return;
    setSignOutLoading(true);
    const { error } = await supabase.auth.signOut().catch((err) => err);
    setSignOutLoading(false);
    if (error) {
      Toast.error(error.message);
    }
  };

  /**
   * @deprecated
   */
  const handleOpenKeyDetail = () => {
    if (session?.access_token) {
      const params = new URLSearchParams();
      params.append('access_token', session.access_token);
      params.append('expires_in', session.expires_in.toString());
      if (session.provider_token) {
        params.append('provider_token', session.provider_token);
      }
      params.append('refresh_token', session.refresh_token);
      params.append('token_type', 'bearer');
      window.open(`https://key.aios.chat/login/callback#${params.toString()}`);
    }
  };
  
  const renderInfoItem = useCallback((lable: string, info?: string) => {
    if (!info) return null;
    return (
      <div className="w-full flex items-center my-[8px] bg-white dark:bg-[#282c35] p-[16px] rounded-lg">
        <span className="text-[var(--semi-color-text-1)] flex-shrink-0 mr-[24px]">{lable}</span>
        <span className="w-0 flex-grow text-overflow-l1">{info}</span>
      </div>
    );
  }, []);

  return (
    <ResponsiveLayout hiddenHeader className="w-full flex max-md:flex-col p-5 max-md:p-0 overflow-auto">
      <div className={sectionClass}>
        {session ? (
          <Spin spinning={signOutLoading}>
            <Form.Section text={t('my info')}>
              <div className="flex items-center my-[24px]">
                <Avatar className="flex-shrink-0 mr-4" src={user?.user_metadata.avatar_url}>
                  <IconUser />
                </Avatar>
                <span className="w-0 flex-grow text-[24px] text-overflow-l1">
                  {userName}
                </span>
              </div>
              {renderInfoItem(t('login:email.upper'), email)}
              {renderInfoItem(t('login:phone.upper'), phone)}
            </Form.Section>
            {Array.isArray(apiKeys) && apiKeys.length > 0 && (
              <div className="mt-8">
                <Typography.Title heading={6} className="flex items-center">
                  {t('api keys')}
                  <Typography.Text link className="ml-4" onClick={handleOpenKeyDetail}>
                    <IconExternalOpen />
                  </Typography.Text>
                </Typography.Title>
                {apiKeys.map((key) => <ApiKey apiKey={key} key={key.id} />)}
              </div>
            )}
            <Button
              type="danger"
              className="w-full !h-[48px] !mt-[24px] rounded-lg !bg-white dark:!bg-[#2e333d] hover:opacity-80"
              onClick={handleSignOut}
            >
              {t('sign out')}
            </Button>
          </Spin>
        ) : (
          <LoginTips
            wrapperClassName="w-full h-[30vh] flex justify-center items-center"
            afterPagePath="/setting"
          />
        )}
      </div>
      <div className={sectionClass}>
        <Form.Section text={t('Setting')}>
          <GeneralConfig />
        </Form.Section>
      </div>
    </ResponsiveLayout>
  );
}

export default Setting;
