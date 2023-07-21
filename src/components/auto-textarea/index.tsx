import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Dropdown, Toast, Upload } from '@douyinfe/semi-ui';
import { IconBolt, IconPlusCircle, IconSend } from '@douyinfe/semi-icons';
import { v4 as uuid } from 'uuid';
import classNames from 'classnames';
import Loading from '@/components/loading';
import useIsMobile from '@/hooks/useIsMobile';
import Files from './Files';
import Inspiration from './Inspiration';
import type { AutoTextAreaProps } from './AutoTextArea';
import type { UploadedFile } from './FilesProps';
import styles from './AutoTextArea.module.less';

const placeholder = import.meta.env.VITE_DEFAULT_PLACEHOLDER;
const autoTextAreaCls = 'w-full rounded-md border bg-white border-black/10 shadow-[0_0_10px_rgba(0,0,0,0.10)]';
const darkAutoTextAreaCls = 'dark:border-gray-900/50 dark:text-white dark:bg-gray-700 dark:shadow-[0_0_15px_rgba(0,0,0,0.10)]';

const AutoTextArea: React.FC<AutoTextAreaProps> = function AutoTextArea(props) {
  const {
    loading, hiddenUpload, hiddenInspiration, uploadProps, onFetchAnswer 
  } = props;

  const [t] = useTranslation();

  const [value, setValue] = useState<string>('');
  const [height, setHeight] = useState<number>(21);
  const [showInspire, setShowInspire] = useState<boolean>(false);
  const [isComposition, setIsComposition] = useState<boolean>(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const isMobile = useIsMobile();

  const { accept, multiple = true } = uploadProps || {};

  useEffect(() => {
    if (textareaRef.current) {
      const h = value ? textareaRef.current.scrollHeight : 21;
      setHeight(h);
    }
  }, [value]);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const pasteFiles = event.clipboardData?.files || [];
      const fileList = Array.from(pasteFiles);
      const filterSizeFiles = fileList.filter((file) => {
        if (file.size > 52428800) {
          Toast.warning(t('file limit error', { name: file.name }));
        }
        return file.size <= 52428800;
      }).map((file) => ({ id: uuid(), name: file.name, originFile: file }));
      setFiles((pre) => pre.concat(filterSizeFiles));
    };

    const textareaElement = textareaRef.current;
    textareaElement?.addEventListener('paste', handlePaste);
    return () => {
      textareaElement?.removeEventListener('paste', handlePaste);
    };
  }, [t]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { value: v } = e.target;
    setValue(v);
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (loading || isComposition) return;
      const textArea = e.target as HTMLTextAreaElement;
      const v = textArea?.value?.trim();
      if (v && isMobile) textArea?.blur();
      if (v) {
        onFetchAnswer({ text: v, files: files.filter((file) => file.uploaded && file.url) });
        setValue('');
        setFiles([]);
      }
    }
  }, [files, isComposition, isMobile, loading, onFetchAnswer]);

  const handleButtonClick = useCallback(() => {
    if (loading || !value) return;
    onFetchAnswer({ text: value, files: files.filter((file) => file.uploaded && file.url) });
    setValue('');
    setFiles([]);
  }, [loading, onFetchAnswer, value, files]);

  const handleOpenInspiration = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    setShowInspire((pre) => !pre);
  };

  const handleClickInspiration = (v: string) => {
    setValue((pre) => `${pre}${v}`);
    setShowInspire(false);
  };

  const handleFileChange = (_files: File[]) => {
    if (_files && _files.length > 0) {
      const filterSizeFiles = _files.filter((file) => {
        if (file.size > 52428800) {
          Toast.warning(t('file limit error', { name: file.name }));
        }
        return file.size <= 52428800;
      });
      const formatFiles = filterSizeFiles.map((file) => ({ id: uuid(), name: file.name, originFile: file }));
      setFiles((pre) => pre.concat(formatFiles));
    }
  };

  const uploadLoading = files.some((file) => !file.uploaded);
  const hiddenUploadBtn = hiddenUpload || (!multiple && files.length === 1);

  return (
    <div className={classNames(autoTextAreaCls, darkAutoTextAreaCls)}>
      <Files data={files} onChange={setFiles} />
      <Dropdown
        trigger="custom"
        visible={showInspire}
        onClickOutSide={() => setShowInspire(false)}
        onEscKeyDown={() => setShowInspire(false)}
        spacing={12}
        autoAdjustOverflow
        stopPropagation
        position="topRight"
        content={<Inspiration onClickItem={handleClickInspiration} />}
      >
        <div
          onClick={() => setShowInspire(false)}
          className={classNames('w-full flex items-end py-2 md:py-3 pl-2 relative', { '!pl-[32px]': !hiddenUploadBtn })}
        >
          {!hiddenUploadBtn && (
            <Upload
              action=""
              accept={accept}
              beforeUpload={() => false}
              multiple={multiple}
              showUploadList={false}
              onFileChange={handleFileChange}
            >
              <Button className="absolute bottom-3 left-2 !h-[21px] max-md:bottom-2" type="tertiary" icon={<IconPlusCircle />} />
            </Upload>
          )}
          <textarea
            ref={textareaRef}
            className={classNames('w-full scrollbar-hide m-0 pr-4 pl-2 text-black dark:text-white', styles.textarea)}
            style={{ maxHeight: '200px', height }}
            value={value}
            placeholder={placeholder || t('chat input placeholder')}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onCompositionStart={() => setIsComposition(true)}
            onCompositionEnd={() => {
              // 处理safari浏览器的执行顺序问题
              setTimeout(() => {
                setIsComposition(false);
              });
            }}
          />
          {(loading || uploadLoading) ? <Loading /> : (
            <div className="flex mx-2 flex-shrink-0">
              {!hiddenInspiration && <Button className="!h-[21px]" type="tertiary" icon={<IconBolt />} onClick={handleOpenInspiration} />}
              <Button className="!h-[21px]" type="tertiary" icon={<IconSend />} onClick={handleButtonClick} />
            </div>
          )}
        </div>
      </Dropdown>
    </div>
  );
};

export default AutoTextArea;
