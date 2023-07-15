import inquirer from 'inquirer'
import { baiduFetch, crawlAirbnb, crawlGitee, logger } from '@/utils'

async function main() {
  const args = process.argv.slice(2) // 排除前两个默认参数（node 和脚本文件路径）
  let task = args[0] // 第一个参数作为任务标识

  if (!task) {
    const choices = ['crawlGitee', 'crawlAirbnb', 'baiduFetch']
    const { selectedTask } = await inquirer.prompt({
      type: 'list',
      name: 'selectedTask',
      message: '请选择要执行的任务:',
      choices,
    })

    task = selectedTask
  }

  logger.info(`启动 ${task} 任务 🚀`)

  if (task === 'crawlGitee') {
    await crawlGitee()
  } else if (task === 'crawlAirbnb') {
    await crawlAirbnb()
  } else if (task === 'baiduFetch') {
    await baiduFetch('https://kaifa.baidu.com/rest/v1/home/languages')
  } else {
    logger.error(`未知任务: ${task}`)
    process.exit(1)
  }

  logger.info(`${task} 任务已完成`)
}

main().catch((error) => {
  logger.error('An error occurred:', error)
  process.exit(1)
})
