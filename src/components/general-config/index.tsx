import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Form, Popconfirm, Toast } from '@douyinfe/semi-ui';
import useTheme from '@/hooks/useTheme';
import useChatList from '@/hooks/useChatList';

const languageMap: Record<string, string> = {
  'zh-CN': 'zh', ja: 'jp', jp: 'jp', en: 'en', zh: 'zh' 
};

const GeneralConfig: React.FC = function GeneralConfig() {
  const [t, i18n] = useTranslation(['setting', 'translation']);

  const [mode, setMode] = useTheme();

  const { handleDeleteAll } = useChatList();

  const handleChangeLanguage = (v: any) => {
    i18n.changeLanguage(v).catch(() => {});
  };

  return (
    <Form labelPosition="left">
      {mode && (
        <Form.RadioGroup field={t('theme')} initValue={mode} onChange={(e) => setMode(e.target.value)}>
          <Form.Radio value="light">{t('Light')}</Form.Radio>
          <Form.Radio value="dark">{t('Dark')}</Form.Radio>
          <Form.Radio value="auto">{t('Automatic')}</Form.Radio>
        </Form.RadioGroup>
      )}
      <Form.Select field={t('language')} initValue={languageMap[i18n.language] || 'en'} onChange={handleChangeLanguage}>
        <Form.Select.Option value="en">English</Form.Select.Option>
        <Form.Select.Option value="zh">简体中文</Form.Select.Option>
        <Form.Select.Option value="jp">日本語</Form.Select.Option>
      </Form.Select>
      <Popconfirm
        title={t('clear history.title')}
        content={t('clear history.content')}
        okText={t('Confirm')}
        cancelText={t('Cancel')}
        onConfirm={() => {
          handleDeleteAll();
          Toast.success(t('translation:deletion.success'));
        }}
      >
        <Button className="w-full !h-[48px] !mt-[24px] rounded-lg !bg-white dark:!bg-[#2e333d] hover:opacity-80" type="danger">
          {t('clear history.name')}
        </Button>
      </Popconfirm>
    </Form>
  );
};

export default GeneralConfig;
