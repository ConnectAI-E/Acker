import React from 'react';
import classNames from 'classnames';
import styles from './Loading.module.less';

const Loading: React.FC = function Loading() {
  return (
    <div className={classNames('h-[21px] flex-shrink-0 text-[24px] mr-4 ml-2 leading-[10px] rounded-md text-gray-500', styles.loading)}>
      <span>.</span>
      <span className={styles.loadingFirst}>.</span>
      <span className={styles.loadingSecond}>.</span>
    </div>
  );
};

export default Loading;
