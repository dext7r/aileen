export interface Cookie {
  type?: string
  name: string
  value: string
  domain: string
  path?: string
  expires?: number
  httpOnly?: boolean
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None'
}

export interface FormattedCookie {
  name: string
  value: string
  domain: string
  path?: string
  expires?: Date
  httpOnly?: boolean // 将 httpOnly 属性的类型改为可选的布尔值
  secure?: boolean
  sameSite?: 'Strict' | 'Lax' | 'None' | string
}
