import { evConfig } from '@/config'
import { CrawlHooksOptions, CrawlHooksCallback, CrawlHooks, CrawlPageResult } from '@/hooks'
import path from 'path'
const storeDirs = path.join(evConfig.store.storeDirs ?? __dirname, 'upload')

const options: CrawlHooksOptions = {
  maxRetry: 3,
  intervalTime: { max: 300, min: 200 },
  targets: ['https://www.airbnb.cn/s/experiences'],
  viewport: { width: 1920, height: 1080 },
  storeDirs,
  crawlPage: { launchBrowser: { headless: true } },
}

const callback: CrawlHooksCallback = (count, stopPolling, results) => {
  // 在某个条件下停止轮询
  if (count === 5 && stopPolling) {
    stopPolling()
    process.exit(0) // 退出程序
  }
}

export async function crawlAirbnb(): Promise<CrawlPageResult[]> {
  return await CrawlHooks(options, callback)
}
