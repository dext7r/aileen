import { useFetch } from '@/hooks'

export async function baiduFetch(url: string | string[], Cookie?: string): Promise<any> {
  const urls = Array.isArray(url) ? url : [url]

  const fetchPromises = urls.map((url) => {
    return useFetch(url, {
      headers: {
        Cookie,
      },
    })
  })

  return Promise.all(fetchPromises)
}
