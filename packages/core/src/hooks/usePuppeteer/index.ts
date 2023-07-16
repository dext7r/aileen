import type { Browser, LaunchOptions, Page } from 'puppeteer'
import puppeteer from 'puppeteer'

type Hook = (browser: Browser, page: Page) => void

export class usePuppeteer {
  private browser: Browser | null
  private page: Page | null
  private hooks: Hook[]

  constructor() {
    this.browser = null
    this.page = null
    this.hooks = []
  }

  public addHook(hook: Hook): void {
    this.hooks.push(hook)
  }

  public async launch(options?: LaunchOptions): Promise<void> {
    const launchOptions: LaunchOptions = {
      // ignoreDefaultArgs: ['--headless'],
      headless: 'new',
      ...options,
    }

    this.browser = await puppeteer.launch(launchOptions)
    this.page = await this.browser.newPage()

    for (const hook of this.hooks) {
      hook(this.browser, this.page)
    }
  }

  public async close(): Promise<void> {
    if (this.browser) {
      await this.browser.close()
    }
  }
}
