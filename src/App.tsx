import { Routes, Route } from 'react-router-dom'
import Layout from '@/Layout'
import HoardingDetail from '@/components/utils/HoardingDetail'
import Pending from './components/pending_hoardings/Pending'
import Dashboard from './components/dashboard/Dashboard'
import Approved from './components/approved_hoardings/Approved'
import Rejected from './components/rejected_hoardings/Rejected'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HoardingProvider } from './providers/HoardingProvider';
import AllHoardings from './components/all-hoardings/AllHoardings'

const App = () => {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <HoardingProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/pending" element={<Pending />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/approved" element={<Approved />} />
            <Route path="/rejected" element={<Rejected />} />
            <Route path="/all-hoardings" element={<AllHoardings />} />
            <Route path="/hoarding/:id" element={<HoardingDetail />} />
          </Route>
        </Routes>
      </HoardingProvider>
    </QueryClientProvider>
  )
}

export default App