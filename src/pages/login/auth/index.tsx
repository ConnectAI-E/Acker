import { useState } from 'react';
// import { createSearchParams, useSearchParams } from 'react-router-dom';
// import { IconGithubLogo, IconMailStroked, IconPhoneStroke } from '@douyinfe/semi-icons';
import { useTranslation, Trans } from 'react-i18next';
import { Button, Divider, Form, Spin } from '@douyinfe/semi-ui';
import { IconGithubLogo } from '@douyinfe/semi-icons';
import { validateEmail } from '@/utils/validate';
import { useLoginOutlet } from '..';

function AuthForm() {
  const [loading, setLoading] = useState<boolean>(false);

  const { onEmailSubmit, onGithubLogin, onPhoneSubmit } = useLoginOutlet();

  const [t] = useTranslation('login');

  // const [search, setSearch] = useSearchParams();

  // const type = search.get('type') || 'Email';
  
  // const otherName = useMemo(() => `Sign In with ${type === 'Email' ? 'phone' : 'email'}`, [type]);

  const type = 'Email';

  const handleSubmit = async (values: any) => {
    if (loading) return;
    setLoading(true);
    const onSubmit = type === 'Email' ? onEmailSubmit : onPhoneSubmit;
    const value = type === 'Email' ? values.email : values.phone;
    await onSubmit(value);
    setLoading(false);
  };

  const handleGithubLogin = async () => {
    if (loading) return;
    setLoading(true);
    await onGithubLogin();
    setLoading(false);
  };

  // const handleChangeLoginWay = () => {
  //   setSearch((pre) => {
  //     const preType = pre.get('type') || 'Email';
  //     const curType = preType === 'Email' ? 'Phone' : 'Email';
  //     return createSearchParams({ type: curType });
  //   });
  // };

  return (
    <Form key={type} className="mx-auto sm:w-[400px] w-full max-md:px-[20px]" onSubmit={handleSubmit}>
      <div className="text-center dark:text-white">
        <h1 className="text-2xl font-semibold tracking-tight my-2">{t('Welcome')}</h1>
        <p className="text-slate-500 dark:text-slate-400">
          <Trans
            t={t}
            i18nKey="login tips"
            values={{ type: t(type === 'Email' ? 'email.upper' : 'phone.upper') }}
            components={{ b: <b /> }}
          />
        </p>
      </div>
      <Spin spinning={loading}>
        {type === 'Email' ? (
          <Form.Input
            noLabel
            field="email"
            placeholder="name@example.com"
            autoComplete="email"
            type="email"
            name="email"
            size="large"
            autoCapitalize="none"
            autoCorrect="off"
            validate={(v) => (validateEmail(v) ? '' : t('email validate'))}
            trigger="blur"
            showClear
          />
        ) : (
          <Form.Input
            noLabel
            field="phone"
            placeholder="+1 (123) 456-7890"
            autoComplete="phone"
            type="tel"
            name="phone"
            size="large"
            autoCapitalize="none"
            autoCorrect="off"
            validate={(v) => (v ? '' : t('phone validate'))}
            trigger="blur"
            showClear
          />
        )}
        <Button
          className="w-full !bg-black !text-white dark:!bg-slate-50 dark:!text-slate-900 my-5"
          htmlType="submit"
        >
          {t('email sign in')}
        </Button>
        <Divider className="text-slate-600 dark:text-slate-300">
          {t('continue with')}
        </Divider>
        {/* <Button
          className="w-full mt-8 !bg-[#14c786] !text-white"
          icon={type === 'Email' ? <IconPhoneStroke /> : <IconMailStroked />}
          onClick={handleChangeLoginWay}
        >
          {otherName}
        </Button> */}
        <Button
          className="w-full mt-8 !bg-[var(--semi-color-fill-0)]"
          type="tertiary"
          icon={<IconGithubLogo />}
          onClick={handleGithubLogin}
        >
          {t('Github')}
        </Button>
      </Spin>
    </Form>
  );
}

export default AuthForm;
