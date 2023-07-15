import fs from 'fs-extra'
import { build } from 'esbuild'
import { execSync } from 'child_process'
const isPord = process.env.NODE_ENV === 'production' || false
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

console.log(`🌍 当前环境：${process.env.NODE_ENV}`)
console.log(`📦 开始构建...`)

// 根据环境变量判断是否删除 dist 目录
if (isPord) {
  console.log('🧹 开始删除 dist 目录...')
  execSync('rimraf ./dist')
  console.log('✅ 删除 dist 目录完成！')
}

// 根据环境变量判断是否格式化代码
if (isPord) {
  console.log('🔨 开始格式化代码...')
  execSync('prettier --write .')
  console.log('✅ 代码格式化完成！')
}

const config = {
  bundle: true,
  entryPoints: ['src/index.ts'],
  outfile: 'dist/index.cjs',
  format: 'cjs',
  platform: 'node',
  target: 'node12',
  metafile: true,
}

config.define = { 'process.env.PACKAGE_VERSION': JSON.stringify(pkg.version) }

console.log('🚀 开始构建...')
build(config)
  .then((result) => {
    console.log('✅ 构建完成！')

    // 根据环境变量判断是否移动文件
    if (isPord) {
      console.log('📦 开始移动文件...')
      fs.copySync('README.md', 'dist/README.md')
      fs.copySync('LICENSE', 'dist/LICENSE')
      console.log('✅ 移动文件完成！')
    }
  })
  .catch((error) => {
    console.error('❌ 构建失败:', error)
    process.exit(1)
  })
