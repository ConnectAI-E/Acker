import useSWR from 'swr';
import axios, { AxiosResponse } from 'axios';
import { v4 as uuid } from 'uuid';
import Papa from 'papaparse';
import json from '@/assets/json/promptRecommend.json';
import type { PromptItem } from '../InspirationProps';

function formatJson(data: unknown): PromptItem[] {
  if (Array.isArray(data)) {
    return data.map((d) => ({ key: uuid(), label: (d.act || d.key), value: (d.prompt || d.value) }));
  }
  if (typeof data === 'string') {
    // 尝试解析一下是不是csv
    const jsonData = Papa.parse(data, { header: true }).data;
    if (Array.isArray(jsonData)) {
      return jsonData.map((d: any) => ({ key: uuid(), label: (d.act || d.key), value: (d.prompt || d.value) }));
    }
  }
  return [];
}

function useZhPrompt(fetchFlag?: boolean) {
  const zhUrl = fetchFlag ? json[0].downloadUrl : null;

  const { data, ...rest } = useSWR<AxiosResponse>(zhUrl, axios.get, { revalidateIfStale: false });

  return { data: formatJson(data?.data), ...rest };
}

function useEnPrompt(fetchFlag?: boolean) {
  const enUrl = fetchFlag ? json[1].downloadUrl : null;

  const { data, ...rest } = useSWR<AxiosResponse>(enUrl, axios.get, { revalidateIfStale: false });

  return { data: formatJson(data?.data), ...rest };
}

export { useEnPrompt, useZhPrompt };
