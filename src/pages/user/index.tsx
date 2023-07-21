import { useState, useRef } from 'react';
import { useSWRConfig } from 'swr';
import { useTranslation } from 'react-i18next';
import {
  Button, Input, Empty, SideSheet, Toast, List, Modal, Skeleton, Typography, Spin
} from '@douyinfe/semi-ui';
import { IconSearch } from '@douyinfe/semi-icons';
import type { Assistant, ChatList } from '@/global';
import useChatList from '@/hooks/useChatList';
import useSupabase from '@/hooks/useSupabase';
import ResponsiveLayout from '@/global/responsive-layout';
import AiCard from '@/components/assistant-card';
import {
  useAssistant,
  useDeleteAssistant,
  usePersonCreatedAssistant,
  useUpdateAssistantById,
  useUploadAssistant,
} from '@/api/assistant';
import AiEdit from './components/ai-edit';
import AiPick from './components/ai-pick';

function User() {
  const [t] = useTranslation();

  const [curAssistant, setCurAssistant] = useState<Assistant>();
  const [model, setModel] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [visible, setVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const aiPickRef = useRef<any>();

  const { handleNewChat, setChatList } = useChatList();

  const { session } = useSupabase();

  const { mutate: mutateGlobal } = useSWRConfig();

  const { data, isLoading, mutate } = usePersonCreatedAssistant();

  const { data: presetAI, isLoading: presetLoading } = useAssistant('system');

  const { trigger: deleteAssistant } = useDeleteAssistant();

  const { trigger: uploadAssistant } = useUploadAssistant();

  const { trigger: updateAssistant } = useUpdateAssistantById();

  const afterUpdate = (id: string) => {
    setLoading(true);
    mutate().catch(() => {}).finally(() => setLoading(false));
    mutateGlobal(`/assistant/${id}`, undefined, { revalidate: true }).catch(() => {});
    setVisible(false);
  };

  const handleModelClick = (_model: string) => {
    setCurAssistant(undefined);
    setVisible(true);
    setModel(_model);
    aiPickRef.current?.destroy();
  };

  const handleCreate = () => {
    aiPickRef.current = Modal.info({
      header: null,
      icon: null,
      footer: null,
      style: { maxWidth: '100%' },
      content: <AiPick onClick={handleModelClick} />
    });
  };

  const handleConfirm = async (assistant: Assistant, changeFlag?: boolean) => {
    const author = session?.user.user_metadata.name || session?.user.user_metadata.user_name || session?.user.email;
    if (!changeFlag) {
      // 创建
      const currentAssistant = { ...assistant, author, isPublic: false, userId: session?.user.id };
      await uploadAssistant(currentAssistant).then((res) => {
        if (res?.data.message === 'OK') {
          afterUpdate(assistant.id);
          Toast.success(t('creation.success'));
        } else {
          Toast.error(res?.data.message || t('creation.failed'));
        }
      }).catch(() => {});
    } else {
      await updateAssistant({ ...assistant }).then((res) => {
        if (res?.data.message === 'OK') {
          afterUpdate(assistant.id);
          setChatList((pre) => {
            const cachePre: ChatList[] = JSON.parse(JSON.stringify(pre || '[]'));
            cachePre.forEach((chat) => {
              if (chat.assistantId === assistant.id) {
                Object.assign(chat, { assistant: { ...assistant } });
              }
            });
            return cachePre;
          });
          Toast.success(t('update.success'));
        } else {
          Toast.error(res?.data.message || t('update.failed'));
        }
      }).catch(() => {});
    }
  };

  const handleEdit = (assistant: Assistant) => {
    setCurAssistant(assistant);
    setModel(assistant.model);
    setVisible(true);
  };

  const handleDelete = async (assistant: Assistant) => {
    await deleteAssistant({ assistantId: assistant.id }).then(() => {
      Toast.success(t('deletion.success'));
    }).catch((error) => {
      Toast.error(error.message);
    }).finally(() => {
      setLoading(true);
      mutate().catch(() => {}).finally(() => setLoading(false));
    });
  };

  const handleChat = (assistant: Assistant) => {
    const { id, prompt } = assistant;
    const chat = { systemMessage: prompt, assistantId: id, assistant };
    handleNewChat(chat);
  };

  const renderItem = (assistant: Assistant) => (
    <List.Item style={{ padding: '0 10px', marginBottom: '20px' }}>
      <AiCard
        assistant={assistant}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onChat={handleChat}
      />
    </List.Item>
  );

  const renderSkeleton = () => (
    <List.Item style={{ padding: '0 10px', marginBottom: '20px' }}>
      <Skeleton.Title className="w-full h-[168px] rounded-lg" />
    </List.Item>
  );

  const filterAssistantsFc = (assistant: Assistant) => {
    const { prompt, name } = assistant;
    const promptString = prompt?.map((p) => p.content)?.join(' ') || '';
    return (name.includes(searchValue) || promptString?.includes(searchValue));
  };

  const filterAssistants = data?.filter(filterAssistantsFc) || [];

  return (
    <ResponsiveLayout className="overflow-hidden px-5 py-2 flex flex-col" hiddenHeader>
      <div className="flex flex-shrink-0 w-1/2 my-5 max-md:w-full">
        <Input prefix={<IconSearch />} placeholder={t('Search')} value={searchValue} onChange={setSearchValue} />
        <Button className="!ml-10" theme="solid" onClick={handleCreate}>{t('Create')}</Button>
      </div>
      <div className="h-0 flex-grow overflow-auto">
        <Spin wrapperClassName="!h-full" spinning={loading}>
          {(presetLoading || presetAI.length > 0) && (
            <>
              <Typography.Title heading={2}>{t('system ai')}</Typography.Title>
              <div className="mt-[12px]">
                <List
                  dataSource={presetLoading ? [1, 2, 3, 4] as any[] : presetAI}
                  renderItem={presetLoading ? renderSkeleton : renderItem}
                  grid={{
                    xs: 24, sm: 12, md: 12, lg: 8, xl: 6, xxl: 6, className: 'min-[2160px]:w-1/6 min-[2480px]:w-[12.5%]'
                  }}
                  emptyContent={<div>{}</div>}
                />
              </div>
            </>
          )}
          <Typography.Title heading={2}>{t('my ai')}</Typography.Title>
          <div className="mt-[12px]">
            <List
              dataSource={isLoading ? [1, 2, 3, 4, 5, 6, 7, 8] as any[] : filterAssistants}
              renderItem={isLoading ? renderSkeleton : renderItem}
              grid={{
                xs: 24, sm: 12, md: 12, lg: 8, xl: 6, xxl: 6, className: 'min-[2160px]:w-1/6 min-[2480px]:w-[12.5%]'
              }}
              emptyContent={(
                <Empty title={t('no data.title')} description={!searchValue ? t('no data.user message') : ''}>
                  {!searchValue && <Button className="w-full" theme="solid" onClick={handleCreate}>{t('Create')}</Button>}
                </Empty>
              )}
            />
          </div>
        </Spin>
      </div>
      <SideSheet
        closable
        visible={visible}
        style={{ maxWidth: '80%' }}
        bodyStyle={{ margin: '20px 0' }}
        onCancel={() => setVisible(false)}
        headerStyle={{ display: 'none' }}
        getPopupContainer={() => document.querySelector('.layout-root') as HTMLElement}
      >
        <AiEdit
          model={model}
          disabled={curAssistant?.source === 'system'}
          assistant={curAssistant}
          onConfirm={handleConfirm}
        />
      </SideSheet>
    </ResponsiveLayout>
  );
}

export default User;
