import { LazyExoticComponent, Suspense } from 'react'
import Spinner from '@/components/spinner'
/**
 * 实现路由懒加载
 * @param Comp 懒加载组件
 * @returns
 */
function lazyLoad(Comp: LazyExoticComponent<() => JSX.Element>) {
  return (
    <Suspense fallback={<Spinner />}>
      <Comp />
    </Suspense>
  )
}

export default lazyLoad
