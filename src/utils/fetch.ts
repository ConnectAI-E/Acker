import axios from '@/services/axiosInstance';

const fetcher = async (url: string) => await axios.get(url);

const createFetcher = (params: any) => async (url: string) => await axios.get(url, { params });

export {
  fetcher,
  createFetcher,
};
