import React from 'react';
import { Skeleton } from '@douyinfe/semi-ui';

const HotTopicSkeleton: React.FC = function HotTopicSkeleton() {
  return (
    <div className="w-full px-4 mt-4 flex flex-col items-center">
      {[1, 2, 3, 4, 5].map((key) => (
        <Skeleton.Title key={key} className="w-1/3 h-[54px] max-md:w-full my-2" />
      ))}
    </div>
  );
};

export default HotTopicSkeleton;
