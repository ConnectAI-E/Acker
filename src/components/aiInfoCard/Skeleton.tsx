import React from 'react';
import { Skeleton } from '@douyinfe/semi-ui';

export const MdSkeleton: React.FC = function MdSkeleton() {
  return (
    <>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((key) => (
        <div key={key} className="h-[148px] md:w-1/2 lg:w-1/3 xl:w-1/4 2xl:w-1/5 min-[2160px]:w-1/6 min-[2560px]:w-[12.5%] px-2 mb-4">
          <Skeleton.Title className="h-full py-4 rounded-xl" />
        </div>
      ))}
    </>
  );
};

export const SmSkeleton: React.FC = function SmSkeleton() {
  return (
    <Skeleton.Title className="!w-[calc(100%-1rem)] h-[148px] flex-shrink-0 mx-2 mb-2 px-2 py-4 rounded-xl" />
  );
};
