import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation, Trans } from 'react-i18next';
import { Button, Form, Spin } from '@douyinfe/semi-ui';
import { useLoginOutlet } from '..';

function VerificationForm() {
  const [query] = useSearchParams();

  const [loading, setLoading] = useState<boolean>(false);

  const { onEmailCodeSubmit, onPhoneCodeSubmit } = useLoginOutlet();

  const [t] = useTranslation('login');

  const email = decodeURIComponent(query.get('email') || '');
  const phone = decodeURIComponent(query.get('phone') || '');

  const handleSubmit = async (values: any) => {
    if (loading) return;
    setLoading(true);
    const onCodeSubmit = email ? onEmailCodeSubmit : onPhoneCodeSubmit;
    await onCodeSubmit(values.code);
    setLoading(false);
  };

  return (
    <Form className="mx-auto sm:w-[400px] w-full max-md:px-[20px]" onSubmit={handleSubmit}>
      <div className="text-center dark:text-white">
        <h1 className="text-2xl font-semibold tracking-tight my-2">
          <Trans t={t} i18nKey="check tips" values={{ type: email ? t('email.lower') : t('phone.lower') }} />
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          <Trans
            t={t}
            i18nKey="sent success tips"
            values={{ value: email || phone }}
            components={{ b: <b className="mx-2" /> }}
          />
        </p>
      </div>
      <Spin spinning={loading}>
        <Form.Input
          noLabel
          field="code"
          placeholder={t('login code placeholder')}
          validate={(v) => (v && v.length === 6 ? '' : t('login code validate'))}
          trigger="blur"
          showClear
        />
        <Button size="large" className="w-full !bg-black !text-white dark:!bg-slate-50 dark:!text-slate-900 my-5" htmlType="submit">
          {t('code sign in')}
        </Button>
      </Spin>
    </Form>
  );
}

export default VerificationForm;
