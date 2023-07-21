import React from "react";
import type { SupabaseClient, Session } from '@supabase/supabase-js';
import type { MidJourneyData } from "@/components/midjourney-chat/MidJourneyChatProps";
import type { UploadedFile } from "@/components/auto-textarea/FilesProps";
import type { ChatAction } from "@/pages/chat/Chat";

export type ChatListKey = 'chatId' | 'title' | 'lastUpdateTime' | 'systemMessage' | 'parentId' | 'assistant' | 'data';
export type Model = 'gpt-3.5-turbo' | 'gpt-4' | 'gpt-3.5-turbo-16k' | string;
export type Role = 'assistant' | 'user' | 'system';
export type StandardUpload = (file: File | Blob, fileName: string, onProgress?: (progress: number) => void, abort?: AbortController, bucketName?: string) => Promise<string>;

/**
 * system message
 */
export interface Message {
  role: Role;
  content: string;
}

/**
 * 聊天记录
 */
export interface Conversation {
  key: string;
  character: 'user' | 'bot';
  value: string;
  error?: boolean;
  conversationId: string;
  type?: 'text' | 'image';
  url?: string;
  progress?: string;
  files?: UploadedFile[];
  midjourneyData?: Partial<MidJourneyData> | null;
  stop?: boolean;
}

/**
 * 会话列表
 */
export interface ChatList {
  chatId: string;
  assistantId: string; // 表示这个会话从哪个模版来的
  data: Conversation[];
  title?: string;
  lastUpdateTime?: string;
  parentId?: string;
  /**
   * 这个如果从模版继承过来，是不会获取最新的数据，所以NewChat的时候如果需要得传入一下
   */
  systemMessage?: Message[];
  /**
   * 头像、模型、名称应该直接继承过来，方便直接显示
   */
  assistant?: Partial<Assistant> | null;
  /**
   * 原用户的一些信息
   */
  user?: { avatar?: string };
}

/**
 * 个人助理模版
 */
export interface Assistant {
  id: string;
  model: Model;
  name: string;
  avatar?: string;
  prompt?: Message[];
  configuration: AssistantConfiguration;
  source?: 'system' | string; // 是系统预制还是哪个用户的

  alias?: string; // 唯一标识
  author?: string; // 作者
  background?: string; // 背景图
  followers?: number; // 粉丝数
  heats?: number; // 收藏量
  isPublic?: boolean; // 是否公开
  title?: string; // 标题？
  userId?: string | null;
}

/**
 * 个人助理高级设置
 */
export interface AssistantConfiguration {
  host: string;
  apiKey?: string;
  temperature?: number; // 输出更加随机 较高的值会使输出更加随机 0 - 2
  presence_penalty?: number; // 不轻易改变对话主题 越高越容易改变话题 -2.0 - 2.0
  frequency_penalty?: number; // 减少重复已提及的内容 越高重复度越低 -2.0 - 2.0
  stream?: boolean; // 流式传输
}

/**
 * 新建会话需要传入的值
 */
export interface NewChatProps {
  chatId?: string;
  assistantId?: string;
  data?: Conversation[];
  title?: string;
  lastUpdateTime?: string;
  parentId?: string;
  systemMessage?: Message[];
  /**
   * assistant的几个属性
   */
  assistant?: Assistant;
}

/**
 * 每个页面可用
 */
export interface ChatStoreProps {
  chatList?: ChatList[];
  setChatList: (chatList: ChatList[] | ((previousState?: T) => T)) => void;
  handleChange: (chatId: string, data: Conversation[]) => void;
  handleDelete: (chatId: string) => void;
  handleChatValueChange: (chatId: string, key: ChatListKey, value: any) => void;
  handleDeleteAll: () => void;
  handleNewChat: (chatProps?: NewChatProps, disableNavigate?: boolean) => void;
}

/**
 * supabse store
 */
export interface SupabaseStoreProps {
  supabase: SupabaseClient;
  session: Session | null;
  apiKeys: ApiKey[] | null;
  setSession: React.Dispatch<React.SetStateAction<Session | null>>;
  setApiKeys: React.Dispatch<React.SetStateAction<ApiKey[] | null>>;
  standardUpload: StandardUpload;
}

/**
 * current chat store
 */
export interface CurrentChatProps {
  chatId: string;
  chat: ChatList;
  assistant: Assistant;
  assistantLoading: boolean;
  checkFlag: boolean;
  checkList: Conversation[];
  dispatch: React.Dispatch<ChatAction>;
  setCheckFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

/**
 * Api Keys
 */
export interface ApiKey {
  api_key: string;
  created_at: string;
  description: string | null;
  id: string;
  updated_at: string;
  user_id: string;
}