import React from 'react';
import type { Assistant, ChatList, Conversation } from '@/global';

export type ChatAction = { type: 'check', data: Conversation[] } | { type: 'change', data: Conversation[] };

export type ChatReducer = React.Reducer<Conversation[], ChatAction>;

export interface ChatOutletProps {
  setHiddenHeader: React.Dispatch<React.SetStateAction<boolean>>;
}
