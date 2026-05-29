/// <reference types="vite/client" />
import type { ToastApi } from '@/utils/toast'
import 'vue'

interface ImportMetaEnv {
  readonly VITE_APP_ENV: string
  readonly VITE_APP_TITLE: string
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_PREFIX?: string
  readonly VITE_FACEBOOK_SHARE_URL?: string
  readonly VITE_FACEBOOK_SHARE_TITLE?: string
  readonly VITE_FACEBOOK_SHARE_DESCRIPTION?: string
  readonly VITE_FACEBOOK_APP_ID?: string
  readonly VITE_THINKINGDATA_APPID: string
  readonly VITE_THINKINGDATA_SERVER_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $toast: ToastApi
  }
}
