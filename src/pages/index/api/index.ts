import { useCallback, useEffect, useState } from 'react';
import useSWR from 'swr';
import { AxiosResponse } from 'axios';
import { randomArrayFormatter } from '@/utils/formatter';
import { axiosInstance } from '@/api/axios';

const api = '/hot';
const defaultLength = 8;

const languageMap: Record<string, string> = { zh: 'zh_CN', 'zh-CN': 'zh_CN' }; // jp 暂时没有，后续加上

function useRefresh(isLoading: boolean, topicLength: number, data?: any[]): [any[], () => void] {
  const [list, setList] = useState<any[]>([]);

  const refresh = useCallback(() => {
    if (Array.isArray(data) && !isLoading) {
      const curData = randomArrayFormatter<any>(data, topicLength);
      setList(curData);
    }
  }, [data, isLoading, topicLength]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return [list, refresh];
}

function useHotTopics(topicLength: number = defaultLength, language: string = 'en') {
  const locale = languageMap[language] || 'en_GB';

  const fetcher = async ([url, _locale]: string[]) => axiosInstance.get(url, { params: { locale: _locale, count: 20 } });

  const { data, isLoading } = useSWR<AxiosResponse>([api, locale], fetcher, { revalidateIfStale: false });

  const [list, refresh] = useRefresh(isLoading, topicLength, data?.data?.data);

  return { data: list, isLoading, refresh };
}

export default useHotTopics;
