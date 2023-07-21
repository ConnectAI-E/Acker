const API_HOST_LIST = {
  'gpt-3.5-turbo-16k': import.meta.env.VITE_API_HOST || 'https://api.openai.com/v1/chat/completions',
  'gpt-3.5-turbo': import.meta.env.VITE_API_HOST || 'https://api.openai.com/v1/chat/completions',
  'gpt-4': import.meta.env.VITE_API_HOST_GPT4 || 'https://api.openai.com/v1/chat/completions'
};

const ONLY_TEXT: string = import.meta.env.VITE_ONLY_TEXT;

const HOST: string = window.location.origin || import.meta.env.VITE_HOST || 'https://plus.aios.chat';

export const defaultAvatarUrl = 'https://sp-key.aios.chat/storage/v1/object/public/static/web/defaultRounded.png';

export { API_HOST_LIST, ONLY_TEXT, HOST };
