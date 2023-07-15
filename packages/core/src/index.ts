import { crawlGitee, logger } from '@/utils'

async function main() {
  logger.info('启动 crawlGitee 任务 🚀')
  await crawlGitee()
  logger.info('crawlGitee 任务已完成')
}

main().catch((error) => {
  logger.error('An error occurred:', error)
  process.exit(1)
})
