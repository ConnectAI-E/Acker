import type { ChatList } from '@/global';

const nullFc = () => {};

const sortChatList = (a: ChatList, b: ChatList) => {
  if (!a.lastUpdateTime && !b.lastUpdateTime) return 0;
  if (!a.lastUpdateTime) return 1;
  if (!b.lastUpdateTime) return -1;
  // replaceAll 为了解决safari的Invalid Date问题，2023-06-29这种类型无法转换
  const dateA = new Date(a.lastUpdateTime.replaceAll('-', '/'));
  const dateB = new Date(b.lastUpdateTime.replaceAll('-', '/'));
  if (dateA === dateB) return 0;
  return dateA < dateB ? 1 : -1;
};

export { sortChatList, nullFc };
