import { Assistant, ChatList, ChatListKey } from '@/global';

export interface ChatConfigProps {
  chat: ChatList;
  loading: boolean;
  assistant?: Assistant;
  parentChat?: ChatList;
  onConfirm: (chatId: string, key: ChatListKey, value: any) => void;
  onClose: () => void;
}
