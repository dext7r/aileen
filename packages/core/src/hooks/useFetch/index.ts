import path from 'node:path'
import type { AxiosRequestConfig } from 'axios'
import fs from 'fs-extra'
import { useRequest } from '@/hooks'
import { evConfig } from '@/config'
import { logger } from '@/utils'

export async function useFetch(url: string, options?: AxiosRequestConfig): Promise<any> {
  try {
    const data = await useRequest(url, options)
    const filePath = path.join(evConfig.store.storeDirs ?? __dirname, 'baiduFetch.json')
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    if (evConfig.log.isLog) logger.info(url)
    return data
  } catch (error) {
    if (evConfig.log.isLog) logger.error(url)
    throw error
  }
}
