/* eslint-disable no-console */
import { get_encoding } from 'tiktoken-lite';
import type { Message, Model } from '@/global';

const encoding = get_encoding();

const maximumMap: Record<Model, number> = { 'gpt-4': 8192, 'gpt-3.5-turbo': 4096, 'gpt-3.5-turbo-16k': 16384 };

function calculateTokenLength(value: string): number {
  return encoding.encode(value).length;
}

function calculateMessagesLength(messages: Message[], maximum: number, tokensPerMessage: number): number {
  if (messages.length === 0) return 0;

  const tokenLength = messages.map((message: Message) => {
    const length = calculateTokenLength(message.content) + calculateTokenLength(message.role) + tokensPerMessage;
    if (length > maximum) {
      console.warn(`The token length of ${message.content} has exceeded the maximum`);
    }
    return length;
  });

  const totalTokenLength = tokenLength.reduce((pre, cur) => pre + cur);
  if (totalTokenLength > maximum) {
    console.warn(`Token length exceeds the ${maximum} maximum limit.`);
  }
  return totalTokenLength + 3; // every reply is primed with <|start|>assistant<|message|>
}

function calculateMessages(messages: Message[], model: Model = 'gpt-3.5-turbo-16k'): Message[] {
  const maximum = maximumMap[model] || 4096; // 模型的长度

  const tokensPerMessage = model === 'gpt-4' ? 3 : 4; // every message follows <|start|>{role/name}\n{content}<|end|>\n
  if (messages.length === 0) {
    console.warn('No messages');
    return messages;
  }
  /**
   * 计算system message的长度 只计算长度，不移除，让接口报错后用户自己处理
   */
  const systemMessage = messages.filter((message) => message.role === 'system');
  calculateMessagesLength(systemMessage, maximum, tokensPerMessage);
  /**
   * 计算user和assistant的message长度，长度超过了就移除最开始的对话，直到只剩下最后一对对话，让接口报错
   */
  const conversationMessage = messages.filter((message) => message.role !== 'system');
  while (conversationMessage.length > 2 && calculateMessagesLength(conversationMessage, maximum, tokensPerMessage) >= maximum) {
    conversationMessage.splice(0, 2);
  }
  return systemMessage.concat(conversationMessage);
}

export {
  calculateMessages,
  calculateTokenLength
};
