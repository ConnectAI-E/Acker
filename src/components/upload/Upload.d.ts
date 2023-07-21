import { AvatarSize } from '@douyinfe/semi-ui/lib/es/avatar';
import type { CustomError } from '@douyinfe/semi-ui/lib/es/upload';

export interface UploadProps {
  size?: AvatarSize;
  disabled?: boolean;
  defaultAvatarUrl?: string;
  onSuccess?: (url: string) => void;
  onError?: (err: CustomError, file: File) => void;
}
