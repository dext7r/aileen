const pkg = require('@aileen/core')

const { useFetch } = pkg
useFetch('https://kaifa.baidu.com/rest/v1/news/hot?pageNum=1&pageSize=10')
  .then((res) => {
    // eslint-disable-next-line no-console
    console.log('🎉 Fetch success!', res)
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.log('❌ Network error occurred:', error)
  })
