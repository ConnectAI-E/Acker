import React, { Suspense } from 'react';
import { Navigate, RouteObject, useRoutes } from 'react-router-dom';
import { Layout } from '@douyinfe/semi-ui';
import routes from 'virtual:generated-pages-react';
import classNames from 'classnames';
import ChatStore from '@/store/ChatStore';
import SupabaseStore from '@/store/Supabase';
import SiderConfig from '@/components/sider-config';
import Fallback from '@/components/fallback';
import ErrorBoundary from '@/components/error-boundary';

routes.push({ path: '*', element: <Navigate to="/" />, hasErrorBoundary: true, errorElement: <ErrorBoundary /> });

function parseRoutes(route: RouteObject) {
  const newRoute: RouteObject = { ...route };
  const { children, element, path } = newRoute;
  if (Array.isArray(children) && children.length && !React.isValidElement(element) && !path?.startsWith(':')) {
    const newChildren = children.map(parseRoutes);
    const curElementIndex = newChildren.findIndex((child) => !child.path);
    newRoute.element = newChildren.splice(curElementIndex, 1)[0].element;
    newRoute.children = newChildren;
  }
  return newRoute;
}

// 使用文件夹命名路由会导致路由文件夹index下的Outlet失效
const outletRoutes = routes.map(parseRoutes);

export default function App () {
  return (
    <SupabaseStore>
      <ChatStore>
        <Layout
          className={classNames(
            'w-[95%] h-[95%] layout-root relative',
            'overflow-hidden flex-row flex-none rounded-lg',
            'max-md:flex-col max-md:w-full max-md:h-full max-md:rounded-none',
            'border-[1px] border-[var(--semi-color-border)] max-md:border-none'
          )}
        >
          <Layout.Sider className="w-[64px] h-full flex-shrink-0 max-md:hidden">
            <SiderConfig />
          </Layout.Sider>
          <Suspense fallback={<Fallback />}>
            {useRoutes(outletRoutes)}
          </Suspense>
        </Layout>
      </ChatStore>
    </SupabaseStore>
  );
}
