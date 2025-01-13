import { Outlet } from 'react-router-dom'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { Toaster } from "react-hot-toast"

const Layout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="py-4 pr-4 h-full w-full">
        <Header />
        <Outlet />
        <Toaster />
      </main>
    </div>
  )
}

export default Layout