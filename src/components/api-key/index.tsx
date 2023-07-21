import React from 'react';
import { useTranslation, Trans } from 'react-i18next';
import { Input, Toast } from '@douyinfe/semi-ui';
import { IconCopy } from '@douyinfe/semi-icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { formatDateTime } from '@/utils';
import type { ApiKeyProps } from './ApiKey';

const ApiKey: React.FC<ApiKeyProps> = function ApiKey(props) {
  const { apiKey } = props;

  const [t, i18] = useTranslation(['setting', 'translation']);

  const handleCopy = () => {
    Toast.success(t('translation:copy.success'));
  };

  return (
    <div className="w-full flex items-center justify-between space-x-2 p-4 bg-white dark:bg-[#282c35] rounded-lg mt-2">
      <div className="grid flex-1 gap-2">
        {apiKey.description ? <div className="font-semibold">{apiKey.description}</div> : null}
        <Input
          className="truncate border-none px-0 pr-6"
          value={apiKey.api_key}
          readonly
          mode="password"
          suffix={(
            <CopyToClipboard text={apiKey.api_key} onCopy={handleCopy}>
              <IconCopy className="cursor-pointer hover:text-[var(--semi-color-primary-hover)] mx-1" />
            </CopyToClipboard>
          )}
        />
        <div className="text-sm text-slate-600 dark:text-slate-300">
          <Trans t={t} i18nKey="create at" values={{ time: formatDateTime(apiKey.created_at, i18.language) }} />
        </div>
      </div>
    </div>
  );
};

export default ApiKey;
