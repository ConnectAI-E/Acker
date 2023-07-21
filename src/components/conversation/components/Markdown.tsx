/* eslint-disable react/jsx-props-no-spreading */
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm'; // table
import remarkMath from 'remark-math'; // math
import rehypeKatex from 'rehype-katex'; // katex
import CopyToClipboard from 'react-copy-to-clipboard';
import { Space, Toast } from '@douyinfe/semi-ui';
import { IconCopy, IconEdit2Stroked, IconExternalOpenStroked } from '@douyinfe/semi-icons';
import type { CodeProps } from 'react-markdown/lib/ast-to-react';
import type { Conversation } from '@/global';
import CodeRender from './CodeRender';
import '../github.css';
import '../katex.min.css';

interface MarkdownProps {
  data: Conversation;
  onEdit: () => void;
  hiddenButtons: boolean;
}

const renderCode = (code: CodeProps) => <CodeRender {...code} />;

const Markdown: React.FC<MarkdownProps> = function Markdown(props) {
  const { data, onEdit, hiddenButtons } = props;

  const [t] = useTranslation();

  const { character, value, stop } = data;

  const handleShare = () => {
    Toast.info(t('feature upcoming'));
  };

  const renderMarkdown = useMemo(() => (character !== 'user' ? (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeKatex]}
      components={{ code: renderCode }}
    >
      {value}
    </ReactMarkdown>
  ) : value), [value, character]);

  return (
    <>
      {renderMarkdown}
      {character !== 'user' && stop && !hiddenButtons && (
        <Space className="w-full html2canvas-ignore" spacing={20}>
          <CopyToClipboard text={value} onCopy={() => Toast.success(t('copy.success'))}>
            <IconCopy className="cursor-pointer" onClick={(e) => e.stopPropagation()} />
          </CopyToClipboard>
          <IconEdit2Stroked
            className="cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
          />
          <IconExternalOpenStroked className="cursor-pointer" onClick={handleShare} />
        </Space>
      )}
    </>
  );
};

export default Markdown;
