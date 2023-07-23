import React, { useCallback, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { Button, ButtonGroup } from '@douyinfe/semi-ui';
import SimpleMdeReact from 'react-simplemde-editor';
import type { Options } from 'easymde';
import useResponsiveMobile from '@/hooks/useResponsiveMobile';
import styles from '../Conversation.module.less';
import 'easymde/dist/easymde.min.css';
import '../editor.css';

interface EditorProps {
  value: string;
  onSave: (value: string) => void;
  onCancel: () => void;
}

const mdeOptions: Options = { hideIcons: ['guide'], autofocus: true };

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

  const onChange = useCallback((_value: string) => {
    setMarkdownValue(_value);
  }, []);

  const handleReset = () => {
    setMarkdownValue(value);
  };

  const handleMdeKeyDown = useCallback((event: React.KeyboardEvent<HTMLDivElement>) => {
    if ((event.metaKey || event.ctrlKey) && event.key?.toLocaleLowerCase() === 's') {
      event.preventDefault();
      onSave(markdownValue);
    }
    if (event.key === 'Escape') {
      onCancel();
    }
    if ((event.metaKey || event.ctrlKey) && event.key.toLocaleLowerCase() === 'r') {
      event.preventDefault();
      setMarkdownValue(value);
    }
  }, [markdownValue, onCancel, onSave, value]);

  return (
    <div className="w-full relative" onClick={(e) => e.stopPropagation()}>
      <SimpleMdeReact
        className={classNames('w-full', styles.simpleMdeReact)}
        options={mdeOptions}
        value={markdownValue}
        onChange={onChange}
        onKeyDown={handleMdeKeyDown}
      />
      <div className={classNames('absolute right-0 -bottom-[20px] z-10 ', { 'w-full !static justify-end  pt-2': isMobile })}>
        <button
          onClick={() => onSave(markdownValue)}
          type="button"
          className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl  focus:outline-none   font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-4 mb-2"
        >
          {t('Save')}
        </button>

        <button
          onClick={onCancel}
          type="button"
          className="py-2.5 px-5 mr-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700"
        >
          {t('Cancel')}
        </button>

      </div>
    </div>
  );
};

export default MyEditor;
