import { useFetch } from '@/hooks'

export async function baiduFetch(url: string, Cookie?: string) {
  return await useFetch(url, {
    headers: {
      Cookie,
    },
  })
}
