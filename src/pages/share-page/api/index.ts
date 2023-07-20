import useSWR from 'swr';
import axios, { AxiosResponse } from 'axios';
import type { ChatList } from '@/global';

const baseUrl = 'https://sp-key.aios.chat/storage/v1/object/public/share/private';

function useShareChatData(userid?: string, shareid?: string) {
  const url = userid && shareid ? `${baseUrl}/${userid}/${shareid}.json` : '';

  const { data, isLoading, error } = useSWR<AxiosResponse<ChatList>>(url, axios.get);

  return { data: data?.data || {}, isLoading, error };
}

export default useShareChatData;
