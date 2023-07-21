/* eslint-disable @typescript-eslint/naming-convention */
import axios from 'axios';
import useSWRMutation from 'swr/mutation';

function useMidjourney() {
  const fetcher = async (_: string, { arg }: { arg: Record<string, any> }) => {
    // message_id img
    const {
      host,
      key,
      prompt,
      request_type = 'imagine',
      channel = 'MJ',
      imgs = [],
      ...rest
    } = arg;
    const imgStringify = Array.isArray(imgs) ? imgs.map((img: string) => `${img}?x-oss-process=image/resize,w_750/quality,q_80`).join(' ') : '';
    const formatPrompt = `${prompt as string} --v 5.1 --q 1 --s 100`;
    const data = { channel, prompt: `${imgStringify} ${formatPrompt}`, request_type, ...rest };
    return axios({
      url: host,
      method: 'post',
      params: { key },
      data,
    });
  };

  const { data, ...rest } = useSWRMutation('/midjourney', fetcher);

  return { data: data?.data, ...rest };
}

function usePollingMidjourney() {
  const fetcher = async (_: string, { arg }: { arg: Record<string, any> }) => {
    const { key, host, id } = arg;
    return axios({
      url: `${host as string}/${id as string}`,
      method: 'get',
      params: { key }
    });
  };

  const { data, ...rest } = useSWRMutation('/polling', fetcher);

  return { data: data?.data, ...rest };
}

export { useMidjourney, usePollingMidjourney };
