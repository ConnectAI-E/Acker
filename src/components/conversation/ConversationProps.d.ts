import React from 'react';
import type { Session } from '@supabase/supabase-js';
import type { Assistant, Conversation } from '@/global';

export interface ConversationProps {
  generateLoading: boolean;
  data: Conversation;
  pairData: Conversation;
  onEditorSave: (v: string, key: string) => void;
}

export interface GenConversationProps {
  question?: string;
  loading: boolean;
  retry: boolean;
  scrollToBottom: () => void;
  setRetry: React.Dispatch<React.SetStateAction<boolean>>;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  setQuestion: React.Dispatch<React.SetStateAction<string>>;
}

export interface PreviewConversationProps {
  data: Conversation;
  botAvatar?: string;
  userAvatar?: string;
}
