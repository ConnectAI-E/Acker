import type { Session } from '@supabase/supabase-js';
import type { Assistant, ChatList, Conversation, ChatListKey } from '@/global';

export interface Component {
  custom_id: string;
  label: 'U1' | 'U2' | 'U3' | 'U4' | 'V1' | 'V2' | 'V3' | 'V4' | '🔄';
  disabled?: boolean;
}

export interface Captcha {
  channel_id: string;
  components: Component[] | null;
  message_flags: number;
  image_url: string;
  message_id: string;
  server_id: string;
}

export interface MidJourneyData {
  id: number;
  prompt_id: number;
  message_id: string;
  message_hash: string;
  img_url: string;
  ref_message_id: string;
  server_id: string;
  channel_id: string;
  components: Component[] | null;
  state: string;
  error: Error;
  description: string | null;
  seed: string;
  req_id: number;
  captcha: Captcha;
}

export interface MidJourneyResponse {
  errorCode: number;
  msg: string;
  data: MidJourneyData | null;
}

export interface MJConversationProps {
  data: Conversation;
  index: number;
  isLoading?: boolean;
  question?: string;
  botAvatar?: string;
  userAvatar?: string;
  onFetch: (value: string, params: Record<string, any> = {}) => Promise<void>;
  afterOptionsFinish: (data: Conversation, Component: Component) => void;
}
