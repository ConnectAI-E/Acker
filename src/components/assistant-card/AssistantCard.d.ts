import { Assistant } from '@/global';

export interface AssistantCardProps {
  className?: string;
  assistant: Assistant;
  hiddenFooter?: boolean;
  disabledBtn?: boolean;
  onEdit?: (assistant: Assistant) => void;
  onDelete?: (assistant: Assistant) => void | Promise<void>;
  onChat?: (assistant: Assistant) => void;
}
