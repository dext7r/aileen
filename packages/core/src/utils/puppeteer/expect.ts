import type { ClickOptions, ElementHandle, Page, WaitForSelectorOptions } from 'puppeteer'

export class expect {
  private page: Page

  constructor(page: Page) {
    this.page = page
  }

  public async toMatch(assertText: string): Promise<void> {
    await this.page.waitForFunction(
      (text) => {
        const elements = Array.from(document.querySelectorAll('*'))
        return elements.some((element) => element.textContent && element.textContent.includes(text))
      },
      {},
      assertText,
    )

    const element = await this.page.waitForFunction(
      (text) => {
        const elements = Array.from(document.querySelectorAll('*'))
        return elements.find((element) => element.textContent && element.textContent.includes(text))
      },
      {},
      assertText,
    )

    if (!element) {
      throw new Error(`Expected '${assertText}' to be found on the page`)
    }
  }

  public async toClick(tag: string, options?: ClickOptions): Promise<void> {
    const elements = await this.page.$$(tag)
    if (elements.length === 0) {
      throw new Error(`No elements found with tag '${tag}'`)
    }
    await elements[0].click(options)
  }

  public async toClickByText(tag: string, text: string): Promise<void> {
    const elements = await this.page.$$(tag)
    const element = elements.find(async (el) => {
      const elementText = await el.evaluate((node) => node.textContent)
      return elementText === text
    })

    if (!element) {
      throw new Error(`Element with text '${text}' not found`)
    }

    await element.click()
  }

  public async toMatchElement(
    selector: string,
    options?: WaitForSelectorOptions,
  ): Promise<ElementHandle<Element>> {
    await this.page.waitForSelector(selector, options)
    const element = await this.page.$(selector)
    if (!element) {
      throw new Error(`Element '${selector}' not found`)
    }
    return element
  }
}
