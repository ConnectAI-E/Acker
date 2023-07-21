import React, { lazy, Suspense } from 'react';
import Fallback from '@/components/fallback';
import ErrorBoundary from '@/components/error-boundary';

const MidJourneyChatCom = lazy(async () => import('./MidJourneyChat').catch(() => ({ default: () => <ErrorBoundary /> })));

const Chat: React.FC = function ChatIcon() {
  return (
    <Suspense fallback={<Fallback />}>
      <MidJourneyChatCom />
    </Suspense>
  );
};

export default Chat;
