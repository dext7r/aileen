import './index.scss'
import { Outlet } from 'react-router-dom'
import Aside from './aside'

function Layout() {
  return (
    <section id="container">
      <aside>
        <Aside></Aside>
      </aside>
      <section>
        <header>header</header>
        <main>
          <Outlet></Outlet>
        </main>
      </section>
    </section>
  )
}

export default Layout
