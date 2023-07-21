import { useState } from 'react';
import useMemoizedFn from './useMemoizedFn';

type IFuncUpdater<T> = (previousState?: T) => T; 

interface Options<T> {
  serializer?: (value: T) => string;
  deserializer?: (value: string) => T;
  defaultValue?: T | IFuncUpdater<T>;
  onError?: (error: unknown) => void;
}

function useLocalStorageState<T>(key: string, options: Options<T> = {}) {
  const { onError = () => {}, defaultValue } = options;

  const serializer = (value: T) => {
    if (options?.serializer) {
      return options?.serializer(value);
    }
    return JSON.stringify(value);
  };

  const deserializer = (value: string): T => {
    if (options?.deserializer) {
      return options?.deserializer(value);
    }
    return JSON.parse(value);
  };

  const [state, setState] = useState(() => {
    try {
      const raw = localStorage?.getItem(key);
      if (raw) {
        return deserializer(raw);
      }
    } catch (e) {
      onError(e);
    }
    return typeof defaultValue === 'function' ? (defaultValue as IFuncUpdater<T>)() : defaultValue;
  });

  const updateValue = useMemoizedFn((value: T | IFuncUpdater<T>) => {
    const currentValue = typeof value === 'function' ? (value as IFuncUpdater<T>)(state) : value;
    setState(currentValue);

    if (typeof currentValue === 'undefined') {
      localStorage?.removeItem(key);
    } else {
      try {
        localStorage?.setItem(key, serializer(currentValue));
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e);
      }
    }
  });

  return [state, updateValue] as const;
}

export default useLocalStorageState;
