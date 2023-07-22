import React from 'react';
import { UploadedFile } from './FilesProps';

export interface InputProps {
  text: string;
  files: UploadedFile[];
}

export interface UploadProps {
  multiple: boolean;
  accept: string;
}

export interface AutoTextAreaProps {
  loading: boolean;
  hiddenUpload?: boolean;
  hiddenInspiration?: boolean;
  uploadProps?: UploadProps;
  onFetchAnswer: (value: InputProps) => void;
  getLastQuestion?: () => any;
  getNextQuestion?: () => any;
}
