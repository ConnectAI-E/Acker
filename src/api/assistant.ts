import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import type { AxiosResponse } from 'axios';
import type { Assistant } from '@/global';
import { mutationFetcher, axiosInstance } from './axios';

const AssistantIdMap: Record<string, number> = {
  'gpt-3.5-turbo': 29,
  'gpt-3.5-turbo-16k': 28,
  'gpt-4': 30,
  midjourney: 27,
};

/**
 * 上传单个assistant
 */
function useUploadAssistant() {
  return useSWRMutation('/assistant', mutationFetcher);
}

/**
 * 用户自己创建的assistant列表
 * TODO: 分页？
 */
function usePersonCreatedAssistant() {
  const { data, ...rest } = useSWR<AxiosResponse>('/account/createdList', axiosInstance.get, { revalidateIfStale: false });

  const assistants: Assistant[] = data ? (data.data?.data || []) : [];

  return { data: assistants, ...rest };
}

/**
 * 用户follow的assistant列表
 */
function usePersonFollowAssistant() {
  const { data, ...rest } = useSWR<AxiosResponse>('/account/followList', axiosInstance.get, { revalidateIfStale: false });

  const assistants: Assistant[] = data ? (data.data?.data || []) : [];

  return { data: assistants, ...rest };
}

/**
 * 根据id查询assistant, 会优先查询公开的assistant，再查询自己的assistant
 */
function useAssistantById(id?: string, cacheAssistant?: Partial<Assistant> | null) {
  const curId = id ? (AssistantIdMap[id] || id) : '';

  const url = curId ? `/assistant/${curId}` : '';

  const { data, ...rest } = useSWR<AxiosResponse>(url, axiosInstance.get, { revalidateIfStale: false });

  const assistant: Assistant = data ? data.data?.data : null;

  return { data: assistant || cacheAssistant, ...rest };
}

/**
 * 根据id更新assistant
 */
function useUpdateAssistantById() {
  const fetcher = async (url: string, { arg }: { arg: Record<string, any> }) => {
    const { id, ...rest } = arg;
    return axiosInstance.post(`${url}/${id as string}`, rest);
  };

  return useSWRMutation('/assistant/update', fetcher);
}

/**
 * 查询所有公开的可用的assistant
 */
function useAssistant(source?: string) {
  const fetcher = async ([_url, _source]: string[]) => axiosInstance.get(_url, { params: { source: _source } });

  const { data, ...rest } = useSWR(['/assistant', source], fetcher, { revalidateIfStale: false });

  return { data: (data?.data.data || []) as Assistant[], ...rest };
}

/**
 * 删除单个assistant
 */
function useDeleteAssistant() {
  const fetcher = async (url: string, { arg }: { arg: Record<string, any> }) => {
    const { assistantId } = arg;
    return axiosInstance({
      url: `${url}/${assistantId as string}`,
      method: 'delete',
    });
  };

  return useSWRMutation('/assistant', fetcher);
}

export {
  useUploadAssistant,
  usePersonCreatedAssistant,
  usePersonFollowAssistant,
  useDeleteAssistant,
  useAssistantById,
  useAssistant,
  useUpdateAssistantById,
};
