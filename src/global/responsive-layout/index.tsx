/* eslint-disable react/jsx-props-no-spreading */
import { FC } from 'react';
import classNames from 'classnames';
import { Layout } from '@douyinfe/semi-ui';
import { ResponsiveLayoutProps } from './ResponsiveLayout';
import Header from '../header';
import Footer from '../footer';

const ResponsiveLayout: FC<ResponsiveLayoutProps> = function ResponsiveLayout(props) {
  const {
    wrapperClassName = '', className, children, style = {},
    hiddenFooter, hiddenHeader, headerProps = {}, footerProps = {},
  } = props;

  return (
    <Layout
      className={classNames(wrapperClassName, 'w-full h-full flex flex-col overflow-hidden')}
      style={style}
    >
      {!hiddenHeader && <Header {...headerProps} />}
      <Layout.Content className={classNames(className, 'h-0 flex-grow text-[var(--semi-color-text-0)]')}>
        {children || null}
      </Layout.Content>
      {!hiddenFooter && <Footer {...footerProps} />}
    </Layout>
  );
};

export default ResponsiveLayout;
