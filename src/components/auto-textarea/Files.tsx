import React, { useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames';
import debounce from 'lodash/debounce';
import {
  IconClear, IconFile, IconImage, IconTickCircle, IconUpload 
} from '@douyinfe/semi-icons';
import { Progress } from '@douyinfe/semi-ui';
import { PhotoSlider } from 'react-photo-view';
import useSupabase from '@/hooks/useSupabase';
import type { FilesProps, FileItemProps, UploadedFile } from './FilesProps';

const reader = new FileReader();

const FileItem: React.FC<FileItemProps> = function FileItem(props) {
  const {
    className, file, uploadFile, onUploaded, onDeleted, onPreview
  } = props;

  const { name, originFile, url } = file;

  const [progress, setProgress] = useState<number>(0);
  const [error, setError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController>();

  reader.onloadend = (event) => {
    onPreview(event.target?.result || '');
  };

  const upload = useMemo(() => debounce((forceUpdate: boolean = false) => {
    const { name: curName, originFile: curOriginFile, uploaded, id } = file;
    if ((!uploaded && curOriginFile && !loading) || forceUpdate) {
      setLoading(true);
      setError(false);
      abortControllerRef.current = new AbortController();
      const extension = `.${(curName).split('.').slice(-1)[0]}`;
      uploadFile(
        curOriginFile,
        `${id}${extension}`,
        (_progress: number) => setProgress(_progress),
        abortControllerRef.current,
      ).then((res) => {
        const curFile = {
          id, name: curName, url: res, uploaded: true, originFile: curOriginFile
        };
        onUploaded(curFile);
      }).catch(() => {
        setError(true);
        onUploaded({ id, name: curName, uploaded: true, originFile: curOriginFile });
      }).finally(() => {
        setLoading(false);
        abortControllerRef.current = undefined;
      });
    }
  }, 1000, { leading: true, trailing: false }), [file, loading, uploadFile, onUploaded]);

  useEffect(upload, [upload]);

  const handleAbortOrDelete = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    if (loading && typeof abortControllerRef.current?.abort === 'function') {
      abortControllerRef.current.abort();
    } else {
      onDeleted(file);
    }
  };

  const handleDelete = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    onDeleted(file);
  };

  const handleRetry = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
    setProgress(0);
    upload(true);
  };

  const handlePreview = () => {
    if (originFile instanceof File && originFile?.type?.startsWith('image/')) {
      reader.readAsDataURL(originFile);
    }
  };

  return (
    <div
      onClick={handlePreview}
      className={classNames(
        'w-[calc(50%-1rem)] relative max-md:w-full flex items-center cursor-pointer p-2 m-1 rounded-sm',
        'hover:bg-gray-100 dark:hover:bg-zinc-500',
        className
      )}
    >
      <div className="flex-shrink-0 flex items-center mr-1">
        {originFile.type.startsWith('image/') ? (
          <IconImage className="text-green-400" size="large" />
        ) : (
          <IconFile className="text-blue-400" size="large" />
        )}
      </div>
      <div className={classNames('w-0 flex-grow leading-[20px] text-overflow-l1', { 'text-red-500': error })}>
        {name}
      </div>
      {!error && (
        <div className="flex-shrink-0 flex items-end ml-1" onClick={handleAbortOrDelete}>
          <IconClear className="text-red-400" />
        </div>
      )}
      {url && !error && (
        <div className="flex-shrink-0 flex items-end ml-2 mr-0">
          <IconTickCircle className="text-green-400" />
        </div>
      )}
      {error && (
        <>
          <div className="flex-shrink-0 flex items-end ml-1" onClick={handleDelete}>
            <IconClear className="text-red-500" />
          </div>
          <div className="flex-shrink-0 flex items-end ml-2 mr-0" onClick={handleRetry}>
            <IconUpload className="text-red-500" />
          </div>
        </>
      )}
      {loading && <Progress className="w-full absolute left-0 -bottom-[4px] translate-y-full" percent={progress} />}
    </div>
  );
};

const Files: React.FC<FilesProps> = function Files(props) {
  const { data, wrapperClassName, className, onChange } = props;

  const { standardUpload } = useSupabase();

  const [previewSrc, setPreviewSrc] = useState<string>('');

  const handleUploaded = (file: UploadedFile) => {
    const { id } = file;
    onChange((pre) => [...(pre || [])].map((_file) => {
      if (_file.id === id) {
        Object.assign(_file, { ...file });
      }
      return _file;
    }));
  };

  const handleDelete = (file: UploadedFile) => {
    const { id } = file;
    onChange((pre) => [...(pre || [])].filter((_file) => _file.id !== id));
  };

  return data?.length > 0 ? (
    <div className={classNames('w-full flex flex-wrap p-2 max-h-[300px] overflow-auto', wrapperClassName)}>
      {data.map((file) => (
        <FileItem
          key={file.id}
          className={className}
          file={file}
          uploadFile={standardUpload}
          onUploaded={handleUploaded}
          onDeleted={handleDelete}
          onPreview={(url) => setPreviewSrc(url as string)}
        />
      ))}
      <PhotoSlider
        images={[{ key: 0, src: previewSrc }]}
        visible={!!previewSrc}
        onClose={() => setPreviewSrc('')}
        maskOpacity={0.7}
      />
    </div>
  ) : null;
};

export default React.memo(Files);
