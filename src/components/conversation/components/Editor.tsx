import React, { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Button, ButtonGroup } from '@douyinfe/semi-ui';
import SimpleMdeReact from 'react-simplemde-editor';
import type { Options } from 'easymde';
import useResponsiveMobile from '@/hooks/useResponsiveMobile';
import styles from '../Conversation.module.less';
import 'easymde/dist/easymde.min.css';

interface EditorProps {
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

const mdeOptions: Options = { hideIcons: ['side-by-side', 'fullscreen', 'guide'], autofocus: true };

const MyEditor: React.FC<EditorProps> = function MyEditor(props) {
  const { value, onSave, onCancel } = props;

  const [t] = useTranslation();

  const [markdownValue, setMarkdownValue] = useState(value);
  
  const isMobile = useResponsiveMobile(1000);

  useEffect(() => {
    document.addEventListener('click', onCancel);

    return () => {
      document.removeEventListener('click', onCancel);
    };
  }, [onCancel]);

  useEffect(() => {
    const closeEditorWithEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keyup', closeEditorWithEsc);

    return () => {
      document.removeEventListener('keyup', closeEditorWithEsc);
    };
  }, [onCancel]);

  const onChange = useCallback((_value: string) => {
    setMarkdownValue(_value);
  }, []);

  const handleReset = () => {
    setMarkdownValue(value);
  };

  return (
    <div className="w-full relative" onClick={(e) => e.stopPropagation()}>
      <SimpleMdeReact
        className={classNames('w-full', styles.simpleMdeReact)}
        options={mdeOptions}
        value={markdownValue}
        onChange={onChange}
      />
      <ButtonGroup className={classNames('absolute right-0 -bottom-[4px] z-10', { 'w-full !static justify-end': isMobile })}>
        <Button
          className={classNames('w-[90px]', { '!w-0 flex-1': isMobile })}
          theme="solid"
          onClick={() => onSave(markdownValue)}
        >
          {t('Save')}
        </Button>
        <Button
          className={classNames('w-[90px] !bg-[var(--semi-color-secondary)]', { '!w-0 flex-1': isMobile })}
          type="secondary"
          theme="solid"
          onClick={handleReset}
        >
          {t('Reset')}
        </Button>
        <Button
          className={classNames('w-[90px] !bg-[var(--semi-color-tertiary)]', { '!w-0 flex-1': isMobile })}
          type="tertiary"
          theme="solid"
          onClick={onCancel}
        >
          {t('Cancel')}
        </Button>
      </ButtonGroup>
    </div>
  );
};

export default MyEditor;
