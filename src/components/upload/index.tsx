import React, { useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Avatar, Progress, Upload as SemiUpload } from '@douyinfe/semi-ui';
import type { CustomError } from '@douyinfe/semi-ui/lib/es/upload';
import { IconCamera } from '@douyinfe/semi-icons';
import useSupabase from '@/hooks/useSupabase';
import type { UploadProps } from './Upload';

const reader = new FileReader();

const Upload: React.FC<UploadProps> = function Upload(props) {
  const {
    disabled = false, size = 'medium', defaultAvatarUrl = '', onError = () => {}, onSuccess = () => {} 
  } = props;

  const [avatarUrl, setAvatarUrl] = useState<string | ArrayBuffer>(defaultAvatarUrl);
  const [uploadLoading, setUploadLoading] = useState<boolean>(false);
  const [progress, setProgress] = useState<number>(0);
  const [imgLoading, setImgLoading] = useState<boolean>(false);

  const { standardUpload } = useSupabase();

  reader.onloadend = () => {
    const base64Data = reader.result;
    setAvatarUrl(base64Data || '');
  };

  const hoverMask = useMemo(() => (
    <div className="w-full h-full flex justify-center items-center bg-black opacity-50 text-white">
      <IconCamera />
    </div>
  ), []);

  const handleFileChange = async (files: File[]) => {
    if (uploadLoading || imgLoading) return;
    const [file] = files;
    setUploadLoading(true);
    setImgLoading(true);
    reader.readAsDataURL(file);
    const url = await standardUpload(file, uuid(), (_progress) => setProgress(_progress));
    setUploadLoading(false);
    setAvatarUrl(url);
    onSuccess(url);
  };

  const handleImageLoading = () => {
    setImgLoading(false);
  };

  const handleError = (err: CustomError, file: File) => {
    setAvatarUrl(defaultAvatarUrl);
    onError(err, file);
  };

  const loading = uploadLoading || imgLoading;

  return (
    <SemiUpload
      action=""
      className="relative"
      onFileChange={handleFileChange}
      beforeUpload={() => false}
      maxSize={6144}
      showUploadList={false}
      accept="image/*"
      disabled={disabled}
      onError={handleError}
    >
      <Avatar
        size={size}
        shape="square"
        hoverMask={hoverMask}
        src={avatarUrl as any}
        imgAttr={{ onLoad: handleImageLoading }}
      >
        {loading ? null : <IconCamera />}
      </Avatar>
      {loading && (
        <div className="w-[72px] h-[72px] absolute left-0 top-0 flex justify-center items-center bg-black/50">
          <Progress
            percent={progress}
            type="circle"
            size="small"
            format={(format) => format}
          />
        </div>
      )}
    </SemiUpload>
  );
};

export default Upload;
