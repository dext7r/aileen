import type { AxiosRequestConfig } from 'axios'
import axios from 'axios'
import merge from 'lodash-es/merge'
import type { HttpInstance } from '@/index.d'

function extractOrigin(url: string): string {
  const urlObject = new URL(url)
  return `${urlObject.protocol}//${urlObject.host}`
}

const defaultOptions: AxiosRequestConfig = {
  method: 'GET',
  data: {},
  params: {},
  headers: {
    pragma: 'no-cache',
    'sec-ch-ua': '"Chromium";v="92", " Not A;Brand";v="99", "Google Chrome";v="92"',
    'sec-ch-ua-mobile': '?0',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'User-Agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.131 Safari/537.36',
  },
}

export const useRequest: HttpInstance = async (url, options = {}) => {
  const mergedOptions: AxiosRequestConfig = merge({}, defaultOptions, options)
  mergedOptions.headers = mergedOptions.headers || {}
  mergedOptions.headers.origin = extractOrigin(url)
  mergedOptions.headers.Cookie = options.headers?.Cookie || ''
  mergedOptions.headers.referer = extractOrigin(url)

  const response = await axios(url, mergedOptions)
  return response.data
}
