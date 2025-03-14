import { Outlet, useOutletContext } from 'react-router-dom'
import Header from '@/components/Header'
import Sidebar from '@/components/Sidebar'
import { Toaster } from "react-hot-toast"
import { useState } from 'react'
import CustomTooltip from './components/utils/CustomTooltip'
import { backupData } from './data/requests'

type ContextType = { searchQuery: string }

const Layout = () => {

  const [searchQuery, setSearchQuery] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');
  const [syncBg, setSyncBg] = useState('');

  const handleSync = async () => {
    setSyncing(true);
    setSyncMessage('Syncing with excel sheet...');
    setSyncBg('bg-[#A2EC9C]');
    try{
      const response = await backupData();
      console.log("response", response);
      setSyncing(false);
    } catch (error) {
      setTimeout(() => {
        setSyncing(false);
        setSyncMessage('Error syncing with excel sheet');
        setSyncBg('bg-[#FAB5B5]');
      }, 3000);
    }
  }

  return (
    <div className="flex h-screen">
      <Sidebar handleSync={handleSync} syncing={syncing} />
      <main className="py-4 pr-4 h-full w-full">
        <Header searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <Outlet context={{ searchQuery }} />
        <Toaster />
      </main>
      {syncing && <CustomTooltip message={syncMessage} bg={syncBg} />}
    </div>
  )
}

export function useSearch() {
  return useOutletContext<ContextType>();
}

export default Layout