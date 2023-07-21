import merge from 'lodash/merge';
import axios from './axiosInstance';

export const getTopRatedAssistant = async (url: string, params: any) => axios.get(url, { params: merge({}, { locale: 'en_GB' }, params), });

export const getTopTopics = async (url: string) => axios.get(url);
