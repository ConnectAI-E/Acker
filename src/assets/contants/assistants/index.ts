import type { Assistant } from '@/global';

const defaultAPIHost = 'https://api.openai.com/v1/chat/completions';

export const defaultAssistant: Assistant = {
  id: 'gpt-3.5-turbo-16k',
  model: 'gpt-3.5-turbo-16k',
  name: 'gpt-3.5-turbo-16k',
  avatar: '',
  prompt: [],
  configuration: {
    host: import.meta.env.VITE_API_HOST || defaultAPIHost,
    temperature: 0.8,
    presence_penalty: -1.0,
    frequency_penalty: 1.0,
    stream: true
  },
  source: 'user'
};

export const defaultMidjourneyAssistant: Assistant = {
  id: 'midjourney',
  model: 'midjourney',
  name: 'midjourney',
  avatar: '',
  prompt: [],
  configuration: {
    host: import.meta.env.VITE_MIDJOURNEY_API_HOST || '',
    apiKey: '',
  },
  source: 'user'
};

export default [
  {
    id: 'gpt-3.5-turbo-16k',
    model: 'gpt-3.5-turbo-16k',
    name: 'gpt-3.5-turbo-16k',
    avatar: 'https://sp-key.aios.chat/storage/v1/object/public/static/web/gpt3.5.png',
    prompt: [],
    configuration: {
      host: import.meta.env.VITE_API_HOST || defaultAPIHost,
      temperature: 0.8,
      presence_penalty: -1.0,
      frequency_penalty: 1.0,
      stream: true
    },
    source: 'system'
  },
  {
    id: 'gpt-3.5-turbo',
    model: 'gpt-3.5-turbo',
    name: 'gpt-3.5-turbo',
    avatar: 'https://sp-key.aios.chat/storage/v1/object/public/static/web/gpt3.5.png',
    prompt: [],
    configuration: {
      host: import.meta.env.VITE_API_HOST || defaultAPIHost,
      temperature: 0.8,
      presence_penalty: -1.0,
      frequency_penalty: 1.0,
      stream: true
    },
    source: 'system'
  },
  {
    id: 'gpt-4',
    model: 'gpt-4',
    name: 'gpt-4',
    avatar: 'https://sp-key.aios.chat/storage/v1/object/public/static/web/gpt4.png',
    prompt: [],
    configuration: {
      host: import.meta.env.VITE_API_HOST || defaultAPIHost,
      temperature: 0.8,
      presence_penalty: -1.0,
      frequency_penalty: 1.0,
      stream: true
    },
    source: 'system'
  }
] as Assistant[];
