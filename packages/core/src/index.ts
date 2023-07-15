import { baiduFetch, crawlAirbnb } from '@/utils'
import chalk from 'chalk'

async function main() {
  const infoPromise = baiduFetch('https://kaifa.baidu.com/rest/v1/home/languages')
  const crawPromise = crawlAirbnb()

  console.log(chalk.bgMagentaBright.white('启动 baiduFetch 任务 🚀'))
  const info = await infoPromise
  console.log(chalk.bgMagentaBright.white('baiduFetch 任务已完成'))

  console.log(chalk.bgBlueBright.white('启动 crawlAirbnb 任务 🚀'))
  const craw = await crawPromise
  console.log(chalk.bgBlueBright.white('crawlAirbnb 任务已完成'))

  console.log(chalk.green('所有启动的任务已完成！'))

  console.log(craw)
  console.log(info)
}

main().catch((error) => {
  console.error('An error occurred:', error)
  process.exit(1)
})
