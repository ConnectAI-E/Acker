import { useState } from 'react';
import useWindowResize from './useWindowResize';

function useResponsiveMobile(width: number = 768): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useWindowResize((_width: number) => setIsMobile(_width < width));

  return isMobile;
}

export default useResponsiveMobile;
