import { useEffect } from 'react';
import { preload } from 'swr';
import { axiosInstance } from '@/api/axios';
import useSupabase from './useSupabase';

const fetcher = async ([_url, _source]: string[]) => axiosInstance.get(_url, { params: { source: _source } });

function usePreload() {
  const { session } = useSupabase();

  useEffect(() => {
    if (session) {
      preload('/assistant/27', axiosInstance.get).catch(() => {});
      preload('/assistant/28', axiosInstance.get).catch(() => {});
      preload('/assistant/29', axiosInstance.get).catch(() => {});
      preload('/assistant/30', axiosInstance.get).catch(() => {});
      preload(['/assistant', 'system'], fetcher).catch(() => {});
    }
  }, [session]);
}

export default usePreload;
