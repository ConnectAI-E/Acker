import useSWR from 'swr';
import { createFetcher } from '@/utils/fetch';

function useWelcomeData() {
  const { data, isLoading, error } = useSWR('/welcome', createFetcher({ locale: 'en_GB' }));

  const topList = data?.data?.filter((item: any) => item?.isTopRated)?.sort((a: any, b: any) => {
    if (Number.isInteger(a.heats) && Number.isInteger(b.heats)) {
      return b.heats - a.heats;
    }
    return 0;
  });

  return { 
    data: topList || [], 
    isLoading, 
    error 
  };
}

function useOtherFetcher() {
  // TODO  ...
}

export { useWelcomeData, useOtherFetcher };
