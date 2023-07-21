import React, { lazy, Suspense } from 'react';
import Fallback from '@/components/fallback';
import ErrorBoundary from '@/components/error-boundary';

const ChatComponent = lazy(async () => import('./Chat').catch(() => ({ default: () => <ErrorBoundary /> })));

const Chat: React.FC = function ChatIcon() {
  return (
    <Suspense fallback={<Fallback />}>
      <ChatComponent />
    </Suspense>
  );
};

export default Chat;
