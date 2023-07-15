import { AxiosRequestConfig, AxiosHeaders } from 'axios'

type AxiosHeaderValue = string
type RawAxiosHeaders = {
  [key: string]: AxiosHeaderValue | string[] | undefined
}

declare module 'axios' {
  interface AxiosRequestConfig {
    // headers?: Record<string, string>;
  }
}

export interface HttpOptions extends AxiosRequestConfig {
  headers?: Record<string, string>
}

export interface RequestHooksConfig extends AxiosRequestConfig {
  headers?: Record<string, string>
}

export interface HttpInstance {
  (url: string, options?: HttpOptions): Promise<any>
}

declare function RequestHooks(cookie?: string): HttpInstance

export default RequestHooks
