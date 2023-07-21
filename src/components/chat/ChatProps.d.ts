import type { Session } from '@supabase/supabase-js';
import type {
  ChatList, NewChatProps, Conversation, Assistant, ApiKey 
} from '@/global';

export interface CheckOptionsProps {
  data: Conversation[];
}

export interface OptionButtonProps {
  text: string;
  type: 'primary' | 'secondary' | 'tertiary' | 'warning' | 'danger';
  icon: React.ReactNode;
  onClick: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

export interface ChatHeaderProps {
  title?: string;
  brief?: string;
  updateTime?: string;
  model?: string;
  showSelectButton: boolean;
  onOpenConfig: () => void;
  onSelectList: () => void;
}
