import React from 'react';

export interface FilesProps {
  data: UploadedFile[];
  wrapperClassName?: string;
  className?: string;
  onChange: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

export interface FileItemProps {
  file: UploadedFile;
  className?: string;
  uploadFile: (file: File, fileName: string, onProgress: (progress: number) => void, abort?: AbortController) => Promise<string>;
  onUploaded: (file: UploadedFile) => void;
  onDeleted: (file: UploadedFile) => void
  onPreview: (url: string | ArrayBuffer) => void;
}

export interface UploadedFile {
  id: string;
  name: string;
  url?: string;
  uploaded?: boolean;
  error?: boolean;
  originFile: File;
}
