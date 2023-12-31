import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Spin, Tabs } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import { useEnPrompt, useZhPrompt } from './api';
import PromptList from '@/components/auto-textarea/PromptList';
import useLocalStorageState from '@/hooks/useLocalStorageState';
import useIsMobile from '@/hooks/useIsMobile';
import type { InspirationProps, PromptItem } from './InspirationProps';

const Inspiration: React.FC<InspirationProps> = function Inspiration(props) {
  const { onClickItem } = props;

  const { i18n } = useTranslation();

  const [zhPrompt] = useLocalStorageState<PromptItem[]>('zhPrompt');
  const [enPrompt] = useLocalStorageState<PromptItem[]>('enPrompt');

  const { data: onlineZhPrompt, isLoading: onlineZhLoading, error: zhError } = useZhPrompt(!zhPrompt);

  const { data: onlineEnPrompt, isLoading: onlineEnLoading, error: enError } = useEnPrompt(!enPrompt);

  const [searchValue, setSearchValue] = useState('');

  const [activeTab, changeTabKey] = useState(['zh', 'en'].includes(i18n.language) ? i18n.language : 'en');

  const isMobile = useIsMobile();

  const zh = (zhPrompt || onlineZhPrompt).filter((item) => item?.label?.includes(searchValue));
  const en = (enPrompt || onlineEnPrompt).filter((item) => item?.label?.includes(searchValue));

  const data = [
    { name: 'en', data: en, loading: onlineEnLoading, error: zhError?.message },
    { name: 'zh', data: zh, loading: onlineZhLoading, error: enError?.message },
  ];

  useEffect(() => {
    const localZhPrompt = localStorage?.getItem('zhPrompt');
    if (Array.isArray(onlineZhPrompt) && onlineZhPrompt.length > 0 && !onlineZhLoading && !localZhPrompt) {
      localStorage.setItem('zhPrompt', JSON.stringify(onlineZhPrompt));
    }
  }, [onlineZhPrompt, onlineZhLoading]);

  useEffect(() => {
    const localEnPrompt = localStorage?.getItem('enPrompt');
    if (Array.isArray(onlineEnPrompt) && onlineEnPrompt.length > 0 && !onlineEnLoading && !localEnPrompt) {
      localStorage.setItem('enPrompt', JSON.stringify(onlineEnPrompt));
    }
  }, [onlineEnPrompt, onlineEnLoading]);

  const checkNextTab = useCallback(
    () => {
      if (activeTab === 'zh') {
        changeTabKey('en');
      } else {
        changeTabKey('zh');
      }
    },
    [activeTab],
  );

  return (
    <div className="w-[500px] h-[500px] max-w-[calc(100vw)]">
      <Tabs
        activeKey={activeTab}
        onChange={
          (key) => {
            changeTabKey(key);
          }
        }
        className="h-full flex flex-col"
        tabBarClassName="px-4 flex-shrink-0"
        contentStyle={{ height: 0, flexGrow: 1 }}
        tabBarExtraContent={(
          <Input
            autofocus={!isMobile} // 移动端不需要autofocus
            style={{ minWidth: '240px' }}
            prefix={<IconSearch />}
            value={searchValue}
            onChange={setSearchValue}
            showClear
          />
        )}
      >
        {data.map((d) => (
          <Tabs.TabPane key={d.name} itemKey={d.name} tab={d.name} className="h-full overflow-auto">
            {d.loading ? <Spin wrapperClassName="w-full h-[200px]" /> : (
              <PromptList
                onChangeNextTab={checkNextTab}
                ifActive={activeTab === d.name}
                data={d.data}
                onClickItem={onClickItem}
                errorMsg={d.error}
              />
            )}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default Inspiration;
