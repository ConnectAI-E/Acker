import { useTranslation } from 'react-i18next';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Prism } from 'react-syntax-highlighter';
import { Toast } from '@douyinfe/semi-ui';
import { IconCopy } from '@douyinfe/semi-icons';
import type { CodeProps } from 'react-markdown/lib/ast-to-react';

const CodeRender = function CodeRender(props: CodeProps) {
  const { children, className, inline } = props;

  const [t] = useTranslation();

  const code = String(children);
  const match = /language-(\w+)/.exec(className || '');
  const language = match?.[1] || 'plainxt';

  return !inline ? (
    <div className="w-full pt-8 relative text-white">
      <div className="absolute top-0 left-0 px-3 bg-[#343541] w-full h-8 flex items-center justify-between">
        <span className="flex-shrink-0">{language}</span>
        <CopyToClipboard text={code} onCopy={() => Toast.success(t('copy.success'))}>
          <button type="button" className="text-right cursor-pointer">
            <IconCopy className="align-middle mr-2" />
            Copy code
          </button>
        </CopyToClipboard>
      </div>
      <Prism
        language={language}
        PreTag="div"
        style={materialDark}
        customStyle={{
          width: '100%', overflow: 'auto', padding: '16px 12px', margin: '0', background: '#242c37'
        }}
        codeTagProps={{ style: { margin: 0 } }}
      >
        {code}
      </Prism>
    </div>
  ) : (
    <code className={className}>{children}</code>
  );
};

export default CodeRender;
