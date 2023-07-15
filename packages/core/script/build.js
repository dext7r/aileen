import { execSync } from 'node:child_process'
import fs from 'fs-extra'
import { build } from 'esbuild'

const isProd = process.env.NODE_ENV === 'production' || false
const pkg = JSON.parse(fs.readFileSync('./package.json', 'utf-8'))

console.log(`🌍 当前环境：${process.env.NODE_ENV}`)
console.log(`📦 开始构建...`)

// 根据环境变量判断是否删除 dist 目录
if (isProd) {
  console.log('🧹 开始删除 dist 目录...')
  execSync('rimraf ./dist')
  console.log('✅ 删除 dist 目录完成！')
}

// 根据环境变量判断是否格式化代码
if (isProd) {
  console.log('🔨 开始格式化代码...')
  execSync('prettier --write .')
  console.log('✅ 代码格式化完成！')
}

const entryPoint = 'src/index.ts'

const formats = [
  { format: 'cjs', outfile: 'dist/index.cjs' },
  { format: 'iife', outfile: 'dist/index.iife.js' },
  { format: 'esm', outfile: 'dist/index.esm.js' },
]

console.log('🚀 开始构建...')
const entryPoints = fs.readdirSync('./src').map((file) => `src/${file}`)
const config = {
  bundle: true,
  entryPoints,
  outdir: 'dist',
  format: 'cjs',
  platform: 'node',
  target: 'node12',
  metafile: true,
  define: {
    'process.env.PACKAGE_VERSION': JSON.stringify(pkg.version),
  },
}
build(config)
Promise.all(
  formats.map(({ format, outfile }) =>
    build({
      bundle: true,
      entryPoints: [entryPoint],
      outfile,
      format,
      platform: 'node',
      target: 'node12',
      metafile: true,
      define: {
        'process.env.PACKAGE_VERSION': JSON.stringify(pkg.version),
      },
    }),
  ),
)
  .then(() => {
    console.log('✅ 构建完成！')
  })
  .catch((error) => {
    console.error('❌ 构建失败:', error)
    process.exit(1)
  })
