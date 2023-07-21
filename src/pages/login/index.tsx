import { Suspense, useState, useEffect } from 'react';
import {
  Outlet, createSearchParams, useNavigate, useOutletContext, useSearchParams 
} from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { AuthError } from '@supabase/supabase-js';
import { Icon, Toast } from '@douyinfe/semi-ui';
import useSupabase from '@/hooks/useSupabase';
import Fallback from '@/components/fallback';
import ResponsiveLayout from '@/global/responsive-layout';
import Logo from '@/assets/svg/logo.svg';
import { HOST } from '@/utils/env';
import type { LoginOutletProps } from './Login';

export function useLoginOutlet() {
  return useOutletContext<LoginOutletProps>();
}

function Login() {
  const [error, setError] = useState<string>('');

  const { supabase, session } = useSupabase();

  const navigate = useNavigate();

  const [t] = useTranslation('login');
  
  const [query] = useSearchParams();

  useEffect(() => {
    if (window.location.pathname === '/login' && !session) {
      navigate('/login/auth', { replace: true });
    } else if (session) {
      navigate('/', { replace: true });
    }
  }, [navigate, session]);

  const handleSuccessful = () => {
    Toast.success(t('login success'));
    const afterPagePath = localStorage?.getItem('afterPagePath');
    window.location.href = afterPagePath || '/';
    localStorage?.removeItem('afterPagePath');
  };

  const handleEmailSubmit = async (_email: string) => {
    const { error: authError } = await supabase.auth.signInWithOtp({
      email: _email,
      options: { emailRedirectTo: HOST }
    });
    if (authError instanceof AuthError) {
      setError(authError.message);
    } else {
      setError(authError || '');
      navigate({
        pathname: '/login/verification',
        search: createSearchParams({ email: encodeURIComponent(_email) }).toString() 
      });
    }
  };

  const handlePhoneSubmit = async (_phone: string) => {
    const { error: authError } = await supabase.auth.signInWithOtp({ phone: _phone });
    if (authError instanceof AuthError) {
      setError(authError.message);
    } else {
      setError(authError || '');
      navigate({
        pathname: '/login/verification',
        search: createSearchParams({ phone: encodeURIComponent(_phone) }).toString() 
      });
    }
  };

  const handleEmailCodeSubmit = async (code: string) => {
    const email = decodeURIComponent(query.get('email') || '');
  
    const { error: magiclinkError } = await supabase.auth.verifyOtp({ email, token: code, type: 'magiclink' });

    if (magiclinkError) {
      const { error: signupError } = await supabase.auth.verifyOtp({ email, token: code, type: 'signup' });
      if (signupError) {
        setError(signupError.message);
      } else {
        handleSuccessful();
      }
    } else {
      handleSuccessful();
    }
  };

  const handlePhoneCodeSubmit = async (code: string) => {
    const phone = decodeURIComponent(query.get('phone') || '');
  
    const { error: smsError } = await supabase.auth.verifyOtp({ phone, token: code, type: 'sms' });

    if (smsError) {
      setError(smsError.message);
    } else {
      handleSuccessful();
    }
  };

  const handleGithubLogin = async () => {
    const afterPagePath: string = localStorage?.getItem('afterPagePath') || '';
    localStorage?.removeItem('afterPagePath');
    const { error: githubError } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${HOST}${afterPagePath}` }
    });

    if (githubError) {
      setError(githubError.message);
    }
  };

  return (
    <ResponsiveLayout
      hiddenFooter
      className="flex flex-col items-center justify-center"
      headerProps={{ title: t('title'), back: true, onLeftClick: () => navigate(-1) }}
    >
      <div className="text-center dark:text-white">
        <Icon className="w-[24px] h-[24px]" svg={<Logo />} />
      </div>
      <Suspense fallback={<Fallback />}>
        <Outlet
          context={{
            onEmailSubmit: handleEmailSubmit,
            onPhoneSubmit: handlePhoneSubmit,
            onEmailCodeSubmit: handleEmailCodeSubmit,
            onPhoneCodeSubmit: handlePhoneCodeSubmit,
            onGithubLogin: handleGithubLogin,
          }}
        />
      </Suspense>
      {error && (
        <div className="text-center text-red-600 mt-8">
          {error}
        </div>
      )}
    </ResponsiveLayout>
  );
}

export default Login;
