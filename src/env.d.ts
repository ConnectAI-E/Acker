/// <reference types="vite/client" />

declare const ENV: 'local' | 'dev' | 'test' | 'stage' | 'prod';
declare const BASE: string;

interface ImportMetaEnv {
  readonly VITE_API_HOST: string
  readonly VITE_CACHE_TIMES: string
  readonly VITE_BASE_URL: string
  readonly VITE_DEFAULT_PLACEHOLDER: string
  readonly VITE_DEFAULT_BOTTOM_TIPS: string
  readonly VITE_LOGO_URL: string
  readonly VITE_INFO: string
  readonly VITE_ONLY_TEXT: string
  /**
   * supabase project url
   */
  readonly VITE_SUPABASE_URL: string
  /**
   * supabase project anon api key
   */
  readonly VITE_SUPABASE_KEY: string
  /**
   * midjourney api host
   */
  readonly VITE_MIDJOURNEY_API_HOST: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
