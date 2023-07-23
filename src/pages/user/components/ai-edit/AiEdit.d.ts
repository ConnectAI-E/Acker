import { Assistant } from '@/global';

export interface AiEditProps {
  disabled?: boolean;
  assistant?: Assistant;
  onConfirm: (values: Assistant, update?: boolean) => void;
}
