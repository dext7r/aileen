import { fetchData } from './fetchData'

export async function baiduFetch(url: string, Cookie?: string) {
  return await fetchData(url, {
    headers: {
      Cookie,
    },
  })
}
