import { useContext } from 'react';
import { SupabaseStoreProps } from '@/global';
import { Store } from '@/store/Supabase';

function useSupabase() {
  const context = useContext<SupabaseStoreProps>(Store);
  if (context === undefined) {
    throw new Error('useSupabase must be used inside SupabaseStore');
  } else {
    return context;
  }
}

export default useSupabase;
