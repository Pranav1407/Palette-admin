import { Outlet, useOutletContext } from 'react-router-dom'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { Toaster } from "react-hot-toast"
import { useState } from 'react'

type ContextType = { searchQuery: string }

const Layout = () => {

  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="py-4 pr-4 h-full w-full">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Outlet context={{ searchQuery }} />
        <Toaster />
      </main>
    </div>
  )
}

export function useSearch() {
  return useOutletContext<ContextType>();
}

export default Layout