import pkg from '@aileen/core'

const { useFetch } = pkg
useFetch('https://kaifa.baidu.com/rest/v1/news/hot?pageNum=1&pageSize=30')
  .then((res) => {
    // eslint-disable-next-line no-console
    console.log('useFetch test success! ✅', res)
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log('🚨Failed to fetch data:', error)
  })
