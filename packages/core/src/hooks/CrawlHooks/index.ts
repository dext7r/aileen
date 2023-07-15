import xCrawl from 'x-crawl'

export type CrawlPageResult = {
  id: number
  urls: string[]
}

export type CrawlHooksOptions = {
  maxRetry: number
  intervalTime: { max: number; min: number }
  targets: string[]
  viewport: { width: number; height: number }
  storeDirs: string
  crawlPage?: {
    launchBrowser?: {
      headless?: boolean
    }
  }
}

export type CrawlHooksCallback = (
  count?: number,
  stopPolling?: () => void,
  results?: CrawlPageResult[],
) => void

export const CrawlHooks = async (
  options: CrawlHooksOptions,
  callback: CrawlHooksCallback,
): Promise<CrawlPageResult[]> => {
  const { targets, viewport, storeDirs } = options
  const results: CrawlPageResult[] = []

  const crawler = xCrawl({
    maxRetry: options.maxRetry,
    intervalTime: options.intervalTime,
    crawlPage: options.crawlPage,
  })

  let stopFlag = false

  await crawler.startPolling({ d: 1 }, async (count, stopPolling) => {
    const res = await crawler.crawlPage({
      targets,
      viewport,
    })

    const pageResults: CrawlPageResult[] = []

    for (const item of res) {
      const { id } = item
      const { page } = item.data

      await new Promise((resolve) => setTimeout(resolve, 300))

      const urls = await page.$$eval('img', (imgEls) => {
        return imgEls
          .map((item) => item.getAttribute('src'))
          .filter((src) => src !== null) as string[]
      })

      pageResults.push({ id, urls })

      page.close()
    }

    results.push(...pageResults)

    await crawler.crawlFile({ targets: pageResults.flatMap((result) => result.urls), storeDirs })

    callback(
      count,
      () => {
        stopFlag = true
        stopPolling()
        process.exit(0) // 退出程序
      },
      results,
    )

    if (count === targets.length || stopFlag) {
      stopPolling()
      process.exit(0) // 退出程序
    }
  })

  return results
}
