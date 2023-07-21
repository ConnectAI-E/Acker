import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Button, ButtonGroup, Form, Tabs, Toast, Tooltip
} from '@douyinfe/semi-ui';
import { IconHelpCircle } from '@douyinfe/semi-icons';
import { v4 as uuid } from 'uuid';
import type { CustomError } from '@douyinfe/semi-ui/lib/es/upload';
import type { FormApi } from '@douyinfe/semi-ui/lib/es/form';
import SystemMessage from '@/components/system-message';
import Upload from '@/components/upload';
import modelList from '@/assets/json/model.json';
import { validateUrl } from '@/utils/validate';
import { Message } from '@/global';
import { defaultAssistant, defaultMidjourneyAssistant } from '@/assets/contants/assistants';
import type { AiEditProps } from './AiEdit';

const AiEdit: React.FC<AiEditProps> = function AiEdit(props) {
  const { assistant, disabled, model: editModel, onConfirm } = props;

  const [t] = useTranslation('assistantSetting');

  const { prompt, avatar, model } = assistant || {};

  const changeFlag: boolean = !!assistant?.id;
  const midjourneyFlag: boolean = editModel === 'midjourney';

  const [smList, setSmList] = useState<Message[]>(() => prompt || []);
  const [avatarUrl, setAvatarUrl] = useState<string>(avatar || '');
  const [loading, setLoading] = useState<boolean>(false);

  const formApiRef = useRef<FormApi<any>>();

  const validateAvatar = (url?: string) => (!url || validateUrl(url) ? '' : t('url invalid'));

  const handleSubmit = async (values: any) => {
    const cacheValues = JSON.parse(JSON.stringify(values));
    Object.assign(cacheValues, { prompt: smList, id: changeFlag ? assistant?.id : uuid() });
    setLoading(true);
    await onConfirm(cacheValues, changeFlag);
    setLoading(false);
  };

  const handleReset = () => {
    setSmList(prompt || []);
    setAvatarUrl(avatar || '');
  };

  const handleUploadSuccess = (url: string) => {
    Toast.success(t('upload success'));
    setAvatarUrl(url);
    formApiRef.current?.setValue('avatar', url);
  };

  const handleUploadError = (e: CustomError) => {
    Toast.error(e.message);
  };

  const renderCreateItem = (inputValue: string | number) => <div className="p-[10px]">{`${t('Create model')}: ${inputValue}`}</div>;

  return (
    <Form
      className="h-full flex flex-col overflow-hidden"
      disabled={disabled}
      onSubmit={handleSubmit}
      initValues={assistant || (midjourneyFlag ? defaultMidjourneyAssistant : defaultAssistant)}
      getFormApi={(formApi) => { formApiRef.current = formApi; }}
    >
      <Tabs className="h-0 flex-grow flex flex-col" contentStyle={{ height: 0, flexGrow: 1, overflow: 'auto' }}>
        <Tabs.TabPane itemKey="General" tab={t('general')}>
          <Form.Select
            allowCreate
            filter
            className="w-full"
            field="model"
            label={t('assistant.model')}
            renderCreateItem={renderCreateItem}
            disabled={midjourneyFlag}
          >
            {modelList.map((m) => <Form.Select.Option key={m.value} value={m.value}>{m.name}</Form.Select.Option>)}
            {model && !modelList.some((m) => m.value.includes(model)) && <Form.Select.Option value={model}>{model}</Form.Select.Option>}
          </Form.Select>
          <Form.Input
            field="alias"
            label={t('assistant.alias')}
            rules={[{ required: true, message: t('required error', { value: 'alias' }) }]}
            showClear
          />
          <Form.Input
            field="name"
            label={t('assistant.name')}
            rules={[{ required: true, message: t('required error', { value: 'name' }) }]}
            showClear
          />
          <Form.Input field="avatar" label={t('assistant.avatar')} showClear validate={validateAvatar} trigger="change" />
          <Upload
            key={avatarUrl}
            size="large"
            disabled={disabled}
            defaultAvatarUrl={avatarUrl}
            onSuccess={handleUploadSuccess}
            onError={handleUploadError}
          />
          {!midjourneyFlag && (
            <Form.Slot
              label={{
                text: t('assistant.prompt.name'),
                extra: <Tooltip content={t('assistant.prompt.tips')}><IconHelpCircle /></Tooltip>
              }}
            >
              <SystemMessage disabled={disabled} key={JSON.stringify(smList)} data={smList} onChange={setSmList} />
            </Form.Slot>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane itemKey="Advanced" tab={t('advanced')}>
          <Form.Input
            field="configuration.host"
            label={t('assistant.configuration.apiHost')}
            rules={[{ required: true, message: t('required error', { value: 'apiHost' }) }]}
            showClear
          />
          <Form.Input field="configuration.apiKey" label={t('assistant.configuration.apiKey')} mode="password" showClear />
          {!midjourneyFlag && (
            <>
              <Form.Slider
                field="configuration.temperature"
                label={t('assistant.configuration.temperature')}
                min={0}
                max={2}
                step={0.1}
                marks={{ 0: '0', 1: '1', 2: '2' }}
              />
              <Form.Slider
                field="configuration.presence_penalty"
                label={t('assistant.configuration.presence_penalty')}
                min={-2}
                max={2}
                step={0.1}
                marks={{
                  '-2': '-2', '-1': '-1', 0: '0', 1: '1', 2: '2'
                }}
              />
              <Form.Slider
                field="configuration.frequency_penalty"
                label={t('assistant.configuration.frequency_penalty')}
                min={-2}
                max={2}
                step={0.1}
                marks={{
                  '-2': '-2', '-1': '-1', 0: '0', 1: '1', 2: '2'
                }}
              />
              <Form.Switch field="configuration.stream" label={t('assistant.configuration.stream')} />
            </>
          )}
        </Tabs.TabPane>
      </Tabs>
      <ButtonGroup className="mt-5 flex-shrink-0" disabled={disabled}>
        <Button className="flex-1" htmlType="submit" theme="solid" loading={loading}>
          {changeFlag ? t('Modify') : t('Create')}
        </Button>
        <Button className="flex-1" htmlType="reset" type="tertiary" onClick={handleReset}>
          {t('Reset')}
        </Button>
      </ButtonGroup>
    </Form>
  );
};

export default AiEdit;
