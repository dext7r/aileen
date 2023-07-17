// react hook
import { useState } from 'react'
import { router_item } from '@/routes/index'
import { Menu } from 'antd'
import { useNavigate } from 'react-router-dom'

function aside() {
  const navigate = useNavigate()

  //菜单
  const [routes] = useState<any[]>(router_item)

  //打开和选中
  const defaultOpenKeys = (localStorage.getItem('openKeys') || '')?.split(',')
  const defaultSelectKeys = localStorage.getItem('selectKeys') || ''
  const [selectKeys, setSelectKeys] = useState<string[]>([defaultSelectKeys])
  const [openKeys, setOpenKeys] = useState<string[]>(defaultOpenKeys)
  //点击菜单
  const menuHandler = (e: any) => {
    let path = '/' + e.keyPath.reverse().join('/')
    path = path.replace('//', '/')
    navigate(path)

    // 缓存打开和选中的keys
    const selectKeys = e.key
    e.keyPath.pop()
    const openKeys = e.keyPath.join(',')
    setSelectKeys(selectKeys)
    setOpenKeys(openKeys)
    localStorage.setItem('selectKeys', selectKeys)
    localStorage.setItem('openKeys', openKeys)
  }

  return (
    <>
      <Menu
        mode="inline"
        theme="dark"
        defaultOpenKeys={openKeys}
        defaultSelectedKeys={selectKeys}
        items={routes}
        onClick={menuHandler}
      ></Menu>
    </>
  )
}

export default aside
