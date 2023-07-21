import React from 'react';
import classNames from 'classnames';
import { Spin } from '@douyinfe/semi-ui';
import { FallbackProps } from './Fallback';

const Fallback: React.FC<FallbackProps> = function Fallback(props) {
  const { size = 'large', wrappClass = '' } = props;

  return (
    <div className={classNames('w-full h-full flex items-center justify-center', wrappClass)}>
      <Spin size={size} />
    </div>
  );
};

export default Fallback;
