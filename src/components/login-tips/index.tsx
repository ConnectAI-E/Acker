import React from 'react';
import classNames from 'classnames';
import { useTranslation, Trans } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Typography } from '@douyinfe/semi-ui';
import type { LoginTipsProps } from './LoginTips';

const LoginTips: React.FC<LoginTipsProps> = function LoginTips (props) {
  const { wrapperClassName = '', className = '', afterPagePath } = props;

  const navigate = useNavigate();

  const [t] = useTranslation('login');

  const handeLogin = () => {
    if (afterPagePath) {
      localStorage?.setItem('afterPagePath', afterPagePath);
    }
    navigate('/login');
  };

  return (
    <div className={wrapperClassName}>
      <Typography className={classNames('text-[18px]', className)}>
        <Trans
          t={t}
          i18nKey="not login tips"
          components={{ click: <Typography.Text className="text-[18px] mx-2" onClick={handeLogin} link underline /> }}
        />
      </Typography>
    </div>
  );
};

export default LoginTips;
