import type { Assistant } from '@/global';

export interface TopicItem {
  id: number;
  entry: string;
  assistant?: Assistant;
}
