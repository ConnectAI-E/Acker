import useSWRMutation from 'swr/mutation';
import { AIOKMutationFetcher } from './axios';

function useCreateApiKey() {
  return useSWRMutation('/api/api-keys', AIOKMutationFetcher);
}

export default useCreateApiKey;
