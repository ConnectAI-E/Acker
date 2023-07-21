import type { Session } from '@supabase/supabase-js';
import type { Assistant } from '@/global';

export interface AssistantWrapperProps {
  onClickItem?: (assistant: Assistant, event?: React.MouseEvent<HTMLDivElement | HTMLLIElement, MouseEvent>) => void;
  session: Session | null;
}
