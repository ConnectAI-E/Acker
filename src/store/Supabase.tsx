import React, {
  useState, useEffect, createContext, useMemo, useCallback 
} from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import debounce from 'lodash/debounce';
import { createClient, Session } from '@supabase/supabase-js';
import { Toast } from '@douyinfe/semi-ui';
import useCreateApiKey from '@/api/apiKey';
import { type SupabaseStoreProps, type ApiKey, StandardUpload } from '@/global';

interface SupabaseProps {
  children: React.ReactElement
}

const projectUrl = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase = createClient(projectUrl, anonKey);

const fetchApiKey = debounce(async () => {
  // 没登录的话，data为空数组
  const { data, error } = await supabase.from('api_keys').select('*');
  return { data, error };
}, 1000, { leading: true, trailing: false });

const getPreviewUrl = (path: string): string => (path ? `${projectUrl}/storage/v1/object/public/${path}` : '');

const getUploadUrl = (bucketName: string = 'users') => `${projectUrl}/storage/v1/object/${bucketName}`;

export const Store = createContext<SupabaseStoreProps>({} as any);

function Supabase({ children }: SupabaseProps) {
  const [session, setSession] = useState<Session | null>(null);
  const [apiKeys, setApiKeys] = useState<ApiKey[] | null>([]);

  const { trigger } = useCreateApiKey();

  const [t] = useTranslation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session: _session } }) => {
      setSession(_session);
    }).catch(() => {});

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, _session) => {
      setSession(_session);
      if (_session) {
        fetchApiKey()?.then(({ data }) => {
          // 没有key就创建一个
          if (data?.length === 0) {
            trigger({}).then((res) => { setApiKeys([res?.data]); }).catch((err) => {
              // eslint-disable-next-line no-console
              console.error(err);
            });
          } else {
            setApiKeys(data as any);
          }
        }, () => {});
      }
    });

    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const standardUpload = useCallback<StandardUpload>(async (
    file: File | Blob,
    fileName: string,
    onProgress = (_: number) => {},
    abort: AbortController | null = null,
    bucketName?: string,
  ) => {
    if (!session) {
      Toast.warning(t('upload error with no login'));
      return '';
    }
    const url = `${getUploadUrl(bucketName)}/${session.user.id}/${fileName}`;
    const body = new FormData();
    body.append('cacheControl', '3600');
    body.append('', file);
    const res = await axios({
      url,
      method: 'post',
      data: body,
      signal: abort?.signal,
      headers: {
        Authorization: `Bearer ${session.access_token}`,
        'x-upsert': 'true',
        'x-client-info': 'supabase-js/2.24.0',
        'content-type': 'multipart/form-data'
      },
      onUploadProgress: (progressEvent) => {
        onProgress?.(Math.round((progressEvent.progress || 0) * 100));
      },
    }).then((response) => response.data);
  
    return getPreviewUrl(res.Key);
  }, [session, t]);

  const value = useMemo(() => ({
    supabase,
    session,
    apiKeys,
    setApiKeys,
    setSession,
    standardUpload,
  }), [session, apiKeys, standardUpload]);

  return (
    <Store.Provider value={value}>
      {children}
    </Store.Provider>
  );
}

export default Supabase;
