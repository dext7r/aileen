import type { LaunchOptions } from 'puppeteer'
import { usePuppeteer } from '@/hooks'

export async function crawlGitee(): Promise<void> {
  const hooks = new usePuppeteer()

  // 添加一个 hook
  hooks.addHook(async (browser, page) => {
    console.log('Browser version:', await browser.version())
    console.log('User agent:', await page.evaluate(() => navigator.userAgent))
    await page.goto('https://gitee.com/explore/recommend')

    // 设置窗口大小为全屏
    await page.setViewport({ width: 1920, height: 1080 })

    await page.waitForSelector('.explore-categories__container')
    await page.hover('.explore-categories__container .explore-categories__item:nth-child(11)')

    // 点击 "Web爬虫" 链接
    await page.click(
      '.explore-categories__container .explore-categories__item:nth-child(11) .popup a[href="/explore/spider"]',
    )

    // 等待 "#git-discover-page .item" 元素出现
    await page.waitForSelector('#git-discover-page .item')

    // // 获取优雅的信息
    // const elegantInfo = await page.evaluate(() => {
    //   const items = document.querySelectorAll('.ui.relaxed.divided.items.explore-repo__list .item')

    //   let info: any[] = []

    //   items.forEach((item) => {
    //     const titleElement = item.querySelector('.project-title a')
    //     const title = titleElement ? titleElement.textContent?.trim() : ''

    //     const descElement = item.querySelector('.project-desc')
    //     const description = descElement ? descElement.textContent?.trim() : ''

    //     const languageElement = item.querySelector('.project-language')
    //     const language = languageElement ? languageElement.textContent?.trim() : ''

    //     const categoryElement = item.querySelector('.project-item-bottom__item[href^="/explore/"]')
    //     const category = categoryElement ? categoryElement.textContent?.trim() : ''

    //     const starsCountElement = item.querySelector('.project-stars-count-box .stars-count')
    //     const starsCount = starsCountElement ? starsCountElement.textContent?.trim() : ''

    //     info.push({
    //       title,
    //       description,
    //       language,
    //       category,
    //       starsCount,
    //     })
    //   })

    //   return info
    // })

    // console.log('Elegant Info:', elegantInfo)
    await page.evaluate(() => {
      window.scrollBy(0, 50000)
    })

    const usefulInfo = await page.evaluate(() => {
      const element = document.querySelector('div.column.center.aligned')
      if (!element) {
        return null // 如果元素不存在，返回 null 或其他适当的值
      }

      const items = Array.from(
        element.querySelectorAll('a.item[href^="/explore/spider?page="]:not([rel="next"])'),
        (item) => ({
          url: item.getAttribute('href'),
          text: item.textContent.trim(),
        }),
      )

      const nextItems = Array.from(element.querySelectorAll('a.item[rel="next"]'))
      const nextHrefs = nextItems.map((item) => item.getAttribute('href'))

      if (!items || !items.length) {
        return null // 如果 items 不存在或其长度为 0，返回 null 或其他适当的值
      }

      return {
        items,
        nextHrefs,
      }
    })

    if (usefulInfo) {
      console.log(usefulInfo.items, usefulInfo)
    }
  })
  // 配置启动选项
  const launchOptions: LaunchOptions = {
    ignoreDefaultArgs: ['--headless'],
  }

  // 启动 Puppeteer
  try {
    await hooks.launch(launchOptions)
    console.log('Puppeteer launched')
  } catch (error) {
    console.error('Failed to launch Puppeteer:', error)
  }
}
