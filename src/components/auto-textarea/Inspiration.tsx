import React, { useEffect, useState } from 'react';
import { Input, List, Spin, Tabs } from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import { useEnPrompt, useZhPrompt } from './api';
import useLocalStorageState from '@/hooks/useLocalStorageState';
import type { InspirationProps, PromptItem } from './InspirationProps';

const Inspiration: React.FC<InspirationProps> = function Inspiration(props) {
  const { onClickItem } = props;

  const [zhPrompt] = useLocalStorageState<PromptItem[]>('zhPrompt');
  const [enPrompt] = useLocalStorageState<PromptItem[]>('enPrompt');

  const { data: onlineZhPrompt, isLoading: onlineZhLoading, error: zhError } = useZhPrompt(!zhPrompt);

  const { data: onlineEnPrompt, isLoading: onlineEnLoading, error: enError } = useEnPrompt(!enPrompt);

  const [searchValue, setSearchValue] = useState('');

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

  return (
    <div className="w-[500px] h-[500px] max-w-[calc(100vw)]">
      <Tabs
        className="h-full flex flex-col"
        tabBarClassName="px-4 flex-shrink-0"
        contentStyle={{ height: 0, flexGrow: 1 }}
        tabBarExtraContent={(<Input prefix={<IconSearch />} value={searchValue} onChange={setSearchValue} showClear />)}
      >
        {data.map((d) => (
          <Tabs.TabPane key={d.name} itemKey={d.name} tab={d.name} className="h-full overflow-auto">
            {d.loading ? <Spin wrapperClassName="w-full h-[200px]" /> : (
              <List
                dataSource={d.data}
                emptyContent={<div className="h-full">{d.error || 'No data'}</div>}
                renderItem={(item) => (
                  <List.Item
                    className="cursor-pointer hover:bg-[var(--semi-color-fill-0)]"
                    onClick={() => onClickItem(item?.value?.trim())}
                  >
                    <div className="w-full text-overflow-l2">{item?.label || item?.value || ''}</div>
                  </List.Item>
                )}
              />
            )}
          </Tabs.TabPane>
        ))}
      </Tabs>
    </div>
  );
};

export default Inspiration;
