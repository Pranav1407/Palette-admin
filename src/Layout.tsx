import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { Toaster } from "react-hot-toast"

const Layout = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex h-full">
        <Sidebar />
        <main className="py-4 pr-4 h-full w-full">
          <Outlet />
          <Toaster />
        </main>
      </div>
    </div>
  )
}

export default Layout