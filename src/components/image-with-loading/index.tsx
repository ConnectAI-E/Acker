import React, { useState } from 'react';
import { Skeleton } from '@douyinfe/semi-ui';
import type { ImageWithLoadingProps } from './ImageWithLoading';

const ImageWithLoading: React.FC<ImageWithLoadingProps> = function ImageWithLoading(props) {
  const {
    src = '',
    className = '',
    skeletonStyle = {}, 
    imageStyle = {}, 
  } = props;

  const [loading, setLoading] = useState<boolean>(true);

  return (
    <>
      <Skeleton loading={loading} style={skeletonStyle} className={className} placeholder={<Skeleton.Image />} />
      <img
        alt="404"
        src={src}
        style={loading ? {} : imageStyle}
        className={loading ? 'w-0 h-0 opacity-0 hidden' : className}
        onLoad={() => setLoading(false)}
        onError={() => setLoading(false)}
      />
    </>
  );
};

export default ImageWithLoading;
