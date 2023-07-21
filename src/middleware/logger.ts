import type { SWRHook, Key, BareFetcher, SWRConfiguration } from 'swr';

function logger(useSWRNext: SWRHook) {
  return (key: Key, fetcher: BareFetcher<any> | null, config: SWRConfiguration) => {
    // 将日志记录器添加到原始 fetcher。
    const extendedFetcher = (...args: any[]) => {
      // TODO sentry with key
      // console.log('SWR Request:', key);
      if (typeof fetcher === 'function') {
        return fetcher(...args);
      }
      return () => {};
    };
 
    // 使用新的 fetcher 执行 hook。
    return useSWRNext(key, extendedFetcher, config);
  };
}

export default logger;
