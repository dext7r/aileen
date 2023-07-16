import * as http from 'node:http'
import type { Browser, ElementHandle, HTTPResponse, Page } from 'puppeteer'

import { expect } from 'expect-puppeteer'
import type { Cookie, FormattedCookie } from './index.d'

/**
 * 格式化 Cookie
 * @param cookies 原始的 Cookie 对象数组
 * @returns 格式化后的 Cookie 对象数组
 */
export function formatCookies(cookies: Cookie[]): FormattedCookie[] {
  return cookies.map((cookie) => ({
    name: cookie.name,
    value: cookie.value,
    domain: cookie.domain,
    path: cookie.path,
    expires: cookie.expires ? new Date(cookie.expires * 1000) : undefined,
    httpOnly: cookie.httpOnly,
    secure: cookie.secure,
    sameSite: cookie.sameSite,
  }))
}

/**
 * 延迟指定的毫秒数后返回一个解析为 void 的 Promise。
 * @param ms 延迟的毫秒数
 * @returns 解析为 void 的 Promise
 */
function delay(ms: number): Promise<void> {
  return new Promise<void>((resolve) => setTimeout(resolve, ms))
}

/**
 * 上传文件
 * @param page Page对象
 * @param elementSelector 元素选择器
 * @param filePath 文件路径，相对于执行命令行的上下文
 */
export async function uploadFile(
  page: Page,
  elementSelector: string,
  filePath: string,
): Promise<void> {
  const inputUploadHandle = (await page.$(
    elementSelector,
  )) as ElementHandle<HTMLInputElement> | null
  if (inputUploadHandle) {
    await inputUploadHandle.uploadFile(filePath)
  }
}

/**
 * 校验元素中是否包含指定文本
 * @param page Page对象
 * @param elementSelector 元素选择器
 * @param assertText 要校验的文本
 */
export async function assertElementHasText(
  page: Page,
  elementSelector: string,
  assertText: string,
): Promise<void> {
  await page.waitForSelector(elementSelector, { visible: true })
  await expect(page).toMatchElement(elementSelector, { timeout: 15000 })
  await expect(page).toMatch(assertText)
}

/**
 * 通过文本点击元素
 * @param page Page对象
 * @param tag 元素标签，例如 'a', 'li'等
 * @param text 要点击的文本
 */
export async function clickElementByText(page: Page, tag: string, text: string): Promise<void> {
  await delay(500)
  await expect(page).toMatch(text, { timeout: 5000 })
  await expect(page).toClick(tag, { text })
  await delay(500)
}

/**
 * 屏蔽指定的域名列表
 * @param page Page对象
 * @param blockList 要屏蔽的域名列表
 */
export async function blockDomainList(page: Page, blockList: string[]): Promise<void> {
  await page.setRequestInterception(true)

  page.on('request', (interceptedRequest) => {
    const url = new URL(interceptedRequest.url())
    if (blockList.includes(url.host)) {
      interceptedRequest.abort()
    } else {
      interceptedRequest.continue()
    }
  })
}

/**
 * 清除输入框中的内容，并输入新值
 * @param page Page对象
 * @param elementSelector 元素选择器
 * @param text 要输入的文本
 */
export async function clearAndType(
  page: Page,
  elementSelector: string,
  text: string,
): Promise<void> {
  const input = await page.$(elementSelector)
  if (input) {
    await input.click({ clickCount: 3 })
    await input.press('Backspace')
    await page.type(elementSelector, text)
  }
}

/**
 * 等待指定的URL请求返回
 * @param page Page对象
 * @param url URL字符串或URL正则表达式
 */
export async function waitForResponse(page: Page, url: string | RegExp): Promise<Response | null> {
  const response = await page.waitForResponse((res: HTTPResponse) => {
    if (typeof url === 'string') {
      return res.url().includes(url)
    } else if (url instanceof RegExp) {
      return url.test(res.url())
    }
    return false
  })

  return response as unknown as Response
}

/**
 * 校验当前页面的URL是否正确
 * @param page Page对象
 * @param url 要校验的URL字符串或URL正则表达式
 */
export async function assertCurrentUrl(page: Page, url: string | RegExp): Promise<void> {
  const currentUrl: string = await page.evaluate(() => location.href)
  if (typeof url === 'string') {
    if (!currentUrl.includes(url)) {
      throw new Error('URL not found in current URL')
    }
  } else if (url instanceof RegExp) {
    if (!url.test(currentUrl)) {
      throw new Error('URL not found in current URL')
    }
  }
}

/**
 * 通过XPath点击元素
 * @param page Page对象
 * @param tag 元素标签
 * @param text 要点击的元素文本
 */
export async function clickElementByXPath(page: Page, tag: string, text: string): Promise<void> {
  const xpath = `//${tag}[text()='${text}']`
  await page.waitForXPath(xpath, { visible: true })
  await delay(500)
  const elements: ElementHandle<Element>[] = (await page.$x(xpath)) as ElementHandle<Element>[]
  if (elements.length > 0) {
    await elements[0].click()
  }
}

/**
 * 判断元素是否隐藏
 * @param page Page对象
 * @param elementSelector 元素选择器
 */
export async function isElementHidden(page: Page, elementSelector: string): Promise<boolean> {
  const isHidden = await page.$eval(elementSelector, (elem) => {
    const htmlElement = elem as HTMLElement
    return htmlElement.style.display === 'none'
  })
  return isHidden
}

/**

  依次点击匹配的元素
  @param page Page对象
  @param selector 元素选择器
  @param xPath XPath选择器
  */
export async function clickEveryElement(page: Page, selector = '', xPath = ''): Promise<void> {
  let elHandleArray: ElementHandle<Element>[] | undefined
  if (selector) {
    await page.waitForSelector(selector)
    const nodeHandleArray = await page.$$(selector)
    elHandleArray = nodeHandleArray.map((nodeHandle) => nodeHandle as ElementHandle<Element>)
  } else if (xPath) {
    await page.waitForXPath(xPath)
    const nodeHandleArray = await page.$x(xPath)
    elHandleArray = nodeHandleArray.map((nodeHandle) => nodeHandle as ElementHandle<Element>)
  }
  if (!elHandleArray || elHandleArray.length === 0) {
    throw new Error('No elements found to click')
  }

  for (const el of elHandleArray) {
    await el.click({ delay: 50 }).catch(() => {
      // console.log('try click every downside confirm')
    })
  }
}

/**

  发送请求并获取返回结果

  @param attr 请求参数
  */
export async function getToken(attr: {
  username: string
  password: string
  base_url: string
}): Promise<any> {
  return new Promise((resolve) => {
    let obj = ''
    const data = JSON.stringify({
      username: attr.username,
      password: attr.password,
    })
    const options = {
      hostname: attr.base_url,
      port: 443,
      path: '/pa/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    }

    const callback = function (response: http.IncomingMessage) {
      let str = ''
      response.on('data', function (chunk) {
        str += chunk
      })
      response.on('end', function () {
        obj = JSON.parse(str)
        resolve(obj)
      })
    }

    const request = http.request(options, callback)
    request.write(data)
    request.end()
  })
}

/**

  滚动屏幕
  @param page Page对象
  @param distance 滚动的距离
  */
export async function scrollPage(page: Page, distance: number): Promise<void> {
  await page.evaluate((scrollDistance) => {
    window.scrollBy(0, scrollDistance)
  }, distance)
}
/**

  滚动元素至可见
  @param page Page对象
  @param elementSelector 元素选择器
  */
export async function scrollElementIntoView(page: Page, elementSelector: string): Promise<void> {
  await page.evaluate((selector) => {
    document.querySelector(selector)?.scrollIntoView()
  }, elementSelector)
}
/**

  控制新页面
  @param browser Browser对象
  @returns Promise<Page>
  */
export async function controlNewPage(browser: Browser): Promise<Page> {
  // eslint-disable-next-line promise/param-names
  const newPagePromise = new Promise<Page>((res) =>
    browser.once('targetcreated', (target) => res(target.page())),
  )
  const page = await newPagePromise
  await page.bringToFront()
  return page
}

/**

  获取元素的属性值
  @param page Page对象
  @param selector 元素选择器
  @param attribute 属性名
  @returns Promise<string | null>
  */
export async function getElementAttribute(
  page: Page,
  selector: string,
  attribute: string,
): Promise<string | null> {
  return await page.$eval(selector, (el: Element, attr: string) => el.getAttribute(attr), attribute)
}

/**
 * 设置页面的 Cookie
 * @param page 页面对象
 * @param cookieStr Cookie 字符串
 * @param domain Cookie 的域名
 */
export async function setPageCookie(page: Page, cookieStr: string, domain: string): Promise<void> {
  const cookies: Cookie[] = cookieStr.split(';').map((pair) => {
    const name = pair.trim().slice(0, pair.trim().indexOf('='))
    const value = pair.trim().slice(pair.trim().indexOf('=') + 1)
    return { name, value, domain }
  })
  await page.setCookie(...cookies)
}

/**
 * 获取页面的 Cookie
 * @param page 页面对象
 * @returns 包含页面 Cookie 的数组
 */
/**
 * 获取页面的 Cookie
 * @param page 页面对象
 * @param format 是否格式化 Cookie，默认为 false
 * @returns 包含页面 Cookie 的数组
 */
export async function getPageCookies(
  page: Page,
  format = false,
): Promise<Cookie[] | FormattedCookie[]> {
  const cookies = await page.cookies()

  if (!format) {
    return cookies
  }

  const formattedCookies = formatCookies(cookies)

  return formattedCookies
}

/**
 * 获取指定类型的 Cookie
 * @param page 页面对象
 * @param type Cookie 类型
 * @returns 包含指定类型 Cookie 的数组
 */
export async function getSpecificTypeCookies(page: Page, type: string): Promise<Cookie[]> {
  const cookies = await page.cookies()
  const specificTypeCookies = cookies.filter((cookie) => {
    // 在这里根据您的需求进行 Cookie 筛选，比如根据名称、值或其他属性
    // 这里以根据名称（name）为例进行筛选
    return cookie.name === type
  })
  return specificTypeCookies
}
/**
 * 将 JSON 格式的 Cookie 设置到页面中
 * @param page 页面对象
 * @param cookieJson JSON 格式的 Cookie
 */
export async function setJsonCookies(page: Page, cookieJson: string): Promise<void> {
  const cookies: Cookie[] = JSON.parse(cookieJson)
  await page.setCookie(...cookies)
}

/**
 * 将页面的 Cookie 转换为 JSON 格式
 * @param page 页面对象
 * @returns JSON 格式的 Cookie
 */
export async function getJsonCookies(page: Page): Promise<string> {
  const cookies: Cookie[] = await page.cookies()
  return JSON.stringify(cookies)
}

/**
 * 获取 JSON 格式的指定类型的 Cookie
 * @param page 页面对象
 * @param type 指定的 Cookie 类型
 * @returns JSON 格式的指定类型的 Cookie
 */
export async function getSpecificTypeJsonCookies(page: Page, type: string): Promise<string> {
  const cookies: Cookie[] = await page.cookies()
  const filteredCookies: Cookie[] = cookies.filter((cookie) => cookie.type === type)
  return JSON.stringify(filteredCookies)
}
