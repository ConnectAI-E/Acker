import { useContext } from 'react';
import { CurrentChatProps } from '@/global';
import { Store } from '@/pages/chat/chat-page';

function useCurrentChat() {
  const context = useContext<CurrentChatProps>(Store);
  if (context === undefined) {
    throw new Error('useCurrentChat must be used inside ChatPage');
  } else {
    return context;
  }
}

export default useCurrentChat;
