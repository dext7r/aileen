import { Button } from 'antd'
import { Outlet } from 'react-router-dom'
import { useState } from 'react'

function Home() {
  const [count, setCount] = useState<number>(0)

  return (
    <>
      <div>数字：{count}</div>
      <Button type="primary" onClick={() => setCount(count + 1)}>
        第一种方式+1
      </Button>
      <Button type="primary" style={{ marginLeft: 10 }} onClick={() => setCount((v) => v + 1)}>
        第二种方式+1
      </Button>
      <Outlet />
    </>
  )
}

export default Home
