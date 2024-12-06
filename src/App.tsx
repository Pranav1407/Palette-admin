import { Routes, Route } from 'react-router-dom'
import Layout from '@/Layout'
import HoardingDetail from '@/components/pending_hoardings/HoardingDetail'
import Pending from './components/pending_hoardings/Pending'
import Dashboard from './components/dashboard/Dashboard'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Dashboard />} />  {/* Changed from Pending to Dashboard */}
        <Route path="/pending" element={<Pending />} />  {/* Move Pending to its own route */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/hoarding/:id" element={<HoardingDetail />} />
      </Route>
    </Routes>
  )
}

export default App