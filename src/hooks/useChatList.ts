import { useContext } from 'react';
import { ChatStoreProps } from '@/global';
import { Store } from '@/store/ChatStore';

function useChatList() {
  const context = useContext<ChatStoreProps>(Store);
  if (context === undefined) {
    throw new Error('useChatList must be used inside ChatStore');
  } else {
    return context;
  }
}

export default useChatList;
