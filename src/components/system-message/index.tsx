import React, { Suspense } from 'react';
import Fallback from '@/components/fallback';
import ErrorBoundary from '@/components/error-boundary';
import { SystemMessageProps } from './SystemMessageProps';

const SystemMessageComponent = React.lazy(async () => import('./SystemMessage').catch(() => ({ default: () => <ErrorBoundary /> })));

const SystemMessage: React.FC<SystemMessageProps> = function SiderConfig(props) {
  const { data, disabled, onChange } = props;

  return (
    <Suspense fallback={<Fallback />}>
      <SystemMessageComponent disabled={disabled} data={data} onChange={onChange} />
    </Suspense>
  );
};

export default SystemMessage;
