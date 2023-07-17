import { useRoutes, Navigate, RouteObject } from 'react-router-dom'
import { lazy } from 'react'
//页面
import Layout from '@/layout/index'
import Error404 from '@/pages/error/404'

//公共
import lazyLoad from './lazyLoad'

// 添加一个固定的延迟时间，以便你可以看到加载状态
function delayForDemo(promise: Promise<any>) {
  return new Promise((resolve) => {
    setTimeout(resolve, 2000)
  }).then(() => promise)
}

export const router_item: Array<object> = [
  {
    path: '/',
    key: '/',
    label: '首页',
    hidden: true,
    element: <Navigate to="/layout" />,
  },
  {
    path: '/layout',
    key: 'layout',
    label: '控制台',
    element: <Layout />,
    children: [
      {
        path: 'home',
        key: 'home',
        label: '首页',
        element: lazyLoad(lazy(() => delayForDemo(import('@/pages/home')))), //故意延迟2s,这里是延迟加载
      },
      {
        path: 'user',
        key: 'user',
        label: '用户',
        element: lazyLoad(lazy(() => import('@/pages/user'))), //这里是延迟加载
        children: [
          {
            path: 'home1',
            key: 'home1',
            label: '首页1',
            element: lazyLoad(lazy(() => import('@/pages/home'))), //这里是延迟加载
          },
          {
            path: 'user1',
            key: 'user1',
            label: '用户1',
            element: lazyLoad(lazy(() => import('@/pages/user'))), //这里是延迟加载
          },
        ],
      },
    ],
  },
  {
    path: '/404',
    hidden: true,
    element: <Error404 />,
    meta: {
      noAuth: true, //不需要检验
    },
  },
  {
    path: '*',
    hidden: true,
    element: <Navigate to="/404" />,
  },
]

function GetRoutes() {
  const routes: RouteObject[] = useRoutes(router_item)

  return routes
}

export default GetRoutes
