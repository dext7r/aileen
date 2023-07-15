import { RequestHooks } from '@/hooks'
import { AxiosRequestConfig } from 'axios'
import fs from 'fs-extra'
import path from 'path'
import { evConfig } from '@/config'
import logger from '../logger'
import { baiduFetch } from '@/utils'

export async function fetchData(url: string, options?: AxiosRequestConfig): Promise<any> {
  try {
    const data = await RequestHooks(url)
    const filePath = path.join(evConfig.store.storeDirs ?? __dirname, 'baiduFetch.json')
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2))
    if (evConfig.log.isLog) logger.info(url)
    return data
  } catch (error) {
    if (evConfig.log.isLog) logger.error(url)
    throw error
  }
}
