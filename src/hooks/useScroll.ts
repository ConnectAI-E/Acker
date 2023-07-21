import { useEffect, useRef, useState } from 'react';
import useCallbackRef from './useCallbackRef';

function useScroll(callback?: () => Promise<void> | void): [React.MutableRefObject<any>, boolean] {
  const ref = useRef<HTMLElement>();

  const callbackRef = useCallbackRef(callback);

  const [isBottom, setIsBottom] = useState<boolean>(false);

  useEffect(() => {
    const content = ref.current as HTMLElement;

    const handleScroll = async () => {
      const { scrollTop, scrollHeight, clientHeight } = content;
      // chrome浏览器的误差，往下取整了
      if ((scrollTop + clientHeight + 2 >= scrollHeight)) {
        setIsBottom(true);
        await callbackRef();
      } else {
        setIsBottom(false);
      }
    };

    content?.addEventListener('scroll', handleScroll);

    return () => {
      content?.removeEventListener('scroll', handleScroll);
    };
  }, [callbackRef]);

  return [ref, isBottom];
}

export default useScroll;
