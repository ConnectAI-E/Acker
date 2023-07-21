import { Assistant } from '@/global';

export interface AiEditProps {
  disabled?: boolean;
  assistant?: Assistant;
  model: string;
  onConfirm: (values: Assistant, update?: boolean) => void;
}
