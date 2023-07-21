import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Button, ButtonGroup, Descriptions, Form, Avatar, Toast, Tooltip, Tabs, Spin, 
} from '@douyinfe/semi-ui';
import { IconEyeClosedSolid, IconEyeOpened, IconHelpCircle } from '@douyinfe/semi-icons';
import type { InputMode } from '@douyinfe/semi-ui/lib/es/input';
import modelList from '@/assets/json/model.json';
import SystemMessage from '@/components/system-message';
import { ChatConfigProps } from './ChatConfig';
import { Message } from '@/global';

const ChatConfig: React.FC<ChatConfigProps> = function ChatConfig(props) {
  const {
    chat, assistant, parentChat, loading, onConfirm, onClose 
  } = props;

  const { title, data, chatId, systemMessage } = chat;

  const navigate = useNavigate();

  const [t] = useTranslation(['assistantSetting', 'translation']);

  const [smList, setSmList] = useState<Message[]>(() => systemMessage || []);
  const [apiKeyMode, setApiKeyMode] = useState<InputMode | undefined>('password');
  
  const initKey: string = title || data[0]?.value || '';
  const midjourneyFlag: boolean = assistant?.model === 'midjourney';

  const handleSubmit = (values: any) => {
    onConfirm(chatId, 'title', values?.title);
    onConfirm(chatId, 'systemMessage', [...(smList || [])]);
    Toast.success(t('translation:save.success'));
    onClose();
  };

  const handleReset = () => {
    setSmList(systemMessage || []);
  };

  const renderParentChat = useMemo(() => parentChat && (
    <Form.Slot label={t('Source')}>
      <Descriptions className="border-[var(--semi-color-border)] border-[1px] rounded-md p-3">
        <Descriptions.Item itemKey={t('id')}>{parentChat.chatId}</Descriptions.Item>
        <Descriptions.Item itemKey={t('title')}>
          <div className="text-overflow-l4">
            {parentChat.title || parentChat.data[0]?.value}
          </div>
        </Descriptions.Item>
        <Descriptions.Item itemKey={t('redirect.name')}>
          <span
            className="text-[#40b4f3] cursor-pointer"
            onClick={() => {
              if (parentChat) {
                navigate({ pathname: '/chat/chat-page', search: `?chatId=${parentChat.chatId}` });
                onClose();
              }
            }}
          >
            {t('redirect.content')}
          </span>
        </Descriptions.Item>
      </Descriptions>
    </Form.Slot>
  ), [navigate, onClose, parentChat, t]);

  return (
    <Form className="h-full flex flex-col" onSubmit={handleSubmit}>
      <Tabs className="h-0 flex-grow flex flex-col" contentStyle={{ height: 0, flexGrow: 1, overflow: 'auto' }}>
        <Tabs.TabPane tab={t('general')} itemKey="General">
          {renderParentChat}
          <Form.Input
            field="title"
            label={t('title')}
            initValue={initKey}
            placeholder="Fill in the title here"
            showClear
          />
          <Form.Select disabled field="model" label={t('assistant.model')} initValue={assistant?.model} className="w-full">
            {modelList.map((m) => <Form.Select.Option key={m.value} value={m.value}>{m.name}</Form.Select.Option>)}
            {assistant?.model && !modelList.some((m) => m.value.includes(assistant?.model)) && (
              <Form.Select.Option value={assistant?.model}>{assistant?.model}</Form.Select.Option>
            )}
          </Form.Select>
          {!midjourneyFlag && (
            <Form.Slot
              label={{
                text: t('assistant.prompt.name'),
                extra: <Tooltip content={t('assistant.prompt.tips')}><IconHelpCircle /></Tooltip>
              }}
            >
              <SystemMessage key={JSON.stringify(smList)} data={smList} onChange={setSmList} />
            </Form.Slot>
          )}
        </Tabs.TabPane>
        {assistant && (
          <Tabs.TabPane tab={t('Assistant')} itemKey="Assistant">
            <Spin spinning={loading}>
              <Form key={JSON.stringify(assistant || {})} disabled initValues={assistant} className="h-full overflow-auto">
                <Form.Input field="name" label={t('assistant.name')} />
                <Form.Select className="w-full" field="model" label={t('assistant.model')} />
                {assistant.avatar && <Form.Slot label={t('assistant.avatar')}><Avatar src={assistant.avatar} /></Form.Slot>}
                {!midjourneyFlag && (
                  <Form.Slot label={t('assistant.prompt.name')}>
                    <SystemMessage data={assistant.prompt || []} onChange={() => {}} disabled />
                  </Form.Slot>
                )}
                <Form.Input field="configuration.host" label={t('assistant.configuration.apiHost')} rules={[{ required: true }]} />
                <Form.Input
                  field="configuration.apiKey"
                  label={{
                    text: t('assistant.configuration.apiKey'),
                    extra: apiKeyMode === 'password' ? (
                      <IconEyeClosedSolid className="cursor-pointer" onClick={() => setApiKeyMode(undefined)} />
                    ) : (
                      <IconEyeOpened className="cursor-pointer" onClick={() => setApiKeyMode('password')} />
                    )
                  }}
                  mode={apiKeyMode}
                />
                {!midjourneyFlag && (
                  <>
                    <Form.Slider
                      field="configuration.temperature"
                      label={t('assistant.configuration.temperature')}
                      min={0}
                      max={2}
                      marks={{ 0: '0', 1: '1', 2: '2' }}
                    />
                    <Form.Slider
                      field="configuration.presence_penalty"
                      label={t('assistant.configuration.presence_penalty')}
                      min={-2}
                      max={2}
                      marks={{
                        '-2': '-2', '-1': '-1', 0: '0', 1: '1', 2: '2'
                      }}
                    />
                    <Form.Slider
                      field="configuration.frequency_penalty"
                      label={t('assistant.configuration.frequency_penalty')}
                      min={-2}
                      max={2}
                      marks={{
                        '-2': '-2', '-1': '-1', 0: '0', 1: '1', 2: '2'
                      }}
                    />
                    <Form.Switch field="configuration.stream" label={t('assistant.configuration.stream')} />
                  </>
                )}
              </Form>
            </Spin>
          </Tabs.TabPane>
        )}
      </Tabs>
      <ButtonGroup className="mt-4">
        <Button htmlType="submit" className="flex-1" theme="solid">{t('Save')}</Button>
        <Button htmlType="reset" className="flex-1" type="secondary" onClick={handleReset}>{t('Reset')}</Button>
      </ButtonGroup>
    </Form>
  );
};

export default ChatConfig;
