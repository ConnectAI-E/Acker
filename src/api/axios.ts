import axios from 'axios';

function getToken(): string {
  const { hash } = window.location;
  if (hash) {
    const accessToken = new URLSearchParams(hash.split('#')[1]);
    return accessToken.get('access_token') || '';
  }
  if (localStorage?.getItem('sb-sp-key-auth-token')) {
    const session = JSON.parse(localStorage.getItem('sb-sp-key-auth-token') || '{}');
    return session.access_token || '';
  }
  return '';
}

// TODO 这里的各种状态码错误处理
export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PROJECT_API_HOST || 'https://server.aios.chat/api',
  timeout: 300000,
  headers: { 'Access-Token': getToken() },
});

export const axiosAIOKInstance = axios.create({
  baseURL: 'https://key.aios.chat',
  timeout: 300000,
  headers: { Authorization: `Bearer ${getToken()}`, }
});

export const AIOKMutationFetcher = async (url: string, { arg }: { arg: Record<string, any> }) => {
  const { method = 'post', ...rest } = arg;

  const lowerMethod = method?.toLocaleLowerCase();

  return axiosAIOKInstance({
    url,
    method,
    data: lowerMethod === 'get' ? {} : rest,
    params: lowerMethod === 'get' ? rest : {},
  });
};

export const mutationFetcher = async (url: string, { arg }: { arg: Record<string, any> }) => {
  const { method = 'post', ...rest } = arg;

  const lowerMethod = method?.toLocaleLowerCase();

  return axiosInstance({
    url,
    method,
    data: lowerMethod === 'get' ? {} : rest,
    params: lowerMethod === 'get' ? rest : {},
  });
};
