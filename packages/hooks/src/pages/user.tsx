import { Outlet } from 'react-router-dom'
function User() {
  return (
    <>
      <div>user页面</div>
      <Outlet />
    </>
  )
}

export default User
